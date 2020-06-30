import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { FormBuilder, Validators, FormControl } from '@angular/forms';
import * as $ from 'src/assets/js/jquery.min';
import { manageSub } from 'src/assets/js/commons'
import { ValidateRegex } from 'src/app/beans/Validations';
import { ForgetPasswordService } from 'src/app/services/forget-password/forget-password.service';
import { formatDate } from '@angular/common';
import { PersonalDetailsService } from 'src/app/services/personal-details/personal-details.service';


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
  getCurrentDate: any;
  showBranchUserId: boolean = false;
  resp: any;
  referViewDetails : any;

  constructor(public router: Router, public activatedRoute: ActivatedRoute, private formBuilder: FormBuilder, public fps: ForgetPasswordService, public service:PersonalDetailsService) {

    this.activatedRoute.parent.url.subscribe((urlPath) => {
      this.parentURL = urlPath[urlPath.length - 1].path;
    });
    this.activatedRoute.parent.parent.url.subscribe((urlPath) => {
      this.subURL = urlPath[urlPath.length - 1].path;
    })
    this.getCurrentDate = formatDate(new Date(), 'yyyy-MM-dd', 'en'); 

    if(sessionStorage.getItem('userID').startsWith('BC')){
      this.showBranchUserId = true;
    }
    this.resp = JSON.parse(sessionStorage.getItem('countryData'));
    console.log(JSON.parse(sessionStorage.getItem('countryData')));

  }

  referForm = this.formBuilder.group({
    userId: sessionStorage.getItem('userID'),
    referenceId: new FormControl(''),
    firstName: new FormControl('', [Validators.required]),
    lastName: new FormControl('', [Validators.required]),
    mobileNo: new FormControl('', [Validators.required]),
    emailAddress: new FormControl('', [Validators.required, Validators.email]),
    countryName: new FormControl('', [Validators.required]),
    companyName: new FormControl('', [Validators.required]),
    status: new FormControl('ACTIVE'),
    insertedDate: this.getCurrentDate,
    modifiedDate: this.getCurrentDate,
    branchUserId: new FormControl(''),
    insertedBy: new FormControl({fieldName:'firstName'}),
    modifiedBy: new FormControl({fieldName:'firstName'}),

  });

  get referDetails() {
    return this.referForm.controls;
  }

  ngOnInit() {
    manageSub();
    this.viewReferDetails(sessionStorage.getItem('userID'));
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
    const data = {
      userId: sessionStorage.getItem('userID'),
      referenceId: this.referForm.get('referenceId').value,
      firstName: this.referForm.get('firstName').value,
      lastName: this.referForm.get('lastName').value,
      mobileNo: this.referForm.get('mobileNo').value,
      emailAddress: this.referForm.get('emailAddress').value,
      countryName: this.referForm.get('countryName').value,
      companyName: this.referForm.get('companyName').value,
      status: 'ACTIVE',
      insertedDate: this.getCurrentDate,
      modifiedDate: this.getCurrentDate,
      branchUserId: this.referForm.get('branchUserId').value,
      insertedBy: this.referForm.get('firstName').value,
      modifiedBy: this.referForm.get('firstName').value
    }    
    
    this.submitted = false;
    this.CompanyName = this.referForm.get('companyName').value;

    const fg = {
      email: this.referForm.get('emailAddress').value,
      event: 'ADD_REFER'
    }

    this.service.addRefer(data)
      .subscribe(
        (response) => {
      let res = JSON.parse(JSON.stringify(response));
      console.log(res);                
          this.resetPopup();
              this.fps.sendForgetPasswordEmail(fg)
                .subscribe(
                  (response) => {
                    const navigationExtras: NavigationExtras = {
                      state: {
                        title: 'Congratulations! You has successfully refered. Soon provided email address will get a reference mail.',
                        message: '',
                        parent: this.subURL + "/" + this.parentURL + '/refer'
                      }
                    };
                    this.router.navigate([`/${this.subURL}/${this.parentURL}/refer/success`], navigationExtras)
                    .then(success => console.log('navigation success?', success))
                    .catch(console.error);
                  },
                  (error) => {
                    const navigationExtras: NavigationExtras = {
                      state: {
                        title: ' Failed !!!',
                        message: 'Invalid Data',
                        parent: this.subURL + "/" + this.parentURL + '/refer'
                      }
                    };
                    this.router.navigate([`/${this.subURL}/${this.parentURL}/refer/error`], navigationExtras)
                      .then(success => console.log('navigation success?', success))
                      .catch(console.error);
                  }
                )
        },
        (error) => {
          const navigationExtras: NavigationExtras = {
            state: {
              title: ' Failed !!!',
              message: 'Invalid Data',
              parent: this.subURL + "/" + this.parentURL + '/refer'
            }
          };
          this.router.navigate([`/${this.subURL}/${this.parentURL}/refer/error`], navigationExtras)
            .then(success => console.log('navigation success?', success))
            .catch(console.error);
        }
      )

  }

  resetPopup(){
    $('#authemaildiv').slideUp();
    $('#paradiv').slideDown();
    $('#okbtn').show();
    $('#btninvite').hide();
    this.referForm.reset();
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

  viewReferDetails(userID: string) {
    this.service.viewRefer(userID)
      .subscribe(
        (response) => {
          let responseData = JSON.parse(JSON.stringify(response));
          this.referViewDetails = responseData;
        },
        (error) => {}
      )
  }

}

