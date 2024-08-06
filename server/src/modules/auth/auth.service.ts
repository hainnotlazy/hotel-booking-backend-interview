import { AuthenticatedResponse, IAuthService } from "src/common/service-interfaces/auth.service";
import {
	BadRequestException,
	Injectable,
	InternalServerErrorException,
	NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "src/entities";
import { Repository } from "typeorm";
import { LoginUserDto, RegisterUserDto } from "src/common/dtos";
import { JsonWebTokenError, JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import * as bcrypt from "bcrypt";
import { RawTokenPayload, TokenPayload } from "./interfaces";
import { RedisService } from "src/shared/redis/redis.service";
import { GoogleProfile } from "./strategies";
import { UsersService } from "../users/users.service";
import { v4 as uuidv4 } from "uuid";

@Injectable()
export class AuthService implements IAuthService {
	private readonly ACCESS_TOKEN_EXPIRATION_TIME: string;
	private readonly REFRESH_TOKEN_EXPIRATION_TIME: string;
	private readonly REFRESH_TOKEN_SECRET: string;
	constructor(
		@InjectRepository(User)
		private readonly userRepository: Repository<User>,
		private readonly usersService: UsersService,
		private readonly configService: ConfigService,
		private readonly jwtService: JwtService,
		private readonly redisService: RedisService,
	) {
		this.ACCESS_TOKEN_EXPIRATION_TIME = this.configService.get<string>(
			"ACCESS_TOKEN_EXPIRATION_TIME",
			"1d",
		);
		this.REFRESH_TOKEN_EXPIRATION_TIME = this.configService.get<string>(
			"REFRESH_TOKEN_EXPIRATION_TIME",
			"30d",
		);
		this.REFRESH_TOKEN_SECRET = this.configService.get<string>(
			"JWT_REFRESH_TOKEN_SECRET",
			"hotel-admin-refresh-token-secret",
		);
	}

	async login(loginUserDto: LoginUserDto): Promise<AuthenticatedResponse> {
		const { email, password } = loginUserDto;

		// Validate user
		const existedUser = await this.userRepository.findOne({
			where: {
				email,
			},
		});
		if (!existedUser) {
			throw new NotFoundException("User not found");
		}
		if (!bcrypt.compareSync(password, existedUser.password)) {
			throw new BadRequestException("Password is incorrect");
		}

		// Create token payload
		const tokenPayload: TokenPayload = {
			uid: existedUser.id,
			email: existedUser.email,
		};

		return {
			user: existedUser,
			accessToken: this.generateToken(tokenPayload),
			refreshToken: this.generateToken(tokenPayload, "refresh"),
		};
	}

	async register(registerUserDto: RegisterUserDto): Promise<AuthenticatedResponse> {
		const { email, password } = registerUserDto;

		// Validate if email is already registered
		await this.validateEmail(email);

		// Create new user
		const savedUser = await this.usersService.createUser({
			email,
			password,
		});
		const tokenPayload: TokenPayload = {
			uid: savedUser.id,
			email: savedUser.email,
		};

		return {
			user: savedUser,
			accessToken: this.generateToken(tokenPayload),
			refreshToken: this.generateToken(tokenPayload, "refresh"),
		};
	}

	async refreshToken(accessToken: string, refreshToken: string): Promise<AuthenticatedResponse> {
		try {
			// Blacklist old access token
			const { uid: accessTokenUserId, exp: accessTokenExpirationTime } =
				this.jwtService.verify<RawTokenPayload>(accessToken);
			await this.blacklistToken(accessToken, this.getTimeLeft(accessTokenExpirationTime));

			// Check if refresh token is blacklisted
			if (await this.isTokenBlacklisted(refreshToken)) {
				throw new BadRequestException("Refresh token is blacklisted!");
			}

			// Get refresh token payload
			const {
				uid: refreshTokenUserId,
				email,
				exp: refreshTokenExpirationTime,
			} = this.jwtService.verify<RawTokenPayload>(refreshToken, {
				secret: this.REFRESH_TOKEN_SECRET,
			});

			// Black list old refresh token
			await this.blacklistToken(refreshToken, this.getTimeLeft(refreshTokenExpirationTime));

			if (accessTokenUserId !== refreshTokenUserId) {
				throw new BadRequestException("Token is invalid!");
			}

			// Create new payload
			const tokenPayload: TokenPayload = {
				uid: refreshTokenUserId,
				email,
			};

			return {
				accessToken: this.generateToken(tokenPayload),
				refreshToken: this.generateToken(tokenPayload, "refresh"),
			};
		} catch (err) {
			if (err instanceof JsonWebTokenError) {
				throw new BadRequestException("Token is invalid!");
			}
			throw new InternalServerErrorException("Somethings went wrong!");
		}
	}

	generateToken(payload: TokenPayload, tokenType: "access" | "refresh" = "access"): string {
		if (tokenType === "refresh") {
			return this.jwtService.sign(payload, {
				expiresIn: this.REFRESH_TOKEN_EXPIRATION_TIME,
				secret: this.REFRESH_TOKEN_SECRET,
			});
		}

		return this.jwtService.sign(payload, {
			expiresIn: this.ACCESS_TOKEN_EXPIRATION_TIME,
		});
	}

	async blacklistToken(token: string, expiresIn: number): Promise<void> {
		await this.redisService.setKey({
			key: token,
			value: "blacklisted",
			expiresIn: expiresIn,
		});
	}

	async isTokenBlacklisted(token: string): Promise<boolean> {
		const isTokenBlacklisted = await this.redisService.getKey({
			key: token,
		});

		return !!isTokenBlacklisted;
	}

	async logout(accessToken: string, refreshToken: string): Promise<void> {
		// Blacklist access token
		const { exp: accessTokenExpirationTime } = this.jwtService.verify<RawTokenPayload>(accessToken);
		await this.blacklistToken(accessToken, this.getTimeLeft(accessTokenExpirationTime));

		// Blacklist refresh token
		const { exp: refreshTokenExpirationTime } = this.jwtService.verify<RawTokenPayload>(
			refreshToken,
			{
				secret: this.REFRESH_TOKEN_SECRET,
			},
		);
		await this.blacklistToken(refreshToken, this.getTimeLeft(refreshTokenExpirationTime));
	}

	async googleLogin(googleProfile: GoogleProfile): Promise<AuthenticatedResponse> {
		const { fullname, email } = googleProfile;

		const existedUser = await this.userRepository.findOne({
			where: {
				email,
			},
		});

		// Create new user if email is not registered
		if (!existedUser) {
			const newUser = await this.usersService.createUser({
				email,
				password: uuidv4(), // Generate random password
				fullname,
			});

			const tokenPayload: TokenPayload = {
				uid: newUser.id,
				email: newUser.email,
			};

			return {
				user: newUser,
				accessToken: this.generateToken(tokenPayload),
				refreshToken: this.generateToken(tokenPayload, "refresh"),
			};
		}
		// Return tokens if email is already registered
		else {
			const tokenPayload: TokenPayload = {
				uid: existedUser.id,
				email: existedUser.email,
			};

			return {
				user: existedUser,
				accessToken: this.generateToken(tokenPayload),
				refreshToken: this.generateToken(tokenPayload, "refresh"),
			};
		}
	}

	private async validateEmail(email: string): Promise<void> {
		const isEmailExisted = await this.userRepository.findOne({
			where: {
				email,
			},
		});

		if (isEmailExisted) {
			throw new BadRequestException("Email already existed!");
		}
	}

	private getTimeLeft(expirationTime: number): number {
		const now = Math.floor(new Date().getTime() / 1000);

		return expirationTime > now ? expirationTime - now : 0;
	}
}
