import {Component, Input, OnInit} from '@angular/core';
import {gapi} from 'gapi-client';
import {environment} from "../environments/environment";
import {AuthService, GoogleLoginProvider, SocialUser} from "angularx-social-login";
import {MatDialog} from '@angular/material';
import {CrisisButtonComponent} from "./resources/crisis-button.component";
import {LoginService} from "./login.service";

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
    title = "Sunshine Journal";
    public user: SocialUser;
    public loggedIn: boolean;

    public buttonText: string;

    constructor(private authService: AuthService, public dialog: MatDialog, private loginService: LoginService) { }

    //New function to return the name of the active user
    //window.* is not defined, or 'gettable' straight from HTML *ngIf
    //So this function will return that
    getLoginName(){
        var name = window['name'];
        return name;
    }

    signInWithGoogle(): void {
        if(this.loggedIn) {
            this.signOut();
            return;
        }
        this.authService.signIn(GoogleLoginProvider.PROVIDER_ID)

            .then((user) => {
                return this.loginService.authenticate(user.idToken);
            })

            .then((authResponse) => {
                // check that our client id is within the response from google
                if (authResponse.aud != '557763158088-rb4bkc622e0lkc5tnksua58b187n3r33.apps.googleusercontent.com') {
                    console.log('Error: login response did not contain our app\'s client ID');
                    this.user = null;
                } else {
                    //refreshes after login so that the name of the user can be shown
                    window.location.reload();
                    console.log(authResponse.name + ' signed in.');
                }

            })

            .catch((err) => {

                // if an error occurs, print it out and clear the data from this.user
                console.log(err);
                this.user = null;
            });
    }

    signOut(): void {
        this.authService.signOut()

            .then((res) => {
                console.log('Signed out.');
                return;
            })
            .catch((err) => {
                console.log(err);
            });
    }

    ngOnInit() {
        this.authService.authState.subscribe((user) => {

            //only get the user's information if the authentication works
            this.user = user;

            this.loggedIn = (this.user != null);
            if(this.loggedIn) {
                this.buttonText = 'Sign Out';
            }
            else {
                this.buttonText = 'Sign In';
            }
        });
    }

    openDialog(): void{
        const dialogRef = this.dialog.open(CrisisButtonComponent,{
            width: '500px',
            height: 'auto', //Do what we want, please :)
            data: {
                user: this.user
            }
        });
    }

}
