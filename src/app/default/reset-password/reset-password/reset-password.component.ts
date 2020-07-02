import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { ResetPasswordService } from 'src/app/services/reset-password/reset-password.service';
import { FormGroup, FormBuilder } from '@angular/forms';
import { LoginService } from 'src/app/services/login/login.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {

  public flag: boolean = false;
  public key: string;
  public resetForm: FormGroup;
  constructor(public router: ActivatedRoute, public route: Router,public lgsc:LoginService, public rsc: ResetPasswordService, public fb: FormBuilder) {
    this.router.queryParams.subscribe(params => {
      this.key = params["key"]
    })
    this.rsc.validateToken(this.key).subscribe(
      (response) => {
        this.flag = true;
      },
      (error) => {
        const navigationExtras: NavigationExtras = {
          state: {
            title: JSON.parse(JSON.stringify(error)).error.errMessage,
            message: '',
            parent: 'accountactivation'
          }
        };
        this.route.navigate(['/accountactivation/error'], navigationExtras)
          .then(success => console.log('navigation success?', success))
          .catch(console.error);
      }
    )
  }

  ngOnInit() {
    this.resetForm = this.fb.group({
      emailId: [''],
      userId: [''],
      oldPassword: [''],
      newPassword: [''],
      retypePaasword: [''],
      getToken: this.key
    })
  }


  submit(){


    this.lgsc.resetPassword(this.resetForm.value)
    .subscribe(
      (response)=>{
        const navigationExtras: NavigationExtras = {
          state: {
            title: 'Congratulations! Your password reset successfully !',
            message: '',
            parent: 'accountactivation'
          }
        };
        this.route.navigate(['/accountactivation/success'], navigationExtras)
          .then(success => console.log('navigation success?', success))
          .catch(console.error);
      },
      (error)=>{
        const navigationExtras: NavigationExtras = {
          state: {
            title: JSON.parse(JSON.stringify(error)).error.errMessage,
            message: '',
            parent: 'accountactivation'
          }
        };
        this.route.navigate(['/accountactivation/error'], navigationExtras)
          .then(success => console.log('navigation success?', success))
          .catch(console.error);
      
      }
    )

  }

  




}
