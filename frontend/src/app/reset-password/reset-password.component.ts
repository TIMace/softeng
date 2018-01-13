import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {

  formReset: FormGroup;

  constructor(private formBuilder: FormBuilder) { }

  doReset(){
    console.log(event);
    console.log(this.formReset.value);
  }

  ngOnInit() {
    this.formReset = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]], //Validators.pattern('[a-z0-9.@]*')
      type: ['', Validators.required],
    });
  }

}
