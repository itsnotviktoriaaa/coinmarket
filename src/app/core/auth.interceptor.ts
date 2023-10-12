import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import {finalize, Observable} from 'rxjs';
import {LoaderService} from "../shared/services/loader.service";

@Injectable({
  providedIn: "root"
})

export class AuthInterceptor implements HttpInterceptor {

  constructor(private loaderService: LoaderService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    this.loaderService.show();

    const newRequest = req.clone();

    return next.handle(newRequest)
      .pipe(
        finalize(() => this.loaderService.hide())
      );
  }
}
