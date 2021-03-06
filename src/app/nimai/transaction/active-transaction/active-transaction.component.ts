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

@Component({
  selector: 'app-active-transaction',
  templateUrl: './active-transaction.component.html',
  styleUrls: ['./active-transaction.component.css']
})
export class ActiveTransactionComponent implements OnInit {
  displayedColumns: string[] = ['id', 'beneficiary', 'bcountry', 'applicant', 'acountry', 'txnID', 'dateTime','validity', 'ib','amount', 'ccy', 'goods', 'requirement','receivedQuotes','star'];
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
  public hasRecord: boolean = false;

  constructor(public titleService: TitleService, public nts: NewTransactionService) {
    this.titleService.quote.next(false);

  }

  public getAllnewTransactions() {
    this.nts.getAllNewTransaction().subscribe(
      (response) => {
        const flt = JSON.parse(JSON.stringify(response)).data;
        if (flt) {
          this.hasRecord = true;
        }
        this.filteredData(flt);
        this.dataSource = new MatTableDataSource(this.ntData);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        

      }
    )
  }

  filteredData(data: NTBean[]): void {

    this.ntData = [];
    let index = 0;
    if (data.length > 0)
      for (let dt of data) {
        index++;
        let bean = {
          id:'',
          beneficiary:'',
          bcountry: '',
          applicant:'', 
          acountry:'',
          txnID:'',
          dateTime:'',
          validity: '',
          ib:'',
          amount:'',
          ccy:'',
          goods: '',
          requirement:'',
          receivedQuotes:'',
        }
        bean.id = '' + (index);
        bean.beneficiary = dt.beneName;
        bean.applicant = dt.applicantName;
        bean.acountry = dt.applicantCountry;
        bean.bcountry = dt.beneBankCountry;
        bean.txnID = dt.transactionId;
        bean.dateTime = dt.insertedDate;
        bean.validity = dt.validity;
        bean.ib = dt.lCIssuanceBank;
        bean.ccy = dt.lCCurrency;
        bean.goods = dt.lCValue;
        bean.requirement = dt.requirementType;
        bean.receivedQuotes='0'        
        this.ntData.push(bean);


      }

  }
 


  ngOnInit() {


  }
  ngAfterViewInit() {
    this.confirmation.isActive = false;
    this.discounting.isActive = false;
    this.confirmAndDiscount.isActive = false;
    this.refinancing.isActive = false;
    this.banker.isActive = false;
    this.getAllnewTransactions();
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }


  showQuotePage(pagename: string,action:Tflag,data:any) {
    this.titleService.quote.next(true);
    this.whoIsActive = pagename;
    if (pagename === 'confirmation') {
      this.confirmation.action(true,action,data);
      this.discounting.isActive = false;
      this.confirmAndDiscount.isActive = false;
      this.refinancing.isActive = false;
      this.banker.isActive = false;
    } else if (pagename === 'discount') {
      this.confirmation.action(false,0,null);
      this.discounting.isActive = true;
      this.confirmAndDiscount.isActive = false;
      this.refinancing.isActive = false;
      this.banker.isActive = false;
    } else if (pagename === 'cad') {
      this.confirmation.action(false,0,null);
      this.discounting.isActive = false;
      this.confirmAndDiscount.isActive = true;
      this.refinancing.isActive = false;
      this.banker.isActive = false;
    } else if (pagename === 'refinance') {
      this.confirmation.action(false,0,null);
      this.discounting.isActive = false;
      this.confirmAndDiscount.isActive = false;
      this.refinancing.isActive = true;
      this.banker.isActive = false;
    } else if (pagename === 'banker') {
      this.confirmation.action(false,0,null);
      this.discounting.isActive = false;
      this.confirmAndDiscount.isActive = false;
      this.refinancing.isActive = false;
      this.banker.isActive = true;


    }




  }



}
