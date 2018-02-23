import { Component, OnInit } from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule, FormBuilder, Validators, FormControl } from '@angular/forms';
import { UserDetailsService, userDetailsObj } from '../user-details.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  formLogin: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    public userDetailsService: UserDetailsService,
    private router: Router
  ) {}

  // userType: String;
  Username: String;
  Password: String;
  UserType: String;

  doLogin(){

    this.Username = this.formLogin.get('username').value;
    this.Password = this.formLogin.get('password').value;
    this.UserType = this.formLogin.get('type').value;

    // console.log(this.userType);
    console.log(this.formLogin.value);

    var answer: userDetailsObj;
    answer = this.userDetailsService.login( this.Username, this.Password, this.UserType);
    if ( answer.loginSuccess )
      this.router.navigate(['']);
    else
      alert('Login Failed!');



  }

  ngOnInit() {
    this.formLogin = this.formBuilder.group({
      username: ['', Validators.required], //Validators.pattern('[a-z0-9.@]*')
      password: ['', Validators.required],
      type: ['parent', Validators.required],
    });
  }


  



}
