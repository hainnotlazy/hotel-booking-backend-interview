export interface TokenPayload {
	uid: number;
	email: string;
}

export interface RawTokenPayload extends TokenPayload {
	iat: number;
	exp: number;
}
