import { Body, Controller, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { LoginUserDto, RegisterUserDto } from "src/common/dtos";
import { PublicRoute } from "src/common/decorators";

@Controller("auth")
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@PublicRoute()
	@Post("login")
	async login(@Body() loginUserDto: LoginUserDto) {
		return await this.authService.login(loginUserDto);
	}

	@PublicRoute()
	@Post("register")
	async register(@Body() registerUserDto: RegisterUserDto) {
		return await this.authService.register(registerUserDto);
	}
}
