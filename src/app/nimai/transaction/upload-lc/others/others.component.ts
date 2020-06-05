import { Component, OnInit, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { DataServiceService } from 'src/app/services/upload-lc/data-service.service';

@Component({
  selector: 'app-others',
  templateUrl: './others.component.html',
  styleUrls: ['./others.component.css']
})
export class OthersComponent implements OnInit {
  
  @Input() public LcDetail:FormGroup;
  
  

  constructor(public rds:DataServiceService) {
    
   }

  ngOnInit() {
  }

}
