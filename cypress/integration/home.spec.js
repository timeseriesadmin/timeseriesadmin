describe('Home Page', () => {
  before(() => {
    cy.server();
    cy.route(
      'GET',
      'https://api.github.com/repos/timeseriesadmin/timeseriesadmin/releases/latest',
      { tag_name: 'v9.9.9' },
    );
    cy.visit('/');
  });
  it('shows new version info', () => {
    cy.getByText('New version available').should('exist');
  });
  it('successfully loads all content', () => {
    // sidebar panels
    cy.getByText('Connect').should('exist');
    cy.getByText('Explorer').should('exist');
    cy.getByText('History').should('exist');
    cy.getByText('Reference').should('exist');
    // default panel content
    cy.getByText('List of all saved connections').should('exist');
    // title
    cy.getByText('Time Series Admin').should('exist');
  });
  it('has working sidebar panels', () => {
    cy.getByText('Explorer').click();
    cy.getByText('Explore currently connected server').should('exist');
    cy.getByText('History').click();
    cy.getByText(
      'List of most recent queries executed, with max length of 30 items.',
    ).should('exist');
    cy.getByText('Reference').click();
    cy.getByText('official InfluxDB docs').should('exist');
    cy.getByText('Connect').click();
    cy.queryByText('official InfluxDB docs').should('not.exist');
    cy.getByText('List of all saved connections').should('exist');
  });
  it('has working sidebar toggle button', () => {
    cy.getByTitle('Close sidebar').click();
    cy.getByText('List of all saved connections').then(el =>
      cy.wrap(el).should('not.be.visible'),
    );
  });
});
