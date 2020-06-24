import { Component } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import { TitleService } from 'src/app/services/titleservice/title.service';
import { NewTransactionService } from 'src/app/services/banktransactions/new-transaction.service';
import { trnsactionDetail } from 'src/assets/js/commons';
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

  constructor(public titleService: TitleService, public nts: NewTransactionService) {
    this.titleService.quote.next(false);
  }

  ngOnInit() {
    this.getAllnewTransactions();
    trnsactionDetail();
  }

  ngAfterViewInit() {
    // setTimeout(() => {
      // trnsactionDetail();
  // }, 1000);
}

  public getAllnewTransactions() {
    this.nts.getAllNewTransaction().subscribe(
      (response) => {
        const data = JSON.parse(JSON.stringify(response)).data;
        console.log(data);
        
        // $('#datatables').DataTable({
        //   responsive: true
        // });
        if (!data) {
          this.hasNoRecord = true;
        }
      },
      (error) => {
        this.hasNoRecord = true;

      }
    )
  }




}