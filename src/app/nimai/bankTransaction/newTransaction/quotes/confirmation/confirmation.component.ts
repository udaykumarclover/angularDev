// import { Component, OnInit, ViewChild } from '@angular/core';
import { Tflag } from 'src/app/beans/Tflag';
import { TitleService } from 'src/app/services/titleservice/title.service';
import { TransactionBean } from 'src/app/beans/TransactionBean';
import * as $ from 'src/assets/js/jquery.min';
import { NewTransactionService } from 'src/app/services/banktransactions/new-transaction.service';
import { ViewChild, OnInit, Component } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
@Component({
  selector: 'app-confirmation',
  templateUrl: './confirmation.component.html',
  styleUrls: ['./confirmation.component.css']
})
export class ConfirmationComponent implements OnInit {
 
  
  public confirmationForm: FormGroup;
  public isActive: boolean = false;
  public isActiveQuote: boolean = false;
  public data: TransactionBean;
  public title: string = "";
  public tab = 'tab1';
  constructor(public titleService: TitleService, public ts: NewTransactionService, public fb: FormBuilder) {
    this.data = {
      transactionId: "",
      userId: "",
      requirementType: "",
      lCIssuanceBank: "",
      lCIssuanceBranch: "",
      swiftCode: 0,
      lCIssuanceCountry: "",
      lCIssuingDate: null,
      lCExpiryDate: null,
      lCValue: null,
      lCCurrency: "",
      lastShipmentDate: null,
      negotiationDate: null,
      paymentPeriod: 0,
      paymentTerms: "",
      tenorEndDate: null,
      applicantName: "",
      applicantCountry: "",
      beneName: "",
      beneBankCountry: "",
      beneBankName: "",
      beneSwiftCode: "",
      beneCountry: "",
      loadingCountry: "",
      loadingPort: "",
      dischargeCountry: "",
      dischargePort: null,
      chargesType: "",
      validity: null,
      insertedDate: null,
      insertedBy: "",
      modifiedDate: null,
      modifiedBy: "",
      transactionflag: null,
      transactionStatus: "",
      branchUserId: null,
      branchUserEmail: null,
      goodsType: "",
      usanceDays: null,
      startDate: null,
      endDate: null,
      originalTenorDays: null,
      refinancingPeriod: "",
      lcMaturityDate: null,
      lcNumber: '',
      lastBeneBank: "",
      lastBeneSwiftCode: "",
      lastBankCountry: "",
      remarks: "",
      discountingPeriod: "",
      confirmationPeriod: null,
      financingPeriod: null,
      lcProForma: "",
      tenorFile: null,
      lccountry: [],
      lcgoods: [],
      lcbanks: [],
      lcbranch: []
    }

    this.confirmationForm = this.fb.group({
      confirmationCharges: [''],
      confChgsIssuanceToNegot: [''],
      confChgsIssuanceToMatur: [''],
      minTransactionCharges: ['']
    
    })

  }

  ngOnInit() {
  }

  public action(flag: boolean, type: Tflag, data: any) {

    if (flag) {
     
      if (type === Tflag.VIEW) {
        this.isActive = flag;
        $('input').attr('readonly', true);
        this.title = 'View';
        this.data = data;
      } else if (type === Tflag.EDIT) {
        this.isActive = flag;
        this.title = 'Edit';
        this.data = data;
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
        this.ts.updateCustomerTransaction(this.data).subscribe(
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
            if(this.isActive){
            this.closed();
            this.tab = 'tab1';
            }else{
           this.closedQuote();
           this.tab = 'tab1';
}
        
      }
        break;
      case 'preview': {
        this.tab = 'tab2';
        setTimeout(() => {
          $('input').attr('readonly', true);
        }, 200);
      }
        break;


        case 'GetQuote': {
          console.log(this.data)
          const data1 = {
            
            "transactionId":'CU2020IND0112'
           }
          this.ts.calculateQuote(data1).subscribe(
            (response) => {
              console.log(response)
              //this.tab = 'tab3';
            },
            error => {
              alert('error')
             
            }
          )

          // this.ts.saveQuotationToDraft(this.data).subscribe(
          //   (response) => {
          //     this.tab = 'tab2';
          //   },
          //   error => {
          //     alert('error')
          //     this.closedQuote();
          //     this.tab = 'tab1';
          //   }
          // )
  
  
        }


    }

  }




  submit(): void {
    
  }


}
