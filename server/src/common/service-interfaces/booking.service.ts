import { BookingRecord } from "../models";

export interface BookingRecordResponse {
	confirmation_no: string;
	resv_name_id: string;
	arrival: string;
	departure: string;
	adults: number;
	children: number;
	roomtype: string;
	ratecode: string;
	rateamount: {
		amount: number;
		currency: string;
	};
	guarantee: string;
	method_payment: string;
	computed_resv_status: string;
	last_name: string;
	first_name: string;
	title: string;
	phone_number: string;
	email?: string;
	booking_balance: number;
	booking_created_date: string;
}

export interface IBookingService {
	findBookingRecord(confirmationNo: number): BookingRecordResponse;
	getResvNameId(jsonObject: BookingRecord): string;
	getArrival(jsonObject: BookingRecord): string;
	getDeparture(jsonObject: BookingRecord): string;
	getAdults(jsonObject: BookingRecord): number;
	getChildren(jsonObject: BookingRecord): number;
	getRoomType(jsonObject: BookingRecord): string;
	getRateCode(jsonObject: BookingRecord): string;
	getRateAmount(jsonObject: BookingRecord): {
		amount: number;
		currency: string;
	};
	getGuarantee(jsonObject: BookingRecord): string;
	getMethodPayment(jsonObject: BookingRecord): string;
	getComputedResvStatus(jsonObject: BookingRecord): string;
	getLastName(jsonObject: BookingRecord): string;
	getFirstName(jsonObject: BookingRecord): string;
	getTitle(jsonObject: BookingRecord): string;
	getPhoneNumber(jsonObject: BookingRecord): string;
	getEmail(jsonObject: BookingRecord): string;
	getBookingBalance(jsonObject: BookingRecord): number;
	getBookingCreatedDate(jsonObject: BookingRecord): string;
}
