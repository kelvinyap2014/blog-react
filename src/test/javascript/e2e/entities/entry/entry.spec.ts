/* tslint:disable no-unused-expression */
import { browser, protractor } from 'protractor';

import NavBarPage from './../../page-objects/navbar-page';
import EntryComponentsPage from './entry.page-object';
import EntryUpdatePage from './entry-update.page-object';

const expect = chai.expect;

describe('Entry e2e test', () => {
  let navBarPage: NavBarPage;
  let entryUpdatePage: EntryUpdatePage;
  let entryComponentsPage: EntryComponentsPage;

  before(() => {
    browser.get('/');
    navBarPage = new NavBarPage();
    navBarPage.autoSignIn();
  });

  it('should load Entries', async () => {
    navBarPage.getEntityPage('entry');
    entryComponentsPage = new EntryComponentsPage();
    expect(await entryComponentsPage.getTitle().getText()).to.match(/Entries/);
  });

  it('should load create Entry page', async () => {
    entryComponentsPage.clickOnCreateButton();
    entryUpdatePage = new EntryUpdatePage();
    expect(await entryUpdatePage.getPageTitle().getAttribute('id')).to.match(/blogApp.entry.home.createOrEditLabel/);
  });

  it('should create and save Entries', async () => {
    entryUpdatePage.setTitleInput('title');
    expect(await entryUpdatePage.getTitleInput()).to.match(/title/);
    entryUpdatePage.setContentInput('content');
    expect(await entryUpdatePage.getContentInput()).to.match(/content/);
    entryUpdatePage.setDateInput('01/01/2001' + protractor.Key.TAB + '02:30AM');
    expect(await entryUpdatePage.getDateInput()).to.contain('2001-01-01T02:30');
    entryUpdatePage.blogSelectLastOption();
    // entryUpdatePage.tagSelectLastOption();
    await entryUpdatePage.save();
    expect(await entryUpdatePage.getSaveButton().isPresent()).to.be.false;
  });

  after(() => {
    navBarPage.autoSignOut();
  });
});
