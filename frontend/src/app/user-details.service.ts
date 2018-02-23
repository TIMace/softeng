import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import {HttpClient} from '@angular/common/http';
import {HttpErrorResponse} from '@angular/common/http';
import { HttpParams, HttpHeaders, HttpRequest } from '@angular/common/http';
import { Http, Response, Headers, RequestOptions } from '@angular/http'; 
import 'rxjs/add/operator/map'
import { Subject } from 'rxjs/Subject';

@Injectable()
export class UserDetailsService {
  userType : String;
  userDetails : userDetailsObj;
  constructor(
    private httpClient:HttpClient
  ) { 
    this.userType = "Anonymous";
    this.userDetails = new userDetailsObj()
  }

  getUserType(): String {
    return this.userType;
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

  login(uname:String,passwd:String,utype:String){
    console.log("UserService ", uname, passwd, utype);
    this.userType = utype;
    var subject = new Subject<any>();
    if (utype === "Parent") {
        this.httpClient.get(
          `http://snf-806935.vm.okeanos.grnet.gr:8888/user/${uname}/${passwd}`
        ).subscribe((data:parentDetailsObj)=>
          {if ( data === null){
            this.userDetails.loginSuccess = false;
          }
        else{
          this.userType = utype;
          this.userDetails.username = uname;
          this.userDetails.password = passwd;
          this.userDetails.email = data.user_email;
          this.userDetails.firstName = data.user_first_name;
          this.userDetails.lastName = data.user_last_name;
          this.userDetails.compName = "";
          this.userDetails.address = data.user_address;
          this.userDetails.phoneNum = data.user_phone_num;
          this.userDetails.ssn = "";
          this.userDetails.bankAccount = "";
          this.userDetails.credits = data.user_credits;
          this.userDetails.loginSuccess = true;
        }
      subject.next(this.userDetails)})
    }
    else if (utype === "Provider"){

    }
    // return of(this.getDetails())
    return subject.asObservable()
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

class parentDetailsObj{
  user_id: String;
  username: String;
  user_password: String;
  user_email: String;
  user_join_date: String;
  user_first_name: String;
  user_last_name: String;
  user_address: String;
  user_phone_num: String;
  user_credits: null;
}
