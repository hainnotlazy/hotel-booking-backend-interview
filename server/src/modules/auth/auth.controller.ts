import { Body, Controller, Get, HttpCode, Post, Req, UseGuards } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { LoginUserDto, LogoutUserDto, RefreshTokenDto, RegisterUserDto } from "src/common/dtos";
import { AccessToken, PublicRoute } from "src/common/decorators";
import { GoogleAuthGuard } from "./guards";
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

	@Post("logout")
	@HttpCode(200)
	async logout(@AccessToken() accessToken: string, @Body() logoutUserDto: LogoutUserDto) {
		return await this.authService.logout(accessToken, logoutUserDto.refresh_token);
	}

	@PublicRoute()
	@Post("refresh")
	async refreshToken(@AccessToken() accessToken: string, @Body() refreshTokenDto: RefreshTokenDto) {
		return await this.authService.refreshToken(accessToken, refreshTokenDto.refresh_token);
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

	@Get("test")
	async test() {
		return "test";
	}
}
