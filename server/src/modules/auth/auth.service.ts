import { IAuthService } from "src/common/service-interfaces/auth.service";
import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "src/entities";
import { Repository } from "typeorm";
import { RegisterUserDto } from "src/common/dtos";

@Injectable()
export class AuthService implements IAuthService {
	constructor(
		@InjectRepository(User)
		private readonly userRepository: Repository<User>,
	) {}

	async register(registerUserDto: RegisterUserDto): Promise<User> {
		const { email, password } = registerUserDto;

		await this.validateEmail(email);

		const newUser = this.userRepository.create({
			email,
			password, // Handle to hash password at entity layer
		});
		const savedUser = this.userRepository.save(newUser);

		return savedUser;
	}

	private async validateEmail(email: string): Promise<void> {
		const isEmailExisted = await this.userRepository.findOne({
			where: {
				email,
			},
		});
		if (isEmailExisted) {
			throw new BadRequestException("Email already existed!");
		}
	}
}
