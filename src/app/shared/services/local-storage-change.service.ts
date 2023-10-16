import { Injectable } from '@angular/core';
import {Subject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class LocalStorageChangeService {

  constructor() { }

  localStorageChange$: Subject<boolean> = new Subject<boolean>();

  requestOnBackendForUpdatePriceUsdIsOver$: Subject<boolean> = new Subject<boolean>();

  addToLocalStorage(): void {
    this.localStorageChange$.next(true);
  }

  requestOnBackendForUpdatePriceUsdIsOver(): void {
    this.requestOnBackendForUpdatePriceUsdIsOver$.next(true);
  }

}
