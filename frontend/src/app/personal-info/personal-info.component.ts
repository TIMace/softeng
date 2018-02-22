import { Component, OnInit } from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule, FormBuilder, Validators, FormControl } from '@angular/forms';

@Component({
  selector: 'app-personal-info',
  templateUrl: './personal-info.component.html',
  styleUrls: ['./personal-info.component.css']
})
export class PersonalInfoComponent implements OnInit {

  formRegister: FormGroup;

  provider: boolean;

  constructor(
    private formBuilder: FormBuilder
  ) { }

  ngOnInit() {

    this.provider = true;

    this.formRegister = this.formBuilder.group({
      name: ['Λεωνίδας', Validators.required],
      lastname: ['Παπαντωνίου', Validators.required],
      location: ['', Validators.required],
      phone: ['', Validators.required],
      company: ['', Validators.required],
      afm: ['', Validators.required],
      account: ['', Validators.required],
      username: ['Leo', Validators.required],
      email: ['', [Validators.required, Validators.email]], //Validators.pattern('[a-z0-9.@]*')
      password: ['', Validators.required],
      new_password: ['', Validators.required],
      confirm_password: ['', Validators.required],
    });
  }

}
