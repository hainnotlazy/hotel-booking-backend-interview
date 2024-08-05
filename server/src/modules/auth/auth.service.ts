import { AuthenticatedResponse, IAuthService } from "src/common/service-interfaces/auth.service";
import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "src/entities";
import { Repository } from "typeorm";
import { LoginUserDto, RegisterUserDto } from "src/common/dtos";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import * as bcrypt from "bcrypt";

@Injectable()
export class AuthService implements IAuthService {
	private readonly ACCESS_TOKEN_EXPIRATION_TIME: string;
	private readonly REFRESH_TOKEN_EXPIRATION_TIME: string;
	private readonly REFRESH_TOKEN_SECRET: string;
	constructor(
		@InjectRepository(User)
		private readonly userRepository: Repository<User>,
		private readonly configService: ConfigService,
		private readonly jwtService: JwtService,
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

		return {
			user: existedUser,
			accessToken: this.generateToken(existedUser),
			refreshToken: this.generateToken(existedUser, "refresh"),
		};
	}

	async register(registerUserDto: RegisterUserDto): Promise<AuthenticatedResponse> {
		const { email, password } = registerUserDto;

		await this.validateEmail(email);

		const newUser = this.userRepository.create({
			email,
			password, // Handle to hash password at entity layer
		});
		const savedUser = await this.userRepository.save(newUser);

		return {
			user: savedUser,
			accessToken: this.generateToken(savedUser),
			refreshToken: this.generateToken(savedUser, "refresh"),
		};
	}

	generateToken(user: User, tokenType: "access" | "refresh" = "access"): string {
		const payload = {
			uid: user.id,
			email: user.email,
		};

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
