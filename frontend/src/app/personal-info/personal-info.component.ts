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

  userDetails = this.userDetailsService.getDetails();

  ngOnInit() {

    this.formUpdate = this.formBuilder.group({
      name: [this.userDetails.firstName],
      lastname: [this.userDetails.lastName],
      location: [this.userDetails.address, Validators.required],
      phone: [this.userDetails.phoneNum, Validators.required],
      company: [this.userDetails.compName],
      afm: [this.userDetails.ssn],
      account: [this.userDetails.bankAccount, Validators.required],
      username: [this.userDetails.username],
      email: [this.userDetails.email, [Validators.required, Validators.email]],
      credits: [this.userDetails.credits],
      password: [''],
      new_password: [''],
      confirm_password: [''],
    });
  }

}
