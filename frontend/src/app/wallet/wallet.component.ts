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
  formWallet: FormGroup;
  show: boolean = false;
  buttonName: any = 'Show';

  constructor(
    private formBuilder: FormBuilder,
    public userDetailsService: UserDetailsService
  ) { }

  // userType: String;
  CardNumber: String;
  Password: String;
  Amount: Number;

  addPontous() {

    this.CardNumber = this.formWallet.get('cardNumber').value;
    this.Password = this.formWallet.get('password').value;
    this.Amount = this.formWallet.get('amount').value;

    console.log(this.formWallet.value);
    this.userDetailsService.addCredits(this.CardNumber, this.Password, this.Amount).
      subscribe(
        data => {
          console.log(data);
          if (data) {
            alert("Η συναλλαγή ήταν επιτυχής!")
            this.userDetails = this.userDetailsService.getDetails()
            // this.router.navigate(['']);
          }
          else{
            alert("Η συναλλαγή απέτυχε!")
          }
        }
      );
  }

  userDetails = this.userDetailsService.getDetails();

  ngOnInit() {
    this.formWallet = this.formBuilder.group({
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
