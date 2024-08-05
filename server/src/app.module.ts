import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { ConfigModule } from "@nestjs/config";
import { ConfigOptions, TypeOrmConfigOptions } from "./configurations";
import { TypeOrmModule } from "@nestjs/typeorm";

@Module({
	imports: [
		ConfigModule.forRoot(ConfigOptions),
		TypeOrmModule.forRootAsync({
			useClass: TypeOrmConfigOptions,
		}),
	],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {}
