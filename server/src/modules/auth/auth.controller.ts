import { AuthenticatedResponse } from "src/common/service-interfaces/auth.service";
import { Body, Controller, Get, HttpCode, Post, Req, UseFilters, UseGuards } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { LoginUserDto, LogoutUserDto, RefreshTokenDto, RegisterUserDto } from "src/common/dtos";
import { AccessToken, PublicRoute } from "src/common/decorators";
import { GoogleAuthGuard } from "./guards";
import { GoogleProfile } from "./strategies";
import { OauthFilter } from "./filters";
import {
	ApiBadRequestResponse,
	ApiBearerAuth,
	ApiBody,
	ApiCreatedResponse,
	ApiInternalServerErrorResponse,
	ApiNotFoundResponse,
	ApiOkResponse,
	ApiOperation,
	ApiPermanentRedirectResponse,
	ApiResponse,
	ApiTags,
	getSchemaPath,
} from "@nestjs/swagger";
import { User } from "src/entities";

@ApiTags("Auth")
@Controller("auth")
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@PublicRoute()
	@Post("login")
	@HttpCode(200)
	@ApiOperation({ summary: "Login route" })
	@ApiBody({ type: LoginUserDto })
	@ApiOkResponse({
		description: "Login success response",
		schema: {
			type: "object",
			properties: {
				access_token: { type: "string" },
				refresh_token: { type: "string" },
			},
		},
	})
	@ApiBadRequestResponse({ description: "Password is incorrect" })
	@ApiNotFoundResponse({ description: "User not found" })
	@ApiInternalServerErrorResponse({ description: "Internal server error" })
	async login(@Body() loginUserDto: LoginUserDto): Promise<AuthenticatedResponse> {
		return await this.authService.login(loginUserDto);
	}

	@PublicRoute()
	@Post("register")
	@ApiOperation({ summary: "Register route" })
	@ApiBody({ type: RegisterUserDto })
	@ApiCreatedResponse({
		description: "Created new user successfully",
		schema: {
			type: "object",
			properties: {
				user: { $ref: getSchemaPath(User) },
				access_token: { type: "string" },
				refresh_token: { type: "string" },
			},
		},
	})
	@ApiBadRequestResponse({ description: "Email already exists" })
	@ApiInternalServerErrorResponse({ description: "Internal server error" })
	async register(@Body() registerUserDto: RegisterUserDto): Promise<AuthenticatedResponse> {
		return await this.authService.register(registerUserDto);
	}

	@Post("logout")
	@HttpCode(200)
	@ApiOperation({ summary: "Logout route" })
	@ApiBearerAuth()
	@ApiBody({ type: LogoutUserDto })
	@ApiOkResponse({ description: "Logout successfully. Blacklist access and refresh token" })
	@ApiInternalServerErrorResponse({ description: "Internal server error" })
	async logout(
		@AccessToken() accessToken: string,
		@Body() logoutUserDto: LogoutUserDto,
	): Promise<void> {
		return await this.authService.logout(accessToken, logoutUserDto.refresh_token);
	}

	@PublicRoute()
	@Post("refresh")
	@ApiOperation({ summary: "Refresh token route" })
	@ApiBody({ type: RefreshTokenDto })
	@ApiOkResponse({
		description: "Blacklist old access and refresh token and return new access and refresh token",
		schema: {
			type: "object",
			properties: {
				access_token: { type: "string" },
				refresh_token: { type: "string" },
			},
		},
	})
	@ApiResponse({
		status: 400,
		description: "Bad request",
		content: {
			"application/json": {
				examples: {
					"Refresh token is blacklisted!": {
						value: "Refresh token is blacklisted!",
					},
					"Token is invalid!": {
						value: "Token is invalid!",
					},
				},
			},
		},
	})
	@ApiInternalServerErrorResponse({ description: "Internal server error" })
	async refreshToken(
		@AccessToken() accessToken: string,
		@Body() refreshTokenDto: RefreshTokenDto,
	): Promise<AuthenticatedResponse> {
		return await this.authService.refreshToken(accessToken, refreshTokenDto.refresh_token);
	}

	@PublicRoute()
	@UseGuards(GoogleAuthGuard)
	@Get("google")
	@ApiOperation({ summary: "Google OAuth route" })
	@ApiPermanentRedirectResponse({
		description: "Redirect to Google OAuth",
	})
	googleOAuth(): void {}

	@PublicRoute()
	@UseGuards(GoogleAuthGuard)
	@UseFilters(OauthFilter)
	@Get("google/callback")
	@ApiOperation({ summary: "Google OAuth callback route" })
	@ApiCreatedResponse({
		description: "Created new user by Google account successfully",
		schema: {
			type: "object",
			properties: {
				user: { $ref: getSchemaPath(User) },
				access_token: { type: "string" },
				refresh_token: { type: "string" },
			},
		},
	})
	@ApiInternalServerErrorResponse({ description: "Internal server error" })
	async googleOAuthCallback(@Req() req): Promise<AuthenticatedResponse> {
		const user: GoogleProfile = req.user;

		return await this.authService.googleLogin(user);
	}

	@PublicRoute()
	@Get("google/failure")
	@ApiOperation({ summary: "Google OAuth failure route" })
	@ApiInternalServerErrorResponse({ description: "Internal server error" })
	googleOAuthFailure(): string {
		return "OAuth Google failed. Return to frontend oauth page later.";
	}
}
