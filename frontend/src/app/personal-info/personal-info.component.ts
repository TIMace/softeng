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

  formUpdate: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    public userDetailsService: UserDetailsService
  ) { }

  doUpdate() {
    console.log(this.formUpdate.value);
    this.userDetailsService.updateParentDetails(this.formUpdate.value).
      subscribe(
      data => {
        if (data) {
          alert("Η επεξεργασία στοιχείων ολοκληρώθηκε με επιτυχία!")
          // this.router.navigate(['']);
        }
        else {
          alert("Η επεξεργασία στοιχείων απέτυχε!")
        }
      }
      );
  }

  userDetails: userDetailsObj;
  firstname: String;
  lastname: String;
  company: String;
  afm: String;
  username: String;
  credits: number;

  ngOnInit() {

    this.userDetails = this.userDetailsService.getDetails();

    this.firstname = this.userDetails.firstName;
    this.lastname = this.userDetails.lastName;
    this.company = this.userDetails.compName;
    this.afm = this.userDetails.ssn;
    this.username = this.userDetails.username;
    this.credits = this.userDetails.credits;


    this.formUpdate = this.formBuilder.group({
      firstname: [{ value: this.userDetails.firstName, disabled: true }],
      lastname: [{ value: this.userDetails.lastName, disabled: true }],
      location: [this.userDetails.address, Validators.required],
      phone: [this.userDetails.phoneNum, Validators.required],
      company: [{ value: this.userDetails.compName, disabled: true }],
      afm: [{ value: this.userDetails.ssn, disabled: true }],
      account: [this.userDetails.bankAccount, Validators.required],
      username: [{ value: this.userDetails.username, disabled: true }],
      email: [this.userDetails.email, [Validators.required, Validators.email]],
      credits: [{ value: this.userDetails.credits, disabled: true }],
      password: ['', Validators.required],
      new_password: [''],
      confirm_password: [''],
    }, { validator: this.matchingPasswords('new_password', 'confirm_password') });
  }

  matchingPasswords(passwordKey: string, passwordConfirmationKey: string) {
    return (group: FormGroup) => {
      let passwordInput = group.controls[passwordKey];
      let passwordConfirmationInput = group.controls[passwordConfirmationKey];
      if (passwordInput.value !== passwordConfirmationInput.value) {
        return passwordConfirmationInput.setErrors({ notEquivalent: true })
      }
    }
  }

}
