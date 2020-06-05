import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TitleService } from 'src/app/services/titleservice/title.service';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { PersonalDetailsService } from 'src/app/services/personal-details/personal-details.service';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  public searchForm: FormGroup;
  public title: string = "Dashboard";
  public username: string = "";
  public isReferrer: boolean = false;
  public isCustomer: boolean = false;
  public isBank: boolean = false;
  public parentURL: string = "";
  public subURL: string = "";

  constructor(public fb: FormBuilder, public titleService: TitleService, public psd: PersonalDetailsService, public activatedRoute:ActivatedRoute, public router:Router) {
    let userId = sessionStorage.getItem('userID');
    this.getPersonalDetails(userId);
    if (userId.startsWith('RE')) {
      this.isReferrer = true;
    } else if (userId.startsWith('BC') || userId.startsWith('CU')) {
      this.isReferrer = false;
      this.isCustomer = true;
      this.isBank = false;
    } else {
      this.isReferrer = false;
      this.isCustomer = false;
      this.isBank = true;
    }

    this.activatedRoute.parent.url.subscribe((urlPath) => {
      this.parentURL = urlPath[urlPath.length - 1].path;
    });
    this.activatedRoute.parent.parent.url.subscribe((urlPath) => {
      this.subURL = urlPath[urlPath.length - 1].path;
    })
  }

  ngOnInit() {

    this.searchForm = this.fb.group({
      searchText: ['']
    });

    this.titleService.titleMessage.subscribe(title => this.title = title);
    this.titleService.userMessage.subscribe(username => this.username = username);
    //this.titleService.loader.subscribe(flag => this.loading = flag);
    //this.titleService.quote.subscribe(flag=>this.isQuote=flag);
  }

  search(): void {

  }

  public getPersonalDetails(userID: string) {
    this.titleService.loading.next(true);
    this.psd.getPersonalDetails(userID)
      .subscribe(
        (response) => {
          let responseData = JSON.parse(JSON.stringify(response));
          let personalDetails = responseData.data;

          this.username = personalDetails.firstName + " " + personalDetails.lastName;
          this.titleService.changeUserName(this.username);
          this.titleService.loading.next(false);
        },
        (error) => {
          this.titleService.loading.next(false);
        }
      )
  }  

}
