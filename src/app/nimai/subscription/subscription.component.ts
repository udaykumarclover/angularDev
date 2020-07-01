import { Component, OnInit } from '@angular/core';
import { TitleService } from 'src/app/services/titleservice/title.service';
import { SubscriptionDetailsService } from 'src/app/services/subscription/subscription-details.service';
import { Subscription } from 'src/app/beans/subscription';
import { FormGroup, FormBuilder } from '@angular/forms';
import * as $ from '../../../assets/js/jquery.min';
import { NavigationExtras, Router,ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-subscription',
  templateUrl: './subscription.component.html',
  styleUrls: ['./subscription.component.css']
})
export class SubscriptionComponent implements OnInit {
  public loading = true;
  public isNew = true;
  public isOrder = false;
  public isPayment = false;
  public isPaymentSuccess = false;
  public title: string = "Subscription Details";
  public choosedPlan: Subscription = new Subscription();
  public paymentForm: FormGroup;
  public timeStamp = new Date();
  public parentURL: string = "";
  public subURL: string = "";
  constructor(public activatedRoute: ActivatedRoute, public titleService: TitleService, public subscriptionService: SubscriptionDetailsService, public fb: FormBuilder,public router: Router) {
    this.paymentForm = this.fb.group({});
    this.activatedRoute.parent.url.subscribe((urlPath) => {
      this.parentURL = urlPath[urlPath.length - 1].path;
    });
    this.activatedRoute.parent.parent.url.subscribe((urlPath) => {
      this.subURL = urlPath[urlPath.length - 1].path;
    })
  }

  ngOnInit() {
    this.titleService.changeTitle(this.title);
    this.getSubscriptionDetails();
    this.getPlan(sessionStorage.getItem("userID"));
  }
  subscriptionDetails = [];

  getSubscriptionDetails() {
    this.titleService.loading.next(true);
    this.subscriptionService.getSubscriptionDetails().subscribe(data => {
      this.subscriptionDetails = data.data;
      this.loading = false;
    }
    )
  }
  gotokyc(){
    alert("1")
    console.log("route----",`/${this.subURL}/${this.parentURL}/subscription`)
    this.router.navigate([`/${this.subURL}/${this.parentURL}/kyc-details`])
  }
  public choosePlan(plan: Subscription) {
    this.choosedPlan = plan;
    this.choosedPlan.userId = sessionStorage.getItem('userID');
    this.isNew = false;
    this.isOrder = true;
  }

  public payNow() {
    this.isNew = false;
    this.isOrder = false;
    this.isPayment = true;
    const sd = this;
    this.titleService.loading.next(true);
    $(document).ready(function () {
      $('.selection').show();
      $('.red').show();
      $('input[type="radio"]').click(function () {
        sd.loading = true;
        var inputValue = $(this).attr("value");
        if (inputValue == 'red') {
          $('.red').slideDown();
          $('.green').slideUp();
          this.titleService.loading.next(false);
        }
        else {
          this.titleService.loading.next(false);
          $('.red').slideUp();
          $('.green').slideDown();
        }
      });
    });
    this.titleService.loading.next(false);
  }

  public payment() {
    this.titleService.loading.next(true);
    this.subscriptionService.saveSplan(sessionStorage.getItem('userID'), this.choosedPlan)
      .subscribe(
        response => {
          this.isNew = false;
          this.isOrder = false;
          this.isPayment = false;
          this.isPaymentSuccess = true;
          this.titleService.loading.next(false);
        },
        (error) => {
          this.titleService.loading.next(false);
        }
      )
  }


  public getPlan(userID: string) {

    this.subscriptionService.getPlanByUserId(userID)
      .subscribe(
        response => {

          this.choosedPlan = JSON.parse(JSON.stringify(response)).data[0];
          console.log(this.choosedPlan)

          this.isNew = false;
          this.isOrder = false;
          this.isPayment = false;
          this.isPaymentSuccess = true;
          this.titleService.loading.next(false);

        },
        (error) => {
          this.titleService.loading.next(false);
        }
      )
  }

}
