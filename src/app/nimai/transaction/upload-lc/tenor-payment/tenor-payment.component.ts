import { Component, OnInit, Input, EventEmitter } from '@angular/core';
import { Subject } from 'rxjs';
import { DataServiceService } from 'src/app/services/upload-lc/data-service.service';
import { FormGroup } from '@angular/forms';
import  { ValidateRegex } from '../../../../beans/Validations';


@Component({
  selector: 'app-tenor-payment',
  templateUrl: './tenor-payment.component.html',
  styleUrls: ['./tenor-payment.component.css']
})
export class TenorPaymentComponent implements OnInit {


  @Input() public LcDetail:FormGroup;
  public selector: string;
  public discount: boolean = false;
  public refinancing: boolean = false;
  public confirmation: boolean = true;

  constructor(public rds:DataServiceService) {

  }

  ngOnInit() {

  }


  public selectors(selector: string) {
    this.selector = selector;
    if (this.selector === 'discounting' || this.selector === 'banker') {
      this.discount = true;
      this.confirmation = false;
      this.refinancing = false;
      this.rds.refinance.next(this.refinancing);
    } else if (this.selector === 'refinance') {
      this.discount = false;
      this.confirmation = false;
      this.refinancing = true;
      this.rds.refinance.next(this.refinancing);
    } else {
      this.discount = false;
      this.confirmation = true;
      this.refinancing = false;
      this.rds.refinance.next(this.refinancing);
    }



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
