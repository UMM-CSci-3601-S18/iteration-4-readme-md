import {GoalPage} from './goals.po';
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

describe('', () => {
    let page: GoalPage;

    beforeEach(() => {
        page = new GoalPage();
    });

    it('Should add a goal.', () => {
        GoalPage.navigateTo();
        expect(page.testAddNewGoal("Get score", "Work", "improve salary")).toBeTruthy();
    });

    // Doesn't work

    it('Should view a goal.', () => {
        GoalPage.navigateTo();
        expect(page.getGoalText()).toBe('Get score');
    });
/*
     it('Should open the expansion panel and get the Name', () => {
         GoalPage.navigateTo();
         GoalPage.getOwner('DATA');
         browser.actions().sendKeys(Key.ENTER).perform();

         expect(page.getUniqueGoal('Drink more water')).toEqual('Drink more water');

         // This is just to show that the panels can be opened
         browser.actions().sendKeys(Key.TAB).perform();
         browser.actions().sendKeys(Key.ENTER).perform();
    })
    */
});
