
export interface LcDetail {

    userId: string;
    requirementType: string;
    lCIssuanceBank: string;
    lCIssuanceBranch: string;
    swiftCode: string;
    lCIssuanceCountry: string;
    lCIssuingDate: string;
    lCExpiryDate: string;
    lCValue: number,
    lCCurrency: string;
    lastShipmentDate: string;
    negotiationDate: string;
    paymentPeriod: string;
    paymentTerms: string;
    tenorEndDate: string;
    applicantName: string;
    applicantCountry: string;
    beneName: string;
    beneBankCountry: string;
    beneBankName: string;
    beneSwiftCode: string;
    beneCountry: string;
    loadingCountry: string;
    loadingPort: string;
    dischargeCountry: string;
    dischargePort: string;
    chargesType: string;
    validity: string;
    insertedDate: string;
    insertedBy: string;
    modifiedDate: string;
    modifiedBy: string;
    transactionflag: string;
    transactionStatus: string;

}