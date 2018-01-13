import { Component, OnInit } from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule, FormBuilder, Validators, FormControl } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  formLogin: FormGroup;

  constructor(
    private formBuilder: FormBuilder
  ) {}

  doLogin(){
    console.log(event);
    console.log(this.formLogin.value);
  }

  ngOnInit() {
    this.formLogin = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]], //Validators.pattern('[a-z0-9.@]*')
      password: ['', Validators.required],
    });
  }

}
