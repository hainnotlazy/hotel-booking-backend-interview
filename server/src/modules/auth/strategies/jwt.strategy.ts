import { ForbiddenException, Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { AuthService } from "../auth.service";
import { UsersService } from "src/modules/users/users.service";

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

	async validate(request: any, payload: any) {
		// Check if token is blacklisted
		const accessToken = request.headers.authorization.split(" ")[1];
		// if (await this.authService.isTokenBlacklisted(accessToken)) {
		// 	throw new UnauthorizedException("Token is invalid");
		// }

		// Find user from token
		const { uid, email, exp: expirationTime } = payload;
		const user = await this.usersService.findById(uid);

		// Validate user
		// if (!user.is_active) {
		// 	throw new ForbiddenException("Account is inactive");
		// }

		// request.expirationTime = expirationTime;
		return user;
	}
}
