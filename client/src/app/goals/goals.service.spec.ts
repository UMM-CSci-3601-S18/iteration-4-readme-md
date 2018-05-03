import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {TestBed} from '@angular/core/testing';
import {HttpClient} from '@angular/common/http';



import {Goal} from "./goals";
import {GoalsService} from "./goals.service";



describe('Goal  service: ', () => {
    // A small collection of test goals
    const testGoals: Goal[] = [
        {
            _id: "5aa0b36ecf40cfd384c299fd",
            purpose: "To feel better",
            category: "Health",
            name: 'Eat all the cookies',
            status:true,
            userId: "brittany@gmail.com",
        },
        {
            _id: "5aa0b36e50d6094af8e91aba",
            purpose: "To call my mom",
            category: "Family",
            name: 'I need to call my mom',
            status:false ,
            userId: "cathleen@gmail.com",
        },
        {
            _id: "5aa0b36e3f417437ce3c502a",
            purpose: 'To love Him',
            category: 'Family',
            name: 'Call Dad',
            status: true,
            userId: "martinez@gmail.com",
        },
    ];
    const mGoals: Goal[] = testGoals.filter(goal =>
        goal._id.toLowerCase().indexOf('m') !== -1
    );

    // We will need some url information from the goalService to meaningfully test company filtering;
    // https://stackoverflow.com/questions/35987055/how-to-write-unit-testing-for-angular-2-typescript-for-private-methods-with-ja
    let goalService: GoalsService;
    let currentlyImpossibleToGenerateSearchGoalUrl: string;

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
        goalService = new GoalsService(httpClient);
    });

    afterEach(() => {
        // After every test, assert that there are no more pending requests.
        httpTestingController.verify();
    });

    it('getGoals() calls api/goals', () => {
        // Assert that the goals we get from this call to getGoals()
        // should be our set of test goals. Because we're subscribing
        // to the result of getGoals(), this won't actually get
        // checked until the mocked HTTP request "returns" a response.
        // This happens when we call req.flush(testGoals) a few lines
        // down.
        goalService.getGoals('').subscribe(
            goals => expect(goals).toBe(testGoals)
        );

        // Specify that (exactly) one request will be made to the specified URL.
        const req = httpTestingController.expectOne(goalService.baseUrl + '?userId=');
        // Check that the request made to that URL was a GET request.
        expect(req.request.method).toEqual('GET');
        // Specify the content of the response to that request. This
        // triggers the subscribe above, which leads to that check
        // actually being performed.
        req.flush(testGoals);
    });

/*
    it('getGoals(goalOwner) adds appropriate param string to called URL', () => {
        goalService.getGoals('m').subscribe(
            goals => expect(goals).toEqual(mGoals)
        );

        const req = httpTestingController.expectOne(goalService.baseUrl + '?owner=m&');
        expect(req.request.method).toEqual('GET');
        req.flush(mGoals);
    });
*/

    it('getGoalById() calls api/goals/id', () => {
        const targetGoal: Goal = testGoals[1];
        const targetId: string = targetGoal._id;
        goalService.getGoalById(targetId).subscribe(
            goal => expect(goal).toBe(targetGoal)
        );

        const expectedUrl: string = goalService.baseUrl + '/' + targetId;
        const req = httpTestingController.expectOne(expectedUrl);
        expect(req.request.method).toEqual('GET');
        req.flush(targetGoal);
    });

    it('adding a goal calls api/goals/new', () => {
        const enid_id = { '$oid': 'enid_id' };
        const newGoal: Goal = {
                _id: "5aa0b36e9c7d66070b9231e4",
                purpose:"To get a good grade",
                category: "Study",
                name: "Study for math",
                status: false,
                userId: "enid@gmail.com",
            };

        goalService.addGoal(newGoal).subscribe(
            id => {
                expect(id).toBe(enid_id);
            }
        );


        const expectedUrl: string = goalService.baseUrl + '/new';
        const req = httpTestingController.expectOne(expectedUrl);

        expect(req.request.method).toEqual('POST');
        req.flush(enid_id);
    });


    it('editing a goal calls api/goals/edit', () => {
        const family_id = { '$oid': 'family_id' };
        const editGoal: Goal = {
            _id: "5aa0b36e9c7d66070b9231e4",
            purpose:"To get a good grade",
            category: "Study",
            name: "Study for math",
            status: false,
            userId: "enid@gmail.com",
        };

        goalService.editGoal(editGoal).subscribe(
            id => {
                expect(id).toBe(family_id);
            }
        );

        const expectedUrl: string = goalService.baseUrl + '/edit';
        const req = httpTestingController.expectOne(expectedUrl);
        expect(req.request.method).toEqual('POST');
        req.flush(family_id);
    });

    it('deleting a goal calls api/goals/delete', () => {

        // deleting 'call dad'
        goalService.deleteGoal('5aa0b36e3f417437ce3c502a').subscribe(
            (res) => {
                expect(res).toBe('5aa0b36e3f417437ce3c502a');
            }
        );

        const expectedUrl: string = goalService.baseUrl + '/delete/5aa0b36e3f417437ce3c502a';
        const req = httpTestingController.expectOne(expectedUrl);
        expect(req.request.method).toEqual('DELETE');
        req.flush('5aa0b36e3f417437ce3c502a');
    });
});
