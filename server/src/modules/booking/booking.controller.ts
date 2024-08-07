import { Controller, Get, Param, ParseIntPipe } from "@nestjs/common";
import { BookingService } from "./booking.service";

@Controller("booking")
export class BookingController {
	constructor(private readonly bookingService: BookingService) {}

	@Get(":id")
	findBookingRecord(@Param("id", ParseIntPipe) id: number) {
		return this.bookingService.findBookingRecord(id);
	}
}
