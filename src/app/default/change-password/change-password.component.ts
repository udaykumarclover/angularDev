import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { MustMatch } from 'src/app/beans/Validations';
import * as $ from 'src/assets/js/jquery.min';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { LoginService } from 'src/app/services/login/login.service';


@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {
  public parent: string;
  submitted: boolean = false;
  public parentURL: string = "";
  public subURL: string = "";

  constructor(public router: Router, public activatedRoute: ActivatedRoute, private formBuilder: FormBuilder, public loginService: LoginService) {

    let navigation = this.router.getCurrentNavigation();
    console.log(navigation)
    const state = navigation.extras.state as {
      parent: string
    };
    this.parent = state.parent;

    this.activatedRoute.parent.url.subscribe((urlPath) => {
      this.parentURL = urlPath[urlPath.length - 1].path;
    });
    this.activatedRoute.parent.parent.url.subscribe((urlPath) => {
      this.subURL = urlPath[urlPath.length - 1].path;
    })

  }

  changePasswordForm = this.formBuilder.group({
    userId: sessionStorage.getItem('userID'),
    oldpassword: new FormControl('', Validators.required),
    newPassword: new FormControl('', Validators.required),
    confirmPassword: new FormControl('', [Validators.required])
  }, {
    validators: MustMatch('newPassword', 'confirmPassword')
  });

  get changePassDetails() {
    return this.changePasswordForm.controls;
  }

  ngOnInit() {

  }

  close() {
    this.router.navigate([this.parent]);
  }

  onSubmit() {
    console.log(this.changePasswordForm.value)
    this.submitted = true;
    if (this.changePasswordForm.invalid) {
      return;
    }
    this.submitted = false;
    $('.modal1').hide();

    // let data={
    //   userId: sessionStorage.getItem('userID'),
    //   oldPassword: this.changePasswordForm.get('oldpassword').value,
    //   newPassword: this.changePasswordForm.get('newPassword').value,
    //   retypePassword: this.changePasswordForm.get('confirmPassword').value
    // }

    this.loginService.changePassword(this.changePasswordForm.value).
      subscribe(
        (response) => {
          const navigationExtras: NavigationExtras = {
            state: {
              title: 'Congraulations! Your Password has been successfully Changed !',
              message: 'Kindly login with new Password',
              parent: 'login'
            }
          };
          this.router.navigate(['/login/success'], navigationExtras)
            .then(success => console.log('navigation success?', success))
            .catch(console.error);
        },
        (error) => {
          const navigationExtras: NavigationExtras = {
            state: {
              title: 'Old Password is incorrect !',
              message: 'Kindly check the password and try again!',
              parent: this.subURL + '/' + this.parentURL + '/business-details'
            }
          };
        this.router.navigate([`/${this.subURL}/${this.parentURL}/business-details/error`], navigationExtras)
            .then(success => console.log('navigation ?', success))
            .catch(console.error);
        }
      )
  }
}