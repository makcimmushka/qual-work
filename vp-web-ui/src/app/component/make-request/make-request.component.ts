import {
  Component, OnInit
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService, RequestService } from '../../service';
import { Request } from '../../shared/interface';
import { Role } from '../../shared/enum';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-make-request',
  templateUrl: './make-request.component.html',
  styleUrls: ['./make-request.component.scss']
})
export class MakeRequestComponent implements OnInit {
  makeRequestForm: FormGroup;
  error: string;
  submitted = false;

  constructor(
    private readonly authenticationService: AuthenticationService,
    private readonly requestService: RequestService,
    private readonly formBuilder: FormBuilder,
  ) {
  }

  ngOnInit(): void {
    this.makeRequestForm = this.formBuilder.group({
      phone: ['', []],
      need: ['', [Validators.required]],
      heading: ['', [Validators.required]],
      description: ['', [Validators.required]],
      city: ['', []],
      district: ['', []],
    });
  }

  // convenience getter for easier access to the form fields
  get f() {
    return this.makeRequestForm.controls;
  }

  mapRole(role: string): Role {
    if (role === 'адмін') {
      return Role.Admin;
    } else if (role === 'користувач') {
      return Role.User;
    } else {
      return Role.Volunteer;
    }
  }

  createRequest(): void {
    this.submitted = true;

    // stop here if form is invalid
    if (this.makeRequestForm.invalid) {
      console.log(this.findInvalidControls()); // for debugging purposes
      return;
    }

    const newRequest: Omit<Request, 'id'> = {
      phone: this.makeRequestForm.value.phone || null,
      need: this.makeRequestForm.value.need,
      heading: this.makeRequestForm.value.heading,
      description: this.makeRequestForm.value.description,
      city: this.makeRequestForm.value.city || null,
      district: this.makeRequestForm.value.district || null,
      userId: this.authenticationService.currentUserValue?.userId,
    };

    this.requestService.createRequest(newRequest)
      .pipe(first())
      .subscribe(
        (newRequest) => {
          console.log(newRequest);
          window.location.reload();
        },
        (error) => {
          this.error = error;
        });
  }

  private findInvalidControls(): any[] {
    const invalid: any = [];
    const controls = this.makeRequestForm.controls;

    for (const name in controls) {
      if (controls[name].invalid) {
        invalid.push({ name, value: controls[name].value });
      }
    }

    return invalid;
  }
}
