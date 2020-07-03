import { Component, OnInit,ElementRef} from '@angular/core';
import { Router } from '@angular/router';
import * as $ from '../../../../assets/js/jquery.min';
import { FormGroup, FormControl } from '@angular/forms';
import {Validators} from '@angular/forms';
import  { ValidateRegex } from '../../../beans/Validations';
import { SignupService } from 'src/app/services/signup/signup.service';
import { ForgetPasswordService } from 'src/app/services/forget-password/forget-password.service';


@Component({
  selector: 'app-customer-login',
  templateUrl: './customer-login.component.html',
  styleUrls: ['./customer-login.component.css']
})
export class CustomerLoginComponent implements OnInit {
  public parent: string;
  emailAddress: any;
  submitted: boolean = false;

  constructor(public router: Router, public Service: SignupService, public fps: ForgetPasswordService, private el: ElementRef) {

    let navigation = this.router.getCurrentNavigation();
    console.log(navigation)
    const state = navigation.extras.state as {
      parent: string
    };
    this.parent = state.parent;
  }

  customerLoginForm = new FormGroup({
    batch_id: new FormControl('', Validators.required),
    employee_id: new FormControl('', Validators.required),
    email_id: new FormControl('', [Validators.required, Validators.email]),
    employee_name: new FormControl('', Validators.required)
  })

  get custLogDetails() {
    return this.customerLoginForm.controls;
  }

  ngOnInit() {

  }
  ngAfterViewInit() {
    /*added by ashvini -Default cursor should be present in the Branch ID field of the Enter Access Details page of the Bank as Customer. */
    const invalidElements = this.el.nativeElement.querySelector('.first_input');
    invalidElements.focus();
  }
  close() {
    $('.modal1').hide();
    if (this.parent === 'login') {
      this.router.navigate(['/' + this.parent]);
    } else {
      this.router.navigate(['/nimai/' + this.parent]);
    }
  }

  onCustLoginClick() {
    this.submitted = true;
    if (this.customerLoginForm.invalid) {
      return;
    }
    this.submitted = false;

    this.emailAddress = this.customerLoginForm.get('email_id').value;
    console.log(this.customerLoginForm.value);

    this.Service.userBranch(this.customerLoginForm.value).subscribe(
      (response) => {
        let sendEmail = {
          event: 'VALID_BRANCHUSER',
          email: this.emailAddress,
          userId: sessionStorage.getItem("userID")
        }
        this.fps.sendForgetPasswordEmail(sendEmail)
          .subscribe(
            (response) => {

              $('.modal1').hide();
              $('.modal2').show();
            },
            (error) => {
              $('.modal3').show();
              // alert("unable to send mail")

            }
          )
      },
      (error) => { }
    );

  }

  onOTPClick() {
    $('.modal2').hide();
    
    // this.router.navigate(['/cst/dsb/business-details']);           
  }

  reenterCustLoginDetails() {
    $('.modal3').hide();
    $('.modal1').show();
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

}
