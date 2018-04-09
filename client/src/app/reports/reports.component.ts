import {Component, OnInit} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {Emoji} from "../emoji";
import {ReportsService} from "./reports.service";
import {AuthService, SocialUser} from "angularx-social-login";

@Component({
    selector: 'app-reports-component',
    templateUrl: 'reports.component.html',
    styleUrls: ['./reports.component.css'],
})

export class ReportsComponent implements OnInit {
    // These are public so that tests can reference them (.spec.ts)
    public emojis: Emoji[];
    public filteredEmojis: Emoji[];
    public user: SocialUser;
    // These are the target values used in searching.
    // We should rename them to make that clearer.
    public emojiOwner: string;


    // Inject the EmojiListService into this component.
    constructor(public reportsService: ReportsService, public authService: AuthService) {

    }


    public filterEmojis(searchOwner): Emoji[] {

        this.filteredEmojis = this.emojis;

        // Filter by name
        if (searchOwner != null) {
            searchOwner = searchOwner.toLocaleLowerCase();

            this.filteredEmojis = this.filteredEmojis.filter(emoji => {
                return !searchOwner || emoji.owner.toLowerCase().indexOf(searchOwner) !== -1;
            });
        }

        // Sort by date
        this.filteredEmojis = this.filteredEmojis.sort((emoji1, emoji2) => {
            const date1 = new Date(emoji1.date);
            const date2 = new Date(emoji2.date);
            return date2.valueOf() - date1.valueOf();
        });


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

        const emojiListObservable: Observable<Emoji[]> = this.reportsService.getEmojis(this.user.email);
        emojiListObservable.subscribe(
            emojis => {
                this.emojis = emojis;
                this.filterEmojis(this.emojiOwner);
            },
            err => {
                console.log(err);
            });
        return emojiListObservable;
    }


    ngOnInit(): void {
        this.authService.authState.subscribe((user) => {
            this.user = user;
        });
        this.refreshEmojis();
    }

    public getReadableDate(dateString: string): string {
        if(dateString == '') {
            return '';
        }
        const date = new Date(dateString);
        return (date.getMonth() + 1) + '/' + date.getDate() + '/' + date.getFullYear() + ' ' + date.getHours() + ':'
            + date.getMinutes();
    }
}
