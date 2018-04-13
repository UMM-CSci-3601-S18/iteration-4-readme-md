import {Component, OnInit} from '@angular/core';
import {Observable} from "rxjs/Observable";
import {resources} from "./resources";
import {ResourcesService} from "./resources.service";
import {MatDialog} from "@angular/material/dialog";
import {AddResourcesComponent} from "./add-resources.component";
import {AuthService, SocialUser} from "angularx-social-login";

@Component({
    selector: 'resources-component',
    templateUrl: 'resources.component.html',
    styleUrls: ['./resources.component.css'],
})
export class ResourcesComponent implements OnInit{
    public title: string;
    public resources: resources[];
    public filteredResources: resources[];

    //This is the target value used in searching.
    public resourcesName: string;
    public user: SocialUser;


    constructor(public resourcesService: ResourcesService, public dialog: MatDialog,
                public authService: AuthService) {
        this.title = 'Resources';
    }

    openDialog(): void {
        const newResources: resources =
            {
                _id: '',
                name: '',
                body: '',
                phone: '',
                email: this.user.email,
            };
        const dialogRef = this.dialog.open(AddResourcesComponent, {
            width: '500px',
            data: { resources: newResources }
        });

        dialogRef.afterClosed().subscribe(result => {
            this.resourcesService.addResources(result).subscribe(
                addResourcesResult => {
                    this.refreshResources();
                },
                err => {
                    // This should probably be turned into some sort of meaningful response.
                    console.log('There was an error adding the resource.');
                    console.log('The error was ' + JSON.stringify(err));
                });
        });
    }


    public filterResources(searchName): resources[] {

        this.filteredResources = this.resources;

        // Filter by name
        if (searchName != null) {
            searchName = searchName.toLocaleLowerCase();

            this.filteredResources = this.filteredResources.filter(resources => {
                return !searchName || resources.name.toLowerCase().indexOf(searchName) !== -1;
            });
        }
        return this.filteredResources;
    }

    /**
     * Starts an asynchronous operation to update the resources list
     *
     */
    refreshResources(): Observable<resources[]> {
        // Get Resources returns an Observable, basically a "promise" that
        // we will get the data from the server.
        //
        // Subscribe waits until the data is fully downloaded, then
        // performs an action on it (the first lambda)

        const resourcesListObservable: Observable<resources[]> = this.resourcesService.getResources();
        resourcesListObservable.subscribe(
            resources => {
                this.resources = resources;
                this.filterResources(this.resourcesName);
            },
            err => {
                console.log(err);
            });
        return resourcesListObservable;
    }

    deleteResource(_id: string){
        this.resourcesService.deleteResource(_id).subscribe(
            resources => {
                this.refreshResources();
                this.loadService();
            },
            err => {
                console.log(err);
                this.refreshResources();
                this.loadService();
            }
        );
    }


    loadService(): void {
        this.resourcesService.getResources().subscribe(
            resources => {
                this.resources = resources;
                this.filteredResources = this.resources;
            },
            err => {
                console.log(err);
            }
        );
    }

    ngOnInit(): void {
        this.authService.authState.subscribe((user) => {
            this.user = user;
        });
        this.refreshResources();
    }

    //New function to return the name of the active user
    //window.* is not defined, or 'gettable' straight from HTML *ngIf
    //So this function will return that
    getLoginName(){
        var name = this.user.firstName;
        return name;
    }



}
