import { ClassSerializerInterceptor, Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { ConfigModule } from "@nestjs/config";
import { ConfigOptions, JwtConfigOptions, TypeOrmConfigOptions } from "./configurations";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthModule } from "./modules/auth/auth.module";
import { APP_INTERCEPTOR } from "@nestjs/core";
import { JwtModule } from "@nestjs/jwt";
import { UsersModule } from "./modules/users/users.module";

@Module({
	imports: [
		ConfigModule.forRoot(ConfigOptions),
		TypeOrmModule.forRootAsync({
			useClass: TypeOrmConfigOptions,
		}),
		JwtModule.registerAsync({
			global: true,
			useClass: JwtConfigOptions,
		}),
		AuthModule,
		UsersModule,
	],
	controllers: [AppController],
	providers: [
		AppService,
		{
			provide: APP_INTERCEPTOR,
			useClass: ClassSerializerInterceptor,
		},
	],
})
export class AppModule {}
