import { Body, Controller, Get, HttpCode, Post, Req, UseGuards } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { LoginUserDto, RefreshTokenDto, RegisterUserDto } from "src/common/dtos";
import { PublicRoute } from "src/common/decorators";
import { GoogleAuthGuard } from "./guards/google-auth.guard";
import { GoogleProfile } from "./strategies";

@Controller("auth")
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@PublicRoute()
	@Post("login")
	@HttpCode(200)
	async login(@Body() loginUserDto: LoginUserDto) {
		return await this.authService.login(loginUserDto);
	}

	@PublicRoute()
	@Post("register")
	async register(@Body() registerUserDto: RegisterUserDto) {
		return await this.authService.register(registerUserDto);
	}

	@PublicRoute()
	@Post("refresh")
	async refreshToken(@Body() refreshTokenDto: RefreshTokenDto) {
		return await this.authService.refreshToken(refreshTokenDto.refresh_token);
	}

	@PublicRoute()
	@UseGuards(GoogleAuthGuard)
	@Get("google")
	googleOAuth() {}

	@PublicRoute()
	@UseGuards(GoogleAuthGuard)
	@Get("google/callback")
	async googleOAuthCallback(@Req() req) {
		const user: GoogleProfile = req.user;

		return await this.authService.googleLogin(user);
	}
}
