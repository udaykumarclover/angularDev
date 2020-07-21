import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatSort, throwMatDialogContentAlreadyAttachedError, Sort } from '@angular/material';
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
import { BusinessDetailsService } from 'src/app/services/business-details/business-details.service';
import { Router, ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-active-transaction',
  templateUrl: './active-transaction.component.html',
  styleUrls: ['./active-transaction.component.css']
})
export class ActiveTransactionComponent implements OnInit {
  displayedColumns: string[] = ['id', 'beneficiary', 'bcountry', 'applicant', 'acountry', 'txnID', 'dateTime', 'validity', 'ib', 'amount', 'ccy', 'goods', 'requirement', 'receivedQuotes', 'star'];
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
  QRdetail: any = "";
  noQRdetail: boolean = false;
  getSpecificDetail: any = "";
  acceptedDetails: any = "";
  public parentURL: string = "";
  public subURL: string = "";

  constructor(public titleService: TitleService, public nts: NewTransactionService, public bds: BusinessDetailsService, public router: Router, public activatedRoute: ActivatedRoute) {
    this.titleService.quote.next(false);
    this.activatedRoute.parent.url.subscribe((urlPath) => {
      this.parentURL = urlPath[urlPath.length - 1].path;
    });
    this.activatedRoute.parent.parent.url.subscribe((urlPath) => {
      this.subURL = urlPath[urlPath.length - 1].path;
    })

  }

  public getAllnewTransactions() {
    const data={
      userId:sessionStorage.getItem('userID'),
      "transactionStatus": 'Active'
    }
    this.nts.getAllNewTransaction(data).subscribe(
      (response) => {
        this.detail = JSON.parse(JSON.stringify(response)).data;
        if (!this.detail) {
          this.hasNoRecord = true;
        }
        this.detail.forEach(item => {
          // console.log(item);
          this.ntData.push(item);
        });
        this.dataSource = new MatTableDataSource(this.ntData);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;

      },(error) =>{
        this.hasNoRecord = true;
      }
    )
  }

  ngOnInit() {
    custActiveTransaction();
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  sortData(sort: Sort) {
    const data = this.ntData.slice();
    if (!sort.active || sort.direction == '') {
      this.ntData = data;
      return;
    }
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
        this.QRdetail = this.QRdetail.map(item => ({
          ...item,
          isSelected: false
        }));
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

  getQRDetail(detail){
    this.getSpecificDetail = detail;
 }

 showAcceptedDetails(index,qId, tId, userID,sel){
  let req = {
    "quotationId": qId,
	  "transactionId": tId
  }

  index = index + 1;

  this.bds.viewBusinessDetails(userID).subscribe(
    (response) => {
      let responseData = JSON.parse(JSON.stringify(response));
      this.acceptedDetails = responseData.data;
      $('#TransactionDetailDiv tr:eq(' + index +') td:eq(2)').html(this.acceptedDetails.bankName + ', ' + this.acceptedDetails.branchName + ', '+ this.acceptedDetails.registeredCountry);
      $('#TransactionDetailDiv tr:eq(' + index +') td:eq(6)').html("Accepted");
      this.nts.acceptBankQuote(req).subscribe(
        (response) => {
          console.log("quote Accepted");
        },
        (err) => {
          console.log("Failure");
        }
      )
    },
    (err) => {})
 }

 redirectAsAccepted(){
  this.router.navigate([`/${this.subURL}/${this.parentURL}`+"/transaction-details"]);
 }
}