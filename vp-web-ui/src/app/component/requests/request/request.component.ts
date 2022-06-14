import { RequestService } from '../../../service';
import {
  Component, EventEmitter, Input, OnInit, Output
} from '@angular/core';
import { Request, User } from '../../../shared/interface';

@Component({
  selector: 'app-request',
  templateUrl: './request.component.html',
  styleUrls: ['./request.component.scss']
})
export class RequestComponent implements OnInit {
  @Input() request: Request;
  @Input() user: User;
  @Output() changedRequest = new EventEmitter<string>();

  constructor(
    private readonly requestService: RequestService
  ) {
  }

  ngOnInit(): void {
  }

  onSubmit(): void {
  }

  public assignRequest() {
    this.requestService
      .assignRequest({ requestId: this.request.id, volunteerId: this.user.id })
      .subscribe((res) => {
        console.log(res);
        this.changedRequest.emit(this.request.id);
      });
  }
}
