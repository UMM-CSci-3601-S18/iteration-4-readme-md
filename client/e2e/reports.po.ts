import {browser, element, by, promise} from 'protractor';
import {Key} from 'selenium-webdriver';

export class ReportsPage {
    static navigateTo(): promise.Promise<any> {
        return browser.get('/reports');
    }

    filterReports(mood: string) {
        const select = element(by.id('selector'));
        select.click();

        const value = element(by.cssContainingText('mat-option', mood));
        value.click();
    }

    getEmoji(id) {
        const report = element(by.id(id));
        return report.isDisplayed();
    }
}
