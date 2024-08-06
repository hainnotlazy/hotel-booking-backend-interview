import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { IUsersService } from "src/common/service-interfaces";
import { User } from "src/entities";
import { Repository } from "typeorm";

@Injectable()
export class UsersService implements IUsersService {
	constructor(
		@InjectRepository(User)
		private readonly userRepository: Repository<User>,
	) {}

	async findById(id: number) {
		const existedUser = await this.userRepository.findOne({
			where: {
				id,
			},
		});

		if (!existedUser) {
			throw new NotFoundException("User not found");
		}

		return existedUser;
	}

	async createUser(user: Partial<User>): Promise<User> {
		const newUser = this.userRepository.create(user); // Handled to hash password at entity layer
		return await this.userRepository.save(newUser);
	}
}
