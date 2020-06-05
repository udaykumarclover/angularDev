import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, Validators, FormControl } from '@angular/forms';
import * as $ from 'src/assets/js/jquery.min';
import { manageSub } from 'src/assets/js/commons'


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

  constructor(public router: Router, public activatedRoute: ActivatedRoute, private formBuilder: FormBuilder) {

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
  }

  onSubmit() {

    this.submitted = true;
    if (this.manageSubForm.invalid) {
      return;
    }
    this.submitted = false;
    $('#authemaildiv').slideUp();
    $('#paradiv').slideDown();
    $('#okbtn').show();
    $('#btninvite').hide();
  }

}
