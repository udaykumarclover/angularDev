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
  fileToUpload: File = null;
  
  

  constructor(public rds:DataServiceService) {

    
   }

  ngOnInit() {
    

  }

  handleFileInput1(files: FileList) {
    this.fileToUpload = files.item(0);
    console.log(this.fileToUpload);
    const formData: FormData = new FormData();
    formData.append('fileKey', this.fileToUpload, this.fileToUpload.name);
    
    this.LcDetail.get('lcProForma').setValue(formData);
  }

}
