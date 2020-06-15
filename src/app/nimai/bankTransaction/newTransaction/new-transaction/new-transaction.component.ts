import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { ConfirmationComponent } from '../quotes/confirmation/confirmation.component';
import { DiscountingComponent } from '../quotes/discounting/discounting.component';
import { ConfirmAndDiscountComponent } from '../quotes/confirm-and-discount/confirm-and-discount.component';
import { RefinancingComponent } from '../quotes/refinancing/refinancing.component';
import { BankerComponent } from '../quotes/banker/banker.component';
import { TitleService } from 'src/app/services/titleservice/title.service';
import * as $ from '../../../../../assets/js/jquery.min';
import { NewTransaction, NTBean } from 'src/app/beans/BankNewTransaction';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { NewTransactionService } from 'src/app/services/banktransactions/new-transaction.service';



@Component({
  selector: 'app-new-transaction',
  templateUrl: './new-transaction.component.html',
  styleUrls: ['./new-transaction.component.css']
})
export class NewTransactionComponent implements OnInit, AfterViewInit {

  displayedColumns: string[] = ['id', 'beneficiary', 'applicant', 'country', 'txnID', 'dateTime', 'validity', 'ib', 'ccy', 'goods', 'requirement', 'action'];
  dataSource: MatTableDataSource<NewTransaction>;
  public ntData: any[] = [];

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  @ViewChild(ConfirmationComponent, { static: true }) confirmation: ConfirmationComponent;
  @ViewChild(DiscountingComponent, { static: false }) discounting: DiscountingComponent;
  @ViewChild(ConfirmAndDiscountComponent, { static: false }) confirmAndDiscount: ConfirmAndDiscountComponent;
  @ViewChild(RefinancingComponent, { static: false }) refinancing: RefinancingComponent;
  @ViewChild(BankerComponent, { static: false }) banker: BankerComponent;
  public whoIsActive: string = "";
  public hasRecord:boolean = false;

  constructor(public titleService: TitleService, public nts: NewTransactionService) {
    this.titleService.quote.next(false);

  }

  public getAllnewTransactions() {
    this.nts.getAllNewTransaction().subscribe(
      (response) => {
        const flt = JSON.parse(JSON.stringify(response)).data;
        if(flt){
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
        let bean = {
          id: '',
          beneficiary: '',
          applicant: '',
          country: '',
          txnID: '',
          dateTime: '',
          validity: '',
          ib: '',
          ccy: '',
          goods: '',
          requirement: '',
          action: ''
        }
        index++;
        bean.id = '' + (index);
        bean.beneficiary = dt.beneName;
        bean.applicant = dt.applicantName;
        bean.country = dt.applicantCountry;
        bean.txnID = dt.transactionId;
        bean.dateTime = dt.insertedDate;
        bean.validity = dt.validity;
        bean.ib = dt.lCIssuanceBank;
        bean.ccy = dt.lCCurrency;
        bean.goods = dt.lCValue;
        bean.requirement = dt.requirementType;
        bean.action = dt.requirementType;
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


  showQuotePage(pagename: string) {
    this.titleService.quote.next(true);
    this.whoIsActive = pagename;
    if (pagename === 'confirmation') {
      this.confirmation.isActive = true;
      this.discounting.isActive = false;
      this.confirmAndDiscount.isActive = false;
      this.refinancing.isActive = false;
      this.banker.isActive = false;
    } else if (pagename === 'discount') {
      this.confirmation.isActive = false;
      this.discounting.isActive = true;
      this.confirmAndDiscount.isActive = false;
      this.refinancing.isActive = false;
      this.banker.isActive = false;
    } else if (pagename === 'cad') {
      this.confirmation.isActive = false;
      this.discounting.isActive = false;
      this.confirmAndDiscount.isActive = true;
      this.refinancing.isActive = false;
      this.banker.isActive = false;
    } else if (pagename === 'refinance') {
      this.confirmation.isActive = false;
      this.discounting.isActive = false;
      this.confirmAndDiscount.isActive = false;
      this.refinancing.isActive = true;
      this.banker.isActive = false;
    } else if (pagename === 'banker') {
      this.confirmation.isActive = false;
      this.discounting.isActive = false;
      this.confirmAndDiscount.isActive = false;
      this.refinancing.isActive = false;
      this.banker.isActive = true;


    }




  }




}
