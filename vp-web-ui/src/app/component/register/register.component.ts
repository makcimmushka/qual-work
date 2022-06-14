import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

import { User } from '../../shared/interface';
import { AuthenticationService } from '../../service';
import { Role } from 'src/app/shared/enum';

@Component({
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  loading = false;
  submitted = false;
  error: string;

  Role: string[];

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly router: Router,
    private readonly authenticationService: AuthenticationService,
  ) {
    // redirect to home if already logged in
    if (this.authenticationService.currentUserValue) {
      this.router.navigate(['/']);
    }
  }

  ngOnInit() {
    this.Role = ['волонтер', 'користувач'];
    this.registerForm = this.formBuilder.group({
      phone: ['', [Validators.required]],
      password: ['', [Validators.required]],
      role: ['', [Validators.required]],
      name: ['', [Validators.required]],
    });
  }

  // convenience getter for easier access to the form fields
  get f() {
    return this.registerForm.controls;
  }

  onSubmit(): void {
    this.submitted = true;

    // stop here if form is invalid
    if (this.registerForm.invalid) {
      console.log(this.findInvalidControls()); // for debugging purposes
      return;
    }

    this.loading = true;
    this.authenticationService.register(this.buildUser(this.registerForm.value))
      .pipe(first())
      .subscribe(
        (data) => {
          this.router.navigate(['/login'], { queryParams: { registered: true } });
        },
        (error) => {
          this.error = error;
          this.loading = false;
        });
  }

  private buildUser(value: any): Omit<User, 'id'> {
    const user: Omit<User, 'id'> = {
      phone: value.phone,
      password: value.password,
      name: value.name,
      role: value.role === 'волонтер' ? Role.Volunteer : Role.User,
    };
    console.log(user);
    return user;
  }

  private findInvalidControls(): any[] {
    const invalid: any = [];
    const controls = this.registerForm.controls;

    for (const name in controls) {
      if (controls[name].invalid) {
        invalid.push({name, value: controls[name].value});
      }
    }

    return invalid;
  }
}
