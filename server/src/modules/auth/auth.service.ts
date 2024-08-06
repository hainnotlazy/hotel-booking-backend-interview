import { AuthenticatedResponse, IAuthService } from "src/common/service-interfaces/auth.service";
import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "src/entities";
import { Repository } from "typeorm";
import { LoginUserDto, RegisterUserDto } from "src/common/dtos";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import * as bcrypt from "bcrypt";
import { TokenPayload } from "./interfaces";
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

		await this.validateEmail(email);

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

	async refreshToken(refreshToken: string): Promise<AuthenticatedResponse> {
		// Check if refresh token is blacklisted
		const isRefreshTokenBlacklisted = await this.redisService.getKey({
			key: refreshToken,
		});
		if (isRefreshTokenBlacklisted) {
			throw new BadRequestException("Refresh token is blacklisted!");
		}

		// Blacklist old refresh token
		this.redisService.setKey({
			key: refreshToken,
			value: "blacklisted",
		});

		// Decode token and create new payload
		const payload = this.jwtService.verify(refreshToken, {
			secret: this.REFRESH_TOKEN_SECRET,
		});
		const { uid, email } = payload;
		const tokenPayload: TokenPayload = {
			uid,
			email,
		};

		return {
			accessToken: this.generateToken(tokenPayload),
			refreshToken: this.generateToken(tokenPayload, "refresh"),
		};
	}

	async googleLogin(googleProfile: GoogleProfile): Promise<AuthenticatedResponse> {
		const { fullname, email } = googleProfile;

		const existedUser = await this.userRepository.findOne({
			where: {
				email,
			},
		});

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
		} else {
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
}
