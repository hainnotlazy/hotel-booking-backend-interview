import { ApiProperty } from "@nestjs/swagger";
import { Transform, TransformFnParams } from "class-transformer";
import { IsEmail, IsNotEmpty, IsString, Length, MaxLength } from "class-validator";

export class LoginUserDto {
	@ApiProperty({
		description: "User email",
		type: String,
	})
	@IsEmail()
	@IsNotEmpty()
	@MaxLength(255, { message: "Email is invalid" })
	@Transform(({ value }: TransformFnParams) => value?.trim())
	email: string;

	@ApiProperty({
		description: "User password",
		type: String,
	})
	@IsString({ message: "Password is required" })
	@IsNotEmpty()
	@Length(8, 150, { message: "Password is invalid" })
	@Transform(({ value }: TransformFnParams) => value?.trim())
	password: string;
}
