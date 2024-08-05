import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "src/entities";
import { Repository } from "typeorm";

@Injectable()
export class UsersService {
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
}
