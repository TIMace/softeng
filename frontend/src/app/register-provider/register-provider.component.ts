import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';

@Component({
  selector: 'app-register-provider',
  templateUrl: './register-provider.component.html',
  styleUrls: ['./register-provider.component.css']
})
export class RegisterProviderComponent implements OnInit {
  formRegisterProvider: FormGroup;

  constructor(private formBuilder: FormBuilder) { }

  doRegisterProvider(){
    console.log(this.formRegisterProvider.value);
  }

  ngOnInit() {
    this.formRegisterProvider = this.formBuilder.group({
      name: this.name,
      lastname: this.lastname,
      location: this.location,
      phone: this.phone,
      company: this.company,
      afm: this.afm,
      account: this.account,
      username: this.username,
      email: this.email,
      password: this.password,
      confirm_password: this.confirm_password,
    }, { validator: this.matchingPasswords('password', 'confirm_password')} );
  }

  matchingPasswords(passwordKey: string, passwordConfirmationKey: string) {
    return (group: FormGroup) => {
      let passwordInput = group.controls[passwordKey];
      let passwordConfirmationInput = group.controls[passwordConfirmationKey];
      if (passwordInput.value !== passwordConfirmationInput.value) {
        return passwordConfirmationInput.setErrors({notEquivalent: true})
      }
    }
  }

  name = new FormControl("Λεωνίδας", Validators.required);
  lastname = new FormControl("Παπαντωνίου", Validators.required);
  location = new FormControl("", Validators.required);
  phone = new FormControl("", Validators.required);
  company = new FormControl("", Validators.required);
  afm = new FormControl("", Validators.required);
  account = new FormControl("", Validators.required);
  username = new FormControl("LeoPapa", Validators.required);
  email = new FormControl("", [Validators.required, Validators.email]);
  password = new FormControl("", Validators.required);
  confirm_password = new FormControl("", Validators.required);


}