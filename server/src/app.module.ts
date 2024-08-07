import { ClassSerializerInterceptor, Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { ConfigModule } from "@nestjs/config";
import {
	ConfigOptions,
	JwtConfigOptions,
	RedisConfigOptions,
	TypeOrmConfigOptions,
} from "./configurations";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthModule } from "./modules/auth/auth.module";
import { APP_INTERCEPTOR } from "@nestjs/core";
import { JwtModule } from "@nestjs/jwt";
import { UsersModule } from "./modules/users/users.module";
import { RedisModule } from "@nestjs-modules/ioredis";
import { SharedModule } from './shared/shared.module';
import { BookingModule } from './modules/booking/booking.module';

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
		RedisModule.forRoot(RedisConfigOptions),
		AuthModule,
		UsersModule,
		SharedModule,
		BookingModule,
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
