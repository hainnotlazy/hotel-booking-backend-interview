import { Controller, Get, Param, ParseIntPipe, Post, Res } from "@nestjs/common";
import { PaymentService } from "./payment.service";
import { PublicRoute } from "src/common/decorators";
import { Response } from "express";
import {
	ApiBearerAuth,
	ApiInternalServerErrorResponse,
	ApiOkResponse,
	ApiOperation,
	ApiPermanentRedirectResponse,
	ApiResponse,
	ApiTags,
} from "@nestjs/swagger";

@ApiTags("Payment")
@Controller("payment")
export class PaymentController {
	constructor(private readonly paymentService: PaymentService) {}

	@PublicRoute()
	@Get("success")
	@ApiOperation({ summary: "Payment success" })
	@ApiOkResponse({ description: "Payment success" })
	paymentSuccess() {
		return "Made payment successfully";
	}

	@PublicRoute()
	@Get("fail")
	@ApiOperation({ summary: "Payment failed" })
	@ApiOkResponse({ description: "Payment failed" })
	paymentFailed() {
		return "Payment failed";
	}

	@Post(":id")
	@ApiOperation({ summary: "Make payment" })
	@ApiBearerAuth()
	@ApiPermanentRedirectResponse({
		description: "Create order successfully and redirect to payment page",
	})
	@ApiResponse({
		status: 400,
		description: "Bad request",
		content: {
			"application/json": {
				examples: {
					"Confirmation No not found": {
						value: "Confirmation No not found",
					},
					"Create order failed!": {
						value: "Create order failed!",
					},
				},
			},
		},
	})
	@ApiInternalServerErrorResponse({
		description: "Internal server error",
	})
	async makePayment(@Res() res: Response, @Param("id", ParseIntPipe) id: number) {
		const checkOutLink = await this.paymentService.makePayment(id);
		return res.redirect(checkOutLink);
	}
}
