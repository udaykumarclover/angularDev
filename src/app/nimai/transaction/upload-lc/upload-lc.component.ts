import { Component, OnInit, EventEmitter, Output,ElementRef } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { DataServiceService } from 'src/app/services/upload-lc/data-service.service';
import * as $ from '../../../../assets/js/jquery.min';
import { LcDetail } from 'src/app/beans/LCDetails';
import { UploadLcService } from 'src/app/services/upload-lc/upload-lc.service';
import { formatDate } from '@angular/common';
import { NavigationExtras, Router, ActivatedRoute } from '@angular/router';
import { TitleService } from 'src/app/services/titleservice/title.service';
import  { ValidateRegex } from '../../../beans/Validations';



@Component({
  selector: 'app-upload-lc',
  templateUrl: './upload-lc.component.html',
  styleUrls: ['./upload-lc.component.css'],
  // host: {
  //   '(document:click)': 'onClick($event)',
  // },
})
export class UploadLCComponent implements OnInit {

  public lcDetailForm: FormGroup
  public selector: string = "confirmation";
  public title: string = "New Transaction";
  public refinancing: boolean = false;
  public counter = 1;
  public saveCount = 0;
  public isPrev: boolean = false;
  public isNext: boolean = true;
  public isSave: boolean = false;
  public isPreview: boolean = false;
  public previewShow: boolean = false;
  public isEdit: boolean = false;
  public isConfirm: boolean = false;
  public loading: boolean = false;
  public date: string = formatDate(new Date(), "yyyy-MM-dd'T'HH:mm:ss.SSS+SSSS", 'en-US');

  public lcDetail: LcDetail = null;
  public lc: any = null;
  public transactionID: string = null;
  public subURL: string = "";
  public parentURL: string = "";
  showUpdateButton: boolean = false;
  isUpdate: boolean = false;
  draftData: any;
  dateToPass: any;


  // rds: refinance Data Service
  constructor(public activatedRoute: ActivatedRoute, public fb: FormBuilder, public router: Router, public rds: DataServiceService, public titleService: TitleService, public upls: UploadLcService,private el: ElementRef) {
    this.titleService.changeTitle(this.title);

    this.activatedRoute.parent.url.subscribe((urlPath) => {
      this.parentURL = urlPath[urlPath.length - 1].path;
    });
    this.activatedRoute.parent.parent.url.subscribe((urlPath) => {
      this.subURL = urlPath[urlPath.length - 1].path;
    })

    let navigation = this.router.getCurrentNavigation();
    console.log(navigation);
    if(navigation.extras.state){
      console.log("..."+ navigation.extras.state.redirectedFrom);
      var trnsactionID = navigation.extras.state.trnsactionID;
      this.callDraftTransaction(trnsactionID);
    }

    this.setForm();
    this.lc = this.lcDetailForm.value;    
  }

  ngOnInit() {
    this.rds.refinanting.subscribe(flag => this.refinancing = flag);
    const lcd = this;
    $(document).ready(function () {
      const anchor: any[] = $('.nav-tabs').find('a');
      lcd.saveCount = anchor.length;

    })
    
  
  }
// onClick(event) {
//     if (!this.el.nativeElement.contains(event.target)) // or some similar check
//       alert('Your LC Transaction details will be lost, Kindly save!');
//    }

  ngAfterViewInit() {
    // document.getElementsByTagName('input') : to gell all Docuement imputs
    const inputList = [].slice.call((<HTMLElement>this.el.nativeElement).getElementsByTagName('input'));
     inputList.forEach((input: HTMLElement) => {
         input.addEventListener('focus', () => {
             if((<HTMLInputElement>event.target).value===null || (<HTMLInputElement>event.target).value==="")
              input.className="ng-valid ng-dirty ng-touched"   
             else 
              input.className="ng-valid ng-dirty ng-touched has-value"
         });
            input.addEventListener('blur', () => {
              if((<HTMLInputElement>event.target).value===null || (<HTMLInputElement>event.target).value==="")
                input.className="ng-valid ng-dirty ng-touched"   
              else
              input.className="ng-valid ng-dirty ng-touched has-value"
         });
     });
     const selectList = [].slice.call((<HTMLElement>this.el.nativeElement).getElementsByTagName('select'));
     selectList.forEach((select: HTMLElement) => {
      select.addEventListener('focus', () => {
        if((<HTMLInputElement>event.target).value===null || (<HTMLInputElement>event.target).value==="")
          select.className="ng-valid ng-dirty ng-touched"   
        else 
          select.className="ng-valid ng-dirty ng-touched has-value"
      });
      select.addEventListener('blur', () => {
        if((<HTMLInputElement>event.target).value===null || (<HTMLInputElement>event.target).value==="")
          select.className="ng-valid ng-dirty ng-touched"   
        else 
          select.className="ng-valid ng-dirty ng-touched has-value"
      });
  });
    const textareaList = [].slice.call((<HTMLElement>this.el.nativeElement).getElementsByTagName('textarea'));
    textareaList.forEach((textarea: HTMLElement) => {
      textarea.addEventListener('focus', () => {
      if((<HTMLInputElement>event.target).value===null || (<HTMLInputElement>event.target).value==="")
      textarea.className="ng-valid ng-dirty ng-touched"   
      else 
      textarea.className="ng-valid ng-dirty ng-touched has-value"
    });
    textarea.addEventListener('blur', () => {
      if((<HTMLInputElement>event.target).value===null || (<HTMLInputElement>event.target).value==="")
      textarea.className="ng-valid ng-dirty ng-touched"   
      else 
      textarea.className="ng-valid ng-dirty ng-touched has-value"
    });
  });
 }

  public next() {
    console.log('111');
    
    this.previewShow = false;
    this.titleService.loading.next(true);

    const anchor: any[] = $('.nav-tabs').find('a');

    for (let index = 0; index < anchor.length; index++) {


      if (index == this.counter && $(anchor[index]).attr('href') === '#tab_default_' + (this.counter + 1)) {
        $(anchor[index]).attr('aria-expanded', 'true');
        $(anchor[index]).parent().addClass('active')

        const tabpanes: any[] = $('.tab-content').find('.tab-pane')
        for (let i = 0; i < tabpanes.length; i++) {
          if ($(tabpanes[i]).attr('id') === 'tab_default_' + (this.counter + 1)) {
            $(tabpanes[i]).addClass('active');
          } else {
            $(tabpanes[i]).removeClass('active');
          }

        }
      } else {
        $(anchor[index]).attr('aria-expanded', 'false');
        $(anchor[index]).parent().removeClass('active')
      }


    }
    this.counter++;
    if (this.saveCount == this.counter) {
      this.isPrev = true;
      this.isNext = false;
      this.isSave = false;
      if(this.isUpdate){
        this.showUpdateButton = true;
        this.isPreview = false;
      }
      else{
        this.showUpdateButton = false;
        this.isPreview = true;
      }
    } else {
      this.isPrev = true;
    }
    this.titleService.loading.next(false);


  }

  public prev() {
    this.previewShow = false;
    this.titleService.loading.next(true);
    const anchor: any[] = $('.nav-tabs').find('a');
    this.counter--;

    for (let index = 0; index < anchor.length; index++) {

      if (index == (this.counter - 1) && $(anchor[index]).attr('href') === '#tab_default_' + (this.counter)) {
        $(anchor[index]).attr('aria-expanded', 'true');
        $(anchor[index]).parent().addClass('active');

        const tabpanes: any[] = $('.tab-content').find('.tab-pane')
        for (let i = 0; i < tabpanes.length; i++) {
          if ($(tabpanes[i]).attr('id') === 'tab_default_' + (this.counter)) {
            $(tabpanes[i]).addClass('active');
          } else {
            $(tabpanes[i]).removeClass('active');
          }

        }
      } else {
        $(anchor[index]).attr('aria-expanded', 'false');
        $(anchor[index]).parent().removeClass('active')
      }

    }

    if (this.counter == 1) {
      this.isPrev = false;
      this.isNext = true;
      this.isSave = false;
      this.isPreview = false;

    } else {  
      this.isPrev = true;
      this.isNext = true;
      this.isSave = false;
      this.isPreview = false;
    }
    this.titleService.loading.next(false);
  }


  public save() {
    this.loading = true;
    this.titleService.loading.next(true);
    let data = this.lcDetailForm.value;
    data.lCIssuingDate = (data.lCIssuingDate) ? this.dateFormat(data.lCIssuingDate) : '';
    data.lCExpiryDate = (data.lCExpiryDate) ? this.dateFormat(data.lCExpiryDate) : '';
    data.lastShipmentDate = (data.lastShipmentDate) ? this.dateFormat(data.lastShipmentDate) : '';
    data.negotiationDate = (data.negotiationDate) ? this.dateFormat(data.negotiationDate) : '';
    data.requirementType = data.selector;
    data.tenorEndDate = data.lastShipmentDate;
    console.log(data)

    this.upls.saveLc(data)
      .subscribe(
        (response) => {
          this.transactionID = JSON.parse(JSON.stringify(response)).data;
          sessionStorage.setItem("transactionID",this.transactionID);
          this.loading = false;
          this.lc = this.lcDetailForm.value;
          this.previewShow = true;
          this.isPrev = false;
          this.isNext = false;
          this.isSave = false;
          this.isPreview = false;
          this.showUpdateButton = false;
          this.isEdit = true;
          this.isConfirm = true;
          this.titleService.loading.next(false);
        },
        (error) => {
          this.loading = false;
          this.titleService.loading.next(false);
        }
      )
  }

  public preview() {
    this.titleService.loading.next(true);
    this.save();
    // this.lc = this.lcDetailForm.value;
    // this.previewShow = true;
    // this.isPrev = false;
    // this.isNext = false;
    // this.isSave = false;
    // this.isPreview = false;
    // this.showUpdateButton = false;
    // this.isEdit = true;
    // this.isConfirm = true;
    this.titleService.loading.next(false);
    
  }

  public update(){
    this.loading = true;
    this.titleService.loading.next(true);
    let data = this.lcDetailForm.value;
    data.lCIssuingDate = (data.lCIssuingDate) ? this.dateFormat(data.lCIssuingDate) : '';
    data.lCExpiryDate = (data.lCExpiryDate) ? this.dateFormat(data.lCExpiryDate) : '';
    data.lastShipmentDate = (data.lastShipmentDate) ? this.dateFormat(data.lastShipmentDate) : '';
    data.negotiationDate = (data.negotiationDate) ? this.dateFormat(data.negotiationDate) : '';
    data.requirementType = data.selector;
    data.tenorEndDate = data.lastShipmentDate;
    data.transactionID = this.transactionID;


    this.upls.updateLc(data).subscribe(
        (response) => {
          // this.transactionID = JSON.parse(JSON.stringify(response)).data;
          this.loading = false;
          this.titleService.loading.next(false);
        },
        (error) => {
          this.loading = false;
          this.titleService.loading.next(false);
        }
      )
  }

  public confirm() {
    this.titleService.loading.next(true);
    this.loading = true;
    let body = {
      transactionId: sessionStorage.getItem("transactionID"),
      userId: sessionStorage.getItem('userID')
    }
    this.upls.confirmLc(body)
      .subscribe(
        (response) => {
          this.setForm();
          this.edit();
          this.loading = false;
          this.titleService.loading.next(false);
          const navigationExtras: NavigationExtras = {
            state: {
              title: 'Transaction Successful',
              message: 'Your Transaction has been successfully placed. Keep checking the Active Transaction section for the quotes received.',
              parent: this.subURL+"/"+this.parentURL + '/new-transaction'
            }
          };
          this.router.navigate([`/${this.subURL}/${this.parentURL}/new-transaction/success`], navigationExtras)
            .then(success => console.log('navigation success?', success))
            .catch(console.error);
          this.isUpdate = false;

        },
        (error) => {
          this.titleService.loading.next(false);
          this.loading = false;
          const navigationExtras: NavigationExtras = {
            state: {
              title: 'Transaction Failed',
              message: '',
              parent: this.subURL+"/"+this.parentURL +'/new-transaction'
            }
          };
          this.router.navigate([`/${this.subURL}/${this.parentURL}/new-transaction/error`], navigationExtras)
            .then(success => console.log('navigation error?', success))
            .catch(console.error);
        }
      )
  }

  public edit() {
    this.isUpdate = true;
    this.isEdit = false;
    this.isConfirm = false;
    this.previewShow = false;
    this.counter = 0;

    const anchor: any[] = $('.nav-tabs').find('a');

    for (let index = 0; index < anchor.length; index++) {


      if (index == this.counter && $(anchor[index]).attr('href') === '#tab_default_' + (this.counter + 1)) {
        $(anchor[index]).attr('aria-expanded', 'true');
        $(anchor[index]).parent().addClass('active')

        const tabpanes: any[] = $('.tab-content').find('.tab-pane')
        for (let i = 0; i < tabpanes.length; i++) {
          if ($(tabpanes[i]).attr('id') === 'tab_default_' + (this.counter + 1)) {
            $(tabpanes[i]).addClass('active');
          } else {
            $(tabpanes[i]).removeClass('active');
          }

        }
      } else {
        $(anchor[index]).attr('aria-expanded', 'false');
        $(anchor[index]).parent().removeClass('active')
      }


    }
    this.counter++;


    this.isNext = true;
    this.isSave = false;
    this.isPreview = false;

    this.isPrev = false;



  }

  public setForm() {
    this.lcDetailForm = this.fb.group({
      selector: ['confirmation'],
      userId: sessionStorage.getItem('userID'),
      requirementType: [''],
      lCIssuanceBank: [''],
      lCIssuanceBranch: [''],
      swiftCode: [''],
      lCIssuanceCountry: [''],
  
      lCValue: [''],
      lCCurrency: [''],
      lCIssuingDate: [''], 
      lastShipmentDate: [''],
      negotiationDate: [''],
      goodsType:[''],
  
  
      // For Confirmation 
      paymentPeriod: [''],
      paymentTerms: [''],
      tenorStartDate:[''],
      tenorEndDate: ['20-05-2020'],
  
      // For Discounting 
      discountingPeriod:[''],
      remarks:[''],
  
      //For Refinancing
      originalTenorDays:[''],
      refinancingPeriod:[''],
      lcMaturityDate:[''],
      lcNumber:[''],
    lastBeneBank:[''],
    lastBeneSwiftCode:[''],
    lastBankCountry:[''],
  
      
      applicantName:[''],
      applicantCountry:[''],
  
      beneName:[''],
      beneBankCountry:[''],
      beneBankName:[''],
      beneSwiftCode:[''],
      beneCountry:[''],
      
     
      loadingCountry:[''],
      loadingPort:[''],
      dischargeCountry:[''],
      dischargePort:[''],
  
      chargesType: [''],
      validity:[''],
      lcProForma:'TEST',
  
      lCExpiryDate:[''],    
      
      insertedDate:this.date,
      insertedBy:sessionStorage.getItem('userID'),
      modifiedDate:this.date,
      modifiedBy:sessionStorage.getItem('userID'),
      transactionflag:[''],
      transactionStatus:[''],
      userType:['Applicant'],
      applicantContactPerson:[''],
      applicantContactPersonEmail:[''],
      beneContactPerson:[''],
      beneContactPersonEmail:['']
    })
  }


  public dateFormat(date: string): string {
    let formatedDate = formatDate(new Date(date), "yyyy-MM-dd'T'HH:mm:ss.SSS+SSSS", 'en-US');
    return formatedDate;
  }

  validateRegexFields(event, type){
    if(type == "number"){
      ValidateRegex.validateNumber(event);
    }
    else if(type == "alpha"){
      ValidateRegex.alphaOnly(event);
    }
    else if(type == "alphaNum"){
      ValidateRegex.alphaNumeric(event);
    }
  }

  callDraftTransaction(trnsactionID){
    const param = {
      transactionId: trnsactionID
    }
    this.isUpdate = true;
    
    this.upls.getCustspecificDraftTransaction(param).subscribe(
      (response) => {
         this.draftData = JSON.parse(JSON.stringify(response)).data;
         console.log(this.draftData);
        this.dateToPass = new Date(this.draftData.lCIssuingDate);
         
        this.lcDetailForm.patchValue({
          userId: this.draftData.userId,
          selector: this.draftData.requirementType,
          lCIssuanceBank: this.draftData.lCIssuanceBank,
          lCIssuanceBranch: this.draftData.lCIssuanceBranch,
          swiftCode: this.draftData.swiftCode,
          lCIssuanceCountry: this.draftData.lCIssuanceCountry,
      
          lCValue: this.draftData.lCValue,
          lCCurrency: this.draftData.lCCurrency,
          lCIssuingDate: (this.draftData.lCIssuingDate) ? this.dateFormat(this.draftData.lCIssuingDate) : '',
          lastShipmentDate: this.draftData.lastShipmentDate,
          negotiationDate: this.draftData.negotiationDate,
          goodsType:this.draftData.goodsType,
      
      
          // For Confirmation 
          paymentPeriod: this.draftData.paymentPeriod,
          paymentTerms: this.draftData.paymentTerms,
          tenorStartDate:this.draftData.tenorStartDate,
          tenorEndDate: this.draftData.tenorEndDate,
      
          // For Discounting 
          discountingPeriod:this.draftData.discountingPeriod,
          remarks:this.draftData.remarks,
      
          //For Refinancing
          originalTenorDays:this.draftData.originalTenorDays,
          refinancingPeriod:this.draftData.refinancingPeriod,
          lcMaturityDate:this.draftData.lcMaturityDate,
          lcNumber:this.draftData.lcNumber,
          lastBeneBank:this.draftData.lastBeneBank,
          lastBeneSwiftCode:this.draftData.lastBeneSwiftCode,
          lastBankCountry:this.draftData.lastBankCountry,
      
          
          applicantName:this.draftData.applicantName,
          applicantCountry:this.draftData.applicantCountry,
      
          beneName:this.draftData.beneName,
          beneBankCountry:this.draftData.beneBankCountry,
          beneBankName:this.draftData.beneBankName,
          beneSwiftCode:this.draftData.beneSwiftCode,
          beneCountry:this.draftData.beneCountry,
          
         
          loadingCountry:this.draftData.loadingCountry,
          loadingPort:this.draftData.loadingPort,
          dischargeCountry:this.draftData.dischargeCountry,
          dischargePort:this.draftData.dischargePort,
      
          chargesType: this.draftData.chargesType,
          validity:this.draftData.validity,
          lcProForma:this.draftData.lcProForma,
      
          lCExpiryDate:this.draftData.lCExpiryDate,    
          
          insertedDate: this.draftData.insertedDate,
          insertedBy: this.draftData.insertedBy,
          modifiedDate: this.draftData.modifiedDate,
          modifiedBy: this.draftData.modifiedBy,
          transactionflag: this.draftData.transactionflag,
          transactionStatus: this.draftData.transactionStatus,
          userType:this.draftData.userType,
          applicantContactPerson:this.draftData.applicantContactPerson,
          applicantContactPersonEmail:this.draftData.applicantContactPersonEmail,
          beneContactPerson:this.draftData.beneContactPerson,
          beneContactPersonEmail:this.draftData.beneContactPersonEmail,
        });
    // this.lc = this.lcDetailForm.value;
      },(error) =>{
      }
      )
  }

}
