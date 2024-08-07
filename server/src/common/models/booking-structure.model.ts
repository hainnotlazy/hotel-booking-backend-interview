export interface BookingRecord {
	"?xml": Xml;
	"soap:Envelope": SoapEnvelope;
}

export interface Xml {
	"@_version": string;
	"@_encoding": string;
}

export interface SoapEnvelope {
	"soap:Header": SoapHeader;
	"soap:Body": SoapBody;
	"@_xmlns:soap": string;
	"@_xmlns:xsi": string;
	"@_xmlns:xsd": string;
	"@_xmlns:wsa": string;
}

export interface SoapHeader {
	"OGHeader": Ogheader;
	"wsa:Action": string;
	"wsa:MessageID": string;
	"wsa:RelatesTo": string;
	"wsa:To": string;
}

export interface Ogheader {
	"Origin": Origin;
	"Destination": Destination;
	"@_transactionID": string;
	"@_timeStamp": string;
	"@_primaryLangID": string;
	"@_xmlns": string;
}

export interface Origin {
	"@_entityID": string;
	"@_systemType": string;
}

export interface Destination {
	"@_entityID": string;
	"@_systemType": string;
}

export interface SoapBody {
	FetchBookingResponse: FetchBookingResponse;
}

export interface FetchBookingResponse {
	"Result": Result;
	"HotelReservation": HotelReservation;
	"@_xmlns:r": string;
	"@_xmlns:c": string;
	"@_xmlns:hc": string;
	"@_xmlns": string;
}

export interface Result {
	"@_resultStatusFlag": string;
}

export interface HotelReservation {
	"r:UniqueIDList": RUniqueIdlist;
	"r:RoomStays": RRoomStays;
	"r:ResGuests": RResGuests;
	"r:ReservationHistory": RReservationHistory;
	"r:ReservationPayments": RReservationPayments;
	"@_reservationStatus": string;
	"@_marketSegment": string;
	"@_sourceCode": string;
	"@_originCode": string;
	"@_onBehalfFlag": string;
	"@_redemReservationFlag": string;
	"@_DoNotMoveRoom": string;
	"@_OptIn": string;
	"@_OptInComplete": string;
	"@_queueExists": string;
	"@_computedReservationStatus": string;
	"@_financialTransactionExists": string;
	"@_printRate": string;
	"@_referralYN": string;
}

export interface RUniqueIdlist {
	"c:UniqueID": CUniqueId[];
}

export interface CUniqueId {
	"#text": any;
	"@_type": string;
	"@_source"?: string;
}

export interface RRoomStays {
	"hc:RoomStay": HcRoomStay;
}

export interface HcRoomStay {
	"hc:RatePlans": HcRatePlans;
	"hc:RoomTypes": HcRoomTypes;
	"hc:RoomRates": HcRoomRates;
	"hc:GuestCounts": HcGuestCounts;
	"hc:TimeSpan": HcTimeSpan;
	"hc:Guarantee": HcGuarantee;
	"hc:Payment": HcPayment;
	"hc:CancelTerm": HcCancelTerm;
	"hc:HotelReference": HcHotelReference;
	"hc:Total": HcTotal;
	"hc:CurrentBalance": HcCurrentBalance;
	"hc:ResGuestRPHs": HcResGuestRphs;
	"hc:Comments": HcComments;
	"hc:SpecialRequests": HcSpecialRequests;
	"hc:Packages": HcPackages;
	"hc:ExpectedCharges": HcExpectedCharges;
}

export interface HcRatePlans {
	"hc:RatePlan": HcRatePlan;
}

export interface HcRatePlan {
	"hc:RatePlanDescription": HcRatePlanDescription;
	"hc:AdditionalDetails": HcAdditionalDetails;
	"hc:CancellationDateTime": string;
	"hc:DepositRequired": HcDepositRequired;
	"@_ratePlanCode": string;
	"@_suppressRate": string;
}

export interface HcRatePlanDescription {
	"hc:Text": string;
}

export interface HcAdditionalDetails {
	"hc:AdditionalDetail": HcAdditionalDetail[];
}

export interface HcAdditionalDetail {
	"hc:AdditionalDetailDescription": HcAdditionalDetailDescription;
	"@_detailType": string;
}

export interface HcAdditionalDetailDescription {
	"hc:Text": string;
}

export interface HcDepositRequired {
	"hc:DepositAmount": HcDepositAmount;
	"hc:DepositDueAmount": HcDepositDueAmount;
}

export interface HcDepositAmount {
	"#text": number;
	"@_currencyCode": string;
	"@_decimals": string;
}

export interface HcDepositDueAmount {
	"#text": number;
	"@_currencyCode": string;
	"@_decimals": string;
}

export interface HcRoomTypes {
	"hc:RoomType": HcRoomType;
}

export interface HcRoomType {
	"hc:RoomTypeDescription": HcRoomTypeDescription;
	"hc:RoomTypeShortDescription": HcRoomTypeShortDescription;
	"hc:RoomNumber": number;
	"hc:RoomToChargeDescription": HcRoomToChargeDescription;
	"hc:RoomToChargeShortDescription": HcRoomToChargeShortDescription;
	"@_roomTypeCode": string;
	"@_numberOfUnits": string;
	"@_roomToChargeCode": string;
	"@_roomStatus": string;
	"@_roomServiceStatus": string;
}

export interface HcRoomTypeDescription {
	"hc:Text": string;
}

export interface HcRoomTypeShortDescription {
	"hc:Text": string;
}

export interface HcRoomToChargeDescription {
	"hc:Text": string;
}

export interface HcRoomToChargeShortDescription {
	"hc:Text": string;
}

export interface HcRoomRates {
	"hc:RoomRate": HcRoomRate;
}

export interface HcRoomRate {
	"hc:Rates": HcRates;
	"@_roomTypeCode": string;
	"@_ratePlanCode": string;
	"@_suppressRate": string;
}

export interface HcRates {
	"hc:Rate": HcRate;
}

export interface HcRate {
	"hc:Base": HcBase;
}

export interface HcBase {
	"#text": number;
	"@_currencyCode": string;
	"@_decimals": string;
}

export interface HcGuestCounts {
	"hc:GuestCount": HcGuestCount[];
	"@_isPerRoom": string;
}

export interface HcGuestCount {
	"@_ageQualifyingCode": string;
	"@_count": string;
}

export interface HcTimeSpan {
	"hc:StartDate": string;
	"hc:EndDate": string;
}

export interface HcGuarantee {
	"@_guaranteeType": string;
}

export interface HcPayment {
	"hc:PaymentsAccepted": HcPaymentsAccepted;
}

export interface HcPaymentsAccepted {
	"hc:PaymentType": HcPaymentType;
}

export interface HcPaymentType {
	"hc:OtherPayment": HcOtherPayment;
}

export interface HcOtherPayment {
	"@_type": string;
}

export interface HcCancelTerm {
	"@_cancelType": string;
	"@_otherCancelType": string;
}

export interface HcHotelReference {
	"#text": string;
	"@_chainCode": string;
	"@_hotelCode": string;
}

export interface HcTotal {
	"#text": number;
	"@_currencyCode": string;
	"@_decimals": string;
}

export interface HcCurrentBalance {
	"#text": number;
	"@_currencyCode": string;
	"@_decimals": string;
}

export interface HcResGuestRphs {
	"hc:ResGuestRPH": HcResGuestRph;
}

export interface HcResGuestRph {
	"@_RPH": string;
}

export interface HcComments {
	"hc:Comment": HcComment;
}

export interface HcComment {
	"hc:Text": string;
	"hc:CommentId": number;
	"hc:InternalYn": boolean;
	"hc:CommentType": string;
	"@_guestViewable": string;
}

export interface HcSpecialRequests {
	"hc:SpecialRequest": HcSpecialRequest[];
}

export interface HcSpecialRequest {
	"@_requestCode": string;
}

export interface HcPackages {
	"hc:Package": HcPackage[];
}

export interface HcPackage {
	"hc:Description": HcDescription;
	"hc:ShortDescription": HcShortDescription;
	"@_packageCode": string;
	"@_source": string;
	"@_packageGroupCode"?: string;
}

export interface HcDescription {
	"c:Text": CText;
}

export interface CText {
	"c:TextElement": string;
}

export interface HcShortDescription {
	"c:Text": CText2;
}

export interface CText2 {
	"c:TextElement": string;
}

export interface HcExpectedCharges {
	"hc:ChargesForPostingDate": HcChargesForPostingDate[];
	"@_TotalRoomRateAndPackages": string;
	"@_TotalTaxesAndFees": string;
	"@_TaxInclusive": string;
	"@_decimals": string;
}

export interface HcChargesForPostingDate {
	"hc:RoomRateAndPackages": HcRoomRateAndPackages;
	"hc:TaxesAndFees": HcTaxesAndFees;
	"@_PostingDate": string;
}

export interface HcRoomRateAndPackages {
	"hc:Charges": HcCharges;
	"@_TotalCharges": string;
	"@_decimals": string;
}

export interface HcCharges {
	"hc:Description": string;
	"hc:Amount": HcAmount;
}

export interface HcAmount {
	"#text": number;
	"@_currencyCode": string;
	"@_decimals": string;
}

export interface HcTaxesAndFees {
	"hc:Charges": Charge[];
	"@_TotalCharges": string;
	"@_decimals": string;
}

export interface Charge {
	"hc:Description": string;
	"hc:Amount": HcAmount2;
	"hc:CodeType": string;
	"hc:Code": number;
}

export interface HcAmount2 {
	"#text": number;
	"@_currencyCode": string;
	"@_decimals": string;
}

export interface RResGuests {
	"r:ResGuest": RResGuest;
}

export interface RResGuest {
	"r:Profiles": RProfiles;
	"r:ArrivalTransport": RArrivalTransport;
	"r:DepartureTransport": RDepartureTransport;
	"@_resGuestRPH": string;
}

export interface RProfiles {
	Profile: Profile[];
}

export interface Profile {
	"ProfileIDs": ProfileIds;
	"Customer"?: Customer;
	"Addresses"?: Addresses;
	"Phones"?: Phones;
	"@_languageCode"?: string;
	"@_xmlns": string;
	"Company"?: Company;
}

export interface ProfileIds {
	"c:UniqueID": CUniqueId2;
}

export interface CUniqueId2 {
	"#text": number;
	"@_type": string;
}

export interface Customer {
	PersonName: PersonName;
	NativeName: NativeName;
}

export interface PersonName {
	"c:nameTitle": string;
	"c:firstName": string;
	"c:lastName": string;
}

export interface NativeName {
	"@_languageCode": string;
}

export interface Addresses {
	NameAddress: NameAddress;
}

export interface NameAddress {
	"c:countryCode": string;
	"@_addressType": string;
	"@_otherAddressType": string;
	"@_languageCode": string;
	"@_operaId": string;
}

export interface Phones {
	NamePhone: NamePhone;
}

export interface NamePhone {
	"c:PhoneNumber": string;
	"@_phoneType": string;
	"@_phoneRole": string;
	"@_operaId": string;
	"@_primary": string;
}

export interface Company {
	CompanyName: string;
	CompanyType: string;
}

export interface RArrivalTransport {
	"@_time": string;
}

export interface RDepartureTransport {
	"@_time": string;
}

export interface RReservationHistory {
	"@_insertUser": string;
	"@_insertDate": string;
	"@_updateUser": string;
	"@_updateDate": string;
}

export interface RReservationPayments {
	"r:ReservationPaymentInfo": RReservationPaymentInfo;
}

export interface RReservationPaymentInfo {
	"@_Window": string;
	"@_PaymentType": string;
}
