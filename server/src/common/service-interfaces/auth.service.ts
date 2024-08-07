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
	/**
	 * Describe: Login
	 * @param {LoginUserDto} loginUserDto
	 */
	login(loginUserDto: LoginUserDto): Promise<AuthenticatedResponse>;

	/**
	 * Describe: Register
	 * @param {RegisterUserDto} registerUserDto
	 */
	register(registerUserDto: RegisterUserDto): Promise<AuthenticatedResponse>;

	/**
	 * Describe: Logout
	 * @param {string} accessToken
	 * @param {string} refreshToken
	 */
	logout(accessToken: string, refreshToken: string): Promise<void>;

	/**
	 * Describe: Generate token
	 * @param {TokenPayload} payload
	 * @param {string} tokenType
	 */
	generateToken(payload: TokenPayload, tokenType: "access" | "refresh"): string;

	/**
	 * Describe: Refresh token
	 * @param {string} refreshToken
	 */
	refreshToken(refreshToken: string): Promise<AuthenticatedResponse>;

	/**
	 * Describe: Blacklist token
	 * @param {string} token
	 * @param {number} expiresIn
	 */
	blacklistToken(token: string, expiresIn: number): Promise<void>;

	/**
	 * Describe: Check if token is blacklisted
	 * @param {string} token
	 */
	isTokenBlacklisted(token: string): Promise<boolean>;

	/**
	 * Describe: Google login
	 * @param {GoogleProfile} googleProfile
	 */
	googleLogin(googleProfile: GoogleProfile): Promise<AuthenticatedResponse>;
}
