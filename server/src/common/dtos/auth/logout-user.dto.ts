import { Transform, TransformFnParams } from "class-transformer";
import { IsNotEmpty, IsString } from "class-validator";

export class LogoutUserDto {
	@IsString()
	@IsNotEmpty()
	@Transform(({ value }: TransformFnParams) => value.trim())
	refresh_token: string;
}
