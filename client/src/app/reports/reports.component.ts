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
    today = new Date();
    day = this.today.getDate();
    month = this.today.getMonth();
    year = this.today.getFullYear();

    theDay = new Date(this.year,this.month,this.day);
    startDate = new Date(this.year,this.month,this.day);
    endDate = new Date(this.theDay.setDate(this.theDay.getDate()+1));
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
        {value: 5, viewValue:2},
        {value: 'down', viewValue:3},
        {value: 4, viewValue:4},
        {value: 3, viewValue:5},
        {value: 'radiant', viewValue:6},
    ]*/



    // Inject the EmojiListService into this component.
    constructor(public reportsService: ReportsService, public authService: AuthService) {


    }


    isHighlighted(emoji: Emoji): boolean {
        return emoji._id['$oid'] === this.highlightedID['$oid'];
    }

        filterGraph(weekday, filterMood): number {
            var filterData = this.filteredEmojis;


            // Filter by weekday
            if (this.inputType == "Last month"){
                filterData = filterData.filter(summary => {
                    this.getDate = new Date(summary.date);
                    return this.getDate.getDate() == weekday;
                });
            } else if (this.inputType == "Date Range"){
                filterData = filterData.filter(summary => {
                    this.getDate = new Date(summary.date);
                    return this.getDate.getDate() == weekday;
                });
                filterData = filterData.filter(summary => {
                    this.getDate = new Date(summary.date);
                    return this.getDate.getDay() == weekday;
                });
            }

            // Filter by mood
            filterData = filterData.filter(emoji => {
                return !filterMood || emoji.mood == filterMood;
            });

            return filterData.length;
        }



    public filterEmojis(searchMood: number, searchIntensity: number, searchStartDate: any, searchEndDate: any): Emoji[] {

        this.filteredEmojis = this.emojis;
        console.log("this is the start date passed in " + this.startDate)
        console.log("this is the end date passed in " + this.endDate)

        var today = new Date();
        var day = today.getDate();
        var month = today.getMonth();
        var year = today.getFullYear();
        var theDay = new Date(year,month,day);

        if (this.inputType == "This week") {
            var first = theDay.getDate() - theDay.getDay();
            this.startDate = new Date(theDay.setDate(first));
            this.endDate = new Date(theDay.setDate(theDay.getDate() + 6));
        } else if (this.inputType == "Last week") {
            var first = theDay.getDate() - theDay.getDay()-7;
            this.startDate = new Date(theDay.setDate(first));
            this.endDate = new Date(theDay.setDate(theDay.getDate() + 6));
        } else if (this.inputType == "Last month") {
            theDay.setDate(1);
            this.endDate = new Date(theDay.setDate(theDay.getDate() - 1));
            var count = theDay.getDate() - 1;
            this.startDate = new Date(theDay.setDate(theDay.getDate() - count));
        }  else if (this.inputType == "Today") {
            this.startDate = new Date(year,month,day);
            this.endDate = new Date(theDay.setDate(theDay.getDate()+1));
        }


       // // Filter by mood
       //  if (searchMood == null) {
       //          this.filteredEmojis = this.filteredEmojis.filter(emoji => {
       //              return true;
       //          });
       //
       //      } else{
       //
       //          this.filteredEmojis = this.filteredEmojis.filter(emoji => {
       //              return !searchMood || searchMood == emoji.mood;
       //          })
       //      }
       //
       //  // Filter by Intensity
       //  if (searchIntensity == null) {
       //          this.filteredEmojis = this.filteredEmojis.filter(emoji => {
       //              return true;
       //          });
       //      }
       //      else {
       //          this.filteredEmojis = this.filteredEmojis.filter(emoji => {
       //              return !searchIntensity || searchIntensity == emoji.intensity;
       //          });
       //  }
       //
       //  // Filter by startDate
       //  if (searchStartDate != null) {
       //
       //      this.filteredEmojis = this.filteredEmojis.filter(emoji => {
       //          this.getDate = new Date(emoji.date);
       //          return this.getDate >= searchStartDate;
       //      });
       //  }
       //
       //  // Filter by endDate
       //  if (searchEndDate != null) {
       //
       //      this.filteredEmojis = this.filteredEmojis.filter(emoji => {
       //          this.getDate = new Date(emoji.date);
       //          return this.getDate <= searchEndDate;
       //      });
       //  }



        return this.filteredEmojis;
    }

    /*getRightFormForDate(date: number, month: number, year: number){
        let mons = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
        let mon = mons[month];
        var rightForm = mon+' '+date+' '+year;
        return rightForm;
    }*/

    getThisWeekDate(){
        var days = [];
        var today = new Date();
        var first = today.getDate() - today.getDay();
        var firstDay = new Date(today.setDate(first));
        //var theDay =Last month this.getRightFormForDate(firstDay.getDate(), firstDay.getMonth(), firstDay.getFullYear());
        days.push(firstDay.getTime());
        var nextDay;
        for(var i=1; i<7; i++){
            nextDay = new Date(today.setDate(today.getDate()+1));
            days.push(nextDay.getTime());
        }
        return days;
    }

    getLastWeekDate(){
        var days = [];
        var today = new Date();
        var first = today.getDate() - today.getDay() - 7;
        var firstDay = new Date(today.setDate(first));
        //var theDay = this.getRightFormForDate(firstDay.getDate(), firstDay.getMonth(), firstDay.getFullYear());
        days.push(firstDay.getTime());
        var nextDay;
        for(var i=1; i<7; i++){
            nextDay = new Date(today.setDate(today.getDate()+1));
            days.push(nextDay.getTime()
                //this.getRightFormForDate(nextDay.getDate(), nextDay.getMonth(), nextDay.getFullYear())
            );
        }
        return days;
    }

    getLastMonthDate(){
        var days = [];
        var today = new Date();
        var firstdayCurr = new Date(today.setDate(1));

        var lastday = new Date(today.setDate(today.getDate()-1));
        //var theDay = this.getRightFormForDate(lastday.getDate(), lastday.getMonth(), lastday.getFullYear())
        days.push(lastday.getTime());
        var preDay;
        var count = today.getDate();
        for (var i = 1; i < count; i++){
            preDay = new Date(today.setDate(today.getDate()-1));
            days.push(preDay.getTime()
                //this.getRightFormForDate(preDay.getDate(), preDay.getMonth(), preDay.getFullYear())
            );
        }
        days.reverse();
        return days;
    }

    updateChart(): void{

        this.myChart.destroy();

        this.canvas = document.getElementById("myChart");
        this.ctx = this.canvas;

        if (this.inputType == "This week"){
           this.buildChart();
        } else if (this.inputType == "Last week"){
            let happy_weekly_totals = {"label":"Happy",
                "data":[
                    this.filterGraph('0', 3),
                    this.filterGraph('1', 3),
                    this.filterGraph('2', 3),
                    this.filterGraph('3', 3),
                    this.filterGraph('4', 3),
                    this.filterGraph('5', 3),
                    this.filterGraph('6', 3)
                ],
                hidden: false,
                "fill":false,
                "borderColor":"rgb(0, 204, 0)",
                "lineTension":0.1};

            let unhappy_weekly_totals = {"label":"Sad",
                "data":[
                    this.filterGraph('0', 5),
                    this.filterGraph('1', 5),
                    this.filterGraph('2', 5),
                    this.filterGraph('3', 5),
                    this.filterGraph('4', 5),
                    this.filterGraph('5', 5),
                    this.filterGraph('6', 5)
                ],
                hidden: false,
                "fill":false,
                "borderColor":"rgb(0, 102, 204)",
                "lineTension":0.1};

            let meh_weekly_totals = {"label":"Meh",
                "data":[
                    this.filterGraph('0', 4),
                    this.filterGraph('1', 4),
                    this.filterGraph('2', 4),
                    this.filterGraph('3', 4),
                    this.filterGraph('4', 4),
                    this.filterGraph('5', 4),
                    this.filterGraph('6', 4)
                ],
                hidden: false,
                "fill":false,
                "borderColor":"rgb(96, 96, 96)",
                "lineTension":0.1};

            let frustrated_weekly_totals = {"label":"Mad",
                "data":[
                    this.filterGraph('0', 1),
                    this.filterGraph('1', 1),
                    this.filterGraph('2', 1),
                    this.filterGraph('3', 1),
                    this.filterGraph('4', 1),
                    this.filterGraph('5', 1),
                    this.filterGraph('6', 1)
                ],
                hidden: false,
                "fill":false,
                "borderColor":"rgb(204, 0, 0)",
                "lineTension":0.1};

            let worried_weekly_totals = {"label":"Worried",
                "data":[
                    this.filterGraph('0', 2),
                    this.filterGraph('1', 2),
                    this.filterGraph('2', 2),
                    this.filterGraph('3', 2),
                    this.filterGraph('4', 2),
                    this.filterGraph('5', 2),
                    this.filterGraph('6', 2)
                ],
                hidden: false,
                "fill":false,
                "borderColor":"rgb(204, 0, 204)",
                "lineTension":0.1};

            this.myChart = new Chart(this.ctx, {
                type: 'line',
                data: {
                    labels: this.getLastWeekDate(),
                    datasets: [
                        happy_weekly_totals,
                        unhappy_weekly_totals,
                        meh_weekly_totals,
                        frustrated_weekly_totals,
                        worried_weekly_totals,
                    ]
                },
                options: {

                    responsive: true,
                    maintainAspectRation: false,
                    scales: {
                        xAxes:[{
                            type: 'time',

                            time: {
                                unit: 'day',
                                unitStepSize: 1,
                                tooltipFormat: "MMM D",
                                round: 'day',
                                displayFormats: {
                                    day: 'MMM D'
                                },

                            },

                        }],
                        yAxes: [{
                            ticks: {
                                beginAtZero: true

                            }
                        }]
                    }
                }
            });

        } else if (this.inputType == "Last month"){
            let happy_weekly_totals = {"label":"Happy",
                "data":[
                    this.filterGraph('1', 3),
                    this.filterGraph('2', 3),
                    this.filterGraph('3', 3),
                    this.filterGraph('4', 3),
                    this.filterGraph('5', 3),
                    this.filterGraph('6', 3),
                    this.filterGraph('7', 3),
                    this.filterGraph('8', 3),
                    this.filterGraph('9', 3),
                    this.filterGraph('10', 3),
                    this.filterGraph('11', 3),
                    this.filterGraph('12', 3),
                    this.filterGraph('13', 3),
                    this.filterGraph('14', 3),
                    this.filterGraph('15', 3),
                    this.filterGraph('16', 3),
                    this.filterGraph('17', 3),
                    this.filterGraph('18', 3),
                    this.filterGraph('19', 3),
                    this.filterGraph('20', 3),
                    this.filterGraph('21', 3),
                    this.filterGraph('22', 3),
                    this.filterGraph('23', 3),
                    this.filterGraph('24', 3),
                    this.filterGraph('25', 3),
                    this.filterGraph('26', 3),
                    this.filterGraph('27', 3),
                    this.filterGraph('28', 3),
                    this.filterGraph('29', 3),
                    this.filterGraph('30', 3),
                    this.filterGraph('31', 3),
                ],
                hidden: false,
                "fill":false,
                "borderColor":"rgb(0, 204, 0)",
                "lineTension":0.1};

            let unhappy_weekly_totals = {"label":"Sad",
                "data":[
                    this.filterGraph('1', 5),
                    this.filterGraph('2', 5),
                    this.filterGraph('3', 5),
                    this.filterGraph('4', 5),
                    this.filterGraph('5', 5),
                    this.filterGraph('6', 5),
                    this.filterGraph('7', 5),
                    this.filterGraph('8', 5),
                    this.filterGraph('9', 5),
                    this.filterGraph('10', 5),
                    this.filterGraph('11', 5),
                    this.filterGraph('12', 5),
                    this.filterGraph('13', 5),
                    this.filterGraph('14', 5),
                    this.filterGraph('15', 5),
                    this.filterGraph('16', 5),
                    this.filterGraph('17', 5),
                    this.filterGraph('18', 5),
                    this.filterGraph('19', 5),
                    this.filterGraph('20', 5),
                    this.filterGraph('21', 5),
                    this.filterGraph('22', 5),
                    this.filterGraph('23', 5),
                    this.filterGraph('24', 5),
                    this.filterGraph('25', 5),
                    this.filterGraph('26', 5),
                    this.filterGraph('27', 5),
                    this.filterGraph('28', 5),
                    this.filterGraph('29', 5),
                    this.filterGraph('30', 5),
                    this.filterGraph('31', 5),
                ],
                hidden: false,
                "fill":false,
                "borderColor":"rgb(0, 102, 204)",
                "lineTension":0.1};

            let meh_weekly_totals = {"label":"Meh",
                "data":[
                    this.filterGraph('1', 4),
                    this.filterGraph('2', 4),
                    this.filterGraph('3', 4),
                    this.filterGraph('4', 4),
                    this.filterGraph('5', 4),
                    this.filterGraph('6', 4),
                    this.filterGraph('7', 4),
                    this.filterGraph('8', 4),
                    this.filterGraph('9', 4),
                    this.filterGraph('10', 4),
                    this.filterGraph('11', 4),
                    this.filterGraph('12', 4),
                    this.filterGraph('13', 4),
                    this.filterGraph('14', 4),
                    this.filterGraph('15', 4),
                    this.filterGraph('16', 4),
                    this.filterGraph('17', 4),
                    this.filterGraph('18', 4),
                    this.filterGraph('19', 4),
                    this.filterGraph('20', 4),
                    this.filterGraph('21', 4),
                    this.filterGraph('22', 4),
                    this.filterGraph('23', 4),
                    this.filterGraph('24', 4),
                    this.filterGraph('25', 4),
                    this.filterGraph('26', 4),
                    this.filterGraph('27', 4),
                    this.filterGraph('28', 4),
                    this.filterGraph('29', 4),
                    this.filterGraph('30', 4),
                    this.filterGraph('31', 4),
                ],
                hidden: false,
                "fill":false,
                "borderColor":"rgb(96, 96, 96)",
                "lineTension":0.1};

            let frustrated_weekly_totals = {"label":"Angry",
                "data":[
                    this.filterGraph('1', 1),
                    this.filterGraph('2', 1),
                    this.filterGraph('3', 1),
                    this.filterGraph('4', 1),
                    this.filterGraph('5', 1),
                    this.filterGraph('6', 1),
                    this.filterGraph('7', 1),
                    this.filterGraph('8', 1),
                    this.filterGraph('9', 1),
                    this.filterGraph('10', 1),
                    this.filterGraph('11', 1),
                    this.filterGraph('12', 1),
                    this.filterGraph('13', 1),
                    this.filterGraph('14', 1),
                    this.filterGraph('15', 1),
                    this.filterGraph('16', 1),
                    this.filterGraph('17', 1),
                    this.filterGraph('18', 1),
                    this.filterGraph('19', 1),
                    this.filterGraph('20', 1),
                    this.filterGraph('21', 1),
                    this.filterGraph('22', 1),
                    this.filterGraph('23', 1),
                    this.filterGraph('24', 1),
                    this.filterGraph('25', 1),
                    this.filterGraph('26', 1),
                    this.filterGraph('27', 1),
                    this.filterGraph('28', 1),
                    this.filterGraph('29', 1),
                    this.filterGraph('30', 1),
                    this.filterGraph('31', 1),
                ],
                hidden: false,
                "fill":false,
                "borderColor":"rgb(204, 0, 0)",
                "lineTension":0.1};

            let worried_weekly_totals = {"label":"Worried",
                "data":[
                    this.filterGraph('1', 2),
                    this.filterGraph('2', 2),
                    this.filterGraph('3', 2),
                    this.filterGraph('4', 2),
                    this.filterGraph('5', 2),
                    this.filterGraph('6', 2),
                    this.filterGraph('7', 2),
                    this.filterGraph('8', 2),
                    this.filterGraph('9', 2),
                    this.filterGraph('10', 2),
                    this.filterGraph('11', 2),
                    this.filterGraph('12', 2),
                    this.filterGraph('13', 2),
                    this.filterGraph('14', 2),
                    this.filterGraph('15', 2),
                    this.filterGraph('16', 2),
                    this.filterGraph('17', 2),
                    this.filterGraph('18', 2),
                    this.filterGraph('19', 2),
                    this.filterGraph('20', 2),
                    this.filterGraph('21', 2),
                    this.filterGraph('22', 2),
                    this.filterGraph('23', 2),
                    this.filterGraph('24', 2),
                    this.filterGraph('25', 2),
                    this.filterGraph('26', 2),
                    this.filterGraph('27', 2),
                    this.filterGraph('28', 2),
                    this.filterGraph('29', 2),
                    this.filterGraph('30', 2),
                    this.filterGraph('31', 2),
                ],
                hidden: false,
                "fill":false,
                "borderColor":"rgb(204, 0, 204)",
                "lineTension":0.1};

            this.myChart = new Chart(this.ctx, {
                type: 'line',
                data: {
                    labels: this.getLastMonthDate(),
                    datasets: [
                        happy_weekly_totals,
                        unhappy_weekly_totals,
                        meh_weekly_totals,
                        frustrated_weekly_totals,
                        worried_weekly_totals,
                    ]
                },
                options: {

                    responsive: true,
                    maintainAspectRation: false,
                    scales: {
                        xAxes:[{
                            type: 'time',

                            time: {
                                unit: 'day',
                                unitStepSize: 1,
                                tooltipFormat: "MMM D",
                                round: 'day',
                                displayFormats: {
                                    day: 'MMM D'
                                },

                            },

                        }],
                        yAxes: [{
                            ticks: {
                                beginAtZero: true

                            }
                        }]
                    }
                }
            });

        } else if (this.inputType == "Today"){

            let test1 = {
                "label": "Worried",
                "data": [{
                    x: 0,
                    y: 0
                }],
                "backgroundColor":"rgb(204, 0, 204)",
            };



            this.myChart = new Chart(this.ctx, {
                type: 'scatter',
                data: {
                    datasets: [
                        test1,
                    ]
                },
            });
        } else if (this.inputType == "Date Range"){

        }

    }


    buildChart(): void {

        this.canvas = document.getElementById("myChart");
        this.ctx = this.canvas;

        let happy_weekly_totals = {"label":"Happy",
            "data":[
                this.filterGraph('0', 3),
                this.filterGraph('1', 3),
                this.filterGraph('2', 3),
                this.filterGraph('3', 3),
                this.filterGraph('4', 3),
                this.filterGraph('5', 3),
                this.filterGraph('6', 3)
            ],
            hidden: false,
            "fill":false,
            "borderColor":"rgb(0, 204, 0)",
            "lineTension":0.1};

        let unhappy_weekly_totals = {"label":"Sad",
            "data":[
                this.filterGraph('0', 5),
                this.filterGraph('1', 5),
                this.filterGraph('2', 5),
                this.filterGraph('3', 5),
                this.filterGraph('4', 5),
                this.filterGraph('5', 5),
                this.filterGraph('6', 5)
            ],
            hidden: false,
            "fill":false,
            "borderColor":"rgb(0, 102, 204)",
            "lineTension":0.1};

        let meh_weekly_totals = {"label":"Meh",
            "data":[
                this.filterGraph('0', 4),
                this.filterGraph('1', 4),
                this.filterGraph('2', 4),
                this.filterGraph('3', 4),
                this.filterGraph('4', 4),
                this.filterGraph('5', 4),
                this.filterGraph('6', 4)
            ],
            hidden: false,
            "fill":false,
            "borderColor":"rgb(96, 96, 96)",
            "lineTension":0.1};

        let frustrated_weekly_totals = {"label":"Mad",
            "data":[
                this.filterGraph('0', 1),
                this.filterGraph('1', 1),
                this.filterGraph('2', 1),
                this.filterGraph('3', 1),
                this.filterGraph('4', 1),
                this.filterGraph('5', 1),
                this.filterGraph('6', 1)
            ],
            hidden: false,
            "fill":false,
            "borderColor":"rgb(204, 0, 0)",
            "lineTension":0.1};

        let worried_weekly_totals = {"label":"Worried",
            "data":[
                this.filterGraph('0', 2),
                this.filterGraph('1', 2),
                this.filterGraph('2', 2),
                this.filterGraph('3', 2),
                this.filterGraph('4', 2),
                this.filterGraph('5', 2),
                this.filterGraph('6', 2)
            ],
            hidden: false,
            "fill":false,
            "borderColor":"rgb(204, 0, 204)",
            "lineTension":0.1};

        this.myChart = new Chart(this.ctx, {
            type: 'line',
            data: {
                labels: this.getThisWeekDate(),
                datasets: [
                    happy_weekly_totals,
                    unhappy_weekly_totals,
                    meh_weekly_totals,
                    frustrated_weekly_totals,
                    worried_weekly_totals,
                ]
            },
            options: {

                responsive: true,
                maintainAspectRation: false,
                scales: {
                    xAxes:[{
                        type: 'time',

                        time: {
                            unit: 'day',
                            unitStepSize: 1,
                            tooltipFormat: "MMM D",
                            round: 'day',
                            displayFormats: {
                                day: 'MMM D'
                            },

                        },

                    }],
                    yAxes: [{
                        ticks: {
                            beginAtZero: true

                        }
                    }]
                }
            }
        });

    }


    ngAfterViewInit(): void {
        this.buildChart();
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
                this.filterEmojis(this.emojiMood,this.emojiIntensity, this.startDate, this.endDate);
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

    stringToDate(date: string): any {
        return new Date(date);
    }
    totalNumberMoods(): number{
        return this.filteredEmojis.length;
    }

}
