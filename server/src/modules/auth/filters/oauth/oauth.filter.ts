import {
	ArgumentsHost,
	Catch,
	ExceptionFilter,
	HttpException,
	UnauthorizedException,
} from "@nestjs/common";
import { Response } from "express";

@Catch(UnauthorizedException)
export class OauthFilter implements ExceptionFilter {
	private readonly OAUTH_FAILURE_REDIRECT = "/api/auth/google/failure";

	catch(exception: HttpException, host: ArgumentsHost) {
		const context = host.switchToHttp();
		const response = context.getResponse<Response>();
		const status = exception.getStatus();

		return response.status(status).redirect(this.OAUTH_FAILURE_REDIRECT);
	}
}
