import { RegisterUserDto } from "src/common/dtos/auth/register-user.dto";
import { User } from "src/entities";

export interface IAuthService {
	register(registerUserDto: RegisterUserDto): Promise<User>;
}
