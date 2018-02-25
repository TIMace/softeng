import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ApplicationRef } from '@angular/core';

import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import { AppRoutingModule } from './/app-routing.module';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { RegisterParentComponent } from './register-parent/register-parent.component';
import { RegisterProviderComponent } from './register-provider/register-provider.component';
import { SearchComponent } from './search/search.component';
import { MapComponent } from './map/map.component';
import { ActivityComponent } from './activity/activity.component';
import { AdminLoginComponent } from './admin-login/admin-login.component';
import { AdminPanelComponent } from './admin-panel/admin-panel.component';
import { PanelComponent } from './panel/panel.component';
import { PersonalInfoComponent } from './personal-info/personal-info.component';
import { EventsPresentComponent } from './events-present/events-present.component';
import { EventsPastComponent } from './events-past/events-past.component';
import { CreateActivityComponent } from './create-activity/create-activity.component';


import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatNativeDateModule} from '@angular/material';
import {MatFormFieldModule} from '@angular/material/form-field';



// Material
import { 
  MatSliderModule,
  MatSidenavModule, 
  MatRadioModule,
  MatDialogModule,
  MatTooltipModule,
  MatIconModule,
  MatButtonModule,
 } from '@angular/material';

//  MAP
import { AgmCoreModule } from '@agm/core';

// Services
import { CategoriesService } from './categories.service';
import { MapService } from './map.service';
import { EventService } from './event.service';
import { UserDetailsService } from './user-details.service';
import { WalletComponent } from './wallet/wallet.component';
import { EditActivityComponent } from './edit-activity/edit-activity.component';


@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    HomeComponent,
    LoginComponent,
    RegisterComponent,
    ResetPasswordComponent,
    RegisterParentComponent,
    RegisterProviderComponent,
    SearchComponent,
    MapComponent,
    ActivityComponent,
    PersonalInfoComponent,
    EventsPresentComponent,
    EventsPastComponent,
    AdminLoginComponent,
    AdminPanelComponent,
    PanelComponent,
    CreateActivityComponent,
    WalletComponent,
    EditActivityComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatSliderModule,
    MatSidenavModule,
    MatRadioModule,
    MatDialogModule,
    MatTooltipModule,
    MatIconModule,
    MatButtonModule,
    AgmCoreModule.forRoot({
      apiKey: "AIzaSyC-2M4YYjFXikW0RagBCfh6yxSgrTpplqw",
      libraries: ["places"]
    }),
    HttpClientModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatFormFieldModule
  ],
  entryComponents: [MapComponent],
  providers: [CategoriesService, MapService, EventService,UserDetailsService, MatNativeDateModule],
  bootstrap: [AppComponent]
})
export class AppModule { }
