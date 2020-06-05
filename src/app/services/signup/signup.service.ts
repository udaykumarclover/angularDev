import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { signup } from 'src/app/beans/signup';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class SignupService {

  constructor(public httpClient:HttpClient) { }

  public signUp(sugnup:signup):Observable<signup>{
    console.log(sugnup);
    return this.httpClient.post<signup>(`${environment.domain}/nimaiUCM/UserDetails/registerUser`,
    sugnup,{headers:{'content-type':'application/json'}});
  }
}
