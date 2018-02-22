import { Component, OnInit } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {HttpErrorResponse} from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { HttpParams, HttpHeaders, HttpRequest } from '@angular/common/http';
import { Http, Response, Headers, RequestOptions } from '@angular/http'; 

@Component({
  selector: 'app-admin-panel',
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.css']
})
export class AdminPanelComponent implements OnInit {

  username:string = '';
  providerUsername:string = '';
  radio:string = 'parent';

  constructor(private httpClient:HttpClient) { }
  onNameKeyUp(event:any) {
    // console.log(event.target.value);
    this.username = event.target.value;
      // console.log(this.radio);
  }

  onNameKeyUpProvider(event:any) {
    // console.log(event.target.value);
    this.providerUsername = event.target.value;
      // console.log(this.radio);    
  }




 // const userDetails = new HttpParams()
    // .set('username', 'Malakantreas')
    // .set('password', 'Malakas')
    // .set('email', 'phivos93@yahoo.gr')
    // .set('fname', 'Malakas')
    // .set('lname', 'Antreas')
    // .set('address', 'GamwToSpiti')
    // .set('phone_num', '6936999999');


  createUser(userDetails) {
    this.httpClient.post('http://snf-806935.vm.okeanos.grnet.gr:8888/user',
      userDetails.toString(),
      {
        headers: new HttpHeaders()
          .set('Content-Type', 'application/x-www-form-urlencoded')
      }
    )    
    .subscribe(
      (data:any) => {
        alert("New User Created Succesfully");
      },
      (err: HttpErrorResponse) => {
        if (err.error instanceof Error) {
          console.log("Client-side error occured.");
        } else {
          console.log("Server-side error occured.");
        }
      }
    )
  }
  
  //decision depends on radio button
  lock(){
    if (this.radio == 'parent'){this.lockUser(this.username)}
    else{this.lockProvider(this.username)}

  }

  //decision depends on radio button
  unlock(){
    if (this.radio == 'parent'){this.unlockUser(this.username)}
    else{this.unlockProvider(this.username)}
  }


  lockUser(username:string) {
    var userLock = new HttpParams()
    .set(/*unset active attribute of user with username*/);
    this.httpClient.put('http://snf-806935.vm.okeanos.grnet.gr:8888/user',
      userLock.toString(),
      {
        headers: new HttpHeaders()
        .set('Content-Type', 'application/x-www-form-urlencoded')
      }
    )
    .subscribe(
      (data:any) => {
        alert("User Locked Succesfully");
      },
      (err: HttpErrorResponse) => {
        if (err.error instanceof Error) {
          console.log("Client-side error occured.");
        } else {
          console.log("Server-side error occured.");
        }
      }
    )
  }

  lockProvider(username:string) {
    var providerLock = new HttpParams()
    .set(/*unset active attribute of provider with username*/);
    this.httpClient.put('http://snf-806935.vm.okeanos.grnet.gr:8888/provider',
      providerLock.toString(),
      {
        headers: new HttpHeaders()
        .set('Content-Type', 'application/x-www-form-urlencoded')
      }
    )
    .subscribe(
      (data:any) => {
        alert("Provider Locked Succesfully");
      },
      (err: HttpErrorResponse) => {
        if (err.error instanceof Error) {
          console.log("Client-side error occured.");
        } else {
          console.log("Server-side error occured.");
        }
      }
    )
  }

  unlockUser(username:string) {
    var userUnLock = new HttpParams()
    .set(/*set active attribute of user with username*/);
    this.httpClient.put('http://snf-806935.vm.okeanos.grnet.gr:8888/user',
      userUnLock.toString(),
      {
        headers: new HttpHeaders()
        .set('Content-Type', 'application/x-www-form-urlencoded')
      }
    )
    .subscribe(
      (data:any) => {
        alert("User Unlocked Succesfully");
      },
      (err: HttpErrorResponse) => {
        if (err.error instanceof Error) {
          console.log("Client-side error occured.");
        } else {
          console.log("Server-side error occured.");
        }
      }
    )
  }

  unlockProvider(username:string) {
    var providerUnLock = new HttpParams()
    .set(/*set active attribute of provider with username*/);
    this.httpClient.put('http://snf-806935.vm.okeanos.grnet.gr:8888/provider',
      providerUnLock.toString(),
      {
        headers: new HttpHeaders()
        .set('Content-Type', 'application/x-www-form-urlencoded')
      }
    )
    .subscribe(
      (data:any) => {
        alert("Provider Unlocked Succesfully");
      },
      (err: HttpErrorResponse) => {
        if (err.error instanceof Error) {
          console.log("Client-side error occured.");
        } else {
          console.log("Server-side error occured.");
        }
      }
    )
  }

  activateProvider(providerUsername:string) {
    this.radio = 'Provider';
    this.unlock();
  }

  ngOnInit() {
  }

}
