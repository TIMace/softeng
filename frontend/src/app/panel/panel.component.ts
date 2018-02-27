import { Component, OnInit } from '@angular/core';
import { UserDetailsService, userDetailsObj } from '../user-details.service';
import { HttpClient } from '@angular/common/http';
import { HttpErrorResponse } from '@angular/common/http';
import { HttpParams, HttpHeaders, HttpRequest } from '@angular/common/http';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { server_addr } from '../server_addr'


@Component({
  selector: 'app-panel',
  templateUrl: './panel.component.html',
  styleUrls: ['./panel.component.css']
})
export class PanelComponent implements OnInit {

  constructor(
    public userDetailsService: UserDetailsService,
    private httpClient: HttpClient
  ) { }

  show: number;
  show_more: boolean;

  selected_personal_info() {
    this.show = 1;
  }

  selected_present_events() {
    this.show = 2;
  }

  selected_past_events() {
    this.show = 3;
  }

  create_event() {
    this.show = 4;
  }

  clearPoints() {
    var usr = this.userDetailsService.userDetails.username;
    var psw = this.userDetailsService.userDetails.password;
    var eventPayment = new HttpParams()
      .set('username', '' + usr)
      .set('password', '' + psw);
    this.httpClient.get(`${server_addr}/provider/credits/${usr}/${psw}`,
      {
        headers: new HttpHeaders()
          .set('Content-Type', 'application/x-www-form-urlencoded')
      }
    )
      .subscribe(
        (data: any) => {
          // console.log("AMOUNTTTT")
          // console.log(this.eventId)
          // console.log(data);
          if (data == null) {
            alert("Error")
          }
          else {
            alert("Provider Paid Successfully");
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
    this.show = 1;
    this.show_more = false;
  }

}

