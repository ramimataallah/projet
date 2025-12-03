import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UserStoreService {
  private _user = new BehaviorSubject<any>(null);
  user$ = this._user.asObservable();

  set(user: any) {
    this._user.next(user);
  }

  clear() {
    this._user.next(null);
  }
}
