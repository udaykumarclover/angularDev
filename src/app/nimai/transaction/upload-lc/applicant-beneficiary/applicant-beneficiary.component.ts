import { Component, OnInit, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import  { ValidateRegex } from '../../../../beans/Validations';
import * as $ from 'src/assets/js/jquery.min';


@Component({
  selector: 'app-applicant-beneficiary',
  templateUrl: './applicant-beneficiary.component.html',
  styleUrls: ['./applicant-beneficiary.component.css']
})
export class ApplicantBeneficiaryComponent implements OnInit {

  @Input() public LcDetail:FormGroup;

  constructor() { }

  ngOnInit() {
    $('#divBene').hide();
      $("input[name='optionsRadiosYou']").click(function () {
         
         var radioValue = $("input[name='optionsRadiosYou']:checked").val();
         if (radioValue == "rdBeneficiary") {
            $('#divApplicant').hide();
            $('#divBene').show();
         }
         else if (radioValue == "rdApplicant") {
            $('#divApplicant').show();
            $('#divBene').hide();
         }
      });
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
