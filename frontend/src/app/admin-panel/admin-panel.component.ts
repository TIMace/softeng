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
  temp:string = 'parent';

  constructor(private httpClient:HttpClient) { }
  // constructor(private _http: Http) { }
  onNameKeyUp(event:any) {
    console.log(event.target.value);
    this.username = event.target.value;
      console.log(this.temp);
    
  }


 // const params = new HttpParams()
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
  

  lockUser() {

  }

  lockProvider() {

  }

  ngOnInit() {
  }

}
