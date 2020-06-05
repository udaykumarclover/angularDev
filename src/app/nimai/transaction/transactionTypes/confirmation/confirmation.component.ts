import { Component, OnInit } from '@angular/core';
import { Tflag } from 'src/app/beans/Tflag';

@Component({
  selector: 'app-confirmation',
  templateUrl: './confirmation.component.html',
  styleUrls: ['./confirmation.component.css']
})
export class ConfirmationComponent implements OnInit {

  public isActive: boolean = false;
  public readOnly: boolean = true;
  public data: any = null;
  constructor() { }

  ngOnInit() {
  }

  public action(flag: boolean, type: Tflag, data: any) {

    if (flag) {
      this.isActive = flag;
      if (type === Tflag.VIEW) {
        this.readOnly = true
        this.data = data;
      } else if (type === Tflag.EDIT) {
        this.readOnly = false;
      }
    } else {
      this.isActive = flag;
      this.readOnly = true;
      this.data = data;

    }
  }

}
