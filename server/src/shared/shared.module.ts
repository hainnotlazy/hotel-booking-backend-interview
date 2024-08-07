import { Module } from "@nestjs/common";
import { RedisService } from "./redis/redis.service";
import { HttpModule } from "@nestjs/axios";

@Module({
	imports: [HttpModule],
	providers: [RedisService],
	exports: [RedisService, HttpModule],
})
export class SharedModule {}
