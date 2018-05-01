import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {TestBed} from '@angular/core/testing';
import {HttpClient} from '@angular/common/http';

import {resources} from './resources';
import {ResourcesService} from "./resources.service";


describe('Resource list service: ', () => {
    // A small collection of test journals
    const testResources: resources[] = [
        {
            _id: '5ab2bc3742f5a7b6f0f48626',
            name: 'Lir Fealladh',
            body: 'My farther',
            phone: '555-555-5550',
            userId: 'Lir@Fealladh.com'

        },
        {
            _id: '5ab2bc37bc8681f8f0ddf797',
            name: 'Reina',
            body: 'My best friend',
            phone: '555-555-5551',
            userId: 'Reina@myfriend.com'

        },
        {
            _id: '5ab2bc370290adc56f8065fc',
            name: 'Suicide Prevention Lifeline',
            body: 'We can all help prevent suicide. The Lifeline provides 24/7, free and confidential support for people in distress, prevention and crisis resources for you or your loved ones, and best practices for professionals.',
            phone: '1-800-555-5555',
            userId: 'preventsuicide@lifeline.org'

        }
    ];
    const mResources: resources[] = testResources.filter(resources =>
        resources.name.toLowerCase().indexOf('m') !== -1
    );

    // We will need some url information from the journalListService to meaningfully test subject filtering;
    // https://stackoverflow.com/questions/35987055/how-to-write-unit-testing-for-angular-2-typescript-for-private-methods-with-ja
    let resourcesService: ResourcesService;
    let currentlyImpossibleToGenerateSearchResourceUrl: string;

    // These are used to mock the HTTP requests so that we (a) don't have to
    // have the server running and (b) we can check exactly which HTTP
    // requests were made to ensure that we're making the correct requests.

    let httpClient: HttpClient;
    let httpTestingController: HttpTestingController;

    beforeEach(() => {
        // Set up the mock handling of the HTTP requests
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule]
        });
        httpClient = TestBed.get(HttpClient);
        httpTestingController = TestBed.get(HttpTestingController);
        // Construct an instance of the service with the mock
        // HTTP client.
        resourcesService = new ResourcesService(httpClient);
    });

    afterEach(() => {
        // After every test, assert that there are no more pending requests.
        httpTestingController.verify();
    });

    it('getResources() calls api/resources', () => {
        // Assert that the journals we get from this call to getJournals()
        // should be our set of test journals. Because we're subscribing
        // to the result of getJournals(), this won't actually get
        // checked until the mocked HTTP request "returns" a response.
        // This happens when we call req.flush(testJournals) a few lines
        // down.
        resourcesService.getResources('').subscribe(
            resources => expect(resources).toBe(testResources)
        );

        // Specify that (exactly) one request will be made to the specified URL.
        const req = httpTestingController.expectOne(resourcesService.baseUrl + '?userId=');
        // Check that the request made to that URL was a GET request.
        expect(req.request.method).toEqual('GET');
        // Specify the content of the response to that request. This
        // triggers the subscribe above, which leads to that check
        // actually being performed.
        req.flush(testResources);
    });

    it('getResourceById() calls api/resources/id', () => {
        const targetResource: resources = testResources[1];
        const targetId: string = targetResource._id;
        resourcesService.getResourcesById(targetId).subscribe(
            resources => expect(resources).toBe(targetResource)
        );

        const expectedUrl: string = resourcesService.baseUrl + '/' + targetId;
        const req = httpTestingController.expectOne(expectedUrl);
        expect(req.request.method).toEqual('GET');
        req.flush(targetResource);
    });

    it('adding a resource calls api/resources/new', () => {
        const bryon_id = { '$oid': 'bryon_id' };
        const newResource: resources = {
            _id: '5ab2bc37e194ff1f2434eb46',
            name: 'Bryon',
            body: "My Other Best Friend",
            phone: "555-555-5552",
            userId: "bryonotherbestfriend.gov",
        };

        resourcesService.addResources(newResource).subscribe(
            id => {
                expect(id).toBe(bryon_id);
            }
        );

        const expectedUrl: string = resourcesService.baseUrl + '/new';
        const req = httpTestingController.expectOne(expectedUrl);
        console.log(req);
        expect(req.request.method).toEqual('POST');
        req.flush(bryon_id);
    });
});
