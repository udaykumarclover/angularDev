import { Tflag } from 'src/app/beans/Tflag';
import { TitleService } from 'src/app/services/titleservice/title.service';
import * as $ from 'src/assets/js/jquery.min';
import { NewTransactionService } from 'src/app/services/banktransactions/new-transaction.service';
import { ViewChild, OnInit, Component } from '@angular/core';
import { PlaceQuote, editViewQuotation } from 'src/app/beans/BankNewTransaction';
import { UploadLcService } from 'src/app/services/upload-lc/upload-lc.service';
import { NavigationExtras,ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-confirm-and-discount',
  templateUrl: './confirm-and-discount.component.html',
  styleUrls: ['./confirm-and-discount.component.css']
})
export class ConfirmAndDiscountComponent implements OnInit {

  public isActive: boolean = false;
public isActiveQuote:boolean=false;
  public data: PlaceQuote;
  public dataViewEdit:editViewQuotation;

  public title: string = "";
  public tab = 'tab1';
  detail:any;
  public radioSelected:boolean=false;
  radioStatus: boolean;
  public parentURL: string = "";
  public subURL: string = "";
  public selectNego:string="";
  public selectMature:String="";


 constructor(public titleService: TitleService, public ts: NewTransactionService, 
    public upls: UploadLcService,public activatedRoute: ActivatedRoute, public router: Router) {
   this.activatedRoute.parent.url.subscribe((urlPath) => {
     this.parentURL = urlPath[urlPath.length - 1].path;
   });
   this.activatedRoute.parent.parent.url.subscribe((urlPath) => {
     this.subURL = urlPath[urlPath.length - 1].path;
   })
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
      sumOfQuote: 0,
      confChgsMatur: 0,
      confChgsNegot:0
        }
        
this.dataViewEdit={
  acceptedOn:null,
		applicableBenchmark:0,
		applicantName:"",
		bankUserId:"",
		bankerAcceptCharges: 0,
		beneName:"",
		chargesType:"",
    commentsBenchmark:"",	
    confChgsIssuanceToExp: "",
		confChgsIssuanceToMatur:"",
		confChgsIssuanceToNegot: "",
		confirmationCharges: 0,
		discountingCharges: 0,
		docHandlingCharges: 0,
		goodsType: "",
		lCIssuanceBank: "",
		lCValue: 0,
		minTransactionCharges: 0,
		negotiationChargesFixed: 0,
		negotiationChargesPerct: 0,
		otherCharges: 0,
		quotationId: 0,
		quotationPlaced: "",
		refinancingCharges: 0,
		requirementType: "",
		totalQuoteValue: 0,
		transactionId: "",
		transactionStatus: "",
		userId: "",
		validity: null,
		validityDate: null,
}
  }

  ngOnInit() {
  }

  onNegotChange(value){
    this.selectMature='no';
    this.selectNego='yes';     
     }
 
 onMatureChange(value){
  this.selectMature='yes';
  this.selectNego='no';     
   }

   onNegoEdit(){
    this.dataViewEdit.confChgsIssuanceToNegot=$( "#selectid3 option:selected" ).text();   
  }
  onMaturEdit(){
    this.dataViewEdit.confChgsIssuanceToMatur=$( "#selectid4 option:selected" ).text();   
     }

  public action(flag: boolean, type: Tflag, data: any) {
    if (flag) {
      if (type === Tflag.VIEW) {
        this.isActive = flag;
        $('input').attr('readonly', true);
        this.title = 'View';
        this.dataViewEdit = data;   
      } else if (type === Tflag.EDIT) {
        this.isActive = flag;
        this.title = 'Edit';
        this.dataViewEdit = data;       
        $('input').attr('readonly', false);
      }else if(type===Tflag.PLACE_QUOTE){
        this.isActiveQuote = flag;
        this.title = 'Place Quote';
        this.data = data;
        $('#selectid1').attr('readonly', true);
        $('#selectid2').attr('readonly', true);
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
          if($( "#selectid3 option:selected" ).text()==='yes'){
            $("#selectid3").append(new Option("no", "value"));
          }else if($( "#selectid3 option:selected" ).text()==='no'){
            $("#selectid3").append(new Option("yes", "value"));
          }
          if($( "#selectid4 option:selected" ).text()==='yes'){
            $("#selectid4").append(new Option("no", "value"));
          }else if($("#selectid4 option:selected" ).text()==='no'){
            $("#selectid4").append(new Option("yes", "value"));
          }     
          $('input').attr('readonly', false);
        }, 100);
        this.title = 'Edit';
      }
        break;

      case 'submit': {
        this.ts.updateBankTransaction(this.dataViewEdit).subscribe(
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
  
  
  public transactionForQuotes(act: string,data:any,detail:any) {

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
        const param = {
                      "quotationId":detail.quotationId,
                      "transactionId":data.transactionId,
                      "userId":data.userId
         }
      this.ts.confirmQuotation(param).subscribe(
        (response) => {
          console.log(response)
          this.tab = 'tab3';
          let emailBodyUpdate = {
            "transactionid": data.transactionId,
            "userId": data.userId,
            "event": "QUOTE_ACCEPT"
            }
        this.upls.confirmLcMailSent(emailBodyUpdate).subscribe((resp) => {console.log("Email sent successfully");},(err) => {},);

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
           const navigationExtras: NavigationExtras = {
            state: {
              redirectedFrom: "confirmAndDiscountComponent",
              trnsactionID: data.transactionId
            }
          };
           this.router.navigate([`/${this.subURL}/${this.parentURL}/active-transaction`], navigationExtras)
           .then(success => console.log('navigation success?', success))
           .catch(console.error);
              
              }
        break;
      case 'preview': {
        this.tab = 'tab2';
        setTimeout(() => {
          $('input').attr('readonly', true);
        }, 200);
      }
        break;


        case 'calculateQuote':{
          this.ts.saveQuotationToDraft(this.data).subscribe(
            (response) => {
              this.detail = JSON.parse(JSON.stringify(response)).data;
              this.data=data;
              this.data.TotalQuote=this.detail.TotalQuote;
            },
            error => {
              alert('error')
              this.closedQuote();
              this.tab = 'tab1';
            }
          )
        }break;
        case 'generateQuote': {
          this.tab = 'tab2';
          this.data.confChgsIssuanceToNegot=this.selectNego;
          this.data.confChgsIssuanceToMatur=this.selectMature;
          console.log(this.data)
          this.ts.saveQuotationToDraft(this.data).subscribe(
            (response) => {
              this.detail = JSON.parse(JSON.stringify(response)).data;
              this.data=data;
              this.data.TotalQuote=this.detail.TotalQuote;
              this.data.confChgsMatur=this.detail.confChgsMatur;
              this.data.confChgsNegot=this.detail.confChgsNegot;
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