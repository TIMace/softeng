import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { HttpParams, HttpHeaders, HttpRequest } from '@angular/common/http';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { UserDetailsService } from '../user-details.service'


@Component({
  selector: 'app-admin-panel',
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.css']
})
export class AdminPanelComponent implements OnInit {

  username: String = '';
  providerUsername: String = '';
  radio: String = 'parent';

  temp: String;

  constructor(private httpClient: HttpClient, private adminDetails: UserDetailsService) { }
  onNameKeyUp(event: any) {
    // console.log(event.target.value);
    this.username = event.target.value;
    // console.log(this.radio);
  }

  onNameKeyUpProvider(event: any) {
    // console.log(event.target.value);
    this.providerUsername = event.target.value;
    // console.log(this.radio);    
  }

  // adminUsername = this.adminDetails.userDetails.username;
  // adminPassword = this.adminDetails.userDetails.password;

  //decision depends on radio button
  lock() {
    if (this.radio == 'parent') { this.lockUser(this.username) }
    else { this.lockProvider(this.username) }
  }

  // //decision depends on radio button
  unlock() {
    if (this.radio == 'parent') { this.unlockUser(this.username) }
    else { this.unlockProvider(this.username) }
  }


  lockUser(username: String) {
    var userLock = new HttpParams()
      .set('username', '' + this.adminDetails.userDetails.username)
      .set('password', '' + this.adminDetails.userDetails.password)
      .set('name', '' + this.username);
    this.httpClient.post('http://snf-806935.vm.okeanos.grnet.gr:8888/admin/usr_deactivate',
      userLock.toString(),
      {
        headers: new HttpHeaders()
          .set('Content-Type', 'application/x-www-form-urlencoded')
      }
    )
      .subscribe(
        (data: any) => {
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

  lockProvider(username: String) {
    var providerLock = new HttpParams()
      .set('username', '' + this.adminDetails.userDetails.username)
      .set('password', '' + this.adminDetails.userDetails.password)
      .set('name', '' + this.providerUsername);
    this.httpClient.put('http://snf-806935.vm.okeanos.grnet.gr:8888/admin/pr_deactivate',
      providerLock.toString(),
      {
        headers: new HttpHeaders()
          .set('Content-Type', 'application/x-www-form-urlencoded')
      }
    )
      .subscribe(
        (data: any) => {
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

  unlockUser(username: String) {
    var userUnLock = new HttpParams()
      .set('username', '' + this.adminDetails.userDetails.username)
      .set('password', '' + this.adminDetails.userDetails.password)
      .set('name', '' + this.username);
    this.httpClient.post('http://snf-806935.vm.okeanos.grnet.gr:8888/admin/usr_activate',
      userUnLock.toString(),
      {
        headers: new HttpHeaders()
          .set('Content-Type', 'application/x-www-form-urlencoded')
      }
    )
      .subscribe(
        (data: any) => {
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

  unlockProvider(username: String) {
    var providerUnLock = new HttpParams()
      .set('username', '' + this.adminDetails.userDetails.username)
      .set('password', '' + this.adminDetails.userDetails.password)
      .set('name', '' + this.username);
    this.httpClient.post('http://snf-806935.vm.okeanos.grnet.gr:8888/admin/pr_activate',
      providerUnLock.toString(),
      {
        headers: new HttpHeaders()
          .set('Content-Type', 'application/x-www-form-urlencoded')
      }
    )
      .subscribe(
        (data: any) => {
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

  activateProvider() {
  // activateProvider(providerUsername: String) {
    this.radio = 'Provider';
    this.unlock();
  }

  eventId;
  payEvent() {
    var eventPayment = new HttpParams()
      .set('username', '' + this.adminDetails.userDetails.username)
      .set('password', '' + this.adminDetails.userDetails.password)
      .set('ev_id', '' + this.eventId);
    this.httpClient.post('http://snf-806935.vm.okeanos.grnet.gr:8888/admin/pay_event',
      eventPayment.toString(),
      {
        headers: new HttpHeaders()
          .set('Content-Type', 'application/x-www-form-urlencoded')
      }
    )
      .subscribe(
        (data: any) => {
          console.log(data);
          if (data === null) {
            alert("Event is already paid")
          }
          else if (Number.isInteger(data)) {
            alert("Event Paid Successfully");
          }
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

  ngOnInit() {
  }

}
