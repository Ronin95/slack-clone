import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ThreadsService {
  private closeSource = new Subject<void>();
  close$ = this.closeSource.asObservable();

  closeThread() {
    this.closeSource.next();
  }
}
