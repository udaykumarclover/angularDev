import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Email } from 'src/app/beans/Email';


@Injectable({
  providedIn: 'root'
})
export class ForgetPasswordService {

  constructor(public httpClient: HttpClient) { }

  public sendForgetPasswordEmail(data:Email): Observable<any> {
    return this.httpClient.post<any>(`${environment.domain}/nimaiEmail/sendSetPasswordLink` ,data, { headers: { 'content-type': 'application/json' } });
  }

  public validateToken(token: string): Observable<any> {
    return this.httpClient.get(`${environment.domain}/nimaiEmail/validatePasswordLink/` + token, { headers: { 'content-type': 'application/json' } });
  }
}
