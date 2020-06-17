import { Component, OnInit, EventEmitter, Output } from '@angular/core';
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
  styleUrls: ['./upload-lc.component.css']
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


  // rds: refinance Data Service
  constructor(public activatedRoute: ActivatedRoute, public fb: FormBuilder, public router: Router, public rds: DataServiceService, public titleService: TitleService, public upls: UploadLcService) {
    this.setForm();
    this.lc = this.lcDetailForm.value;
    this.titleService.changeTitle(this.title);

    this.activatedRoute.parent.url.subscribe((urlPath) => {
      this.parentURL = urlPath[urlPath.length - 1].path;
    });
    this.activatedRoute.parent.parent.url.subscribe((urlPath) => {
      this.subURL = urlPath[urlPath.length - 1].path;
    })
  }

  ngOnInit() {
    this.rds.refinanting.subscribe(flag => this.refinancing = flag);
    const lcd = this;
    $(document).ready(function () {
      const anchor: any[] = $('.nav-tabs').find('a');
      lcd.saveCount = anchor.length;

    })
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
      this.isSave = true;
      this.isPreview = false;
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
          this.isPrev = true;
          this.isNext = false;
          this.isSave = false;
          this.isPreview = true;
          this.previewShow = false;
          this.isEdit = false;
          this.isConfirm = false;
          this.transactionID = JSON.parse(JSON.stringify(response)).data;
          this.loading = false;
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
    this.lc = this.lcDetailForm.value;
    this.previewShow = true;
    this.isPrev = false;
    this.isNext = false;
    this.isSave = false;
    this.isPreview = false;
    this.isEdit = true;
    this.isConfirm = true;
    this.titleService.loading.next(false);

  }

  public confirm() {
    this.titleService.loading.next(true);
    this.loading = true;
    let body = {
      transactionId: this.transactionID,
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
              message: 'Your LC Transaction has been successfully placed.',
              parent: this.subURL+"/"+this.parentURL + '/new-transaction'
            }
          };
          this.router.navigate([`/${this.subURL}/${this.parentURL}/new-transaction/success`], navigationExtras)
            .then(success => console.log('navigation success?', success))
            .catch(console.error);
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
      contactPer:[''],
      contactPerEmail:[''],
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
      transactionStatus:['']
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

}
