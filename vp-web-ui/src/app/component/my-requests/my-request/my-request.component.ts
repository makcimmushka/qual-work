import { User } from '../../../shared/interface/user';
import { Request } from '../../../shared/interface';
import {
  Component, EventEmitter, Input, OnInit, Output
} from '@angular/core';
import { AuthenticationService, RequestService } from '../../../service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Role } from 'src/app/shared/enum';

@Component({
  selector: 'app-my-request',
  templateUrl: './my-request.component.html',
  styleUrls: ['./my-request.component.scss']
})
export class MyRequestComponent implements OnInit {
  @Input() request: Request;
  @Input() user: User;
  @Output() changedRequest = new EventEmitter<string>();
  updateRequestForm: FormGroup;
  submitted = false;
  error: string;

  actualNeeds: string[] = ['житло 🏘️', 'їжа 🍲', 'гроші 💰'];

  constructor(
    private readonly requestService: RequestService,
    private readonly formBuilder: FormBuilder,
    private readonly authenticationService: AuthenticationService,
  ) {

  }

  ngOnInit(): void {
    console.log(JSON.stringify(this.request));
    this.actualNeeds = this.actualNeeds.filter(need => need !== this.request.need);
    if (this.authenticationService.currentUserValue?.role === Role.User) {
      this.updateRequestForm = this.formBuilder.group({
        phone: new FormControl({ value: '', disabled: this.request.isFinished }),
        need: new FormControl({ value: '', disabled: this.request.isFinished }, Validators.required),
        heading: new FormControl({ value: '', disabled: this.request.isFinished }, Validators.required),
        description: new FormControl({ value: '', disabled: this.request.isFinished }, Validators.required),
        city: new FormControl({ value: '', disabled: this.request.isFinished }),
        district: new FormControl({ value: '', disabled: this.request.isFinished }),
        status: new FormControl({ value: '', disabled: true })
      });
      this.updateRequestForm.get('phone').setValue(this.request.phone);
      this.updateRequestForm.get('need').setValue(this.request.need);
      this.updateRequestForm.get('heading').setValue(this.request.heading);
      this.updateRequestForm.get('description').setValue(this.request.description);
      this.updateRequestForm.get('city').setValue(this.request.city);
      this.updateRequestForm.get('district').setValue(this.request.district);
      this.updateRequestForm.get('status').setValue(this.defineStatus());
    }
  }

  public defineStatus(): string {
    if (this.request.isFinished) {
      return 'опрацьований';
    }
    if (this.request.volunteerId) {
      return 'опрацьовується';
    }
    return 'очікує на опрацювання';
  }

  // convenience getter for easier access to the form fields
  get f() {
    return this.updateRequestForm.controls;
  }

  public unassignRequest() {
    this.requestService
      .unassignRequest({ requestId: this.request.id, volunteerId: this.user.id })
      .subscribe((res) => {
        console.log(res);
        this.changedRequest.emit(this.request.id);
      });
  }

  public finishRequest() {
    this.requestService
      .finishRequest({ requestId: this.request.id })
      .subscribe((res) => {
        console.log(res);
        this.changedRequest.emit(this.request.id);
      });
  }

  public deleteRequest() {
    this.requestService
      .deleteRequest(this.request.id)
      .subscribe(
        (res) => {
          console.log(res);
          this.changedRequest.emit(this.request.id);
        },
        (error) => {
          this.error = error;
        }
      );
  }

  public updateRequest() {
    // stop here if form is invalid
    if (this.updateRequestForm.invalid) {
      console.log(this.findInvalidControls()); // for debugging purposes
      return;
    }

    const updatedRequest: Request = {
      id: this.request.id,
      //isFinished: this.request.isFinished,
      phone: this.updateRequestForm.value.phone || null,
      need: this.updateRequestForm.value.need,
      heading: this.updateRequestForm.value.heading,
      description: this.updateRequestForm.value.description,
      city: this.updateRequestForm.value.city || null,
      district: this.updateRequestForm.value.district || null,
      userId: this.authenticationService.currentUserValue?.userId,
    };
    this.requestService.updateRequest(updatedRequest).subscribe(
      (res) => {
        console.log(res);
        this.changedRequest.emit(this.request.id);
      },
      (error) => {
        this.error = error;
      });
  }

  private findInvalidControls(): any[] {
    const invalid: any = [];
    const controls = this.updateRequestForm.controls;

    for (const name in controls) {
      if (controls[name].invalid) {
        invalid.push({ name, value: controls[name].value });
      }
    }

    return invalid;
  }
}
