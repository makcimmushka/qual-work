import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './component/home';
import { ErrorInterceptor, JwtInterceptor } from './interceptor';
import { RequestsComponent } from './component/requests/requests.component';
import { RequestComponent } from './component/requests/request/request.component';
import { MyRequestComponent } from './component/my-requests/my-request';
import { MyRequestsComponent } from './component/my-requests';
import { MakeRequestComponent } from './component/make-request';
import { LoginComponent } from './component/login';
import { RegisterComponent } from './component/register';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    HomeComponent,
    RequestsComponent,
    RequestComponent,
    MyRequestsComponent,
    MyRequestComponent,
    MakeRequestComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: JwtInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorInterceptor,
      multi: true
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
