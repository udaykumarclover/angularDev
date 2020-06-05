import { Component, OnInit } from '@angular/core';
import { TitleService } from 'src/app/services/titleservice/title.service';

@Component({
  selector: 'app-confirmation',
  templateUrl: './confirmation.component.html',
  styleUrls: ['./confirmation.component.css']
})
export class ConfirmationComponent implements OnInit {

 
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
