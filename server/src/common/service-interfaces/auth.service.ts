import { RegisterUserDto } from "src/common/dtos/auth/register-user.dto";
import { User } from "src/entities";
import { LoginUserDto } from "../dtos";
import { TokenPayload } from "src/modules/auth/interfaces";
import { GoogleProfile } from "src/modules/auth/strategies";

export interface AuthenticatedResponse {
	user?: User;
	accessToken: string;
	refreshToken: string;
}

export interface IAuthService {
	login(loginUserDto: LoginUserDto): Promise<AuthenticatedResponse>;
	register(registerUserDto: RegisterUserDto): Promise<AuthenticatedResponse>;
	logout(accessToken: string, refreshToken: string): Promise<void>;
	generateToken(payload: TokenPayload, tokenType: "access" | "refresh"): string;
	refreshToken(accessToken: string, refreshToken: string): Promise<AuthenticatedResponse>;
	blacklistToken(token: string, expiresIn: number): Promise<void>;
	isTokenBlacklisted(token: string): Promise<boolean>;
	googleLogin(googleProfile: GoogleProfile): Promise<AuthenticatedResponse>;
}
