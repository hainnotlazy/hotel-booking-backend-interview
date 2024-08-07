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
	/**
	 * Describe: Find booking record
	 * @param {number} confirmationNo
	 * @param {boolean} useExternalXMLParser
	 */
	findBookingRecord(confirmationNo: number, useExternalXMLParser: boolean): BookingRecordResponse;

	/**
	 * Describe: Get resv name id
	 * @param {BookingRecord} jsonObject
	 */
	getResvNameId(jsonObject: BookingRecord): string;

	/**
	 * Describe: Get arrival
	 * @param {BookingRecord} jsonObject
	 */
	getArrival(jsonObject: BookingRecord): string;

	/**
	 * Describe: Get departure
	 * @param {BookingRecord} jsonObject
	 */
	getDeparture(jsonObject: BookingRecord): string;

	/**
	 * Describe: Get adults
	 * @param {BookingRecord} jsonObject
	 */
	getAdults(jsonObject: BookingRecord): number;

	/**
	 * Describe: Get children
	 * @param {BookingRecord} jsonObject
	 */
	getChildren(jsonObject: BookingRecord): number;

	/**
	 * Describe: Get room type
	 * @param {BookingRecord} jsonObject
	 */
	getRoomType(jsonObject: BookingRecord): string;

	/**
	 * Describe: Get rate code
	 * @param {BookingRecord} jsonObject
	 */
	getRateCode(jsonObject: BookingRecord): string;

	/**
	 * Describe: Get rate amount
	 * @param {BookingRecord} jsonObject
	 */
	getRateAmount(jsonObject: BookingRecord): {
		amount: number;
		currency: string;
	};

	/**
	 * Describe: Get guarantee
	 * @param {BookingRecord} jsonObject
	 */
	getGuarantee(jsonObject: BookingRecord): string;

	/**
	 * Describe: Get method payment
	 * @param {BookingRecord} jsonObject
	 */
	getMethodPayment(jsonObject: BookingRecord): string;

	/**
	 * Describe: Get computed resv status
	 * @param {BookingRecord} jsonObject
	 */
	getComputedResvStatus(jsonObject: BookingRecord): string;

	/**
	 * Describe: Get last name
	 * @param {BookingRecord} jsonObject
	 */
	getLastName(jsonObject: BookingRecord): string;

	/**
	 * Describe: Get first name
	 * @param {BookingRecord} jsonObject
	 */
	getFirstName(jsonObject: BookingRecord): string;

	/**
	 * Describe: Get title
	 * @param {BookingRecord} jsonObject
	 */
	getTitle(jsonObject: BookingRecord): string;

	/**
	 * Describe: Get phone number
	 * @param {BookingRecord} jsonObject
	 */
	getPhoneNumber(jsonObject: BookingRecord): string;

	/**
	 * Describe: Get email
	 * @param {BookingRecord} jsonObject
	 */
	getEmail(jsonObject: BookingRecord): string;

	/**
	 * Describe: Get booking balance
	 * @param {BookingRecord} jsonObject
	 */
	getBookingBalance(jsonObject: BookingRecord): number;

	/**
	 * Describe: Get booking created date
	 * @param {BookingRecord} jsonObject
	 */
	getBookingCreatedDate(jsonObject: BookingRecord): string;
}
