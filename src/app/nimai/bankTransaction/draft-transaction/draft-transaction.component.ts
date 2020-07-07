import { Component, OnInit, ViewChild } from '@angular/core';
import { UploadLcService } from 'src/app/services/upload-lc/upload-lc.service';
import { NavigationExtras, ActivatedRoute, Router } from '@angular/router';
import { ConfirmationComponent } from '../newTransaction/quotes/confirmation/confirmation.component';
import { RefinancingComponent } from '../newTransaction/quotes/refinancing/refinancing.component';
import { ConfirmAndDiscountComponent } from '../newTransaction/quotes/confirm-and-discount/confirm-and-discount.component';
import { DiscountingComponent } from '../newTransaction/quotes/discounting/discounting.component';
import { BankerComponent } from '../newTransaction/quotes/banker/banker.component';
import { TitleService } from 'src/app/services/titleservice/title.service';
import {bankActiveTransaction} from 'src/assets/js/commons'
import { Tflag } from 'src/app/beans/Tflag';
import { NewTransactionService } from 'src/app/services/banktransactions/new-transaction.service';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { TransactionBean } from 'src/app/beans/TransactionBean';
@Component({
  selector: 'app-draft-transaction',
  templateUrl: './draft-transaction.component.html',
  styleUrls: ['./draft-transaction.component.css']
})
export class DraftTransactionComponent implements OnInit {
  displayedColumns: string[] = ['id', 'beneficiary', 'bcountry', 'applicant', 'acountry', 'txnID', 'dateTime', 'validity', 'ib', 'amount', 'ccy', 'goodsTypes', 'requirement', 'receivedQuotes', 'star'];
  dataSource: MatTableDataSource<any>;
  public ntData: any[] = [];
  noData: boolean = false;
  detail: any;
    draftData: any;
  public parentURL: string = "";
  public subURL: string = "";

  
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  @ViewChild(ConfirmationComponent, { static: true }) confirmation: ConfirmationComponent;
  @ViewChild(DiscountingComponent, { static: false }) discounting: DiscountingComponent;
  @ViewChild(ConfirmAndDiscountComponent, { static: false }) confirmAndDiscount: ConfirmAndDiscountComponent;
  @ViewChild(RefinancingComponent, { static: false }) refinancing: RefinancingComponent;
  @ViewChild(BankerComponent, { static: false }) banker: BankerComponent;
  public whoIsActive: string = "";
  public hasNoRecord: boolean = false;
  
  // constructor(public service: UploadLcService,public titleService: TitleService, public nts: NewTransactionService,  public activatedRoute: ActivatedRoute, public router: Router ) {
  //   this.activatedRoute.parent.url.subscribe((urlPath) => {
  //     this.parentURL = urlPath[urlPath.length - 1].path;
  //     this.titleService.quote.next(false);
  constructor(public service: UploadLcService,public titleService: TitleService, public nts: NewTransactionService) {
    this.titleService.quote.next(false);
    
    //});
    // this.activatedRoute.parent.parent.url.subscribe((urlPath) => {
    //   this.subURL = urlPath[urlPath.length - 1].path;
    // })
  }

  
  ngOnInit() {
   
    bankActiveTransaction();
  }

  ngAfterViewInit() {
    this.callAllDraftTransaction();
  //   this.confirmation.isActive = false;
  //   this.confirmAndDiscount.isActive = false;
  //  this.discounting.isActive = false;
  //   this.refinancing.isActive = false;
  //   this.banker.isActive = false;
    
  }

  callAllDraftTransaction(){
    const param = {
    // userId: sessionStorage.getItem('userID')
      userId:'CU1030'
    }
    //this.nts.getAllNewBankRequest(param).subscribe(
   this.service.getCustDraftTransaction(param).subscribe(
      (response) => {
        this.draftData = JSON.parse(JSON.stringify(response)).data;
        console.log(this.draftData);
        if(!this.draftData){
          this.noData = true;
        }
        // const data = {
        //   "userId":sessionStorage.getItem('userID')
        //  }
        // this.nts.getAllNewBankRequest(data).subscribe(
        //   // this.nts.getTransactionDetailByUserId(data).subscribe(            
        //       (response) => {             
        //         this.detail = JSON.parse(JSON.stringify(response)).data;
               
        //       },(error) =>{
                
        //       }
        //     )
      },(error) =>{
        this.noData = true;
      }
      )
  }


  // editDraft(trnsactionID){
  //   const navigationExtras: NavigationExtras = {
  //     state: {
  //       redirectedFrom: "draftTransaction",
  //       trnsactionID: trnsactionID
  //     }
  //   };
  //   this.router.navigate([`/${this.subURL}/${this.parentURL}/new-transaction`], navigationExtras)
  //     .then(success => console.log('navigation success?', success))
  //     .catch(console.error);
  // }


  showQuotePage(pagename: string,action:Tflag,data:any) {
  console.log(data)
    this.titleService.quote.next(true);
    this.whoIsActive = pagename;
    if (pagename === 'confirmation' || pagename === 'Confirmation' ) {
      alert(action)
      this.confirmation.test()
      //this.confirmation.action(true,action,data);
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
