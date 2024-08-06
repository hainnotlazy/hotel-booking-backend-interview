import { InjectRedis } from "@nestjs-modules/ioredis";
import { Injectable } from "@nestjs/common";
import { Redis } from "ioredis";
import {
	GetKeyRedisOptions,
	IRedisService,
	RedisDatabase,
	SetKeyRedisOptions,
} from "src/common/service-interfaces";

@Injectable()
export class RedisService implements IRedisService {
	constructor(
		@InjectRedis()
		private readonly redisService: Redis,
	) {}

	async getKey(options: GetKeyRedisOptions): Promise<string> {
		const { key, database } = options;

		await this.selectDatabase(database ?? RedisDatabase.TOKEN_BLACKLIST);
		return this.redisService.get(key);
	}

	async setKey(options: SetKeyRedisOptions): Promise<"OK"> {
		const { key, value, database, expiresIn } = options;

		await this.selectDatabase(database ?? RedisDatabase.TOKEN_BLACKLIST);
		await this.redisService.set(key, value);
		if (expiresIn) {
			await this.redisService.expire(key, expiresIn);
		}

		return "OK";
	}

	async flushDatabase(database: RedisDatabase): Promise<"OK"> {
		await this.selectDatabase(database);
		return await this.redisService.flushdb();
	}

	async selectDatabase(database: RedisDatabase): Promise<"OK"> {
		return await this.redisService.select(database);
	}
}
