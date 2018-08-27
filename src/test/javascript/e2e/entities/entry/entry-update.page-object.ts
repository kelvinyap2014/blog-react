import { element, by, ElementFinder } from 'protractor';

export default class EntryUpdatePage {
  pageTitle: ElementFinder = element(by.id('blogApp.entry.home.createOrEditLabel'));
  saveButton: ElementFinder = element(by.id('save-entity'));
  cancelButton: ElementFinder = element(by.id('cancel-save'));
  titleInput: ElementFinder = element(by.css('input#entry-title'));
  contentInput: ElementFinder = element(by.css('textarea#entry-content'));
  dateInput: ElementFinder = element(by.css('input#entry-date'));
  blogSelect: ElementFinder = element(by.css('select#entry-blog'));
  tagSelect: ElementFinder = element(by.css('select#entry-tag'));

  getPageTitle() {
    return this.pageTitle;
  }

  setTitleInput(title) {
    this.titleInput.sendKeys(title);
  }

  getTitleInput() {
    return this.titleInput.getAttribute('value');
  }

  setContentInput(content) {
    this.contentInput.sendKeys(content);
  }

  getContentInput() {
    return this.contentInput.getAttribute('value');
  }

  setDateInput(date) {
    this.dateInput.sendKeys(date);
  }

  getDateInput() {
    return this.dateInput.getAttribute('value');
  }

  blogSelectLastOption() {
    this.blogSelect
      .all(by.tagName('option'))
      .last()
      .click();
  }

  blogSelectOption(option) {
    this.blogSelect.sendKeys(option);
  }

  getBlogSelect() {
    return this.blogSelect;
  }

  getBlogSelectedOption() {
    return this.blogSelect.element(by.css('option:checked')).getText();
  }

  tagSelectLastOption() {
    this.tagSelect
      .all(by.tagName('option'))
      .last()
      .click();
  }

  tagSelectOption(option) {
    this.tagSelect.sendKeys(option);
  }

  getTagSelect() {
    return this.tagSelect;
  }

  getTagSelectedOption() {
    return this.tagSelect.element(by.css('option:checked')).getText();
  }

  save() {
    return this.saveButton.click();
  }

  cancel() {
    this.cancelButton.click();
  }

  getSaveButton() {
    return this.saveButton;
  }
}
