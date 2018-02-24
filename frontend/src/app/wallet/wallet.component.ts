import { Component, OnInit } from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule, FormBuilder, Validators, FormControl } from '@angular/forms';

// Services
import { UserDetailsService } from '../user-details.service';

@Component({
  selector: 'app-wallet',
  templateUrl: './wallet.component.html',
  styleUrls: ['./wallet.component.css']
})
export class WalletComponent implements OnInit {

  payment: any;
  paymentBool = false;
  formRegister: FormGroup;
  show: boolean = false;
  buttonName: any = 'Show';

  constructor(
    private formBuilder: FormBuilder,
    public userDetailsService: UserDetailsService
  ) { }

  userDetails = this.userDetailsService.getDetails();

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

  toggle() {
    this.show = !this.show;

    // CHANGE THE NAME OF THE BUTTON.
    if (this.show)
      this.buttonName = "Hide";
    else
      this.buttonName = "Show";
  }
}
