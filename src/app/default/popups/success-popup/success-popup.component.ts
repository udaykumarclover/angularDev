import { Component, OnInit } from '@angular/core';
import * as $ from '../../../../assets/js/jquery.min';
import { Router } from '@angular/router';

@Component({
  selector: 'app-success-popup',
  templateUrl: './success-popup.component.html',
  styleUrls: ['./success-popup.component.css']
})
export class SuccessPopupComponent implements OnInit {
  public title: string;
  public message: string;
  public parent :string;

  constructor(public router: Router) {

    let navigation = this.router.getCurrentNavigation();
    console.log(navigation)
    const state = navigation.extras.state as {
      title: string,
      message: string,
       parent:string
    };
    this.title = state.title;
    this.message = state.message;
    this.parent = state.parent;
   }

  ngOnInit() {
    
  }

  close() {
    $('.modal').hide();
    if(this.parent === 'login'){
      this.router.navigate(['/'+this.parent]);
    } else if(this.parent === "accountactivation"){
      this.router.navigate(['/login']);
    } else{
      this.router.navigate(['/'+this.parent]);
    }

  }

}
