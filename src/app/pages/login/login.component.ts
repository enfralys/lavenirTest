import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service'
import { Router } from "@angular/router";

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
    credentials = {
        text: "",
        password: ""
    };
    isLoading: boolean = false

    constructor(public auth: AuthService, public router: Router) {

    }

    ngOnInit() { }


    loginGoogle() {
        this.auth.loginGoogle().then((res) => {


            if (res.user) {
                this.auth.setLocalstorage()
                setTimeout(() => {
                    this.router.navigate(["/search"]);

                }, 1000);
            }
        });
    }
    login() {
        let user = {
            'email': this.credentials.text,
            'password': this.credentials.password
        }
        this.auth.createUser(user).then((res) => {
            if (res) {
                this.router.navigate(["/search"]);
            }

        });
    }
}
