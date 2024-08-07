import { Module } from "@nestjs/common";
import { BookingController } from "./booking.controller";
import { BookingService } from "./booking.service";
import { SharedModule } from "src/shared/shared.module";

@Module({
	imports: [SharedModule],
	controllers: [BookingController],
	providers: [BookingService],
	exports: [BookingService],
})
export class BookingModule {}
