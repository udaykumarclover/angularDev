import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, Validators, FormControl } from '@angular/forms';
import * as $ from '../../../assets/js/jquery.min';


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

  manageSubForm = this.formBuilder.group({
    emailId: new FormControl('', [Validators.required, Validators.email])
  });

  get manageSubDetails() {
    return this.manageSubForm.controls;
  }

  ngOnInit() {
  }

  close() {
    this.router.navigate([this.parent]);
  }

  onSubmit(){

    this.submitted = true;

    if(this.manageSubForm.invalid){
      return;
    }
    this.submitted = false;
    $('.modal1').hide();
    $('.modal2').show();
  }

  onThanks(){
    $('.modal2').hide();
    this.router.navigate([this.parent]);
  }

}
