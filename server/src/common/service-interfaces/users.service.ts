import { User } from "src/entities";

export interface IUsersService {
	findById(id: number): Promise<User>;
	createUser(user: Partial<User>): Promise<User>;
}
