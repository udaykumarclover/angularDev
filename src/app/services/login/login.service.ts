import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { Login } from '../../beans/login'
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LoginService {


  constructor(public httpClient: HttpClient) { }


  public login(login: Login): Observable<Login> {
    return this.httpClient.post<Login>(`${environment.domain}/nimaiUAM/passwordPolicy/signIn`, login, { headers: { 'content-type': 'application/json' } });
  }


  public resetPassword(data: any): Observable<any> {
    return this.httpClient.post<any>(`${environment.domain}/nimaiUAM/passwordPolicy/resetPassword`, data, { headers: { 'content-type': 'application/json' } });
  }

  public findUserByToken(token: string): Observable<any> {
    return this.httpClient.post<any>(`${environment.domain}/nimaiUAM/passwordPolicy/usertoken/` + token, null, { headers: { 'content-type': 'application/json' } })
  }

  public changePassword(data: any): Observable<any> {
    return this.httpClient.post<any>(`${environment.domain}/nimaiUAM/passwordPolicy/changePassword/` + data, null, { headers: { 'content-type': 'application/json' } })
  }

}
