import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray, Form } from '@angular/forms';
import { SignupService } from 'src/app/services/signup/signup.service';
import { signup } from 'src/app/beans/signup';
import { Login } from 'src/app/beans/login';
import { LoginService } from 'src/app/services/login/login.service';
import { Router, NavigationExtras } from '@angular/router';
import * as $ from '../../../assets/js/jquery.min';
import { loads, selectpickercall } from '../../../assets/js/commons';
import { InterestedCountry } from 'src/app/beans/interestedcountry';
import { BlackListedGoods } from 'src/app/beans/blacklistedgoods';
import { ResetPasswordService } from 'src/app/services/reset-password/reset-password.service';
import { Email } from 'src/app/beans/Email';
import { ForgetPasswordService } from 'src/app/services/forget-password/forget-password.service';
import  { ValidateRegex } from '../../beans/Validations';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  public loginForm: FormGroup;
  public signupForm: FormGroup;
  public forgotPasswordForm: FormGroup;
  public isBank = false;
  public isReferrer = false;

  public intCountries: InterestedCountry[] = [];
  public blg: BlackListedGoods[] = [];
  public intCountriesValue: any[] = [];
  public blgValue: any[] = [];


  interestedCountryList = this.countryService();
  blackListedGoodsList = this.goodsService();
  dropdownSetting = {};

  public submitted = false;
  public submittedSignup = false;

  constructor(public fb: FormBuilder, public router: Router, public rsc: ResetPasswordService, public fps: ForgetPasswordService, public signUpService: SignupService, public loginService: LoginService) {

  }

  ngOnInit() {
    this.loginForm = this.fb.group({
      username: [''],
      password: ['']
    });

    this.signupForm = this.fb.group({
      firstName: [''],
      lastName: [''],
      officialMailId: [''],
      mobileNo: [''],
      landlineNo: [''],
      country: [''],
      designation: [''],
      businessType: [''],
      radio: ['customer'],
      selector: ['customer'],
      countriesInt: [''],
      minLCVal: [''],
      blacklistedGC: [''],
      companyName: ['']
    });

    this.forgotPasswordForm = this.fb.group({
      email: ['', Validators.required]
    })


    this.dropdownSetting = {
      singleSelection: false,
      idField: 'id',
      textField: 'name',
      selectAllText: 'Select All',
      unSelectAllText: 'Unselect All',
      itemsShowLimit: 5,
      allowSearchFilter: false
    }
  }

  get lf() {
    return this.loginForm.controls;
  }

  get suf() {
    return this.signupForm.controls;
  }
  get fpf() {
    return this.forgotPasswordForm.controls;
  }

  submit() {
    this.submitted = true;
    if (this.loginForm.invalid) {
      return;
    }

    let loginData: Login = {
      userId: this.loginForm.get('username').value,
      password: this.loginForm.get('password').value
    }

    this.loginService.login(loginData).
      subscribe(
        (response) => {
          this.Removevalidate();
          let responseData = JSON.parse(JSON.stringify(response));
          sessionStorage.setItem('userID', loginData.userId);
          if (loginData.userId.startsWith('RE')) {
            this.router.navigate(['/ref/rcs/kyc-details']);
          } else  if (loginData.userId.startsWith('BA')){
            this.router.navigate(['/bcst/dsb/business-details']);       
          } else if(loginData.userId.startsWith('CU')){
             this.router.navigate(['/cst/dsb/business-details']); 
          }   else if(loginData.userId.startsWith('BC')){
             this.callCustomerPopup();  
           
          }

        },
        (error) => {
          const navigationExtras: NavigationExtras = {
            state: {
              title: 'Username or Password is incorrect !',
              message: 'Username or Password is incorrect',
              parent: 'login'
            }
          };
          this.router.navigate(['/login/error'], navigationExtras)
            .then(success => console.log('navigation success?', success))
            .catch(console.error);
        }
      )
  }

  signUp() {
    this.submittedSignup = true;
    let subscriptionType = this.signupForm.get('radio').value;
    let selector = this.signupForm.get('selector').value;

    if (subscriptionType == 'referrer') {
      this.validateCommons();
      this.validateReferrerForm();
      if (this.signupForm.invalid) {
        return;
      }
    } else {
      if (subscriptionType == 'bank' && selector == 'underwriter') {
        this.validateCommons();
        this.validateBank();
      } else {
        this.validateCommons();
        if (this.signupForm.invalid) {
          return;
        }
      }

    }

    this.signUpService.signUp(this.signUpForm()).subscribe((response) => {

      let res = JSON.parse(JSON.stringify(response)).data;
      let emailResetPassworData: Email = {
        event: 'ACCOUNT_ACTIVATE',
        email: res.emailAddress
      }
      let saveResponse = JSON.parse(JSON.stringify(response)).errMessage;
      this.rsc.sendRegistrationEmail(emailResetPassworData).
        subscribe(
          (response) => {
            this.resetSignUpForm();
            this.signupForm.patchValue({ radio: 'customer', selector: 'customer' })
            this.submittedSignup = false;
            this.clearSignupValidation();
            this.updateValidation();
            const navigationExtras: NavigationExtras = {
              state: {
                title: saveResponse,
                message: 'Soon you will receive an email containing credentials so you can securely activate your account. Kindly follow the instuctions mentioned in the email to proceed further.',
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
                title: JSON.parse(JSON.stringify(error)).error.errMessage,
                message: '',
                parent: 'login'
              }
            };
            this.router.navigate(['/login/error'], navigationExtras)
              .then(success => console.log('navigation success?', success))
              .catch(console.error);
          }
        )

    },
      error => {
        const navigationExtras: NavigationExtras = {
          state: {
            title: JSON.parse(JSON.stringify(error)).error.errMessage,
            message: '',
            parent: 'login'
          }
        };
        this.router.navigate(['/login/error'], navigationExtras)
          .then(success => console.log('navigation success?', success))
          .catch(console.error);

      })
  }

  public sugnUpView() {
    this.clearSignupValidation();
    this.updateValidation();
  }

  public checkUserType(value: string) {
    this.clearSignupValidation();
    this.updateValidation();
    if (value === 'customer') {
      this.isBank = false;
      this.isReferrer = false;
      this.resetSignUpForm();
      this.signupForm.patchValue({ radio: 'customer' })

    } else if (value === 'bank') {
      this.resetSignUpForm();
      this.signupForm.patchValue({ radio: 'bank', selector: 'customer' })
      this.isBank = false;
      this.isReferrer = false;
      setTimeout(function () { loads() }, 100);


    } else {
      this.resetSignUpForm();
      this.signupForm.patchValue({ radio: 'referrer' })
      this.isBank = false;
      this.isReferrer = true;
      // this.signupForm.reset();
      setTimeout(function () { loads() }, 100)
    }
  }



  bankAsEvent(value: string) {
    if (value === 'c') {
      this.isBank = false;
      this.isReferrer = false;
      this.resetSignUpForm();
      this.signupForm.patchValue({ radio: 'bank', selector: 'customer' })

    } else {
      this.isBank = true;
      this.resetSignUpForm();
      this.signupForm.patchValue({ radio: 'bank', selector: 'underwriter' })

      setTimeout(function () { selectpickercall() }, 200);
    }

  }



  forgotPassword(): void {
    const fg ={
      email:this.forgotPasswordForm.get('email').value,
      event:'FORGOT_PASSWORD'
    }
    this.fps.sendForgetPasswordEmail(fg)
      .subscribe(
        (response) => {

          const navigationExtras: NavigationExtras = {
            state: {
              title: 'Congratulations! Password reset link is sent to your registered email address.',
              message: '',
              parent: 'login'
            }
          };
          this.router.navigate(['/login/success'], navigationExtras)
            .then(success => console.log('navigation success?', success))
            .catch(console.error);
        },
        (error) => {
          let responserror = JSON.parse(JSON.stringify(error));
          console.log(responserror)
          const navigationExtras: NavigationExtras = {
            state: {
              title: JSON.parse(JSON.stringify(error)).error.errMessage,
              message: '',
              parent: 'login'
            }

          };
          this.router.navigate(['/login/error'], navigationExtras)
            .then(success => console.log('navigation success?', success))
            .catch(console.error);
        }
      )

  }

  validateCommons() {
    this.signupForm.get('firstName').setValidators(Validators.required);
    this.signupForm.get('lastName').setValidators(Validators.required);
    this.signupForm.get('officialMailId').setValidators(Validators.required);
    this.signupForm.get('mobileNo').setValidators(Validators.required);
    this.signupForm.get('country').setValidators(Validators.required);
    this.removeBankValidation();
    this.removeReferrerValidation();
    this.updateValidation();
  }

  validateBank() {
    this.signupForm.get('minLCVal').setValidators(Validators.required);
    this.signupForm.get('blacklistedGC').setValidators(Validators.required);
    this.signupForm.get('countriesInt').setValidators(Validators.required);
    this.updateValidation();
  }


  removeReferrerValidation() {
    this.signupForm.get('designation').clearValidators();
    this.signupForm.get('companyName').clearValidators();
    this.signupForm.get('businessType').clearValidators();
    this.updateValidation();

  }
  validateReferrerForm() {
    this.signupForm.get('designation').setValidators(Validators.required);
    this.signupForm.get('companyName').setValidators(Validators.required);
    this.signupForm.get('businessType').setValidators(Validators.required);
    this.updateValidation();

  }

  removeBankValidation() {
    this.signupForm.get('minLCVal').clearValidators();
    this.signupForm.get('blacklistedGC').clearValidators();
    this.signupForm.get('countriesInt').clearValidators();
    this.updateValidation();
  }

  clearSignupValidation() {
    this.signupForm.get('designation').clearValidators();
    this.signupForm.get('companyName').clearValidators();
    this.signupForm.get('businessType').clearValidators();

    this.signupForm.get('minLCVal').clearValidators();
    this.signupForm.get('blacklistedGC').clearValidators();
    this.signupForm.get('countriesInt').clearValidators();

    this.signupForm.get('firstName').clearValidators();
    this.signupForm.get('lastName').clearValidators();
    this.signupForm.get('officialMailId').clearValidators();
    this.signupForm.get('mobileNo').clearValidators();
    this.signupForm.get('country').clearValidators();
  }

  updateValidation() {
    this.signupForm.get('designation').updateValueAndValidity();
    this.signupForm.get('companyName').updateValueAndValidity();
    this.signupForm.get('businessType').updateValueAndValidity();

    this.signupForm.get('minLCVal').updateValueAndValidity();
    this.signupForm.get('blacklistedGC').updateValueAndValidity();
    this.signupForm.get('countriesInt').updateValueAndValidity();

    this.signupForm.get('firstName').updateValueAndValidity();
    this.signupForm.get('lastName').updateValueAndValidity();
    this.signupForm.get('officialMailId').updateValueAndValidity();
    this.signupForm.get('mobileNo').updateValueAndValidity();
    this.signupForm.get('country').updateValueAndValidity();
  }



  public signUpForm(): signup {

    this.blgValue = this.signupForm.get('blacklistedGC').value;
    this.intCountriesValue = this.signupForm.get('countriesInt').value;
    this.blg = [];
    this.intCountries = [];

    for (let vlg of this.blgValue) {
      let blgData = {
        goods_ID: null,
        goodsMId: vlg.id,
        blackListGoods: vlg.name
      }
      this.blg.push(blgData);
    }

    for (let icc of this.intCountriesValue) {
      let icData = {
        countryID: null,
        ccid: icc.id,
        countriesIntrested: icc.name
      }
      this.intCountries.push(icData);
    }


    let data = {

      firstName: this.signupForm.get('firstName').value,
      lastName: this.signupForm.get('lastName').value,
      emailAddress: this.signupForm.get('officialMailId').value,
      mobileNum: this.signupForm.get('mobileNo').value,
      countryName: this.signupForm.get('country').value,
      landLinenumber: this.signupForm.get('landlineNo').value,
      companyName: this.signupForm.get('companyName').value,
      designation: this.signupForm.get('designation').value,
      businessType: this.signupForm.get('businessType').value,
      userId: "",
      bankType: this.signupForm.get('selector').value,
      subscriberType: this.signupForm.get('radio').value,

      minLCValue: this.signupForm.get('minLCVal').value,
      interestedCountry: this.intCountries,
      blacklistedGoods: this.blg

    }
    return data;
  }


  goodsService() {
    return [{ id: 1, name: 'Gold' }, { id: 2, name: 'Drugs' }, { id: 3, name: 'Diamonds' }]
  }


  getGoodsName(gid: number) {
    return this.goodsService().filter((res) => res.id == gid)[0];
  }

  countryService() {
    return [{ id: 1, name: 'India' }, { id: 2, name: 'USA' }, { id: 3, name: 'Australia' }]
  }


  getCountryName(ccid: number) {
    return this.countryService().filter((res) => res.id == ccid)[0];
  }


  onItemSelect(item: any) {
    console.log(item);

  }

  onSelectAll(item: any) {
    console.log(item);
  }


  resetSignUpForm() {
    this.signupForm.patchValue({
      firstName: '',
      lastName: '',
      officialMailId: '',
      mobileNo: '',
      landlineNo: '',
      country: '',
      designation: '',
      businessType: '',
      radio: '',
      selector: '',
      countriesInt: '',
      minLCVal: '',
      blacklistedGC: '',
      companyName: ''
    })
  }


  validate() {
    this.loginForm.get('username').setValidators(Validators.required);
    this.loginForm.get('password').setValidators(Validators.required);
    this.loginForm.get('username').updateValueAndValidity();
    this.loginForm.get('password').updateValueAndValidity();
  }

  Removevalidate() {
    this.loginForm.get('username').clearValidators();
    this.loginForm.get('password').clearValidators();
    this.loginForm.get('username').updateValueAndValidity();
    this.loginForm.get('password').updateValueAndValidity();
  }


  validateRegexFields(event, type){
    if(type == "number"){
      ValidateRegex.validateNumber(event);
    }
    else if(type == "alpha"){
      ValidateRegex.alphaOnly(event);
    }
    else if(type == "alphaNum"){
      ValidateRegex.alphaNumeric(event);
    }
  }

  callCustomerPopup(){
    const navigationExtras: NavigationExtras = {
      state: {
        parent: 'login'
      }
    };
    this.router.navigate(['/login/custPopup'], navigationExtras);
    }

}


