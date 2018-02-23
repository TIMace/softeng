import { Component, OnInit } from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule, FormBuilder, Validators, FormControl } from '@angular/forms';

@Component({
  selector: 'app-wallet',
  templateUrl: './wallet.component.html',
  styleUrls: ['./wallet.component.css']
})
export class WalletComponent implements OnInit {
  
  payment : number;
  paymentBool = false;
  formRegister: FormGroup;

  constructor(
    private formBuilder: FormBuilder
  ) { }

  ngOnInit() {
    this.formRegister = this.formBuilder.group({
      cardNumber: ['xxxx-xxxx-xxxx-xxxx', Validators.required],
      password: ['', Validators.required],
      amount: ['50€', Validators.required]
      });
  }
  onPayment() {
    this.payment = 0;
    this.paymentBool = true;
  }

}
