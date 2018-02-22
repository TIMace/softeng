import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import {HttpClient} from '@angular/common/http';
import {HttpErrorResponse} from '@angular/common/http';
import { HttpParams, HttpHeaders, HttpRequest } from '@angular/common/http';
import { Http, Response, Headers, RequestOptions } from '@angular/http'; 

@Injectable()
export class UserDetailsService {
  userType : String;
  userDetails : userDetailsObj;
  constructor(
    private httpClient:HttpClient
  ) { 
    this.userType = "Anonymous"
  }

  // login(uname,passwd,utype){
  //   if (["Anonymous","Parent","Provider"].includes(utype)){
  //     this.userType = utype;
  //     this.userDetails.username = uname
  //     this.userDetails.password = passwd;
  //     this.userDetails.email = "somemail@gmail.com";
  //     this.userDetails.firstName = "Bala";
  //     this.userDetails.lastName = "Faras";
  //     this.userDetails.compName = "Lulz";
  //     this.userDetails.address = "someaddress";
  //     this.userDetails.phoneNum = "21028384984930";
  //     this.userDetails.ssn = "15161616";
  //     this.userDetails.bankAccount = "1234567890";
  //     this.userDetails.credits = 5000;
  //     this.userDetails.loginSuccess = true

  //     return this.getDetails();
  //   }
  //   this.userDetails.loginSuccess = false;
  //   return this.getDetails();
  // }

  login(uname,passwd,utype){
    if (["Anonymous","Parent","Provider"].includes(utype)){

    }
  }

  registerParent(detailsObj){

  }

  registerProvider(){

  }

  getDetails(){
    return this.userDetails;
  }

  addCredits(accountNum,accountPass,money){
    this.userDetails.credits+=money*100
    return this.getDetails()
  }

  logout(){
    this.userType = "Anonymous";
    this.userDetails.username = ""
    this.userDetails.password = "";
    this.userDetails.email = "";
    this.userDetails.firstName = "";
    this.userDetails.lastName = "";
    this.userDetails.compName = "";
    this.userDetails.address = "";
    this.userDetails.phoneNum = "";
    this.userDetails.ssn = "";
    this.userDetails.bankAccount = "";
    this.userDetails.credits = 5000;
    this.userDetails.loginSuccess = false
  }

  updateDetails(newDetails){
    this.userDetails.password = newDetails.passwd;
    this.userDetails.email = newDetails.email;
    this.userDetails.compName = "Lulz";
    this.userDetails.address = newDetails.address;
    this.userDetails.phoneNum = newDetails.phoneNum;
    this.userDetails.ssn = newDetails.ssn;
    this.userDetails.bankAccount = newDetails.bankAccount;
  }

}

export class userDetailsObj{
  username:String = "";
  password:String = "";
  email:String = "";
  firstName:String = "";
  lastName:String = "";
  compName:String = "";
  address:String = "";
  phoneNum:String = "";
  ssn:String = "";
  bankAccount:String = "";
  credits:number = 0;
  loginSuccess:Boolean = false;
}
