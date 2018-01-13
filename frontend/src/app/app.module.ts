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

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// Material
import { 
  MatSliderModule,
  MatSidenavModule, 
  MatRadioModule
 } from '@angular/material';

import { AgmCoreModule } from '@agm/core';
import { SearchComponent } from './search/search.component';
import { CategoriesService } from './categories.service';


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
    AgmCoreModule.forRoot({
      apiKey: "AIzaSyC-2M4YYjFXikW0RagBCfh6yxSgrTpplqw",
      libraries: ["places"]
    })
  ],
  providers: [CategoriesService],
  bootstrap: [AppComponent]
})
export class AppModule { }
