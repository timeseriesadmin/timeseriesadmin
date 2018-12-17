describe('Form', () => {
  before(() => {
    cy.visit('/');
  });
  it('renders fields', () => {
    cy.getByText('Database URL').should('exist');
    cy.getByText('User').should('exist');
    cy.getByText('Password').should('exist');
    cy.getByText('Database').should('exist');
    cy.getByText('Run query').should('exist');
    cy.getByText('Save connection data').should('exist');
  });
  it('shows and hides password', () => {
    cy.getByLabelText('Password')
      .as('input')
      .type('secretPass');
    cy.get('@input').should('have.attr', 'type', 'password');
    cy.get('@input')
      .next()
      .children('button')
      .as('toggle_btn')
      .click();
    cy.get('@input').should('have.attr', 'type', 'text');
    cy.get('@toggle_btn').click();
    cy.get('@input').should('have.attr', 'type', 'password');
  });
  it('saves and loads connection data', () => {
    cy.getByLabelText('Database URL').type('http://test.test:8086');
    cy.getByLabelText('User').type('Username');
    cy.getByLabelText('Password').type('SecretPass');
    cy.getByLabelText('Database').type('TestDatabase');
    cy.getByText('Save connection data').click();

    cy.getByText('http://test.test:8086').should('exist');
    cy.getByText('database: TestDatabase').should('exist');
    cy.getByText('user: Username').should('exist');

    cy.getByLabelText('User').type('invalidUsername');
    cy.getByText('http://test.test:8086').click();
    cy.getByLabelText('User').should('have.value', 'Username');

    cy.getByText('http://test.test:8086')
      .closest('button')
      .next()
      .click();
    cy.getByText('database: TestDatabase').should('not.exist');
    cy.getByText('No data').should('exist');
  });
});
