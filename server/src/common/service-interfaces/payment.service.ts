export interface CreateOrderResponse {
	result_code: string;
	result_data: {
		checkout_url: string;
		token_code: string;
	};
	result_message: string;
}

export interface IPaymentService {
	makePayment(id: number): Promise<string>;
	getCheckOutLink(confirmationNo: number): Promise<string>;
}
