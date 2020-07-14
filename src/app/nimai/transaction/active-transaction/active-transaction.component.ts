import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { NewTransaction, NTBean } from 'src/app/beans/BankNewTransaction';
import { ConfirmationComponent } from '../transactionTypes/confirmation/confirmation.component';
import { DiscountingComponent } from '../transactionTypes/discounting/discounting.component';
import { ConfirmAndDiscountComponent } from '../transactionTypes/confirm-and-discount/confirm-and-discount.component';
import { RefinancingComponent } from '../transactionTypes/refinancing/refinancing.component';
import { BankerComponent } from '../transactionTypes/banker/banker.component';
import { TitleService } from 'src/app/services/titleservice/title.service';
import { NewTransactionService } from 'src/app/services/banktransactions/new-transaction.service';
import * as $ from '../../../../assets/js/jquery.min'
import { Tflag } from 'src/app/beans/Tflag';
import { custActiveTransaction, onQuoteClick } from 'src/assets/js/commons';


@Component({
  selector: 'app-active-transaction',
  templateUrl: './active-transaction.component.html',
  styleUrls: ['./active-transaction.component.css']
})
export class ActiveTransactionComponent implements OnInit {
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
  QRdetail: any;
  noQRdetail: boolean = false;

  constructor(public titleService: TitleService, public nts: NewTransactionService) {
    this.titleService.quote.next(false);

  }

  public getAllnewTransactions() {
    const data={
      userId:sessionStorage.getItem('userID')
    }
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

  ngOnInit() {
    custActiveTransaction();
  }

  ngAfterViewInit() {
    this.confirmation.isActive = false;
    this.discounting.isActive = false;
    this.confirmAndDiscount.isActive = false;
    this.refinancing.isActive = false;
    this.banker.isActive = false;
    this.getAllnewTransactions();
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
      this.confirmation.isActive = false;
      this.discounting.isActive = false;
      this.confirmAndDiscount.action(true,action,data);
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

  showQuoteDetail(transactionId){
    this.noQRdetail = false;

    let data = {
      "userId": sessionStorage.getItem('userID'),
      "transactionId": transactionId
    }
    this.nts.getAllQuotationDetails(data).subscribe(
      (response) => {
        this.QRdetail = JSON.parse(JSON.stringify(response)).data;
        if(!this.QRdetail){
          this.noQRdetail = true;
        }
        
      },(error) =>{
      }
    )
  }

  openOffcanvas() {
    document.getElementById("menu-barnew").style.width = "450px"; 
 }
 openNav3() {
    document.getElementById("myCanvasNav").style.width = "100%";
    document.getElementById("myCanvasNav").style.opacity = "0.6";  
 }
 closeOffcanvas() {
    document.getElementById("menu-barnew").style.width = "0%"; 
    document.getElementById("myCanvasNav").style.width = "0%";
    document.getElementById("myCanvasNav").style.opacity = "0"; 
 } 
}
