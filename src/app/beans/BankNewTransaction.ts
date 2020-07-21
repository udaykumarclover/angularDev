
export interface NewTransaction{
    id:number;
    beneficiary:string;
    applicant:string;
    country:string;
    txnID:string;
    dateTime:string;
    validity:string;
    ib:string;
    amount:string;
    ccy:string;
    goods:string;
    requirement:string;
    action:string;
   }


export interface NTBean{ 
	 transactionId:string;
	 userId:string;
	 requirementType:string;
	 lCIssuanceBank:string;
	 lCIssuanceBranch:string;
	 swiftCode:string;
	 lCIssuanceCountry:string;
	 lCIssuingDate:string;
	 lCExpiryDate:string;
	 lCValue:string;
	 lCCurrency:string;
	 lastShipmentDate:string;
	 negotiationDate:string;
	 paymentPeriod:string;
	 paymentTerms:string;
	 tenorEndDate:string;
	 applicantName:string;
	 applicantCountry:string;
	 beneName:string;
	 beneBankCountry:string;
	 beneBankName:string;
	 beneSwiftCode:string;
	 beneCountry:string;
	 loadingCountry:string;
	 loadingPort:string;
	 dischargeCountry:string;
	 dischargePort:string;
	 chargesType:string;
	 validity:string;
	 insertedDate:string;
	 insertedBy:string;
	 modifiedDate:string;
	 modifiedBy:string;
	 transactionflag:string;
	 transactionStatus:string;
	 confirmedFlag:string;
	 goodsType:string;
	 quotationReceived:string;

}

export interface PlaceQuote{
	
		transactionId:String;
		userId:String;
		bankUserId:String;
		quotationId:String;
		confirmationCharges:number;
		confChgsIssuanceToNegot:String;
		confChgsIssuanceToexp:String;
		confChgsIssuanceToMatur:String;
		discountingCharges:number;
		refinancingCharges:String;
		bankAcceptCharges:String;
		applicableBenchmark:number;
		commentsBenchmark:String;
		negotiationChargesFixed:number;
		negotiationChargesPerct:number;
		docHandlingCharges:number;
		otherCharges:number;
		minTransactionCharges:number;
		insertedBy:String;
		modifiedBy:String;
		insertedDate: Date;
		modifiedDate: Date;
		validityDate:Date;
		TotalQuote: number;
		expiryDays: number;
		maturityDays: number;
		negotiationDays: number;
		sumOfQuote: number;
		}