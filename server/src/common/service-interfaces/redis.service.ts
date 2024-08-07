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
	/**
	 * Describe: Get key from redis
	 * @param {GetKeyRedisOptions} options
	 */
	getKey(options: GetKeyRedisOptions): Promise<string>;

	/**
	 * Describe: Set key in redis
	 * @param {SetKeyRedisOptions} options
	 */
	setKey(options: SetKeyRedisOptions): Promise<"OK">;

	/**
	 * Describe: Flush database
	 * @param {RedisDatabase} database
	 */
	flushDatabase(database: RedisDatabase): Promise<"OK">;

	/**
	 * Describe: Select database
	 * @param {RedisDatabase} database
	 */
	selectDatabase(database: RedisDatabase): Promise<"OK">;
}
