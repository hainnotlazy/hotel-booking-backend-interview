import { ExecutionContext, createParamDecorator } from "@nestjs/common";

export const AccessToken = createParamDecorator((data: never, context: ExecutionContext) => {
	const request = context.switchToHttp().getRequest();

	return request.headers.authorization.split(" ")[1];
});
