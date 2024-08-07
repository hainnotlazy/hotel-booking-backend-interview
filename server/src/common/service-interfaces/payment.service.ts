export interface CreateOrderResponse {
	result_code: string;
	result_data: {
		checkout_url: string;
		token_code: string;
	};
	result_message: string;
}

export interface IPaymentService {
	/**
	 * Describe: Make payment
	 * @param {number} confirmationNo
	 */
	makePayment(confirmationNo: number): Promise<string>;

	/**
	 * Describe: Get check out link
	 * @param {number} confirmationNo
	 */
	getCheckOutLink(confirmationNo: number): Promise<string>;
}
