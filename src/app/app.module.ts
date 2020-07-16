import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { MatDatepickerModule } from '@angular/material/datepicker';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './default/login/login.component';
import { ForgotPasswordComponent } from './default/forgot-password/forgot-password.component';
import { PagenotfoundComponent } from './default/pagenotfound/pagenotfound.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown-angular7';
//import { ResetPasswordComponent } from './default/reset-password/reset-password/reset-password.component';
import { LoaderServiceService } from './services/loader/loader-service.service';
import { LoaderInterceptorService } from './services/interceptors/loader/loader-interceptor.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatNativeDateModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material'
import { SharedModule } from './modules/shared/shared.module';
import { CustomerCanActiveService } from './services/guards/CustomerCanActive.service';
import { BankCanActiveService } from './services/guards/BankCanActive.service';
import { UploadLcDetailsCanDeactivate } from './services/guards/UploadDetailsCanDeactivate';
import { CustomerLoginComponent } from './default/popups/customer-login/customer-login.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    ForgotPasswordComponent,
    PagenotfoundComponent,
    //ResetPasswordComponent,
    CustomerLoginComponent,
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgMultiSelectDropDownModule.forRoot(),
    BrowserAnimationsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    SharedModule
  ],
  providers: [MatDatepickerModule,
    LoaderServiceService,CustomerCanActiveService,BankCanActiveService,UploadLcDetailsCanDeactivate,
    { provide: HTTP_INTERCEPTORS, useClass: LoaderInterceptorService, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
