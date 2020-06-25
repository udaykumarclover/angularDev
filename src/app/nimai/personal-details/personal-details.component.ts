import { Component, OnInit, OnChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { signup } from 'src/app/beans/signup';
import { PersonalDetailsService } from 'src/app/services/personal-details/personal-details.service';
import * as $ from '../../../assets/js/jquery.min';
import { TitleService } from 'src/app/services/titleservice/title.service';
import { NavigationExtras, Router, ActivatedRoute } from '@angular/router';
import { loads, selectpickercall } from '../../../assets/js/commons';
import { ValidateRegex } from '../../beans/Validations';


const pd = this;
@Component({
  selector: 'app-personal-details',
  templateUrl: './personal-details.component.html',
  styleUrls: ['./personal-details.component.css']
})

export class PersonalDetailsComponent implements OnInit {


  public loading = true;



  public personalDetailsForm: FormGroup;
  public personalDetails: signup = null;
  public isReferrer: boolean = false;
  public isBank: boolean = false;
  public username: string = "";
  public submitted:boolean = false;

  interestedCountryList = this.countryService();
  blackListedGoodsList = this.goodsService();
  dropdownSetting = {};


  intCntTemp: any[] = [];
  blgTemp: any[] = [];



  public title: string = "Personal Details";

  public parentURL: string = "";
  public subURL: string = "";
  public hasValue=false;
  resp: any;

  constructor(public activatedRoute: ActivatedRoute, public fb: FormBuilder, public router: Router, public personalDetailsService: PersonalDetailsService, public titleService: TitleService) {
    if(sessionStorage.getItem('userID'))
    {
      this.hasValue=true;
    }else{
      this.hasValue=false;
    }
    this.getPersonalDetails(sessionStorage.getItem('userID'));
    this.personalDetailsForm = this.fb.group({

      userId: [''],
      subscriberType: [''],
      bankType: [''],

      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      emailId: ['', [Validators.required, Validators.pattern('([a-z0-9._%+-]+)@([a-z0-9.-]+)?\.([a-z]{2,4})$')]],
      mobileNo: ['', Validators.required],
      landLineNo: [''],
      country: ['', Validators.required],

      companyName: [''],
      designation: [''],
      businessType: [''],

      countriesInt: ['',Validators.required],
      minLCVal: [''],
      blacklistedGC: ['',Validators.required]

    })
    this.titleService.changeTitle(this.title);



    this.dropdownSetting = {
      singleSelection: false,
      idField: 'id',
      textField: 'name',
      selectAllText: 'Select All',
      unSelectAllText: 'Unselect All',
      itemsShowLimit: 5,
      allowSearchFilter: true
    }
    this.activatedRoute.parent.url.subscribe((urlPath) => {
      this.parentURL = urlPath[urlPath.length - 1].path;
    });
    this.activatedRoute.parent.parent.url.subscribe((urlPath) => {
      this.subURL = urlPath[urlPath.length - 1].path;
    })

  }

  get perDetails() {
    return this.personalDetailsForm.controls;
  }

  ngOnInit() {
    this.setUserCategoryValidators();

    $("body").on("domChanged", function () {
      const inputs = $('.inputDiv').find('input');
      for (let input of inputs) {
        var text_val = $(input).val();
        if (text_val === "") {
          $(input).removeClass('has-value');
        } else {
          $(input).addClass('has-value');
        }
      };
    });

    this.resp = JSON.parse(sessionStorage.getItem('countryData'));
    console.log(JSON.parse(sessionStorage.getItem('countryData')));
    

  }
 setUserCategoryValidators(){
  const goods = this.personalDetailsForm.get('blacklistedGC')
  const countries = this.personalDetailsForm.get('countriesInt')
  if(!this.isBank){
    goods.setValidators(null);
    countries.setValidators(null);
  }
 }
  submit(): void {
    this.submitted = true;
    if(this.personalDetailsForm.invalid) {
      return;
    }
    this.submitted = false;
    this.titleService.loading.next(true);
    let userID: string = this.personalDetailsForm.get('userId').value;
    this.personalDetailsService.updatePersonalDetails(this.pdb(), userID)
      .subscribe(
        (response) => {
          this.titleService.loading.next(false);
          const navigationExtras: NavigationExtras = {
            state: {
              title: 'Congraulations! Your Personal Details has been successfully submitted!',
              message: '',
              parent: this.subURL + "/" + this.parentURL + '/personal-details'  // need to check
            }
          };
          this.router.navigate([`/${this.subURL}/${this.parentURL}/personal-details/success`], navigationExtras)
            .then(success => console.log('navigation success?', success))
            .catch(console.error);
        },
        (error) => {
          this.titleService.loading.next(false);
          const navigationExtras: NavigationExtras = {
            state: {
              title: ' Your Personal Details has been failed !!!',
              message: 'Invalid Data',
              parent: this.subURL + "/" + this.parentURL + '/personal-details'
            }
          };
          this.router.navigate([`/${this.subURL}/${this.parentURL}/personal-details/error`], navigationExtras)
            .then(success => console.log('navigation success?', success))
            .catch(console.error);
        }
      )

  }

  public getPersonalDetails(userID: string) {

    this.titleService.loading.next(true);
    this.personalDetailsService.getPersonalDetails(userID)
      .subscribe(
        (response) => {
          let responseData = JSON.parse(JSON.stringify(response));
          this.personalDetails = responseData.data;
          console.log(responseData);
          this.username = this.personalDetails.firstName + " " + this.personalDetails.lastName;
          this.titleService.changeUserName(this.username);
          this.personalDetailsForm.patchValue({
            firstName: this.personalDetails.firstName,
            lastName: this.personalDetails.lastName,
            emailId: this.personalDetails.emailAddress,
            mobileNo: this.personalDetails.mobileNum,
            landLineNo: this.personalDetails.landLinenumber,
            country: this.personalDetails.countryName,
            companyName: this.personalDetails.companyName,
            designation: this.personalDetails.designation,
            businessType: this.personalDetails.businessType,
            userId: this.personalDetails.userId,
            subscriberType: this.personalDetails.subscriberType,
            bankType: this.personalDetails.bankType,
            countriesInt: this.filterInterestedCountry(this.personalDetails.interestedCountry),
            minLCVal: this.personalDetails.minLCValue,
            blacklistedGC: this.filterBlackListGoods(this.personalDetails.blacklistedGoods)

          })

          this.intCntTemp = this.personalDetails.interestedCountry;
          this.blgTemp = this.personalDetails.blacklistedGoods;

          let subscriptionType = this.personalDetailsForm.get('subscriberType').value;
          let bankType = this.personalDetails.bankType
          if (subscriptionType === 'REFERRER') {
            this.isReferrer = true;
            $("body").trigger("domChanged");
            this.isBank = false;
          } else if (subscriptionType === 'BANK' && bankType === 'UNDERWRITER') {

            this.isBank = true;
            this.isReferrer = false;
          } else {
            this.isBank = false;
            this.isReferrer = false;
          }

          setTimeout(() => {
            selectpickercall();
            loads();
            //$('.selectpicker').selectpicker('val', ['India', 'USA']);
          }, 200);

          const pd = this;
          setTimeout(function () {
            const inputs = $('.inputDiv').find('input');
            for (let input of inputs) {
              var text_val = $(input).val();
              if (text_val === "") {
                $(input).removeClass('has-value');
              } else {
                $(input).addClass('has-value');
              }
            };
            pd.loading = false;
          }, 1000)


          const selects = $('.inputDiv').find('select')

          for (let select of selects) {
            var text_val = $(select).val();
            if (text_val === "") {
              $(select).css('color', 'transparent');
              $(select).removeClass('has-value');
            } else {
              $(select).css('color', 'black');
              $(select).addClass('has-value');
            }
          };

          this.titleService.loading.next(false);

        },
        (error) => {
          this.titleService.loading.next(false);
          this.personalDetails = null;
        }
      )
  }
  public pdb(): signup {
    let data = {
      subscriberType: this.personalDetailsForm.get('subscriberType').value,
      firstName: this.personalDetailsForm.get('firstName').value,
      lastName: this.personalDetailsForm.get('lastName').value,
      emailAddress: this.personalDetailsForm.get('emailId').value,
      mobileNum: this.personalDetailsForm.get('mobileNo').value,
      countryName: this.personalDetailsForm.get('country').value,
      landLinenumber: this.personalDetailsForm.get('landLineNo').value,
      companyName: this.personalDetailsForm.get('companyName').value,
      designation: this.personalDetailsForm.get('designation').value,
      businessType: this.personalDetailsForm.get('businessType').value,
      userId: this.personalDetailsForm.get('userId').value,
      bankType: this.personalDetailsForm.get('bankType').value,
      minLCValue: this.personalDetailsForm.get('minLCVal').value,
      interestedCountry: this.filterForSaveIntCon(this.intCntTemp, this.personalDetailsForm.get('countriesInt').value),
      blacklistedGoods: this.filterForSaveBlg(this.blgTemp, this.personalDetailsForm.get('blacklistedGC').value)
    }
    return data;
  }



  goodsService() {
    return [{ id: 1, name: 'Gold' }, { id: 2, name: 'Drugs' }, { id: 3, name: 'Diamonds' }]
  }


  getGoodsName(gid: number) {
    return this.goodsService().filter((res) => res.id == gid)[0];
  }

  countryService() {
    return [{ id: 1, name: 'India' }, { id: 2, name: 'USA' }, { id: 3, name: 'Australia' }]
  }


  getCountryName(ccid: number) {
    return this.countryService().filter((res) => res.id == ccid)[0];
  }

  onItemSelect(item: any) {
    console.log(item);
    console.log(this.filterForSaveIntCon(this.intCntTemp, this.personalDetailsForm.get('countriesInt').value))
    console.log(this.filterForSaveBlg(this.blgTemp, this.personalDetailsForm.get('blacklistedGC').value))
  }

  onSelectAll(item: any) {
    console.log(item);
  }


  filterInterestedCountry(data: any[]) {
    let dataArr: any[] = [];

    if (data != null)
      for (let d of data) {
        let dd = {
          id: d.ccid,
          name: d.countriesIntrested
        }
        dataArr.push(dd);
      }
    return dataArr;

  }


  filterBlackListGoods(data: any[]) {
    let dataArr: any[] = [];
    if (data != null)
      for (let d of data) {
        let dd = {
          id: d.goodsMId,
          name: d.blackListGoods
        }
        dataArr.push(dd);
      }
    return dataArr;

  }


  filterForSaveIntCon(data: any[], data1: any[]) {
    let dataArr: any[] = [];
    for (let d1 of data1) {

      let d2 = data.filter((res) => res.ccid === d1.id)[0];

      if (d2 != null) {
        let dd = {
          countryID: d2.countryID,
          countriesIntrested: d2.countriesIntrested,
          ccid: d2.ccid
        }
        dataArr.push(dd)
      } else {
        let dd = {
          countryID: null,
          countriesIntrested: d1.name,
          ccid: d1.id
        }
        dataArr.push(dd)
      }


    }
    return dataArr;

  }



  filterForSaveBlg(data: any[], data1: any[]) {
    let dataArr: any[] = [];
    for (let d1 of data1) {
      let d2 = data.filter((res) => res.goodsMId == d1.id)[0];
      if (d2 != null) {
        let dd = {
          goods_ID: d2.goods_ID,
          blackListGoods: d2.blackListGoods,
          goodsMId: d2.goodsMId
        }
        dataArr.push(dd)
      } else {
        let dd = {
          goods_ID: null,
          blackListGoods: d1.name,
          goodsMId: d1.id
        }
        dataArr.push(dd)
      }


    }
    return dataArr;
  }

  validateRegexFields(event, type) {
    if (type == "number") {
      ValidateRegex.validateNumber(event);
    }
    else if (type == "alpha") {
      //ValidateRegex.alphaOnly(event);
      var key = event.keyCode;
      if (!((key >= 65 && key <= 90) || key == 8/*backspce*/ || key==46/*DEL*/ || key==9/*TAB*/ || key==37/*LFT ARROW*/ || key==39/*RGT ARROW*/ || key==222/* ' key*/ || key==189/* - key*/)) {
          event.preventDefault();
      }
    }
    else if (type == "alphaNum") {
      ValidateRegex.alphaNumeric(event);
    }
  }


}
