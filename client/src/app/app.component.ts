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

    signInWithGoogle(): void {
        if(this.loggedIn) {
            this.signOut();
            return;
        }
        this.authService.signIn(GoogleLoginProvider.PROVIDER_ID)
            .catch((err) => {

                // if an error occurs, print it out and clear the data from this.user
                console.log(err);
                this.signOut();
            });
    }

    signOut(): void {
        this.authService.signOut()
            .then(() => {
                console.log('Signed out.');
                return;
            })
            .catch((err) => {
                console.log(err);
            });
    }

    ngOnInit() {
        if(environment.envName != 'e2e') {
            this.authService.authState.subscribe((user) => {

                this.user = user;

                this.loggedIn = (this.user != null);
                if(this.loggedIn) {
                    // once the user signs in, authenticate it
                    this.loginService.authenticate(user.idToken)

                        .then((userId) => {
                            localStorage.setItem('userId', userId);

                            //refreshes after login so that the name of the user can be shown
                            //window.location.reload();
                            console.log(this.user.name + ' signed in.');
                            this.buttonText = 'Sign Out';
                        })
                        .catch((err) => {

                            // if an error occurs, print it out and clear the data from this.user
                            console.log(err);
                            this.signOut();
                        });
                }
                else {
                    this.buttonText = 'Sign In';
                }
            });

        }
        else {
            // run this code during e2e testing
            // so that we don't have to sign in
            this.user = {
                provider: '',
                id: '',
                email: 'sunshine@test.com',
                name: 'test dummy',
                photoUrl: '',
                firstName: 'test',
                lastName: 'dummy',
                authToken: '',
                idToken: 'testToken',
            };
            this.buttonText = 'Sign Out';
            this.loggedIn = true;
            localStorage.setItem('userId', 'testUserId');
        }

    }

    openDialog(): void{
        const dialogRef = this.dialog.open(CrisisButtonComponent,{
            width: '500px',
            height: '500px', //Makes crisis button popup be a decent size and able to be scrolled. DON'T SET TO auto OR inherit :)
            data: {
                user: this.user
            }
        });
    }

}
