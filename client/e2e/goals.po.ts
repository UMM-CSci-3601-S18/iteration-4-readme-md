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

     getUniqueGoal(name: string) {
         const goal = element(by.id(name)).getText();
         this.highlightElement(by.id(name));

         return goal;
     }

     /*getGoalText() {
        //What is elementToGet is? Which Id should I put here?
         const elementToGet = element(by.id(goal._id['$oid']));
         return elementToGet.getText();
     }*/

     clickElementByCss(css: string) {
         const elementToClick = element(by.css(css));
         elementToClick.click();
         return elementToClick.isPresent();
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

    testAddNewGoal(name: string, category: string, purpose: string) {
        const input = element(by.id('addNewGoal'));
        input.click();
        const nameInput = element(by.id('name'));
        nameInput.sendKeys(name);

        const categoryInput = element(by.id('category-list'));
        categoryInput.click();
        categoryInput.sendKeys(category);

        //How to select mat-option?
        const purposeInput = element(by.css('.mat-select[value = Work]'));
        purposeInput.click();
        purposeInput.sendKeys(purpose)


        const button = element(by.id('confirmAddGoalButton'));
        const buttonWasThere = button.isDisplayed();
        button.click();
        return buttonWasThere;
    }

    testDeleteGoal(){
        const input = element(by.id('deletegoal'));
        input.click();

}

}
