import { Component, OnInit } from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule, FormBuilder, Validators, FormControl, AbstractControl } from '@angular/forms';
import { UserDetailsService } from '../user-details.service';


@Component({
  selector: 'app-register-parent',
  templateUrl: './register-parent.component.html',
  styleUrls: ['./register-parent.component.css']
})
export class RegisterParentComponent implements OnInit {

  formRegisterParent: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    public userDetailsService: UserDetailsService,
  ) { }

  doRegisterProvider() {
    console.log(this.formRegisterParent.value);
    this.userDetailsService.registerParent(this.formRegisterParent.value).
      subscribe(
        data => {
          if (data) {
            alert("Η εγγραφή χρήστη ολοκληρώθηκε!")
            // this.router.navigate(['']);
          }
          else {
            alert("Η εγγραφή χρήστη απέτυχε!")
          }
        }
      );
  }

  pass: String;
  conf_pass: String;
  
  ngOnInit() {
    this.formRegisterParent = this.formBuilder.group({
      parent_name: this.parent_name,
      parent_lastname: this.parent_lastname,
      parent_location: this.parent_location,
      parent_phone: this.parent_phone,
      parent_username: this.parent_username,
      parent_email: this.parent_email,
      parent_password: this.parent_password,
      parent_confirm_password: this.parent_confirm_password,
    }, { validator: this.matchingPasswords('parent_password', 'parent_confirm_password') });
  }

  parent_name = new FormControl("Λεωνίδας", Validators.required);
  parent_lastname = new FormControl("Παπαντωνίου", Validators.required);
  parent_location = new FormControl("", Validators.required);
  parent_phone = new FormControl("", Validators.required);
  parent_username = new FormControl("LeoPapa", Validators.required);
  parent_email = new FormControl("", [Validators.required, Validators.email]);
  parent_password = new FormControl("", Validators.required);
  parent_confirm_password = new FormControl("", Validators.required);

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
