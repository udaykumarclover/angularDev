import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LcDetail } from 'src/app/beans/LCDetails';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class UploadLcService {

  constructor(public httpClient:HttpClient) { }

  public saveLc(body:any):Observable<any>{
    return this.httpClient.post(`${environment.domain}/nimaiTransaction/save`, body,{headers:{'content-type':'application/json'}});
  }

  public confirmLc(body:any):Observable<any>{
    return this.httpClient.post(`${environment.domain}/nimaiTransaction/confirmLC`, body,{headers:{'content-type':'application/json'}})
  }
}
