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

  public getAllNewTransaction(): Observable<any[]> {
    return this.httpClient.get<any[]>(`${environment.domain}/nimaiTransaction/getAllTransactionDetails`, { headers: { 'content-types': 'application/json' } });
  }


  public getTransactionDetailByUserId(data: any): Observable<any[]> {
    return this.httpClient.post<any[]>(`${environment.domain}/nimaiTransaction/getTransactionDetailByUserId`, data, { headers: { 'content-types': 'application/json' } })
  }


  public updateCustomerTransaction(data: TransactionBean): Observable<any> {
    return this.httpClient.post<any>(`${environment.domain}/nimaiTransaction/update`, data, { headers: { 'content-types': 'application/json' } });
  }

}
