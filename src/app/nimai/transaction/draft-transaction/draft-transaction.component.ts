import { Component, OnInit } from '@angular/core';
import { UploadLcService } from 'src/app/services/upload-lc/upload-lc.service';
import { NavigationExtras, ActivatedRoute, Router } from '@angular/router';
@Component({
  selector: 'app-draft-transaction',
  templateUrl: './draft-transaction.component.html',
  styleUrls: ['./draft-transaction.component.css']
})
export class DraftTransactionComponent implements OnInit {
  noData: boolean = false;
  draftData: any;
  public parentURL: string = "";
  public subURL: string = "";

  constructor(public service: UploadLcService, public activatedRoute: ActivatedRoute, public router: Router ) {
    this.activatedRoute.parent.url.subscribe((urlPath) => {
      this.parentURL = urlPath[urlPath.length - 1].path;
    });
    this.activatedRoute.parent.parent.url.subscribe((urlPath) => {
      this.subURL = urlPath[urlPath.length - 1].path;
    })
  }

  ngOnInit() {
    this.callAllDraftTransaction();
  }

  callAllDraftTransaction(){
    const param = {
      userId: sessionStorage.getItem('userID')
    }
    
    this.service.getCustDraftTransaction(param).subscribe(
      (response) => {
        this.draftData = JSON.parse(JSON.stringify(response)).data;
        console.log(this.draftData);
        if(!this.draftData){
          this.noData = true;
        }
      },(error) =>{
        this.noData = true;
      }
      )
  }

  editDraft(){
    const navigationExtras: NavigationExtras = {
      state: {
        redirectedFrom: "draftTransaction"
      }
    };
    this.router.navigate([`/${this.subURL}/${this.parentURL}/new-transaction`], navigationExtras)
      .then(success => console.log('navigation success?', success))
      .catch(console.error);
  }
}
