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
		validityDate:null

         }

    this.confirmationForm = this.fb.group({
      confirmationCharges: [''],
      confChgsIssuanceToNegot: [''],
      confChgsIssuanceToMatur: [''],
      minTransactionCharges:[''],
      validityDate:[''],
      otherCharges:['']
    
    })

  }

  ngOnInit() {
  }

  public test(){
    alert('test')
  }

  public action(flag: boolean, type: Tflag, data: any) {
    console.log(data)
    if (flag) {
     
      if (type === Tflag.VIEW) {
        this.isActive = flag;
        $('input').attr('readonly', true);
        this.title = 'View';
        this.data = data;
      } else if (type === Tflag.EDIT) {
        this.isActive = flag;
        this.title = 'Edit';
        this.data= data;
        $('input').attr('readonly', false);
      }else{
      
        this.isActiveQuote = flag;
        this.title = 'Place Quote';
        this.data = data;
        $('input').attr('readonly', false);
      }
    } else {
      this.isActive = flag;
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
  
  public transactionForQuotes(act: string) {

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
       console.log(this.data)
          this.ts.saveQuotationToDraft(this.data).subscribe(
            (response) => {
              console.log(response)
              this.tab = 'tab2';
            },
            error => {
              alert('error')
              this.closedQuote();
              this.tab = 'tab1';
            }
          )
          // console.log(this.data)
          // const data1 = {
          //               "transactionId":'CU2020IND0112'
          //  }
          // this.ts.calculateQuote(data1).subscribe(
          //   (response) => {
          //     console.log(response)
          //     //this.tab = 'tab3';
          //   },
          //   error => {
          //     alert('error')
             
          //   }
          // )}
    }
  }
  
  }


}
