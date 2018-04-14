import {browser, element, by, promise} from 'protractor';
import {Key} from 'selenium-webdriver';

export class GoalPage {
    static navigateTo(): promise.Promise<any> {
        return browser.get('/goals');
    }

         static getOwner(name: string) {
         const input = element(by.id('goalOwner'));
         input.click();
         input.sendKeys(name);
         const selectButton = element(by.id('submit'));
         selectButton.click();
     }

     getUniqueGoal() {
         const goal = element(by.cssContainingText('.mat-card-title', 'Go to bed early')).getText();
         return goal;
     }

     clickComplete() {
         const elementToClick = element(by.id('complete'));
         elementToClick.click();
     }

    clickCompleteTab() {
        const element2ToClick = element(by.id('md-tab-label-0-1'));
        element2ToClick.click();
    }

    clickDelete() {
        const element3ToClick = element(by.id('delete'));
        element3ToClick.click();
    }

    static clickElement(elementId: string){
        const input = element(by.id(elementId));
        input.click();
    }

    // http://www.assertselenium.com/protractor/highlight-elements-during-your-protractor-test-run/
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

    testAddNewGoal(name: string, purpose: string) {
        const input = element(by.id('addNewGoalButton'));
        input.click();
        const nameInput = element(by.id('nameField'));
        nameInput.sendKeys(name);
        const categoryInput = element(by.id('category-list'));
        categoryInput.click();
        const categoryItem = element(by.cssContainingText('.mat-option', 'Chores')); //https://github.com/angular/protractor/issues/4304
        categoryItem.click();
        const purposeInput = element(by.id('purposeField'));
        purposeInput.sendKeys(purpose);
        const button = element(by.id('confirmAddGoalButton'));
        const buttonWasThere = button.isDisplayed();
        button.click();
        return buttonWasThere;
    }

}
