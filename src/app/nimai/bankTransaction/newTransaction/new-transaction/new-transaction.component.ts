import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { TitleService } from 'src/app/services/titleservice/title.service';
import * as $ from '../../../../../assets/js/jquery.min';
import { NewTransactionService } from 'src/app/services/banktransactions/new-transaction.service';
import {bankRequest} from 'src/assets/js/commons'
import { FormBuilder, FormControl } from '@angular/forms';


@Component({
  selector: 'app-new-transaction',
  templateUrl: './new-transaction.component.html',
  styleUrls: ['./new-transaction.component.css']
})
export class NewTransactionComponent implements OnInit {
  bankDetail: any;

  

  constructor(public titleService: TitleService, public nts: NewTransactionService, private formBuilder: FormBuilder) {
    this.titleService.quote.next(false);

  }
  ngOnInit() {
    bankRequest();
    this.getNewRequestsForBank();
  }

  public getNewRequestsForBank() {
    const data = {
      "userId":sessionStorage.getItem('userID')
    }
    this.nts.getAllNewBankRequest(data).subscribe(
      (response) => {
        this.bankDetail = JSON.parse(JSON.stringify(response)).data;
        console.log(this.bankDetail);
        

      }
    )
  }

  placeQuoteFrom = this.formBuilder.group({
    transactionId: new FormControl(''),
    quotationId: new FormControl(''),
    confirmationCharges: new FormControl(''),
    confChgsIssuanceToNegot: new FormControl(''),
    confChgsIssuanceToexp: new FormControl(''),
    confChgsIssuanceToMatur: new FormControl(''),
    discountingCharges: new FormControl(''),
    refinancingCharges: new FormControl(''),
    bankAcceptCharges: new FormControl(''),
    applicableBenchmark: new FormControl(''),


  })

  placeNewQuote(){
    this.nts.getBankplaceQuotation(this.placeQuoteFrom.value).subscribe(
      (response) => {
        this.bankDetail = JSON.parse(JSON.stringify(response)).data;
        console.log(this.bankDetail);
      },
      (error) => {
        console.log("failed");
        
      }
    )
  }
}
