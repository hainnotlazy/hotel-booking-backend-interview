import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Profile, Strategy, VerifyCallback } from "passport-google-oauth20";
import { ConfigService } from "@nestjs/config";

export interface GoogleProfile {
	fullname: string;
	email: string;
}

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy) {
	constructor(private configService: ConfigService) {
		super({
			clientID: configService.get<string>("GOOGLE_CLIENT_ID", "google-client-id"),
			clientSecret: configService.get<string>("GOOGLE_CLIENT_SECRET", "google-client-secret"),
			callbackURL: configService.get<string>(
				"GOOGLE_CALLBACK_URL",
				"http://localhost:3000/api/auth/google/callback",
			),
			scope: ["profile", "email"],
		});
	}

	async validate(
		accessToken: string,
		refreshToken: string,
		profile: Profile,
		done: VerifyCallback,
	) {
		const { name, email } = profile._json;

		const user: GoogleProfile = {
			fullname: name,
			email,
		};

		done(null, user);
	}
}
