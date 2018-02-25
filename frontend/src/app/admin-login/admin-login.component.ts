import { Component, OnInit } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {HttpErrorResponse} from '@angular/common/http';
import { HttpParams, HttpHeaders, HttpRequest } from '@angular/common/http';
import { Http, Response, Headers, RequestOptions } from '@angular/http'; 
import {server_addr} from '../server_addr'
import { Router } from '@angular/router';
import { UserDetailsService, userDetailsObj } from '../user-details.service';

@Component({
  selector: 'app-admin-login',
  templateUrl: './admin-login.component.html',
  styleUrls: ['./admin-login.component.css']
})
export class AdminLoginComponent implements OnInit {

  constructor(private httpClient:HttpClient, private router: Router, private userDetails:UserDetailsService) { }

  username:string;
  password:string;

  adminLogin() {
    this.httpClient.get(`${server_addr}/admin/${this.username}/${this.password}`)
    .subscribe(
      (data) => {
        if(data) {
          this.userDetails.userType = "Admin";
          this.userDetails.userDetails.password = this.password;
          this.userDetails.userDetails.username = this.username;
          this.router.navigate(["/admin-panel"]);
        }
        else {
          alert("Η είσοδος απέτυχε")
        }
      }
    )
  }




  ngOnInit() {
  }
 
}
