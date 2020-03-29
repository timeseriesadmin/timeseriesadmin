describe('Home Page', () => {
  before(() => {
    cy.visit('/');
  });
  it('successfully loads all content', () => {
    cy.findAllByText('New version available').should('not.exist');
    // sidebar panels
    cy.findByText('Connect').should('exist');
    cy.findByText('Explorer').should('exist');
    cy.findByText('History').should('exist');
    cy.findByText('Reference').should('exist');
    // default panel content
    cy.findByText('List of all saved connections').should('exist');
    // title
    cy.findByTestId('TopBar').within(() => {
      cy.findByText('Time Series Admin').should('exist');
    });
  });
  it('has working sidebar panels', () => {
    cy.findByText('Explorer').click();
    cy.findByText('Not connected').should('exist');
    cy.findByText('History').click();
    cy.findByText(
      'List of most recent queries executed, with max length of 300 items.',
    ).should('exist');
    cy.findByText('Reference').click();
    cy.findByText('official InfluxDB docs').should('exist');
    cy.findByText('Connect').click();
    cy.findAllByText('official InfluxDB docs').should('not.exist');
    cy.findByText('List of all saved connections').should('exist');
  });
  it('has working sidebar toggle button', () => {
    cy.findByTitle('Close sidebar').click();
    cy.findByText('List of all saved connections').then(el =>
      cy.wrap(el).should('not.be.visible'),
    );
  });
});

describe('New version button', () => {
  before(() => {
    cy.server();
    cy.route(
      'GET',
      'https://api.github.com/repos/timeseriesadmin/timeseriesadmin/releases/latest',
      // eslint-disable-next-line @typescript-eslint/camelcase
      { tag_name: 'v9.9.9' },
    );
    cy.visit('/');
  });
  it('shows new version info', () => {
    cy.findByText('New version available').should('exist');
    // cy.findByText('New version available').click();
    // cy.url().should('include', 'timeseriesadmin.github.io');
    // cy.url().should('include', 'download');
    // cy.title().should('include', 'Time Series Admin');
  });
});
