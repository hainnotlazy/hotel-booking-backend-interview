import { Controller, Get, Param, ParseIntPipe, Post, Res } from "@nestjs/common";
import { PaymentService } from "./payment.service";
import { PublicRoute } from "src/common/decorators";
import { Response } from "express";

@Controller("payment")
export class PaymentController {
	constructor(private readonly paymentService: PaymentService) {}

	@PublicRoute()
	@Get("success")
	paymentSuccess() {
		return "Made payment successfully";
	}

	@PublicRoute()
	@Get("fail")
	paymentFailed() {
		return "Payment failed";
	}

	@Post(":id")
	async makePayment(@Res() res: Response, @Param("id", ParseIntPipe) id: number) {
		const checkOutLink = await this.paymentService.makePayment(id);
		return res.redirect(checkOutLink);
	}
}
