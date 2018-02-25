import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import {HttpClient} from '@angular/common/http';
import {HttpErrorResponse} from '@angular/common/http';
import { HttpParams, HttpHeaders, HttpRequest } from '@angular/common/http';
import { Http, Response, Headers, RequestOptions } from '@angular/http'; 
import 'rxjs/add/operator/map'
import { Subject } from 'rxjs/Subject';
import {server_addr} from './server_addr'

@Injectable()
export class UserDetailsService {
  userType : String;
  userDetails : userDetailsObj;
  public editMode : String; //"edit" or "create"
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
    var subject = new Subject<any>();
    if (utype === "Parent") {
        this.httpClient.get(
          `${server_addr}/user/${uname}/${passwd}`
        ).subscribe((data:parentDetailsObj)=>
          {if ( data === null){
            this.userDetails.loginSuccess = false;
          }
        else{
          this.userType = utype;
          this.userDetails = this.parent2user(data)
          this.userDetails.loginSuccess = true;
        }
      subject.next(this.userDetails)})
    }
    else if (utype === "Provider"){
      this.httpClient.get(
        `${server_addr}/provider/${uname}/${passwd}`
      ).subscribe((data:providerDetailsObj)=>
        {if ( data === null){
          this.userDetails.loginSuccess = false;
        }
      else{
        this.userType = utype;
        this.userDetails = this.provider2user(data)
        this.userDetails.loginSuccess = true;
      }
    subject.next(this.userDetails)})
    }
    // return of(this.getDetails())
    return subject.asObservable()
  }

  // παίρνει ένα object τύπου userDetailsObj
  registerParent(detailsObj){
    var subject = new Subject<any>();
    var userDetails = new HttpParams()
    .set('username', ""+detailsObj.parent_username)
    .set('password', ""+detailsObj.parent_password)
    .set('email', ""+detailsObj.parent_email)
    .set('fname', ""+detailsObj.parent_name)
    .set('lname', ""+detailsObj.parent_lastname)
    .set('address', ""+detailsObj.parent_location)
    .set('phone_num', ""+detailsObj.parent_phone);
    this.httpClient.post(
      `${server_addr}/user`,
      userDetails.toString(),
      {
        headers: new HttpHeaders()
          .set('Content-Type', 'application/x-www-form-urlencoded')
      
      }
    ).subscribe(
      (data:any)=>{
        console.log(data)
        if (data==null || data.hasOwnProperty("error")){
          subject.next(false)
        }
        else{
          subject.next(true)
        }

      },
      (err: HttpErrorResponse) => {
        if (err.error instanceof Error) {
          console.log("Client-side error occured.");
        } else {
          console.log("Server-side error occured.");
        }
        subject.next(false)
      }
    )
    return subject;
  }

  registerProvider(detailsObj){
    var subject = new Subject<any>();
    var userDetails = new HttpParams()
    .set('username', ""+detailsObj.username)
    .set('password', ""+detailsObj.password)
    .set('email', ""+detailsObj.email)
    .set('fname', ""+detailsObj.name)
    .set('lname', ""+detailsObj.lastname)
    .set('cname', ""+detailsObj.company)
    .set('ssn', ""+detailsObj.afm)
    .set('baccount', ""+detailsObj.account)
    .set('address', ""+detailsObj.location)
    .set('phone_num', ""+detailsObj.phone);
    this.httpClient.post(
      `${server_addr}/provider`,
      userDetails.toString(),
      {
        headers: new HttpHeaders()
          .set('Content-Type', 'application/x-www-form-urlencoded')
      
      }
    ).subscribe(
      (data:any)=>{
        console.log(data)
        if (data==null || data.hasOwnProperty("error")){
          subject.next(false)
        }
        else{
          subject.next(true)
        }

      },
      (err: HttpErrorResponse) => {
        if (err.error instanceof Error) {
          console.log("Client-side error occured.");
        } else {
          console.log("Server-side error occured.");
        }
        subject.next(false)
      }
    )
    return subject;
  }

  getDetails(){
    return this.userDetails;
  }

  addCredits(accountNum,accountPass,money){
    // this.userDetails.credits+=money*100
    var subject = new Subject<any>();
    var creditDetails = new HttpParams()
    .set('username', ""+this.userDetails.username)
    .set('password', ""+this.userDetails.password)
    .set('amount',""+money*100)

    this.httpClient.post(
      `${server_addr}/user/add_credits`,
      creditDetails.toString(),
      {
        headers: new HttpHeaders()
          .set('Content-Type', 'application/x-www-form-urlencoded')
      
      })
      .subscribe((newUserData:parentDetailsObj) => 
      {
        if (newUserData==null || newUserData.hasOwnProperty("error")){
        subject.next(false)
        }
        else{
          this.userDetails = this.parent2user(newUserData)
          subject.next(true)
        }
      },
      (err: HttpErrorResponse) => {
        if (err.error instanceof Error) {
          console.log("Client-side error occured.");
        } else {
          console.log("Server-side error occured.");
        }
        subject.next(false)
      }
    )
    return subject.asObservable()
  }

  updateParentDetails(newParentDetails){
    var subject = new Subject();
    if (newParentDetails.password!= this.userDetails.password){
      subject.next(false)
    }
    if (newParentDetails.new_password == ""){
      newParentDetails.new_password = this.userDetails.password
    }
    var requestDetails = new HttpParams()
    .set('username', ""+newParentDetails.username)
    .set('password', ""+newParentDetails.password)
    .set('new_password', ""+newParentDetails.new_password)
    .set('email', ""+newParentDetails.email)
    .set('address', ""+newParentDetails.address)
    .set('phone_num', ""+newParentDetails.phoneΝum)
    this.httpClient.post(
      `${server_addr}/user/update`,
      requestDetails.toString(),
      {
        headers: new HttpHeaders()
          .set('Content-Type', 'application/x-www-form-urlencoded')
      
      })
      .subscribe(
        (newUserData:parentDetailsObj) => 
        {
          if (newUserData==null || newUserData.hasOwnProperty("error")){
          subject.next(false)
          }
          else{
            this.userDetails = this.parent2user(newUserData)
            subject.next(true)
          }
        },
        (err: HttpErrorResponse) => {
          if (err.error instanceof Error) {
            console.log("Client-side error occured.");
          } else {
            console.log("Server-side error occured.");
          }
          subject.next(false)
        }
      )
    
    return subject.asObservable()
  }

  updateProviderDetails(newProviderDetails){
    var subject = new Subject();
    if (newProviderDetails.password!= this.userDetails.password){
      subject.next(false)
    }
    if (newProviderDetails.new_password == ""){
      newProviderDetails.new_password = this.userDetails.password
    }
    var requestDetails = new HttpParams()
    .set('username', ""+newProviderDetails.username)
    .set('password', ""+newProviderDetails.password)
    .set('new_password', ""+newProviderDetails.new_password)
    .set('email', ""+newProviderDetails.email)
    .set('address', ""+newProviderDetails.address)
    .set('phone_num', ""+newProviderDetails.phoneΝum)
    .set('baccount', ""+newProviderDetails.bankAccount)
    this.httpClient.post(
      `${server_addr}/provider/update`,
      requestDetails.toString(),
      {
        headers: new HttpHeaders()
          .set('Content-Type', 'application/x-www-form-urlencoded')
      
      })
      .subscribe(
        (newProviderData:providerDetailsObj) => 
        {
          if (newProviderData==null || newProviderData.hasOwnProperty("error")){
          subject.next(false)
          }
          else{
            this.userDetails = this.provider2user(newProviderData)
            subject.next(true)
          }
        },
        (err: HttpErrorResponse) => {
          if (err.error instanceof Error) {
            console.log("Client-side error occured.");
          } else {
            console.log("Server-side error occured.");
          }
          subject.next(false)
        }
      )
    
    return subject.asObservable()
  }

  logout(){
    this.userType = "Anonymous";
    this.userDetails.id = "";
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

  // updateDetails(newDetails){
  //   this.userDetails.password = newDetails.passwd;
  //   this.userDetails.email = newDetails.email;
  //   this.userDetails.compName = "Lulz";
  //   this.userDetails.address = newDetails.address;
  //   this.userDetails.phoneNum = newDetails.phoneNum;
  //   this.userDetails.ssn = newDetails.ssn;
  //   this.userDetails.bankAccount = newDetails.bankAccount;
  // }

  parent2user(parentObj:parentDetailsObj){
    var res = new userDetailsObj();
    res.id = ""+parentObj.user_id;
    res.username = parentObj.username;
    res.password = parentObj.user_password;
    res.email = parentObj.user_email;
    res.firstName = parentObj.user_first_name;
    res.lastName = parentObj.user_last_name;
    res.compName = "";
    res.address = parentObj.user_address;
    res.phoneNum = parentObj.user_phone_num;
    res.ssn = "";
    res.bankAccount = "";
    res.credits = parentObj.user_credits;
    res.loginSuccess = false;

    return res;
  }

  provider2user(providerObj:providerDetailsObj){
    var res = new userDetailsObj();
    res.id = ""+providerObj.provider_id;
    res.username = providerObj.provider_username;
    res.password = providerObj.provider_password;
    res.email = providerObj.provider_email;
    res.firstName = providerObj.provider_first_name;
    res.lastName = providerObj.provider_last_name;
    res.compName = providerObj.provider_comp_name;
    res.address = providerObj.provider_address;
    res.phoneNum = providerObj.provider_phone_num;
    res.ssn = providerObj.provider_ssn;
    res.bankAccount = providerObj.provider_bank_account;
    res.credits = +providerObj.provider_credits;
    res.loginSuccess = false;

    return res;
  }

}

export class userDetailsObj{
  id = ""
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
  user_credits: number;
}

class providerDetailsObj{
  provider_id: String;
  provider_username: String;
  provider_password: String;
  provider_email: String;
  provider_join_date: String;
  provider_first_name: String;
  provider_last_name: String;
  provider_address: String;
  provider_phone_num: String;
  provider_credits: number;
  provider_bank_account: String;
  provider_ssn: String;
  provider_comp_name: String;
}
