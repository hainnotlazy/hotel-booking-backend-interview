import { Controller, Get, Param, ParseIntPipe } from "@nestjs/common";
import { BookingService } from "./booking.service";
import {
	ApiBadRequestResponse,
	ApiBearerAuth,
	ApiInternalServerErrorResponse,
	ApiOkResponse,
	ApiOperation,
	ApiTags,
} from "@nestjs/swagger";
import { BookingRecordResponse } from "src/common/service-interfaces";

@ApiTags("Booking")
@Controller("booking")
export class BookingController {
	constructor(private readonly bookingService: BookingService) {}

	@Get(":id")
	@ApiOperation({ summary: "Get booking record" })
	@ApiBearerAuth()
	@ApiOkResponse({
		description: "Get booking record successfully",
	})
	@ApiBadRequestResponse({ description: "Confirmation No not found" })
	@ApiInternalServerErrorResponse({ description: "Internal server error" })
	findBookingRecord(@Param("id", ParseIntPipe) id: number): BookingRecordResponse {
		return this.bookingService.findBookingRecord(id);
	}
}
