export interface GetKeyRedisOptions {
	key: string;
	database?: RedisDatabase;
}
export interface SetKeyRedisOptions {
	key: string;
	value: string;
	database?: RedisDatabase;
	expiresIn?: number;
}

export enum RedisDatabase {
	TOKEN_BLACKLIST = 0,
}

export interface IRedisService {
	getKey(options: GetKeyRedisOptions): Promise<string>;
	setKey(options: SetKeyRedisOptions): Promise<"OK">;
	flushDatabase(database: RedisDatabase): Promise<"OK">;
	selectDatabase(database: RedisDatabase): Promise<"OK">;
}
