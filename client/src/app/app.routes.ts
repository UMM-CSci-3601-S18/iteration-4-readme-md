// Imports
import {ModuleWithProviders} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {HomeComponent} from './home/home.component';
import {UserListComponent} from './users/user-list.component';
import {ResourcesComponent} from "./resources/resources.component";
import {ReportsComponent} from "./reports/reports.component";

// Route Configuration
export const routes: Routes = [
    {path: '', component: HomeComponent},
    {path: 'users', component: UserListComponent},
    {path: 'resources', component: ResourcesComponent },
    {path: 'reports', component: ReportsComponent },

];

export const Routing: ModuleWithProviders = RouterModule.forRoot(routes);
