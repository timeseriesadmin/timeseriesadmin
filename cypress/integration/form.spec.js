describe('Form', () => {
  before(() => {
    cy.visit('/');
  });
  it('renders fields', () => {
    cy.findByText('Database URL').should('exist');
    cy.findByText('User').should('exist');
    cy.findByText('Password').should('exist');
    cy.findByText('Database').should('exist');
    cy.findByText('Run query').should('exist');
    cy.findByText('Save connection data').should('exist');
  });
  it('shows and hides password', () => {
    cy.findByLabelText('Password')
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
    cy.findByLabelText('Database URL').type('http://test.test:8086');
    cy.findByLabelText('User').type('Username');
    cy.findByLabelText('Password').type('SecretPass');
    cy.findByLabelText('Database').type('TestDatabase');
    cy.findByText('Save connection data').click();

    cy.findByText('http://test.test:8086').should('exist');
    cy.findByText('database: TestDatabase').should('exist');
    cy.findByText('user: Username').should('exist');

    cy.findByLabelText('User').type('invalidUsername');
    cy.findByText('http://test.test:8086').click();
    cy.findByLabelText('User').should('have.value', 'Username');

    cy.findByText('http://test.test:8086')
      .closest('button')
      .next()
      .click();
    cy.queryByText('database: TestDatabase').should('not.exist');
    cy.findByText(
      'No saved connections. Add one using SAVE CONNECTION DATA button.',
    ).should('exist');
  });
});
