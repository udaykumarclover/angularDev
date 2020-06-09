import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, Validators, FormControl } from '@angular/forms';
import * as $ from 'src/assets/js/jquery.min';
import { manageSub } from 'src/assets/js/commons'
import { ValidateRegex } from 'src/app/beans/Validations';
import { ForgetPasswordService } from 'src/app/services/forget-password/forget-password.service';


@Component({
  selector: 'app-refer',
  templateUrl: './refer.component.html',
  styleUrls: ['./refer.component.css']
})
export class ReferComponent implements OnInit {

  public parent: string;
  submitted: boolean = false;
  public parentURL: string = "";
  public subURL: string = "";
  CompanyName: any;

  constructor(public router: Router, public activatedRoute: ActivatedRoute, private formBuilder: FormBuilder, public fps: ForgetPasswordService) {

    this.activatedRoute.parent.url.subscribe((urlPath) => {
      this.parentURL = urlPath[urlPath.length - 1].path;
    });
    this.activatedRoute.parent.parent.url.subscribe((urlPath) => {
      this.subURL = urlPath[urlPath.length - 1].path;
    })

  }

  referForm = this.formBuilder.group({
    firstName: new FormControl('', [Validators.required]),
    lastName: new FormControl('', [Validators.required]),
    mobileNo: new FormControl('', [Validators.required]),
    emailId: new FormControl('', [Validators.required, Validators.email]),
    country: new FormControl('', [Validators.required]),
    compName: new FormControl('', [Validators.required]),
  });

  get referDetails() {
    return this.referForm.controls;
  }

  ngOnInit() {
    manageSub();
  }

  close() {
    this.router.navigate([`/${this.subURL}/${this.parentURL}/refer`]);
    $("#addsub").hide();
  }

  addRefer() {
    $("#addsub").show();
    this.referForm.reset();
  }

  onSubmit() {

    this.submitted = true;
    if (this.referForm.invalid) {
      return;
    }
    this.submitted = false;
    this.CompanyName = this.referForm.get('compName').value;

    const fg = {
      email: this.referForm.get('emailId').value,
      event: 'ADD_REFER'
    }

    this.fps.sendForgetPasswordEmail(fg)
      .subscribe(
        (response) => {
          $('#authemaildiv').slideUp();
          $('#paradiv').slideDown();
          $('#okbtn').show();
          $('#btninvite').hide();
          this.referForm.reset();
        },
        (error) => {
          alert("service not working!!")
        }
      )

  }

  validateRegexFields(event, type) {
    if (type == "number") {
      ValidateRegex.validateNumber(event);
    }
    else if (type == "alpha") {
      ValidateRegex.alphaOnly(event);
    }
    else if (type == "alphaNum") {
      ValidateRegex.alphaNumeric(event);
    }
  }

}

