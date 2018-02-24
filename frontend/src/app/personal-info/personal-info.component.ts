import { Component, OnInit } from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule, FormBuilder, Validators, FormControl } from '@angular/forms';

//Services
import { UserDetailsService } from '../user-details.service';
import { userDetailsObj } from '../user-details.service';

@Component({
  selector: 'app-personal-info',
  templateUrl: './personal-info.component.html',
  styleUrls: ['./personal-info.component.css']
})
export class PersonalInfoComponent implements OnInit {

  formRegister: FormGroup;

  provider: boolean;

  constructor(
    private formBuilder: FormBuilder,
    public userDetailsService: UserDetailsService
  ) { }

  userDetails = this.userDetailsService.getDetails();

  ngOnInit() {

    this.provider = true;

    //TO DO
    //CREATE 2 FORMES WITH IF THEN ELSE STATEMENT
    // 1 FORM WHEN USER IS LOGGED IN 
    // 1 FORM FOR PARENT
    // CHANGE HTML ACCORDINGLY


    this.formRegister = this.formBuilder.group({
      name: [this.userDetails.firstName, Validators.required],
      lastname: [this.userDetails.lastName, Validators.required],
      location: [this.userDetails.address, Validators.required],
      phone: [this.userDetails.phoneNum, Validators.required],
      company: [this.userDetails.compName, Validators.required],
      afm: [this.userDetails.ssn, Validators.required],
      account: [this.userDetails.bankAccount, Validators.required],
      username: [this.userDetails.username, Validators.required],
      email: [this.userDetails.email, [Validators.required, Validators.email]],
      credits: [this.userDetails.credits, [Validators.required]], //Validators.pattern('[a-z0-9.@]*')
      password: [this.userDetails.password, Validators.required],
      new_password: ['', Validators.required],
      confirm_password: ['', Validators.required],
    });
  }

}
