import { ApiProperty } from "@nestjs/swagger";
import { Transform, TransformFnParams } from "class-transformer";
import { IsEmail, IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";

export class RegisterUserDto {
	@ApiProperty({
		description: "User email",
		type: String,
	})
	@IsEmail()
	@IsNotEmpty()
	@MaxLength(255, { message: "Email must be less than 255 characters" })
	@Transform(({ value }: TransformFnParams) => value?.trim())
	email: string;

	@ApiProperty({
		description: "User password",
		type: String,
	})
	@IsString({ message: "Password is required" })
	@IsNotEmpty()
	@MinLength(8, { message: "Password must be at least 8 characters" })
	@MaxLength(150, { message: "Password must be less than 150 characters" })
	@Transform(({ value }: TransformFnParams) => value?.trim())
	password: string;
}
