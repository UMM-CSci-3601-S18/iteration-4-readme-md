import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {TestBed} from '@angular/core/testing';
import {HttpClient} from '@angular/common/http';

import {Journal} from "./journal";
import {JournalListService} from "./journal-list.service";

describe('Journal list service: ', () => {
    // A small collection of test journals
    const testJournals: Journal[] = [
        {
            _id: "5aa0b36e401cfced5f36b1a7",
            subject: "York",
            body: "You can do it",
            date: "Sun Feb 04 1979 13:35:46 GMT-0600 (CST)",
            email: "york@fake.com"
        },
        {
            _id: "5aa0b36ef2d33e651859bd70",
            subject: "Sutton",
            body: "Get it done",
            date: "Sun Oct 28 2012 03:04:31 GMT-0500 (CDT)",
            email: "sutton@suttonsemail.com"
        },
        {
            _id: "5aa0b36e5c1d05d2cb0460a4",
            subject: "Madelyn",
            body: "There you go",
            date: "Thu Sep 25 2003 14:45:37 GMT-0500 (CDT)",
            email: "madelynrules@myspace.com"
        }
    ];
    const mJournals: Journal[] = testJournals.filter(journal =>
        journal.subject.toLowerCase().indexOf('m') !== -1
    );

    // We will need some url information from the journalListService to meaningfully test subject filtering;
    // https://stackoverflow.com/questions/35987055/how-to-write-unit-testing-for-angular-2-typescript-for-private-methods-with-ja
    let journalListService: JournalListService;
    let currentlyImpossibleToGenerateSearchJournalUrl: string;

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
        journalListService = new JournalListService(httpClient);
    });

    afterEach(() => {
        // After every test, assert that there are no more pending requests.
        httpTestingController.verify();
    });

    it('getJournals() calls api/journals', () => {
        // Assert that the journals we get from this call to getJournals()
        // should be our set of test journals. Because we're subscribing
        // to the result of getJournals(), this won't actually get
        // checked until the mocked HTTP request "returns" a response.
        // This happens when we call req.flush(testJournals) a few lines
        // down.
        journalListService.getJournals('').subscribe(
            journals => expect(journals).toBe(testJournals)
        );

        // Specify that (exactly) one request will be made to the specified URL.
        const req = httpTestingController.expectOne(journalListService.baseUrl);
        // Check that the request made to that URL was a GET request.
        expect(req.request.method).toEqual('GET');
        // Specify the content of the response to that request. This
        // triggers the subscribe above, which leads to that check
        // actually being performed.
        req.flush(testJournals);
    });

    it('getJournals(journalSubject) adds appropriate param string to called URL', () => {
        journalListService.getJournals('m').subscribe(
            journals => expect(journals).toEqual(mJournals)
        );

        const req = httpTestingController.expectOne(journalListService.baseUrl + '?email=m&');
        expect(req.request.method).toEqual('GET');
        req.flush(mJournals);
    });

    it('filterBySubject(journalSubject) deals appropriately with a URL that already had a subject', () => {
        currentlyImpossibleToGenerateSearchJournalUrl = journalListService.baseUrl + '?subject=f&something=k&';
        journalListService['journalUrl'] = currentlyImpossibleToGenerateSearchJournalUrl;
        journalListService.filterBySubject('m');
        expect(journalListService['journalUrl']).toEqual(journalListService.baseUrl + '?something=k&subject=m&');
    });

    it('filterBySubject(journalSubject) deals appropriately with a URL that already had some filtering, but no subject', () => {
        currentlyImpossibleToGenerateSearchJournalUrl = journalListService.baseUrl + '?something=k&';
        journalListService['journalUrl'] = currentlyImpossibleToGenerateSearchJournalUrl;
        journalListService.filterBySubject('m');
        expect(journalListService['journalUrl']).toEqual(journalListService.baseUrl + '?something=k&subject=m&');
    });

    it('filterBySubject(journalSubject) deals appropriately with a URL has the keyword subject, but nothing after the =', () => {
        currentlyImpossibleToGenerateSearchJournalUrl = journalListService.baseUrl + '?subject=&';
        journalListService['journalUrl'] = currentlyImpossibleToGenerateSearchJournalUrl;
        journalListService.filterBySubject('');
        expect(journalListService['journalUrl']).toEqual(journalListService.baseUrl + '');
    });

    it('getJournalById() calls api/journals/id', () => {
        const targetJournal: Journal = testJournals[1];
        const targetId: string = targetJournal._id;
        journalListService.getJournalById(targetId).subscribe(
            journal => expect(journal).toBe(targetJournal)
        );

        const expectedUrl: string = journalListService.baseUrl + '/' + targetId;
        const req = httpTestingController.expectOne(expectedUrl);
        expect(req.request.method).toEqual('GET');
        req.flush(targetJournal);
    });

    it('adding a journal calls api/journals/new', () => {
        const pennington_id = { '$oid': 'pennington_id' };
        const newJournal: Journal = {
            _id: "5aa0b36e1f57545f27a26b69",
            subject: "Pennington",
            body: "Get it done",
            date: "Sun Feb 07 1982 22:41:23 GMT-0600 (CST)",
            email: "pennington@penn.com"
        };

        journalListService.addNewJournal(newJournal).subscribe(
            id => {
                expect(id).toBe(pennington_id);
            }
        );

        const expectedUrl: string = journalListService.baseUrl + '/new';
        const req = httpTestingController.expectOne(expectedUrl);
        console.log(req);
        expect(req.request.method).toEqual('POST');
        req.flush(pennington_id);
    });
});
