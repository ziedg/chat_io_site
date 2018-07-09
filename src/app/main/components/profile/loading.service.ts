import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class LoadingService {

  private loader = new BehaviorSubject('false');
  currentMessage = this.loader.asObservable();

  constructor() { }

  changeloader(message: string) {
    this.loader.next(message);
  }
}