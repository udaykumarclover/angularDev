// import { Component, OnInit, ViewChild } from '@angular/core';
import { Tflag } from 'src/app/beans/Tflag';
import { TitleService } from 'src/app/services/titleservice/title.service';
import * as $ from 'src/assets/js/jquery.min';
import { NewTransactionService } from 'src/app/services/banktransactions/new-transaction.service';
import { ViewChild, OnInit, Component } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { formatDate } from '@angular/common';
import { PlaceQuote } from 'src/app/beans/BankNewTransaction';
@Component({
  selector: 'app-confirmation',
  templateUrl: './confirmation.component.html',
  styleUrls: ['./confirmation.component.css']
})
export class ConfirmationComponent implements OnInit {
 
  
  public confirmationForm: FormGroup;
  public isActive: boolean = false;
  public isActiveQuote: boolean = false;
  public data: PlaceQuote;
  public title: string = "";
  public tab = 'tab1';
  data1:any;
  getCurrentDate: any;
   detail: any;
  constructor(public titleService: TitleService, public ts: NewTransactionService, public fb: FormBuilder) {
   
    this.getCurrentDate = formatDate(new Date(), 'yyyy-MM-dd', 'en'); 
    this.data = {        
		transactionId: "",
		userId: "",
		bankUserId: "",
		confirmationCharges:0,
		confChgsIssuanceToNegot: "",
		confChgsIssuanceToexp: "",
		confChgsIssuanceToMatur: "",
		discountingCharges:0,
		refinancingCharges: "",
		bankAcceptCharges: "",
		applicableBenchmark:0,
		commentsBenchmark: "",
		negotiationChargesFixed:0,
		negotiationChargesPerct:0,
		docHandlingCharges:0,
		otherCharges:0,
		minTransactionCharges:0,
		insertedBy: "",
		modifiedBy: "",
		insertedDate: null,
		modifiedDate:null,
		validityDate:null,
    TotalQuote: 0,
    expiryDays: 0,
    maturityDays: 0,
    negotiationDays: 0,
    sumOfQuote: 0
     }

     }

  ngOnInit() {
  }


  public action(flag: boolean, type: Tflag, data: any) {
   
    if (flag) {
     
      if (type === Tflag.VIEW) {
       console.log(type)
        this.isActive = flag;
        $('input').attr('readonly', true);
        this.title = 'View';
        this.data = data;
      } else if (type === Tflag.EDIT) {
      
        this.isActive = flag;
        this.title = 'Edit';
        this.data= data;
        $('input').attr('readonly', false);
      }else if (type === Tflag.PLACE_QUOTE){      
        this.isActiveQuote = flag;
       $('input').attr('readonly', false);
        this.title = 'Place Quote';
        this.data = data;
      
      }
    } else {
      this.isActive = flag;
      this.isActiveQuote=flag
      this.data = data;
      this.title = '';
      $('input').attr('readonly', true);

    }
  }



  public closed() {
    this.isActive = false;
    this.titleService.quote.next(false);
  }
  
  public closedQuote() {
    this.isActiveQuote = false;
    this.titleService.quote.next(false);
  }


  public transaction(act: string) {

    switch (act) {
      case 'edit': {
        this.tab = 'tab1'
        setTimeout(() => {
          $('input').attr('readonly', false);
        }, 100);
        this.title = 'Edit';
      }
        break;

      case 'submit': {
        console.log(this.data)
        this.ts.updateBankTransaction(this.data).subscribe(
          (response) => {
            this.tab = 'tab3';
          },
          error => {
            alert('error')
            this.closedQuote();
            this.tab = 'tab1';
          }
        )
      }
        break;
      case 'ok': {
            this.closed();
            this.tab = 'tab1';                  
      }
        break;
      case 'preview': {
        this.tab = 'tab2';
        setTimeout(() => {
          $('input').attr('readonly', true);
        }, 200);
      }
        break;
    }
  }
  
  public transactionForQuotes(act: string,data:any) {
console.log(data)
    switch (act) {
      case 'edit': {
        this.tab = 'tab1'
        setTimeout(() => {
          $('input').attr('readonly', false);
        }, 100);
        this.title = 'Edit';
      }
        break;

      case 'confirm': {
      console.log(data)
      const param = {
                    "transactionId":data.transactionId,
                    "userId":data.userId
       }
      this.ts.confirmQuotation(param).subscribe(
        (response) => {
          console.log(response)
          this.tab = 'tab3';
        },
        error => {
          alert('error')
          this.closedQuote();
          this.tab = 'tab1';
        }
      )}


        break;
      case 'ok': {
           this.closedQuote();
           this.tab = 'tab1';
              }
        break;
      case 'preview': {
        this.tab = 'tab2';
        setTimeout(() => {
          $('input').attr('readonly', true);
        }, 200);
      }
        break;


        case 'generateQuote': {
      
          this.ts.saveQuotationToDraft(this.data).subscribe(
            (response) => {
            
              this.tab = 'tab2';
              this.detail = JSON.parse(JSON.stringify(response)).data;
              this.data=data;
              console.log(this.data)
            },
            error => {
              alert('error')
              this.closedQuote();
              this.tab = 'tab1';
            }
          )
          
    }
  }
  
  }


}
