import { mergeMap } from 'rxjs/operators';
import { RequestService, UserService, AuthenticationService } from '../../service';
import { Component, OnInit } from '@angular/core';
import { User } from '../../shared/interface';

@Component({
  selector: 'app-requests',
  templateUrl: './requests.component.html',
  styleUrls: ['./requests.component.scss']
})
export class RequestsComponent implements OnInit {
  requests: any[] = [
    // {
    //   heading: 'Потрібно житло❗❗❗',
    //   description: 'Потрібно терміново житло в м. Київ для сім\'ї біженців з трьох людей та собаки, розглянемо будь-які варіанти.',
    //   city: 'Київ',
    //   district: 'Голосіївський',
    //   need: 'житло 🏘️',
    //   phone: '+380992314956'
    // },
    // {
    //   heading: 'Їжа для ЗСУ на блокпост 🪖',
    //   description: 'Потрібна їжа для ЗСУ на блокпост, переважно та, яка довго не псується (консерви, печиво, крупи тощо).',
    //   city: 'Запоріжжя',
    //   district: 'Олександрівський',
    //   need: 'їжа 🍲',
    //   phone: '+380681342215'
    // },
    // {
    //   heading: 'Збір грошей на новий байрактар 😈 😈',
    //   description: 'Відкриваємо збір на новісенький байрактар, щоб нищити русню. Потрібно зібрати ще 200 тис. грн',
    //   city: 'Не вказано',
    //   district: 'Не вказано',
    //   need: 'гроші 💰',
    //   phone: 'Не вказано'
    // },
    // {
    //   heading: 'Гроші на протез для війського з полку Азов',
    //   description: 'Відкриваємо збір на протез ноги для військового, треба зібрати ще 120 тис. грн ...',
    //   city: 'Не вказано',
    //   district: 'Не вказано',
    //   need: 'гроші 💰',
    //   phone: 'Не вказано'
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
          return !req.volunteerId;
        });
      });
  }

  onRequestChange(changedRequestId: string): void {
    window.location.reload();
  }
}
