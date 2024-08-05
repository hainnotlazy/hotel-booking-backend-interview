import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { ValidationPipe } from "@nestjs/common";

async function bootstrap() {
	const app = await NestFactory.create(AppModule);

	app.setGlobalPrefix("api");
	app.enableCors();
	app.useGlobalPipes(
		new ValidationPipe({
			whitelist: true,
			transform: true,
		}),
	);

	// Config Swagger
	const swaggerConfig = new DocumentBuilder()
		.setTitle("Grassway REST API")
		.setDescription("This document lists paths (endpoints) of Dashboard for Hotel Administration.")
		.setVersion("1.0.0")
		.addBearerAuth()
		.build();

	const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);
	SwaggerModule.setup("swagger", app, swaggerDocument);

	await app.listen(3000);
}

bootstrap();
