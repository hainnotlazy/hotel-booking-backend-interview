import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtModuleOptions, JwtOptionsFactory } from "@nestjs/jwt";

@Injectable()
export class JwtConfigOptions implements JwtOptionsFactory {
	constructor(private configService: ConfigService) {}

	createJwtOptions(): JwtModuleOptions {
		return {
			global: true,
			secret: this.configService.get<string>("JWT_SECRET", "hotel-admin-jwt-secret"),
			signOptions: {
				expiresIn: "7d",
			},
		};
	}
}
