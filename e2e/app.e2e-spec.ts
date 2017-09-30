import { SpeegarPage } from './app.po';

describe('speegar App', () => {
  let page: SpeegarPage;

  beforeEach(() => {
    page = new SpeegarPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!!');
  });
});
