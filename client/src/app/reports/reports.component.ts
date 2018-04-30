import {Component, OnInit} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {Emoji} from "../emoji";
import {ReportsService} from "./reports.service";
import {AuthService, SocialUser} from "angularx-social-login";
import {environment} from "../../environments/environment";
import * as Chart from 'chart.js';
import * as Plotly from 'plotly.js'
import {FormControl} from '@angular/forms';

@Component({
    selector: 'app-reports-component',
    templateUrl: 'reports.component.html',
    styleUrls: ['./reports.component.css'],
})

export class ReportsComponent implements OnInit {
    startDate = new Date();
    endDate = new Date(new Date().getTime() + 7 * 24 * 60 * 60 *1000);
    startDate2 = new FormControl(this.startDate);
    endDate2 = new FormControl(this.endDate);
    getDate;

    canvas: any;
    ctx: any;
    myChart: any;

    public emojis: Emoji[];
    public filteredEmojis: Emoji[];

    public user: SocialUser;

    public emojiMood: number;
    public emojiIntensity: number;
    public inputType;

    private highlightedID: {'$oid': string} = { '$oid': '' };


    /*// These are public so that tests can reference them (.spec.ts)
    public emojis: Emoji[];
    public filteredEmojis: Emoji[];
    public user: SocialUser;
    // These are the target values used in searching.
    // We should rename them to make that clearer.
    public emojiOwner: string;
    public emojiMood: any;

    moods = [+ '&date=' + startDate + ',' + endDate
        {value: 'Anxious', viewValue:1},
        {value: 'sad', viewValue:2},
        {value: 'down', viewValue:3},
        {value: 'meh', viewValue:4},
        {value: 'happy', viewValue:5},
        {value: 'radiant', viewValue:6},
    ]*/



    // Inject the EmojiListService into this component.
    constructor(public reportsService: ReportsService, public authService: AuthService) {


    }


    isHighlighted(emoji: Emoji): boolean {
        return emoji._id['$oid'] === this.highlightedID['$oid'];
    }




    public filterEmojis(searchMood: number, searchIntensity: number, startDate: string, endDate: string): Emoji[] {

        this.filteredEmojis = this.emojis;
        console.log("this is the start date passed in " + this.startDate)
        console.log("this is the end date passed in " + this.endDate)

        // Filter by mood
        if (searchMood == null) {
                this.filteredEmojis = this.filteredEmojis.filter(emoji => {
                    return true;
                });

            } else{
                this.filteredEmojis = this.filteredEmojis.filter(emoji => {
                    return !searchMood || searchMood == emoji.mood;
                })
            }

        // Filter by mood
        if (searchIntensity != null) {
                this.filteredEmojis = this.filteredEmojis.filter(emoji => {
                    return true;
                });
            }
            else {
                this.filteredEmojis = this.filteredEmojis.filter(emoji => {
                    return !searchIntensity || searchIntensity == emoji.intensity;
                });

        }

        // Filter by startDate
        if (startDate != null) {

            this.filteredEmojis = this.filteredEmojis.filter(summary => {
                console.log("this is the date start:")
                console.log(summary.date)
                this.getDate = summary.date
                return this.getDate >= this.startDate;
            });
        }

        // Filter by endDate
        if (endDate != null) {
            this.filteredEmojis = this.filteredEmojis.filter(summary => {
                console.log("this is the date:")
                console.log(summary.date)
                this.getDate = summary.date;
                return this.getDate <= this.endDate;
            });
        }




        return this.filteredEmojis;
    }


    /**
     * Starts an asynchronous operation to update the emojis list
     *
     */
    refreshEmojis(): Observable<Emoji[]> {
        // Get Emojis returns an Observable, basically a "promise" that
        // we will get the data from the server.
        //
        // Subscribe waits until the data is fully downloaded, then
        // performs an action on it (the first lambda)
        //if (this.inputType ==
        const emojiListObservable: Observable<Emoji[]> = this.reportsService.getEmojis(this.user.email);
        emojiListObservable.subscribe(
            emojis => {
                this.emojis = emojis;
                this.filterEmojis(this.emojiMood,this.emojiIntensity, this.startDate.toString(), this.endDate.toString());
            },
            err => {
                console.log(err);
            });
        return emojiListObservable;
    }


    ngOnInit(): void {





        if(environment.envName != 'e2e') {
            this.authService.authState.subscribe((user) => {
                this.user = user;
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
        }
        this.refreshEmojis();
    }

    public getReadableDate(dateString: string): string {
        if (dateString == '') {
            return '';
        }
        const date = new Date(dateString);

        return (date.getMonth() + 1) + '/' + date.getFullYear() + ' ' + date.getHours() + ':'
            + date.getMinutes();


    }

}
