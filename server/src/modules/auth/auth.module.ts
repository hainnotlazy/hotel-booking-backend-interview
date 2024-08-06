import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "src/entities";
import { JwtStrategy } from "./strategies";
import { APP_GUARD } from "@nestjs/core";
import { JwtAuthGuard } from "./guards";
import { UsersModule } from "../users/users.module";
import { SharedModule } from "src/shared/shared.module";

@Module({
	imports: [TypeOrmModule.forFeature([User]), UsersModule, SharedModule],
	controllers: [AuthController],
	providers: [
		AuthService,
		JwtStrategy,
		{
			provide: APP_GUARD,
			useClass: JwtAuthGuard,
		},
	],
})
export class AuthModule {}
