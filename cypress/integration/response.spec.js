describe('Response', () => {
  before(() => {
    cy.visit('/');
  });
  it('displays default message', () => {
    cy.getByText('Go ahead and "RUN QUERY"!').should('exist');
  });
  describe('invalid request', () => {
    it('is displaying 401 error message', () => {
      cy.getByLabelText('Database URL').type('http://localhost:8086');
      cy.getByLabelText('Query').type('SELECT * FROM test');
      cy.getByText('Run query').click();
      cy.getByText(
        '401:Unauthorized error unable to parse authentication credentials',
      ).should('exist');
    });
  });
  describe('valid request', () => {
    before(() => {
      cy.server();
      cy.route(
        'POST',
        'http://localhost:8086/query',
        'first,second\n' +
          // 0 - 9801 (99^2) , 1 - 100
          new Array(100)
            .fill(0)
            .map((el, index) => `${index ** 2},${index + 1}`)
            .join('\n'),
      );
      cy.visit('/');
      cy.getByLabelText('Database URL').type('http://localhost:8086');
      cy.getByLabelText('Query').type('SELECT * FROM test');
      cy.getByText('Run query').click();
    });
    it('shows data returned from API', () => {
      cy.get('form')
        .next()
        .within(() => {
          cy.contains('SELECT * FROM test').should('exist');
          cy.get('tr').should('have.length', 1 + 10); // header + content
        });
      cy.getByText('1-10 of 100').should('exist');
      cy.getByText('first').should('exist');
      cy.getByText('second').should('exist');
      for (let i = 0; i < 10; i++) {
        cy.getByText(`${i ** 2}`).should('exist');
        cy.getByText(`${i + 1}`).should('exist');
      }
    });
    it('sorts returned data', () => {
      cy.getByText('second').click();
      for (let i = 0; i < 10; i++) {
        cy.getByText(`${100 - i}`).should('exist');
      }
      cy.getByText('second').click();
      for (let i = 0; i < 10; i++) {
        cy.getByText(`${i + 1}`).should('exist');
      }
    });
    it('shows next page after click', () => {
      cy.getByLabelText('Next Page').click();
      for (let i = 10; i < 20; i++) {
        cy.getByText(`${i + 1}`).should('exist');
      }
      cy.getByLabelText('Previous Page').click(); // go back to default 1st page
    });
    it('limits rows per page', () => {
      cy.getByText('Rows per page:')
        .next()
        .within(() => {
          cy.getByText('10').click();
        });
      cy.get('[data-value=5]').click();
      cy.getByText('1-5 of 100').should('exist');
      cy.get('form')
        .next()
        .within(() => {
          cy.get('tr').should('have.length', 1 + 5); // header + content
        });
    });
  });
});
