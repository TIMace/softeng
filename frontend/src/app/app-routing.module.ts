import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { SearchComponent } from './search/search.component';
import { ActivityComponent } from './activity/activity.component';
import { PanelComponent } from './panel/panel.component';
import { PersonalInfoComponent } from './personal-info/personal-info.component';
import { AdminLoginComponent } from './admin-login/admin-login.component';
import { AdminPanelComponent } from './admin-panel/admin-panel.component';
import { CreateActivityComponent } from './create-activity/create-activity.component';
import { WalletComponent } from './wallet/wallet.component';
import { EventsPresentComponent } from './events-present/events-present.component';
import { EventsPastComponent } from './events-past/events-past.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'register',
    component: RegisterComponent
  },
  {
    path: 'login/reset-password',
    component: ResetPasswordComponent
  },
  {
    path: 'search',
    component: SearchComponent
  },
  {
    path: 'activity/:id',
    component: ActivityComponent
  },
  {
    path: 'panel',
    component: PanelComponent,
    children: [
      {
        path: '',
        component: EventsPresentComponent
      },
      {
        path: '',
        component: EventsPastComponent
      }
    ]
  },
  {
    path: 'admin',
    component: AdminLoginComponent
  },
  {
    path: 'admin-panel',
    component: AdminPanelComponent
  },
  {
    path: 'create-activity',
    component: CreateActivityComponent
  },
  {
    path: 'wallet',
    component: WalletComponent
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes),
    RouterModule
  ],
  exports: [RouterModule],
  declarations: []
})

export class AppRoutingModule { }
