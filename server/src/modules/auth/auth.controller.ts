import { Body, Controller, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { RegisterUserDto } from "src/common/dtos";

@Controller("auth")
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@Post("register")
	async register(@Body() registerUserDto: RegisterUserDto) {
		return await this.authService.register(registerUserDto);
	}
}
