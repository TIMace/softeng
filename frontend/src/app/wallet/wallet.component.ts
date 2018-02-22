import { Component, OnInit } from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule, FormBuilder, Validators, FormControl } from '@angular/forms';

@Component({
  selector: 'app-wallet',
  templateUrl: './wallet.component.html',
  styleUrls: ['./wallet.component.css']
})
export class WalletComponent implements OnInit {
  
  payment : any;
  paymentBool = false;
  formRegister: FormGroup;

  constructor(
    private formBuilder: FormBuilder
  ) { }

  ngOnInit() {
    this.formRegister = this.formBuilder.group({
      cardNumber: ['', Validators.required],
      password: ['', Validators.required],
      amount: ['50€', Validators.required]
      });
  }
  onPayment() {
    this.payment = '';
    this.paymentBool = true;
  }

}
