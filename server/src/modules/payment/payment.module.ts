import { Module } from "@nestjs/common";
import { PaymentController } from "./payment.controller";
import { PaymentService } from "./payment.service";
import { BookingModule } from "../booking/booking.module";
import { SharedModule } from "src/shared/shared.module";

@Module({
	imports: [BookingModule, SharedModule],
	controllers: [PaymentController],
	providers: [PaymentService],
})
export class PaymentModule {}
