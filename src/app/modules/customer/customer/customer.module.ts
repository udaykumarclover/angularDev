import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { AccountStatusComponent } from 'src/app/nimai/acstatus/account-status/account-status.component';
import { UploadLCComponent } from 'src/app/nimai/transaction/upload-lc/upload-lc.component';
import { ActiveTransactionComponent } from 'src/app/nimai/transaction/active-transaction/active-transaction.component';
import { TenorPaymentComponent } from 'src/app/nimai/transaction/upload-lc/tenor-payment/tenor-payment.component';
import { ApplicantBeneficiaryComponent } from 'src/app/nimai/transaction/upload-lc/applicant-beneficiary/applicant-beneficiary.component';
import { OthersComponent } from 'src/app/nimai/transaction/upload-lc/others/others.component';
import { SuccessPopupComponent } from 'src/app/default/popups/success-popup/success-popup.component';
import { ErrorPopupComponent } from 'src/app/default/popups/error-popup/error-popup.component';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown-angular7';
import { MatDatepickerModule, MatNativeDateModule, MatFormFieldModule, MatInputModule, MatTableModule, MatPaginatorModule, MatIconModule } from '@angular/material';
import { SubscriptionComponent } from 'src/app/nimai/subscription/subscription.component';
import { KycDetailsComponent } from 'src/app/nimai/kyc-details/kyc-details.component';
import { BusinessDetailsComponent } from 'src/app/nimai/business-details/business-details.component';
import { PersonalDetailsComponent } from 'src/app/nimai/personal-details/personal-details.component';
import { DashboardComponent } from 'src/app/nimai/dashboard/dashboard.component';
import { SharedModule } from '../../shared/shared.module';
import { UploadLcDetailsCanDeactivate } from 'src/app/services/guards/UploadDetailsCanDeactivate';
import { ConfirmationComponent } from 'src/app/nimai/transaction/transactionTypes/confirmation/confirmation.component';
import { DiscountingComponent } from 'src/app/nimai/transaction/transactionTypes/discounting/discounting.component';
import { ConfirmAndDiscountComponent } from 'src/app/nimai/transaction/transactionTypes/confirm-and-discount/confirm-and-discount.component';
import { RefinancingComponent } from 'src/app/nimai/transaction/transactionTypes/refinancing/refinancing.component';
import { BankerComponent } from 'src/app/nimai/transaction/transactionTypes/banker/banker.component';
import { MyProfileComponent } from 'src/app/nimai/my-profile/my-profile.component';
import { ResetPasswordComponent } from 'src/app/default/reset-password/reset-password/reset-password.component';
import { ManageSubsidiaryComponent } from 'src/app/default/manage-subsidiary/manage-subsidiary.component';


const routes: Routes = [
  {
    path: "dsb",
    component: DashboardComponent,
    children: [
      { path: "", redirectTo: "/dsb/personal-details", pathMatch: "full" },
      {
        path: "personal-details", component: PersonalDetailsComponent,
        children: [
          { path: "success", component: SuccessPopupComponent },
          { path: "error", component: ErrorPopupComponent }
        ]
      },
      {
        path: "business-details", component: BusinessDetailsComponent,
        children: [
          { path: "success", component: SuccessPopupComponent },
          { path: "error", component: ErrorPopupComponent }
        ]
      },
      {
        path: "kyc-details", component: KycDetailsComponent,
        children: [
          { path: "success", component: SuccessPopupComponent },
          { path: "error", component: ErrorPopupComponent }
        ]
      },
      { path: "account-review", component: AccountStatusComponent },
      {
        path: "subscription", component: SubscriptionComponent,
        children: [
          { path: "success", component: SuccessPopupComponent },
          { path: "error", component: ErrorPopupComponent }
        ]
      },
      {
        path: "new-transaction", component: UploadLCComponent, canDeactivate:[UploadLcDetailsCanDeactivate],
        children: [
          { path: "success", component: SuccessPopupComponent },
          { path: "error", component: ErrorPopupComponent }
        ]
      },
      {
        path: "active-transaction", component: ActiveTransactionComponent,
        children: [
          { path: "success", component: SuccessPopupComponent },
          { path: "error", component: ErrorPopupComponent }
        ]
      },
      {
        path: "my-profile", component: MyProfileComponent,
        children: [
          { path: "success", component: SuccessPopupComponent },
          { path: "error", component: ErrorPopupComponent }
        ]
      },
      {
        path: "change-password", component: ResetPasswordComponent, children: [
          { path: "success", component: SuccessPopupComponent },
          { path: "error", component: ErrorPopupComponent }
        ]
      },
      {
        path: "manage-sub", component: ManageSubsidiaryComponent, children: [
          { path: "success", component: SuccessPopupComponent },
          { path: "error", component: ErrorPopupComponent }
        ]
      }
    ]
  },

 


]

@NgModule({
  declarations: [
    UploadLCComponent,
    TenorPaymentComponent,
    ApplicantBeneficiaryComponent,
    OthersComponent,
    ActiveTransactionComponent,
    ConfirmationComponent,
    DiscountingComponent,
    ConfirmAndDiscountComponent,
    RefinancingComponent,
    BankerComponent,

  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule,
    HttpClientModule,
    NgMultiSelectDropDownModule.forRoot(),
    MatDatepickerModule,
    MatNativeDateModule,
    MatFormFieldModule,
    MatInputModule,
    SharedModule,
    MatTableModule,
    MatPaginatorModule,
    MatIconModule
  ],
  exports: [
    UploadLCComponent,
    TenorPaymentComponent,
    ApplicantBeneficiaryComponent,
    OthersComponent,    
    ActiveTransactionComponent,    
    ConfirmationComponent,
    DiscountingComponent,
    ConfirmAndDiscountComponent,
    RefinancingComponent,
    BankerComponent,

    
  ]
})
export class CustomerModule { }
