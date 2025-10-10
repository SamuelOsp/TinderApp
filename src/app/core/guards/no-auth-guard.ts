import { inject, Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { Auth, authState } from '@angular/fire/auth';
import { map, Observable, take } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
@Injectable({ providedIn: 'root' })
export class NoAuthGuard implements CanActivate {
  private auth = inject(Auth);
  private router = inject(Router);

  canActivate(): Observable<boolean | UrlTree> {
    return authState(this.auth).pipe(
      take(1),
      map(user => user ? this.router.createUrlTree(['/home']) : true)
    );
  }
}
