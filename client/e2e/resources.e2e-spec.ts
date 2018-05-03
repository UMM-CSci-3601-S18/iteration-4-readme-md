import {ResourcesPage} from './resources.po';
import {element, by} from 'protractor';

// const origFn = browser.driver.controlFlow().execute;
//
// // https://hassantariqblog.wordpress.com/2015/11/09/reduce-speed-of-angular-e2e-protractor-tests/
// browser.driver.controlFlow().execute = function () {
//     let args = arguments;
//
//     // queue 100ms wait between test
//     // This delay is only put here so that you can watch the browser do its thing.
//     // If you're tired of it taking long you can remove this call
//     origFn.call(browser.driver.controlFlow(), function () {
//         return protractor.promise.delayed(100);
//     });
//
//     return origFn.apply(browser.driver.controlFlow(), args);
// };

describe('Testing all resource page functionality: from checking currently existing resources to adding new contacts', () => {
    let page: ResourcesPage;

    beforeEach(() => {
        page = new ResourcesPage();
    });

    it('should get and highlight Resources title attribute ', () => {
        ResourcesPage.navigateTo();
        expect(page.getResourceTitle()).toEqual('Your Contacts');
    });

    it('Should have an Add your own contact button', () => {
        ResourcesPage.navigateTo();
        expect(page.buttonExists()).toBeTruthy();
    });

    it('Should actually add the user with the information we put in the fields', () => {
        ResourcesPage.navigateTo();
        page.clickAddContactButton();
        element(by.id('nameField')).sendKeys('Zekken');
        element(by.id('bodyField')).sendKeys(':)');
        element(by.id('phonenumberField')).sendKeys('555-555-5590');
        element(by.id('confirmAddresourcesButton')).click();
    });

});
