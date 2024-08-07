import { ApiProperty } from "@nestjs/swagger";
import { Transform, TransformFnParams } from "class-transformer";
import { IsNotEmpty, IsString } from "class-validator";

export class LogoutUserDto {
	@ApiProperty({
		description: "Refresh token",
		type: String,
	})
	@IsString()
	@IsNotEmpty()
	@Transform(({ value }: TransformFnParams) => value.trim())
	refresh_token: string;
}
