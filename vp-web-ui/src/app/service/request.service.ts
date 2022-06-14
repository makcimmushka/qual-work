import { Observable } from 'rxjs';
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Request } from '../shared/interface';

@Injectable({ providedIn: 'root' })
export class RequestService {
  constructor(
    private readonly http: HttpClient,
  ) { }

  public getRequest(requestId: string): Observable<Request> {
    return this.http.get<Request>(`${environment.apiUrl}/request?requestId=${requestId}`)
      .pipe(tap(res => console.log(res)));
  }

  public deleteRequest(requestId: string): Observable<any> {
    return this.http.delete<any>(`${environment.apiUrl}/request?requestId=${requestId}`)
      .pipe(tap(res => console.log(res)));
  }

  public getAllRequests(): Observable<Request[]> {
    return this.http.get<Request[]>(`${environment.apiUrl}/requests`)
      .pipe(tap(res => console.log(res)));
  }

  public createRequest(request: Omit<Request, 'id'>): Observable<Request> {
    return this.http.post<Request>(`${environment.apiUrl}/request`, request)
      .pipe(tap(res => console.log(res)));
  }

  public updateRequest(request: Request): Observable<Request> {
    return this.http.put<Request>(`${environment.apiUrl}/request`, request)
      .pipe(tap(res => console.log(res)));
  }

  public finishRequest(body: { requestId: string }): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/finish-request`, body)
      .pipe(tap(res => console.log(res)));
  }

  public assignRequest(body: { requestId: string, volunteerId: string }): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/assign-request`, body)
      .pipe(tap(res => console.log(res)));
  }

  public unassignRequest(body: { requestId: string, volunteerId: string }): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/unassign-request`, body)
      .pipe(tap(res => console.log(res)));
  }
}
