import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {TestBed} from '@angular/core/testing';
import {HttpClient} from '@angular/common/http';
import {LoginService} from "./login.service";
import {AuthResponse} from "./AuthResponse";

describe('Login service: ', () => {

    let loginService: LoginService;
    let testResponse: AuthResponse;
    let testErr: ErrorEvent = new ErrorEvent('Invalid Token');

    testResponse = {

        iss: '',
        sub: '',
        azp: '',
        aud: '',
        iat: '',
        exp: '',

        email: '',
        email_verified: true,
        name : 'test dummy',
        picture: '',
        given_name: '',
        family_name: '',
        locale: '',

    };

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
        // Construct an instance of the service emojiOwner?: stringwith the mock
        // HTTP client.
        loginService = new LoginService(httpClient);
    });

    afterEach(() => {
        // After every test, assert that there are no more pending requests.
        httpTestingController.verify();
    });


    it('authenticate calls the correct url', () => {

        // Assert that the authResponse we get from this call to authenticate()
        // should be our test authResponse. Because this is a promise,
        // the result of authenticate() won't actually get
        // checked until the mocked HTTP request "returns" a response.
        // This happens when we call req.flush(testResponse) a few lines
        // down.
        loginService.authenticate('testToken')
            .then((authResponse) => {
                expect(authResponse).toBe(testResponse)
            });

        // Specify that (exactly) one request will be made to the specified URL.
        const req = httpTestingController.expectOne('https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=testToken');
        // Check that the request made to that URL was a GET request.
        expect(req.request.method).toEqual('GET');
        // Specify the content of the response to that request. This
        // triggers the subscribe above, which leads to that check
        // actually being performed.
        req.flush(testResponse);
    });

    it('authenticate returns an error when it receives a bad response', () => {
        loginService.authenticate('badTestToken')
            .catch((err) => {
                // I couldn't figure out how to create the correct object to compare the error to, so we just check if
                // it's defined
                expect(err).toBeDefined()
            });
        // Specify that (exactly) one request will be made to the specified URL.
        const req = httpTestingController.expectOne('https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=badTestToken');
        // Check that the request made to that URL was a GET request.
        expect(req.request.method).toEqual('GET');
        // Specify the content of the response to that request. This
        // triggers the subscribe above, which leads to that check
        // actually being performed.
        req.error(testErr);
    });

});
