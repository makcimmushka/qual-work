import { tap, first } from 'rxjs/operators';
import { User } from '../../shared/interface';
import { AuthenticationService, UserService } from '../../service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Role } from 'src/app/shared/enum';

@Component({
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  homeForm: FormGroup;
  loading = false;
  submitted = false;
  error: string;
  user: User;

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly router: Router,
    private readonly authenticationService: AuthenticationService,
    private readonly userService: UserService
  ) {
  }

  ngOnInit(): void {
    this.homeForm = this.formBuilder.group({
      phone: ['', [Validators.required]],
      name: ['', [Validators.required]],
      role: new FormControl({ value: '', disabled: true }, Validators.required),
    });
    this.userService
      .getUser(this.authenticationService.currentUserValue?.userId)
      .pipe(tap((user) => console.log(user)))
      .subscribe(user => {
        this.user = user;
        this.homeForm.get('phone').setValue(this.user.phone);
        this.homeForm.get('name').setValue(this.user.name);
        this.homeForm.get('role').setValue(this.mapRole(this.user.role));
      });
  }

  // convenience getter for easier access to the form fields
  get f() {
    return this.homeForm.controls;
  }

  mapRole(role: Role): string {
    if (role === Role.Admin) {
      return 'адмін';
    } else if (role === Role.User) {
      return 'користувач';
    } else {
      return 'волонтер';
    }
  }

  onSubmit(): void {
    this.submitted = true;

    // stop here if form is invalid
    if (this.homeForm.invalid) {
      console.log(this.findInvalidControls()); // for debugging purposes
      return;
    }

    this.loading = true;
    this.userService.updateUser({
      ...this.user,
      phone: this.homeForm.value.phone,
      name: this.homeForm.value.name
    })
      .pipe(first())
      .subscribe(
        (updatedUser) => {
          this.user = updatedUser;
          this.loading = false;
        },
        (error) => {
          this.error = error;
          this.loading = false;
        });
  }

  private findInvalidControls(): any[] {
    const invalid: any = [];
    const controls = this.homeForm.controls;

    for (const name in controls) {
      if (controls[name].invalid) {
        invalid.push({ name, value: controls[name].value });
      }
    }

    return invalid;
  }
}
