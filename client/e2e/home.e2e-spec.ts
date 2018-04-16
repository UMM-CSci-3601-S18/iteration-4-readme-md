import {HomePage} from './home.po';
import {browser, protractor, element, by} from 'protractor';
import {Key} from 'selenium-webdriver';

 const origFn = browser.driver.controlFlow().execute;

// https://hassantariqblog.wordpress.com/2015/11/09/reduce-speed-of-angular-e2e-protractor-tests/
browser.driver.controlFlow().execute = function () {
    let args = arguments;

    // queue 100ms wait between test
    // This delay is only put here so that you can watch the browser do its thing.
    // If you're tired of it taking long you can remove this call
    // origFn.call(browser.driver.controlFlow(), function () {
    //     return protractor.promise.delayed(100);
    // });

    return origFn.apply(browser.driver.controlFlow(), args);
};

describe('Tests all functionality on the homepage: mostly just the slider/emotion selector ', () => {
    let page: HomePage;

    beforeEach(() => {
        page = new HomePage();
    });

    it('should add an entry', () => {
        HomePage.navigateTo();
        HomePage.selectTheSlider();

        expect(element(by.id('3emoji')).isPresent()).toBeTruthy(); //check that the correct emoji is displayed
        page.clickSubmitButton();
    });

    it("should move the slider positively and click submit. It then navigates to to the report page",() => {
        HomePage.navigateTo();
         HomePage.selectTheSlider();
         HomePage.SlideTheSliderUp();
         HomePage.SlideTheSliderUp();
        expect(element(by.id('5emoji')).isPresent()).toBeTruthy(); //check that the correct emoji is displayed
        page.clickSubmitButton();
        HomePage.navigateToReports();

        // Need to find out default name
        // HomePage.filterOwner('NG_DEFER_BOOTSTRAP');
        // expect( page.getUniqueOwner()).toContain('NG_DEFER_BOOTSTRAP');
    });

    it("should move the slider positively and negatively and click submit",() => {
        HomePage.navigateTo();
        HomePage.selectTheSlider();
        HomePage.SlideTheSliderUp();
        HomePage.SlideTheSliderUp();
        HomePage.SlideTheSliderDown();
        HomePage.SlideTheSliderDown();
        HomePage.SlideTheSliderDown();
        HomePage.SlideTheSliderDown();
        expect(element(by.id('1emoji')).isPresent()).toBeTruthy(); //check that the correct emoji is displayed
        page.clickSubmitButton();
        HomePage.navigateToReports();

        // Need to find out default name
        // HomePage.filterOwner('Roch');
        // expect( page.getUniqueOwner()).toContain('Roch');
    });
});
