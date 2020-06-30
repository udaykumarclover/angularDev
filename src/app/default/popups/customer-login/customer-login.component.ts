import { Component, OnInit,ElementRef} from '@angular/core';
import { Router } from '@angular/router';
import * as $ from '../../../../assets/js/jquery.min';
import { FormGroup, FormControl } from '@angular/forms';
import {Validators} from '@angular/forms';
import  { ValidateRegex } from '../../../beans/Validations';
import { loads } from '../../../../assets/js/commons'
@Component({
  selector: 'app-customer-login',
  templateUrl: './customer-login.component.html',
  styleUrls: ['./customer-login.component.css']
})
export class CustomerLoginComponent implements OnInit {
  public parent: string;
  emailAddress: any;
  submitted: boolean = false;

  constructor(public router: Router,private el: ElementRef) {

    let navigation = this.router.getCurrentNavigation();
    console.log(navigation)
    const state = navigation.extras.state as {
      parent: string
    };
    this.parent = state.parent;
  }

  customerLoginForm = new FormGroup({
    batchId: new FormControl('', Validators.required),
    empId: new FormControl('', Validators.required),
    emailId: new FormControl('', [Validators.required, Validators.email]),
    custName: new FormControl('', Validators.required)
  })

  get custLogDetails() {
    return this.customerLoginForm.controls;
  }

  ngOnInit() {
    loads();
  }
ngAfterViewInit() {
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
    if(this.customerLoginForm.invalid) {
      return;
    }
    this.submitted = false;

    $('.modal1').hide();
    $('.modal2').show();
    this.emailAddress = this.customerLoginForm.get('emailId').value;
    console.log(this.customerLoginForm.value);
  }

  onOTPClick() {
    $('.modal2').hide();
    $('.modal3').show();
    this.router.navigate(['/cst/dsb/business-details']);           
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
