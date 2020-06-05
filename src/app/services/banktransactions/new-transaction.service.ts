import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class NewTransactionService {


  constructor(public httpClient:HttpClient) { }

  public getAllNewTransaction():Observable<any[]>{
    return this.httpClient.get<any[]>(`${environment.domain}/nimaiTransaction/getAllTransactionDetails`,{headers:{'content-types':'application/json'}});
  }
}
