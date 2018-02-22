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
    component: PanelComponent
  },
  {
    path: 'panel_parent/personal_info',
    component: PersonalInfoComponent
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
