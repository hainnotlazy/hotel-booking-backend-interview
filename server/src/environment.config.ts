import { INestApplication, ValidationPipe } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import helmet from "helmet";

export default function configEnvironment(app: INestApplication) {
	app.use(helmet());
	app.getHttpAdapter().getInstance().disable("x-powered-by");

	app.useGlobalPipes(
		new ValidationPipe({
			whitelist: true,
			transform: true,
		}),
	);
	app.setGlobalPrefix("api");

	/** Config settings for environments */
	if (process.env.NODE_ENV === "production") {
		/** Production environment */
		app.enableCors({
			origin: ["http://client", "https://client"],
			credentials: true,
		});
	} else {
		/** Development environment */
		app.enableCors();

		// Config Swagger
		// Swagger will only work on development environment
		const swaggerConfig = new DocumentBuilder()
			.setTitle("PA Infotel Hotel Administration - REST API")
			.setDescription("This document lists paths (endpoints) of PA Infotel Hotel Administration")
			.setVersion("1.0.0")
			.addTag("Auth", "Endpoints for authentication")
			.addTag("Booking", "Endpoints for bookings interaction")
			.addTag("Payment", "Endpoints for payment interaction")
			.addBearerAuth()
			.build();

		const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);
		SwaggerModule.setup("swagger", app, swaggerDocument);
	}
}
