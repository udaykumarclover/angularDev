import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-discounting',
  templateUrl: './discounting.component.html',
  styleUrls: ['./discounting.component.css']
})
export class DiscountingComponent implements OnInit {

  public isActive:boolean = false;
  constructor() { }

  ngOnInit() {
  }

}
