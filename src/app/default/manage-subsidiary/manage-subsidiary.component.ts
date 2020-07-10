import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, Validators, FormControl } from '@angular/forms';
import * as $ from '../../../assets/js/jquery.min';
import { manageSub } from 'src/assets/js/commons'
import { ForgetPasswordService } from 'src/app/services/forget-password/forget-password.service';


@Component({
  selector: 'app-manage-subsidiary',
  templateUrl: './manage-subsidiary.component.html',
  styleUrls: ['./manage-subsidiary.component.css']
})
export class ManageSubsidiaryComponent implements OnInit {

  public parent: string;
  submitted: boolean = false;
  public parentURL: string = "";
  public subURL: string = "";
  respMessage: any;

  constructor(public router: Router, public activatedRoute: ActivatedRoute, private formBuilder: FormBuilder, public fps: ForgetPasswordService) {

    this.activatedRoute.parent.url.subscribe((urlPath) => {
      this.parentURL = urlPath[urlPath.length - 1].path;
    });
    this.activatedRoute.parent.parent.url.subscribe((urlPath) => {
      this.subURL = urlPath[urlPath.length - 1].path;
    })

  }

  manageSubForm = this.formBuilder.group({
    emailId: new FormControl('', [Validators.required, Validators.email])
  });

  get manageSubDetails() {
    return this.manageSubForm.controls;
  }

  ngOnInit() {
    manageSub();
  }

  close() {
    this.router.navigate([`/${this.subURL}/${this.parentURL}/manage-sub`]);
    $("#addsub").hide();
  }

  addSubsidiary() {
    $("#addsub").show();
    this.manageSubForm.reset();
  }

  onSubmit() {

    this.submitted = true;
    if (this.manageSubForm.invalid) {
      return;
    }
    this.submitted = false;

    const fg = {
      "emailId": this.manageSubForm.get('emailId').value,
      "event": 'ADD_SUBSIDIARY',
      "userId": sessionStorage.getItem('userID')
    }

    this.fps.sendEmailReferSubsidiary(fg)
      .subscribe(
        (response) => {
          this.respMessage = JSON.parse(JSON.stringify(response)).message;
          
          if(this.respMessage.indexOf('not match') > -1){
            this.respMessage = "Domain Name does not match!"
          }
          else{
            this.respMessage = "You've successfully invited a subsidiary to join TradeEnabler."
          }
          $('#authemaildiv').slideUp();
          $('#paradiv').slideDown();
          $('#okbtn').show();
          $('#btninvite').hide();
          this.manageSubForm.reset();
        },
        (error) => {
          $('#authemaildiv').slideUp();
          $('#paradiv').slideDown();
          $('#okbtn').show();
          $('#btninvite').hide();
          this.manageSubForm.reset();
          this.respMessage = "Service not working! Please try again later."
        }
      )
  }

}
