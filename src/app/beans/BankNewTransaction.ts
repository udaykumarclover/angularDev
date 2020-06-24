
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

}