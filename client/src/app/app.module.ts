import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { MATERIAL_COMPATIBILITY_MODE } from '@angular/material';

import {HttpClientModule} from '@angular/common/http';
import {AppComponent} from './app.component';
import {HomeComponent} from './home/home.component';
import {HomeService} from "./home/home.service";
import {Routing} from './app.routes';
import {APP_BASE_HREF} from '@angular/common';
import {ResourcesComponent} from "./resources/resources.component";
import {CustomModule} from './custom.module';
import {ReportsComponent} from "./reports/reports.component";
import {ReportsService} from "./reports/reports.service";
import {ResourcesService} from "./resources/resources.service";
import {AddResourcesComponent} from "./resources/add-resources.component";
import {CrisisButtonComponent} from "./resources/crisis-button.component";

import {JournalListComponent} from "./journaling/journal-list.component";
import {JournalListService} from "./journaling/journal-list.service";
import {AddJournalComponent} from './journaling/add-journal.component';
import {EditJournalComponent} from "./journaling/edit-journal.component";

import {GoalsComponent} from "./goals/goals.component";
import {GoalsService} from "./goals/goals.service";
import {AddGoalComponent} from "./goals/add-goals.component";

import { SocialLoginModule, AuthServiceConfig } from 'angularx-social-login';
import { GoogleLoginProvider, FacebookLoginProvider } from 'angularx-social-login';
import {AboutComponent} from "./about/about.component";
import {SelectJournalComponent} from "./journaling/select-journal.component";
import {LoginService} from "./login.service";


let config = new AuthServiceConfig([
    {
        id: GoogleLoginProvider.PROVIDER_ID,
        provider: new GoogleLoginProvider("557763158088-rb4bkc622e0lkc5tnksua58b187n3r33.apps.googleusercontent.com")
    }
]);

export function provideConfig() {
    return config;
}

@NgModule({
    imports: [
        BrowserModule,
        HttpClientModule,
        Routing,
        CustomModule,
        SocialLoginModule,
    ],
    declarations: [
        AppComponent,
        HomeComponent,
        ResourcesComponent,
        ReportsComponent,
        JournalListComponent,
        AddJournalComponent,
        GoalsComponent,
        AboutComponent,
        AddGoalComponent,
        EditJournalComponent,
        SelectJournalComponent,
        // GoogleSignInComponent,
        AddResourcesComponent,
        CrisisButtonComponent,

    ],
    providers: [
        HomeService,
        ReportsService,
        GoalsService,
        JournalListService,
        ResourcesService,
        LoginService,
        HttpClientModule,
        {provide: APP_BASE_HREF, useValue: '/'},
        {provide: MATERIAL_COMPATIBILITY_MODE, useValue: true},
        {
            provide: AuthServiceConfig,
            useFactory: provideConfig
        }
    ],
    entryComponents: [
        AddGoalComponent,
        AddJournalComponent,
        EditJournalComponent,
        SelectJournalComponent,
        AddResourcesComponent,
        CrisisButtonComponent,
    ],
    bootstrap: [AppComponent]
})

export class AppModule {
}
