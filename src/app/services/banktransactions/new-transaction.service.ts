import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { TransactionBean } from 'src/app/beans/TransactionBean';

@Injectable({
  providedIn: 'root'
})
export class NewTransactionService {


  constructor(public httpClient: HttpClient) { }

  public getAllNewTransaction(data: any): Observable<any[]> {
    return this.httpClient.post<any[]>(`${environment.domain}/nimaiTransaction/getAllTxnByUserIdAndStatus`,data, { headers: { 'content-types': 'application/json' } });
  }


  public getTransactionDetailByUserId(data: any): Observable<any[]> {
    return this.httpClient.post<any[]>(`${environment.domain}/nimaiTransaction/getTransactionDetailByUserId`, data, { headers: { 'content-types': 'application/json' } })
  }


  public updateCustomerTransaction(data: TransactionBean): Observable<any> {
    return this.httpClient.post<any>(`${environment.domain}/nimaiTransaction/updateMasterLC`, data, { headers: { 'content-types': 'application/json' } });
  }

  
  public calculateQuote(data: any): Observable<any> {
    return this.httpClient.post<any>(`${environment.domain}/nimaiTransaction/calculateQuote`, data, { headers: { 'content-types': 'application/json' } });
  }

  public getAllNewBankRequest(data: any): Observable<any[]> {
    return this.httpClient.post<any[]>(`${environment.domain}/nimaiTransaction/getAllNewRequestsForBank`,data , { headers: { 'content-types': 'application/json' } });
  }

  
  public getBankplaceQuotation(data: any): Observable<any[]> {
    return this.httpClient.post<any[]>(`${environment.domain}/nimaiTransaction/placeQuotation`,data , { headers: { 'content-types': 'application/json' } });
  }

  public getBankgetQuotationCount(data: any): Observable<any[]> {
    return this.httpClient.post<any[]>(`${environment.domain}/nimaiTransaction/getQuotationCount`,data , { headers: { 'content-types': 'application/json' } });
  }

  public getAllQuotationDetails(data: any): Observable<any[]> {
    return this.httpClient.post<any[]>(`${environment.domain}/nimaiTransaction/getAllQRByUserIdTxnId`,data , { headers: { 'content-types': 'application/json' } });
  }

  public getQuotationDetails(data: any): Observable<any[]> {
    return this.httpClient.post<any[]>(`${environment.domain}/nimaiTransaction/getQuotationDtlByQId`,data , { headers: { 'content-types': 'application/json' } });
  }

}
