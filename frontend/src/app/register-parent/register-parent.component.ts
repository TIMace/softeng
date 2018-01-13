import { Component, OnInit } from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule, FormBuilder, Validators, FormControl } from '@angular/forms';


@Component({
  selector: 'app-register-parent',
  templateUrl: './register-parent.component.html',
  styleUrls: ['./register-parent.component.css']
})
export class RegisterParentComponent implements OnInit {

  formRegister: FormGroup;

  constructor(
    private formBuilder: FormBuilder
  ) {}

  doRegister(){
    console.log(event);
    console.log(this.formRegister.value);
  }

  ngOnInit() {

    this.formRegister = this.formBuilder.group({
      name: ['Λεωνίδας', Validators.required],
      lastname: ['Παπαντωνίου', Validators.required],
      location: ['', Validators.required],
      phone: ['', Validators.required],
      username: ['Leo', Validators.required],
      email: ['', [Validators.required, Validators.email]], //Validators.pattern('[a-z0-9.@]*')
      password: ['', Validators.required],
      confirm_password: ['', Validators.required],
    });

  }

}
