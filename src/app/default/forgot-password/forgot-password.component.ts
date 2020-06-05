import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ForgetPasswordService } from 'src/app/services/forget-password/forget-password.service';
import { LoginService } from 'src/app/services/login/login.service';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {
  public flag: boolean = false;
  public key: string;
  public forgetPassword: FormGroup;
  public userID: string = null;
  constructor(public router: ActivatedRoute, public route: Router, public lgsc: LoginService, public rsc: ForgetPasswordService, public fb: FormBuilder) {
    this.router.queryParams.subscribe(params => {
      this.key = params["key"]
    })
    this.rsc.validateToken(this.key).subscribe(
      (response) => {
        this.flag = true;
        this.lgsc.findUserByToken(this.key)
        .subscribe(
          (response)=>{
            this.userID = JSON.parse(JSON.stringify(response)).data;
          }
        )
      },
      (error) => {
        const navigationExtras: NavigationExtras = {
          state: {
            title: JSON.parse(JSON.stringify(error)).error.errMessage,
            message: '',
            parent: 'forgetpassword'
          }
        };
        this.route.navigate(['/forgetpassword/error'], navigationExtras)
          .then(success => console.log('navigation success?', success))
          .catch(console.error);
      }
    )
  }

  ngOnInit() {
    this.forgetPassword = this.fb.group({      
      password: [''],
      rePassword: ['']
    })
  }

  public save() {
   let data={
    emailId:'',
    userId: this.userID,
    oldPassword: '',
    newPassword: this.forgetPassword.get('password').value,
    retypePaasword:this.forgetPassword.get('password').value,
    getToken: this.key
   }

   this.lgsc.resetPassword(data)
   .subscribe(
     (response)=>{
       const navigationExtras: NavigationExtras = {
         state: {
           title: 'Congraulations! Your password reset successfully !',
           message: '',
           parent: 'forgetpassword'
         }
       };
       this.route.navigate(['/forgetpassword/success'], navigationExtras)
         .then(success => console.log('navigation success?', success))
         .catch(console.error);
     },
     (error)=>{
       const navigationExtras: NavigationExtras = {
         state: {
           title: JSON.parse(JSON.stringify(error)).error.errMessage,
           message: '',
           parent: 'forgetpassword'
         }
       };
       this.route.navigate(['/forgetpassword/error'], navigationExtras)
         .then(success => console.log('navigation success?', success))
         .catch(console.error);
     
     }
   )

  }

}
