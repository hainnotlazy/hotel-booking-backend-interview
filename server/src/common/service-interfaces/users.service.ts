import { User } from "src/entities";

export interface IUsersService {
	/**
	 * Describe: Find user by id
	 * @param {number} id
	 */
	findById(id: number): Promise<User>;

	/**
	 * Describe: Create new user
	 * @param {Partial<User>} user
	 */
	createUser(user: Partial<User>): Promise<User>;
}
