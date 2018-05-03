import {browser, element, by, promise} from 'protractor';
import {Key} from "selenium-webdriver";

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

    highlightElement(byObject) {
        function setStyle(element, style) {
            const previous = element.getAttribute('style');
            element.setAttribute('style', style);
            setTimeout(() => {
                element.setAttribute('style', previous);
            }, 200);
            return 'highlighted';
        }

        return browser.executeScript(setStyle, element(byObject).getWebElement(), 'color: red; background-color: yellow;');
    }

    submitButtonExists(): promise.Promise<boolean> {
        this.highlightElement(by.id('submit'));
        return element(by.id('submit')).isPresent();
    }

    clickSubmitButton(): promise.Promise<void> {
        this.highlightElement(by.id('submit'));
        return element(by.id('submit')).click();
    }

    dateDropdownExists(): promise.Promise<boolean> {
        this.highlightElement(by.id('labelType'));
        return element(by.id('labelType')).Present();
    }

    clickDateDropdown(): promise.Promise<void> {
        this.highlightElement(by.id('labelType'));
        return element(by.id('labelType')).click();
    }

     selectDownKey() {
        browser.actions().sendKeys(Key.ARROW_DOWN).perform();
    }

    selectEnterKey() {
        browser.actions().sendKeys(Key.ENTER).perform();
    }

    graphReviewExists(): promise.Promise<boolean> {
        this.highlightElement(by.id('graphReview'));
        return element(by.id('graphReview')).Present();
    }

    clickGraphReview(): promise.Promise<void> {
        this.highlightElement(by.id('graphReview'));
        return element(by.id('graphReview')).click();
    }

    listReviewExists(): promise.Promise<boolean> {
        this.highlightElement(by.id('listReview'));
        return element(by.id('listReview')).Present();
    }

    clickListReview(): promise.Promise<void> {
        this.highlightElement(by.id('listReview'));
        return element(by.id('listReview')).click();
    }

    startDateExists(): promise.Promise<boolean> {
        this.highlightElement(by.id('startDate'));
        return element(by.id('startDate')).Present();
    }

    endDateExists(): promise.Promise<boolean> {
        this.highlightElement(by.id('endDate'));
        return element(by.id('endDate')).Present();
    }

    listReviewTabExists(): promise.Promise<boolean> {
        this.highlightElement(by.id('listReviewTab'));
        return element(by.id('listReviewTab')).Present();
    }

    clickListReviewTab(): promise.Promise<void> {
        this.highlightElement(by.id('listReviewTab'));
        return element(by.id('listReviewTab')).click();
    }

    reportsExists(): promise.Promise<boolean> {
        this.highlightElement(by.id('selector'));
        return element(by.id('selector')).Present();
    }

    clickReports(): promise.Promise<void> {
        this.highlightElement(by.id('selector'));
        return element(by.id('selector')).click();
    }

    pieChartExists(): promise.Promise<boolean> {
        this.highlightElement(by.id('pieChart'));
        return element(by.id('pieChart')).Present();
    }

    clickPieCharts(): promise.Promise<void> {
        this.highlightElement(by.id('pieChart'));
        return element(by.id('pieChart')).click();
    }

}
