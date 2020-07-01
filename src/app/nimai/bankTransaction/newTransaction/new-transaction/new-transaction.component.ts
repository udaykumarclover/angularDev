import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { TitleService } from 'src/app/services/titleservice/title.service';
import * as $ from '../../../../../assets/js/jquery.min';
import { NewTransactionService } from 'src/app/services/banktransactions/new-transaction.service';
import {bankRequest,newRequest,bankActiveTransaction} from 'src/assets/js/commons'
import { FormBuilder, FormControl } from '@angular/forms';
import { RefinancingComponent } from '../quotes/refinancing/refinancing.component';
import { ConfirmAndDiscountComponent } from '../quotes/confirm-and-discount/confirm-and-discount.component';
import { ConfirmationComponent } from '../quotes/confirmation/confirmation.component';
import { DiscountingComponent } from '../quotes/discounting/discounting.component';
import { BankerComponent } from '../quotes/banker/banker.component';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { Tflag } from 'src/app/beans/Tflag';
import { TransactionBean } from 'src/app/beans/TransactionBean';


@Component({
  selector: 'app-new-transaction',
  templateUrl: './new-transaction.component.html',
  styleUrls: ['./new-transaction.component.css']
})
export class NewTransactionComponent implements OnInit {
  bankDetail: any;
  displayedColumns: string[] = ['id', 'beneficiary', 'bcountry', 'applicant', 'acountry', 'txnID', 'dateTime', 'validity', 'ib', 'amount', 'ccy', 'goodsTypes', 'requirement', 'receivedQuotes', 'star'];
  dataSource: MatTableDataSource<any>;
  public ntData: any[] = [];

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(ConfirmationComponent, { static: true }) confirmation: ConfirmationComponent;
  @ViewChild(DiscountingComponent, { static: false }) discounting: DiscountingComponent;
  @ViewChild(ConfirmAndDiscountComponent, { static: false }) confirmAndDiscount: ConfirmAndDiscountComponent;
  @ViewChild(RefinancingComponent, { static: false }) refinancing: RefinancingComponent;
  @ViewChild(BankerComponent, { static: false }) banker: BankerComponent;
  public whoIsActive: string = "";
  public hasNoRecord: boolean = false;
  detail: any;
  


  constructor(public titleService: TitleService, public nts: NewTransactionService, private formBuilder: FormBuilder) {
    this.titleService.quote.next(false);
    
  }
  ngOnInit() {
    bankActiveTransaction();
   //newRequest();
  }


  public getNewRequestsForBank() {
    const data = {
     //"userId":sessionStorage.getItem('userID')
     "userId":'CU1445'
    }
    console.log(data.userId)
   // this.nts.getAllNewBankRequest(data).subscribe(
   this.nts.getTransactionDetailByUserId(data).subscribe(
    
      (response) => {
     
        this.detail = JSON.parse(JSON.stringify(response)).data;
        if (!this.detail) {
          this.hasNoRecord = true;
        }

      },(error) =>{
        this.hasNoRecord = true;
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
        this.detail = JSON.parse(JSON.stringify(response)).data;
        console.log(this.detail);
      },
      (error) => {
        console.log("failed");
        
      }
    )
  }

  ngAfterViewInit() {
    this.getNewRequestsForBank();
    this.confirmation.isActive = false;
    this.confirmAndDiscount.isActive = false;
   this.discounting.isActive = false;
    this.refinancing.isActive = false;
    this.banker.isActive = false;
  //  this.details.isActiveDetail=false;
  }
  showDetail(data:any){
    //this.isActiveDetail=true;
   // this.titleService.quote.next(true);
    //this.details.action(true,data);
  }
  showQuotePage(pagename: string,action:Tflag,data:any) {
  
    this.titleService.quote.next(true);
    this.whoIsActive = pagename;
    if (pagename === 'confirmation' || pagename === 'Confirmation' ) {
      this.confirmation.action(true,action,data);
      this.discounting.isActive = false;
      this.confirmAndDiscount.isActive = false;
      this.refinancing.isActive = false;
      this.banker.isActive = false;
    } else if (pagename === 'discounting' || pagename === 'Discounting') {
      this.confirmation.isActive = false;
      this.discounting.action(true,action,data);
      this.confirmAndDiscount.isActive = false;
      this.refinancing.isActive = false;
      this.banker.isActive = false;
    } else if (pagename === 'confirmAndDiscount') {      
      this.confirmAndDiscount.action(true,action,data);
      this.confirmation.isActive = false;
      this.discounting.isActive = false;
      this.refinancing.isActive = false;
      this.banker.isActive = false;
    } else if (pagename === 'refinance') {
      this.confirmation.isActive = false;
      this.discounting.isActive = false;
      this.confirmAndDiscount.isActive = false;
      this.refinancing.action(true,action,data);
      this.banker.isActive = false;
    } else if (pagename === 'banker') {
      this.confirmation.isActive = false;
      this.discounting.isActive = false;
      this.confirmAndDiscount.isActive = false;
      this.refinancing.isActive = false;
      this.banker.action(true,action,data);
    }
  }
}
