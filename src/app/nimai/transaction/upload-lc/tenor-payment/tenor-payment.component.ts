import { Component, OnInit, Input, EventEmitter } from '@angular/core';
import { Subject } from 'rxjs';
import { DataServiceService } from 'src/app/services/upload-lc/data-service.service';
import { FormGroup } from '@angular/forms';
import  { ValidateRegex } from '../../../../beans/Validations';
import * as $ from 'src/assets/js/jquery.min';


@Component({
  selector: 'app-tenor-payment',
  templateUrl: './tenor-payment.component.html',
  styleUrls: ['./tenor-payment.component.css']
})
export class TenorPaymentComponent implements OnInit {


  @Input() public LcDetail:FormGroup;
  public selector: string;
  public discount: boolean = false;
  public refinancing: boolean = false;
  public confirmation: boolean = true;
  fileToUpload: File = null;
  private imageSrc: string = '';

  constructor(public rds:DataServiceService) {

  }

  ngOnInit() {
    $("input[name='optionsRadios']").click(function() {
      var radioValue1 = $("input[name='optionsRadios']:checked").val();
      if (radioValue1 == "rdmaturity") {
           $('.multipledate').hide();
      } else {
          $('.multipledate').show();
      } 
    });

  }


  public selectors(selector: string) {
    this.selector = selector;
    if (this.selector === 'discounting' || this.selector === 'banker') {
      this.discount = true;
      this.confirmation = false;
      this.refinancing = false;
      this.rds.refinance.next(this.refinancing);
    } else if (this.selector === 'refinance') {
      this.discount = false;
      this.confirmation = false;
      this.refinancing = true;
      this.rds.refinance.next(this.refinancing);
    } else {
      this.discount = false;
      this.confirmation = true;
      this.refinancing = false;
      this.rds.refinance.next(this.refinancing);
    }



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

  handleFileInput(e) {
    var file = e.dataTransfer ? e.dataTransfer.files[0] : e.target.files[0];
    var pattern = /image-*/;
    var reader = new FileReader();
    if (!file.type.match(pattern)) {
      alert('invalid format');
      return;
    }
    reader.onload = this._handleReaderLoaded.bind(this);
    reader.readAsDataURL(file);
  }
  _handleReaderLoaded(e) {
    let reader = e.target;
    this.imageSrc = reader.result;
    // this.LcDetail.get('lcMaturityDate').setValue(this.imageSrc);

  }


}
