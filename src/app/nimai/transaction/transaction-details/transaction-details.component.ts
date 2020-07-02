import { Component } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import { TitleService } from 'src/app/services/titleservice/title.service';
import { NewTransactionService } from 'src/app/services/banktransactions/new-transaction.service';
import { custTrnsactionDetail } from 'src/assets/js/commons';
import * as $ from 'src/assets/js/jquery.min';


@Component({
  selector: 'app-transaction-details',
  templateUrl: './transaction-details.component.html',
  styleUrls: ['./transaction-details.component.css']
})
export class TransactionDetailsComponent {
  displayedColumns: string[] = ['id', 'beneficiary', 'bcountry', 'applicant', 'acountry', 'txnID', 'dateTime','validity', 'ib','amount', 'ccy', 'goods', 'requirement','receivedQuotes','star'];
  dataSource: MatTableDataSource<any>;
  public ntData: any[] = [];

  public whoIsActive: string = "";
  public hasNoRecord: boolean = false;
  public data: any;
  public specificDetail: any;

  constructor(public titleService: TitleService, public nts: NewTransactionService) {
    this.titleService.quote.next(false);
  }

  ngOnInit() {
    custTrnsactionDetail();
    this.getAllnewTransactions('Accepted');
  }

  public getAllnewTransactions(status) {
    const data = {
      "userId": sessionStorage.getItem('userID'),
      "transactionStatus": status
    }
    this.nts.getAllNewTransaction(data).subscribe(
      (response) => {
        this.data = [];
        this.data = JSON.parse(JSON.stringify(response)).data;
        console.log(this.data);
        if (!this.data) {
          // this.hasNoRecord = true;
        }
      },
      (error) => {
        this.data = null;
        // this.hasNoRecord = true;

      }
    )
  }

  getDetail(detail){

    console.log(detail);
    this.specificDetail = detail;
    
  }

  changeStatusCall(status){
    this.getAllnewTransactions(status);
    custTrnsactionDetail();
  }


}