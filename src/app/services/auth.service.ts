import { AngularFireAuth } from "@angular/fire/auth";
import { Injectable } from '@angular/core';
import * as firebase from 'firebase/app';
import { ToastController } from '@ionic/angular';
import { AngularFirestore, AngularFirestoreDocument } from "@angular/fire/firestore";
import { Router } from "@angular/router";

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    userData: any;

    constructor(
        public afAuth: AngularFireAuth,
        public toastController: ToastController,
        public afStore: AngularFirestore,
        private router: Router
    ) {

        this.setLocalstorage();
    }

    async loginGoogle() {
        return this.afAuth.signInWithPopup(new firebase.default.auth.GoogleAuthProvider());

    }
    async createUser(user: any) {
        return await new Promise((resolve) => {
            this.afAuth
                .fetchSignInMethodsForEmail(user.email)
                .then(response => {
                    if (response.length > 0) {
                        if (response[0] == 'google.com') {
                            this.presentToast('Este correo esta registrao gon login Social Google')
                        } else {
                            this.afAuth.signInWithEmailAndPassword(user.email, user.password)
                                .then((resp) => {
                                    resolve(true)
                                })
                                .catch((error) => {
                                    this.presentToast(error)
                                });
                        }
                    }
                    else {
                        console.log('no esta')
                        this.afAuth.createUserWithEmailAndPassword(
                            user.email,
                            user.password
                        ).then(() => {
                            this.afAuth.signInWithEmailAndPassword(user.email, user.password);
                            resolve(true)
                        })
                    }
                })
        });

    }

    SetUserData(user) {
        const userRef: AngularFirestoreDocument<any> = this.afStore.doc(`users/${user.uid}`);
        const userData = {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL,
            emailVerified: user.emailVerified
        }
        return userRef.set(userData, {
            merge: true
        })
    }

    setLocalstorage() {
        this.afAuth.authState.subscribe(user => {
            if (user) {
                this.userData = user;
                localStorage.setItem('user', JSON.stringify(this.userData));
                JSON.parse(localStorage.getItem('user'));
            } else {
                localStorage.setItem('user', null);
                JSON.parse(localStorage.getItem('user'));
            }
        })
    }

    get isLoggedIn(): boolean {
        const user = JSON.parse(localStorage.getItem('user'));
        return (user !== null && user.emailVerified !== false) ? true : false;
    }


    SignOut() {
        return this.afAuth.signOut().then(() => {
            localStorage.removeItem('user');
            this.router.navigate(['login']);
        })
    }

    async presentToast(message) {
        const toast = await this.toastController.create({
            message: message,
            duration: 2000,
            color: 'danger',
        });
        toast.present();
    }


}
