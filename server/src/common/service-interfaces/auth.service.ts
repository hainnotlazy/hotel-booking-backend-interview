import { RegisterUserDto } from "src/common/dtos/auth/register-user.dto";
import { User } from "src/entities";
import { LoginUserDto } from "../dtos";
import { TokenPayload } from "src/modules/auth/interfaces";

export interface AuthenticatedResponse {
	user?: User;
	accessToken: string;
	refreshToken: string;
}

export interface IAuthService {
	login(loginUserDto: LoginUserDto): Promise<AuthenticatedResponse>;
	register(registerUserDto: RegisterUserDto): Promise<AuthenticatedResponse>;
	generateToken(payload: TokenPayload, tokenType: "access" | "refresh"): string;
	refreshToken(refreshToken: string): Promise<AuthenticatedResponse>;
}
