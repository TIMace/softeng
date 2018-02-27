import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import {HttpClient} from '@angular/common/http';
import {HttpErrorResponse} from '@angular/common/http';
import { HttpParams, HttpHeaders, HttpRequest } from '@angular/common/http';
import { Http, Response, Headers, RequestOptions } from '@angular/http'; 
import { server_addr} from '../server_addr'

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {

  formReset: FormGroup;

  constructor(private formBuilder: FormBuilder,private httpClient:HttpClient) { }

  doReset(){
    // console.log(event);
    console.log(this.formReset.value);
    this.httpClient.get(
      `${server_addr}/user_reset/${this.formReset.value.email}`
    ).subscribe(
    (data:any)=>{
      console.log(data)
      if (data==null || data.hasOwnProperty("error")){
        alert("Η επαναφορά κωδικού απέτυχε!")
      }
      else{
        alert("Η επαναφορά κωδικού ήταν επιτυχής!")
      }

    },
    (err: HttpErrorResponse) => {
      if (err.error instanceof Error) {
        console.log("Client-side error occured.");
      } else {
        console.log("Server-side error occured.");
      }
      // subject.next(false)2
    })
  }

  ngOnInit() {
    this.formReset = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

}
