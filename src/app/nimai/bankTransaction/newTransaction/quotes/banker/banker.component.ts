import { Component, OnInit } from '@angular/core';

import * as $ from '../../../../../../assets/js/jquery.min';
import { TitleService } from 'src/app/services/titleservice/title.service';



@Component({
  selector: 'app-banker',
  templateUrl: './banker.component.html',
  styleUrls: ['./banker.component.css']
})
export class BankerComponent implements OnInit {

  public isActive:boolean = false;

  
  constructor(public titleService:TitleService) {
   
   }

  ngOnInit() {
    
  }


 public closed(){
    this.isActive = false;  
    this.titleService.quote.next(false); 
  }

  

}
