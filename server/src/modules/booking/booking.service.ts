import { BadRequestException, Injectable } from "@nestjs/common";
import { isString } from "class-validator";
import { XMLParser } from "fast-xml-parser";
import * as fs from "fs";
import * as path from "path";
import { BookingRecord } from "src/common/models";
import { BookingRecordResponse, IBookingService } from "src/common/service-interfaces";

@Injectable()
export class BookingService implements IBookingService {
	private readonly xmlParser: XMLParser;
	private readonly BOOKINGS_RESOURCE_PATH = path.join(
		__dirname,
		"..",
		"..",
		"..",
		"resources",
		"bookings",
	);

	constructor() {
		const xmlParserConfig = {
			ignoreAttributes: false,
			attributeNamePrefix: "@_",
		};
		this.xmlParser = new XMLParser(xmlParserConfig);
	}

	findBookingRecord(confirmationNo: number): BookingRecordResponse {
		const fileName = `booking_${confirmationNo}.xml`;
		const filePath = path.join(this.BOOKINGS_RESOURCE_PATH, fileName);
		if (!fs.existsSync(filePath)) {
			throw new BadRequestException("Booking record not found");
		}

		const fileData = fs.readFileSync(filePath, "utf-8");
		const jsonObject = this.xmlParser.parse(fileData) as BookingRecord;

		return {
			confirmation_no: confirmationNo.toString(),
			resv_name_id: this.getResvNameId(jsonObject),
			arrival: this.getArrival(jsonObject),
			departure: this.getDeparture(jsonObject),
			adults: this.getAdults(jsonObject),
			children: this.getChildren(jsonObject),
			roomtype: this.getRoomType(jsonObject),
			ratecode: this.getRateCode(jsonObject),
			rateamount: this.getRateAmount(jsonObject),
			guarantee: this.getGuarantee(jsonObject),
			method_payment: this.getMethodPayment(jsonObject),
			computed_resv_status: this.getComputedResvStatus(jsonObject),
			last_name: this.getLastName(jsonObject),
			first_name: this.getFirstName(jsonObject),
			title: this.getTitle(jsonObject),
			phone_number: this.getPhoneNumber(jsonObject),
			booking_balance: this.getBookingBalance(jsonObject),
			booking_created_date: this.getBookingCreatedDate(jsonObject),
		};
	}

	getResvNameId(jsonObject: BookingRecord): string {
		try {
			const uniqueIds =
				jsonObject["soap:Envelope"]["soap:Body"].FetchBookingResponse.HotelReservation[
					"r:UniqueIDList"
				]["c:UniqueID"];
			let resvNameId = null;
			for (const id of uniqueIds) {
				if (id["@_type"] === "INTERNAL" && id["@_source"] && id["@_source"] === "RESVID") {
					resvNameId = id["#text"];
				}
			}
			return isString(resvNameId) ? resvNameId : resvNameId.toString();
		} catch (e) {
			return null;
		}
	}

	getArrival(jsonObject: BookingRecord): string {
		try {
			const rawDate =
				jsonObject["soap:Envelope"]["soap:Body"].FetchBookingResponse.HotelReservation[
					"r:ResGuests"
				]["r:ResGuest"]["r:ArrivalTransport"]["@_time"];
			const formattedDate = new Date(rawDate).toISOString().split("T")[0];
			return formattedDate;
		} catch (e) {
			return null;
		}
	}

	getDeparture(jsonObject: BookingRecord): string {
		try {
			const rawDate =
				jsonObject["soap:Envelope"]["soap:Body"].FetchBookingResponse.HotelReservation[
					"r:ResGuests"
				]["r:ResGuest"]["r:DepartureTransport"]["@_time"];
			const formattedDate = new Date(rawDate).toISOString().split("T")[0];
			return formattedDate;
		} catch (e) {
			return null;
		}
	}

	getAdults(jsonObject: BookingRecord): number {
		try {
			const guestCounts =
				jsonObject["soap:Envelope"]["soap:Body"].FetchBookingResponse.HotelReservation[
					"r:RoomStays"
				]["hc:RoomStay"]["hc:GuestCounts"]["hc:GuestCount"];
			for (const guest of guestCounts) {
				if (guest["@_ageQualifyingCode"] === "ADULT") {
					return parseInt(guest["@_count"]);
				}
			}
		} catch (e) {
			return null;
		}
	}

	getChildren(jsonObject: BookingRecord): number {
		try {
			const guestCounts =
				jsonObject["soap:Envelope"]["soap:Body"].FetchBookingResponse.HotelReservation[
					"r:RoomStays"
				]["hc:RoomStay"]["hc:GuestCounts"]["hc:GuestCount"];
			for (const guest of guestCounts) {
				if (guest["@_ageQualifyingCode"] === "CHILD") {
					return parseInt(guest["@_count"]);
				}
			}
		} catch (e) {
			return null;
		}
	}

	getRoomType(jsonObject: BookingRecord): string {
		try {
			return jsonObject["soap:Envelope"]["soap:Body"].FetchBookingResponse.HotelReservation[
				"r:RoomStays"
			]["hc:RoomStay"]["hc:RoomTypes"]["hc:RoomType"]["@_roomTypeCode"];
		} catch (e) {
			return null;
		}
	}

	getRateCode(jsonObject: BookingRecord): string {
		try {
			return jsonObject["soap:Envelope"]["soap:Body"].FetchBookingResponse.HotelReservation[
				"r:RoomStays"
			]["hc:RoomStay"]["hc:RoomRates"]["hc:RoomRate"]["@_ratePlanCode"];
		} catch (e) {
			return null;
		}
	}

	getRateAmount(jsonObject: BookingRecord): {
		amount: number;
		currency: string;
	} {
		try {
			const roomRate =
				jsonObject["soap:Envelope"]["soap:Body"].FetchBookingResponse.HotelReservation[
					"r:RoomStays"
				]["hc:RoomStay"]["hc:RoomRates"]["hc:RoomRate"]["hc:Rates"]["hc:Rate"]["hc:Base"];

			return {
				amount: roomRate["#text"],
				currency: roomRate["@_currencyCode"],
			};
		} catch (e) {
			return null;
		}
	}

	getGuarantee(jsonObject: BookingRecord): string {
		try {
			return jsonObject["soap:Envelope"]["soap:Body"].FetchBookingResponse.HotelReservation[
				"r:RoomStays"
			]["hc:RoomStay"]["hc:Guarantee"]["@_guaranteeType"];
		} catch (e) {
			return null;
		}
	}

	getMethodPayment(jsonObject: BookingRecord): string {
		try {
			return jsonObject["soap:Envelope"]["soap:Body"].FetchBookingResponse.HotelReservation[
				"r:ReservationPayments"
			]["r:ReservationPaymentInfo"]["@_PaymentType"];
		} catch (e) {
			return null;
		}
	}

	getComputedResvStatus(jsonObject: BookingRecord): string {
		try {
			return jsonObject["soap:Envelope"]["soap:Body"].FetchBookingResponse.HotelReservation[
				"@_computedReservationStatus"
			];
		} catch (e) {
			return null;
		}
	}

	getLastName(jsonObject: BookingRecord): string {
		try {
			return jsonObject["soap:Envelope"]["soap:Body"].FetchBookingResponse.HotelReservation[
				"r:ResGuests"
			]["r:ResGuest"]["r:Profiles"].Profile[0].Customer.PersonName["c:lastName"];
		} catch (e) {
			return null;
		}
	}

	getFirstName(jsonObject: BookingRecord): string {
		try {
			return jsonObject["soap:Envelope"]["soap:Body"].FetchBookingResponse.HotelReservation[
				"r:ResGuests"
			]["r:ResGuest"]["r:Profiles"].Profile[0].Customer.PersonName["c:firstName"];
		} catch (e) {
			return null;
		}
	}

	getTitle(jsonObject: BookingRecord): string {
		try {
			return jsonObject["soap:Envelope"]["soap:Body"].FetchBookingResponse.HotelReservation[
				"r:ResGuests"
			]["r:ResGuest"]["r:Profiles"].Profile[0].Customer.PersonName["c:nameTitle"];
		} catch (e) {
			return null;
		}
	}

	getPhoneNumber(jsonObject: BookingRecord): string {
		try {
			return jsonObject["soap:Envelope"]["soap:Body"].FetchBookingResponse.HotelReservation[
				"r:ResGuests"
			]["r:ResGuest"]["r:Profiles"].Profile[0].Phones.NamePhone["c:PhoneNumber"];
		} catch (e) {
			return null;
		}
	}

	getEmail(jsonObject: BookingRecord): string {
		// No field email found? (Maybe hide by policy)
		return null;
	}

	getBookingBalance(jsonObject: BookingRecord): number {
		try {
			return jsonObject["soap:Envelope"]["soap:Body"].FetchBookingResponse.HotelReservation[
				"r:RoomStays"
			]["hc:RoomStay"]["hc:Total"]["#text"];
		} catch (e) {
			return null;
		}
	}

	getBookingCreatedDate(jsonObject: BookingRecord): string {
		try {
			const rawDate =
				jsonObject["soap:Envelope"]["soap:Body"].FetchBookingResponse.HotelReservation[
					"r:ReservationHistory"
				]["@_insertDate"];
			const formattedDate = new Date(rawDate).toISOString().split("T")[0];
			return formattedDate;
		} catch (e) {
			return null;
		}
	}
}
