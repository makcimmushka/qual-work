import { NgModule } from '@angular/core';
import {
  RouterModule, Routes
} from '@angular/router';

import { HomeComponent } from './component/home';
import { LoginComponent } from './component/login';
import { MakeRequestComponent } from './component/make-request';
import { MyRequestsComponent } from './component/my-requests';
import { RegisterComponent } from './component/register';
import { RequestsComponent } from './component/requests';
import { AuthGuard } from './guard';

const routes: Routes = [
  { path: '', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'all-requests', component: RequestsComponent, canActivate: [AuthGuard] },
  { path: 'my-requests', component: MyRequestsComponent, canActivate: [AuthGuard] },
  { path: 'make-request', component: MakeRequestComponent, canActivate: [AuthGuard] },

  // otherwise redirect to home
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
