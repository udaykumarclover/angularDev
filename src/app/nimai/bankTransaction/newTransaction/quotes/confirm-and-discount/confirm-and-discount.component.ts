import { Tflag } from 'src/app/beans/Tflag';
import { TitleService } from 'src/app/services/titleservice/title.service';
import { TransactionBean } from 'src/app/beans/TransactionBean';
import * as $ from 'src/assets/js/jquery.min';
import { NewTransactionService } from 'src/app/services/banktransactions/new-transaction.service';
import { ViewChild, OnInit, Component } from '@angular/core';
import { PlaceQuote } from 'src/app/beans/BankNewTransaction';

@Component({
  selector: 'app-confirm-and-discount',
  templateUrl: './confirm-and-discount.component.html',
  styleUrls: ['./confirm-and-discount.component.css']
})
export class ConfirmAndDiscountComponent implements OnInit {

  public isActive: boolean = false;
public isActiveQuote:boolean=false;
  public data: PlaceQuote;
  public title: string = "";
  public tab = 'tab1';
  detail:any;
  constructor(public titleService: TitleService, public ts: NewTransactionService) { 
    
    this.data = {        
      transactionId: "",
      userId: "",
      bankUserId: "",
      quotationId:"",
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
        this.isActive = flag;
        $('input').attr('readonly', true);
        this.title = 'View';
        this.data = data;
      } else if (type === Tflag.EDIT) {
        this.isActive = flag;
        this.title = 'Edit';
        this.data = data;
        $('input').attr('readonly', false);
      }else if(type===Tflag.PLACE_QUOTE){
        this.isActiveQuote = flag;
        this.title = 'Place Quote';
        this.data = data;
        console.log(this.data)
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
  
  public transactionForQuotes(act: string,data:any) {

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
              console.log(this.detail)
              this.data=data;
             
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