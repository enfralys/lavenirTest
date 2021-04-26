import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { NavController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate {


    constructor(
        public auth: AuthService,
        private router: NavController,

    ) { }

    async canActivate(next: ActivatedRouteSnapshot) {
        let isAuthenticated = this.auth.isLoggedIn;

        console.log(next.routeConfig.path);
        if (next.routeConfig.path == "login") {
            if (isAuthenticated) {
                this.router.navigateRoot("/");
            }
            return !isAuthenticated;
        }

        if (!isAuthenticated) {
            this.router.navigateRoot("/login");
        }

        console.log(isAuthenticated);

        return isAuthenticated;
    }
}
