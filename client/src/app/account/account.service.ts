import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { IUser } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  baseUrl = environment.apiUrl;
  private currentUserSourse = new BehaviorSubject<IUser>(null);
  currentUser$ = this.currentUserSourse.asObservable();

  constructor(private http: HttpClient, private router: Router) { }

  login(params: any) {
    return this.http.post(this.baseUrl + 'account/login', params).pipe(
      map((user: IUser) => {
        if (user) {
          localStorage.setItem('token', user.token);
          this.currentUserSourse.next(user);
        }
      })
    )
  }

  register(params: any) {
    return this.http.post(this.baseUrl + 'account/register', params).pipe(
      map((user: IUser) => {
        if (user) {
          localStorage.setItem('token', user.token);
        }
      })
    )
  }

  logout() {
    localStorage.removeItem('token');
    this.currentUserSourse.next(null);
    this.router.navigateByUrl('/');
  }

  checkEmailExists(email: string) {
    return this.http.get(this.baseUrl + 'account/emailexists?email=' + email);
  }
}
