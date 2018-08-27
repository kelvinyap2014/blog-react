/* tslint:disable no-unused-expression */
import { browser } from 'protractor';

import NavBarPage from './../../page-objects/navbar-page';
import BlogComponentsPage from './blog.page-object';
import BlogUpdatePage from './blog-update.page-object';

const expect = chai.expect;

describe('Blog e2e test', () => {
  let navBarPage: NavBarPage;
  let blogUpdatePage: BlogUpdatePage;
  let blogComponentsPage: BlogComponentsPage;

  before(() => {
    browser.get('/');
    navBarPage = new NavBarPage();
    navBarPage.autoSignIn();
  });

  it('should load Blogs', async () => {
    navBarPage.getEntityPage('blog');
    blogComponentsPage = new BlogComponentsPage();
    expect(await blogComponentsPage.getTitle().getText()).to.match(/Blogs/);
  });

  it('should load create Blog page', async () => {
    blogComponentsPage.clickOnCreateButton();
    blogUpdatePage = new BlogUpdatePage();
    expect(await blogUpdatePage.getPageTitle().getAttribute('id')).to.match(/blogApp.blog.home.createOrEditLabel/);
  });

  it('should create and save Blogs', async () => {
    blogUpdatePage.setNameInput('name');
    expect(await blogUpdatePage.getNameInput()).to.match(/name/);
    blogUpdatePage.setHandleInput('handle');
    expect(await blogUpdatePage.getHandleInput()).to.match(/handle/);
    blogUpdatePage.userSelectLastOption();
    await blogUpdatePage.save();
    expect(await blogUpdatePage.getSaveButton().isPresent()).to.be.false;
  });

  after(() => {
    navBarPage.autoSignOut();
  });
});
