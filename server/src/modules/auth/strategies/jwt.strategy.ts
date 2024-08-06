import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { UsersService } from "src/modules/users/users.service";
import { TokenPayload } from "../interfaces";
import { User } from "src/entities";
import { AuthService } from "../auth.service";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
	constructor(
		private configService: ConfigService,
		private usersService: UsersService,
		private authService: AuthService,
	) {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			secretOrKey: configService.get<string>("JWT_SECRET", "do-not-public-this-secret-key"),
			passReqToCallback: true,
		});
	}

	async validate(request: any, payload: TokenPayload): Promise<User> {
		// Check if token is blacklisted
		const accessToken = request.headers.authorization.split(" ")[1];
		if (await this.authService.isTokenBlacklisted(accessToken)) {
			throw new UnauthorizedException("Token is blacklisted!");
		}

		// Find user from token
		const { uid, email } = payload;
		const user = await this.usersService.findById(uid);

		return user;
	}
}
