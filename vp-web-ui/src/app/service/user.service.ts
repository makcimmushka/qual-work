import { Observable } from 'rxjs';
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { map, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { User } from '../shared/interface';

@Injectable({ providedIn: 'root' })
export class UserService {
  constructor(
    private readonly http: HttpClient,
  ) { }

  public getUser(userId: string): Observable<User> {
    return this.http.get<User>(`${environment.apiUrl}/user?userId=${userId}`)
      .pipe(tap(res => console.log(res)));
  }

  public updateUser(user: User): Observable<User> {
    return this.http.put<User>(`${environment.apiUrl}/user`, user)
      .pipe(tap(res => console.log(res)));
  }

  public createUser(user: Omit<User, 'id'>): Observable<User> {
    return this.http.post<User>(`${environment.apiUrl}/user`, user)
      .pipe(tap(res => console.log(res)));
  }

  public deleteUser(userId: string): Observable<any> {
    return this.http.delete<any>(`${environment.apiUrl}/user?userId=${userId}`)
      .pipe(tap(res => console.log(res)));
  }
}
