import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { SessionService } from '../session.service';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ServerErrorComponent } from '../../components/modal/server-error/server-error.component';
@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(
    private session: SessionService,
    private router: Router,
    private dialog: MatDialog
  ) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    if (request.url.includes("/api")) {

      let user = this.session.getTokenData();
      if (user != null) {
        request = request.clone({
          setHeaders: {
            'Authorization': `Bearer ${user.token}`
          }
        });
      }

    }

    return next.handle(request).pipe(
      catchError(
        (error) => {
          switch (error.status) {

            case 401:
              const dialogRef = this.dialog.open(ServerErrorComponent, {
                data: error
              });
              dialogRef.afterClosed().subscribe(() => {
                this.session.removeTokenData();
                this.session.removeUserData();
              });
              break;

            case 500:
              console.log(error);
              break;

            default:
              console.log(error);
              this.dialog.open(ServerErrorComponent, {
                data: error
              });

          }

          this.session.loading.next(false)
          return throwError(error);
        }) as any
    );

  }



}



