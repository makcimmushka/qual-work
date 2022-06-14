import { UserService, AuthenticationService, RequestService } from '../../service';
import { User } from '../../shared/interface/user';
import { Component, OnInit } from '@angular/core';
import { Request } from '../../shared/interface';
import { Role } from 'src/app/shared/enum';
import { mergeMap } from 'rxjs/operators';

@Component({
  selector: 'app-my-requests',
  templateUrl: './my-requests.component.html',
  styleUrls: ['./my-requests.component.scss']
})
export class MyRequestsComponent implements OnInit {
  requests: any[] = [
    // {
    //   id: 'id1',
    //   heading: 'Потрібно житло❗❗❗',
    //   description: 'Потрібно терміново житло в м. Київ для сім\'ї біженців з трьох людей та собаки, розглянемо будь-які варіанти.',
    //   city: 'Київ',
    //   district: 'Голосіївський',
    //   need: 'житло 🏘️',
    //   phone: '+380681342215',
    //   status: 'опрацьовується'
    // },
    // {
    //   id: 'id2',
    //   heading: 'Збір грошей на новий байрактар 😈 😈',
    //   description: 'Відкриваємо збір на новісенький байрактар, щоб нищити русню. Потрібно зібрати ще 200 тис. грн',
    //   city: 'Не вказано',
    //   district: 'Не вказано',
    //   need: 'гроші 💰',
    //   phone: '+380991234567',
    //   status: 'в очікуванні'
    // },
    // {
    //   id: 'id3',
    //   heading: 'Гроші на протез для війського з полку Азов',
    //   description: 'Відкриваємо збір на протез ноги для військового, треба зібрати ще 120 тис. грн ...',
    //   city: 'Не вказано',
    //   district: 'Не вказано',
    //   need: 'гроші 💰',
    //   phone: '+380991234567',
    //   status: 'опрацьовується'
    // }
  ];

  user: User;
  isLoaded: boolean = false;

  constructor(
    private readonly userService: UserService,
    private readonly authenticationService: AuthenticationService,
    private readonly requestService: RequestService,
  ) { }

  ngOnInit(): void {
    this.userService
      .getUser(this.authenticationService.currentUserValue?.userId)
      .pipe(
        mergeMap(user => {
          this.user = user;
          return this.requestService.getAllRequests();
        })
      )
      .subscribe(requests => {
        console.log(JSON.stringify(requests));
        this.isLoaded = true;
        this.requests = requests.filter(req => {
          if (this.user.role === Role.Volunteer) {
            return req.volunteerId === this.user.id;
          } else if (this.user.role === Role.User) {
            return req.userId === this.user.id;
          } else {
            return true;
          }
        });
      });
  }

  onRequestChange(changedRequestId: string): void {
    this.requestService.getRequest(changedRequestId).subscribe((updatedRequest) => {
      console.log(updatedRequest);
      const ind = this.requests.findIndex(req => req.id === changedRequestId);
      this.requests[ind] = updatedRequest;
      window.location.reload();
    })
  }
}
