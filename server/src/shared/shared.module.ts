import { Module } from "@nestjs/common";
import { RedisService } from "./services/redis/redis.service";
import { HttpModule } from "@nestjs/axios";
import { ParseXmlService } from "./services/parse-xml/parse-xml.service";

@Module({
	imports: [HttpModule],
	providers: [RedisService, ParseXmlService],
	exports: [RedisService, HttpModule, ParseXmlService],
})
export class SharedModule {}
