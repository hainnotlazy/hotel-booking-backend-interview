import { BadRequestException, Injectable } from "@nestjs/common";
import { CreateOrderResponse, IPaymentService } from "src/common/service-interfaces";
import { BookingService } from "../booking/booking.service";
import { ConfigService } from "@nestjs/config";
import { HttpService } from "@nestjs/axios";
import { MD5 } from "crypto-js";
import { catchError, firstValueFrom, map, take } from "rxjs";
import { AxiosError } from "axios";

@Injectable()
export class PaymentService implements IPaymentService {
	private readonly PAYMENT_URL: string;
	private readonly PAYMENT_FUNCTION_NAME: string = "CreateOrder";
	private readonly MERCHANT_SITE_CODE: string;
	private readonly MERCHANT_PASSCODE: string;
	private readonly PAYMENT_SUCCESS_URL: string;
	private readonly PAYMENT_FAILED_URL: string;
	private readonly PAYMENT_LANGUAGE_UI: string;

	constructor(
		private readonly configService: ConfigService,
		private readonly bookingService: BookingService,
		private readonly httpService: HttpService,
	) {
		this.PAYMENT_URL = this.configService.get<string>(
			"PAYMENT_URL",
			"https://api.pay.fasterpay.net/api/v1/",
		);
		this.MERCHANT_SITE_CODE = this.configService.get<string>("MERCHANT_SITE_CODE", "7");
		this.MERCHANT_PASSCODE = this.configService.get<string>("MERCHANT_PASSCODE", "passcode");
		this.PAYMENT_SUCCESS_URL = this.configService.get<string>(
			"PAYMENT_RETURN_URL",
			"http://localhost:3000/payment/success",
		);
		this.PAYMENT_FAILED_URL = this.configService.get<string>(
			"PAYMENT_CANCEL_URL",
			"http://localhost:3000/payment/fail",
		);
		this.PAYMENT_LANGUAGE_UI = this.configService.get<string>("PAYMENT_LANGUAGE", "vi");
	}

	async makePayment(confirmationNo: number): Promise<string> {
		const checkOutLink = await this.getCheckOutLink(confirmationNo);

		return checkOutLink;
	}

	async getCheckOutLink(confirmationNo: number): Promise<string> {
		const bookingRecord = this.bookingService.findBookingRecord(confirmationNo);

		const {
			rateamount: { amount, currency },
			last_name: lastName,
			first_name: firstName,
			phone_number: phoneNumber,
			email,
		} = bookingRecord;
		const orderCode = confirmationNo;
		const orderDescription = "";
		const buyerFullname = `${lastName} ${firstName}`;
		const buyerEmail = email || "";
		const buyerMobile = phoneNumber || "";
		const buyerAddress = "";
		const notifyUrl = "";

		// Generate checksum
		const checkSum = MD5(
			[
				this.MERCHANT_SITE_CODE,
				orderCode,
				orderDescription,
				amount,
				currency,
				buyerFullname,
				buyerEmail,
				buyerMobile,
				buyerAddress,
				this.PAYMENT_SUCCESS_URL,
				this.PAYMENT_FAILED_URL,
				notifyUrl,
				this.PAYMENT_LANGUAGE_UI,
				this.MERCHANT_PASSCODE,
			].join("|"),
		);

		// Create form data
		const formData = new FormData();
		formData.append("function", this.PAYMENT_FUNCTION_NAME);
		formData.append("merchant_site_code", this.MERCHANT_SITE_CODE);
		formData.append("order_code", orderCode.toString());
		formData.append("amount", amount.toString());
		formData.append("currency", currency);
		formData.append("buyer_fullname", buyerFullname);
		formData.append("buyer_email", buyerEmail);
		formData.append("buyer_mobile", buyerMobile);
		formData.append("buyer_address", buyerAddress);
		formData.append("return_url", this.PAYMENT_SUCCESS_URL);
		formData.append("cancel_url", this.PAYMENT_FAILED_URL);
		formData.append("language", this.PAYMENT_LANGUAGE_UI);
		formData.append("checksum", checkSum.toString());

		// Return checkout link
		return await firstValueFrom(
			this.httpService.post<CreateOrderResponse>(this.PAYMENT_URL, formData).pipe(
				take(1),
				map(response => {
					return response.data.result_data.checkout_url;
				}),
				catchError((error: AxiosError) => {
					throw new BadRequestException("Create order failed!");
				}),
			),
		);
	}
}
