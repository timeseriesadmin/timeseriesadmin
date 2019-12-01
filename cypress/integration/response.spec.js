describe('Response', () => {
  before(() => {
    cy.visit('/');
  });
  it('displays default message', () => {
    cy.getByText('Go ahead and "RUN QUERY"!').should('exist');
  });
  describe('invalid request', () => {
    before(() => {
      cy.server({
        status: 401,
      });
      cy.route(
        'POST',
        'http://localhost:8086/query',
        'error\nunable to parse authentication credentials',
      );
    });
    it('is displaying 401 error message', () => {
      cy.getByLabelText('Database URL').type('http://localhost:8086');
      cy.getByLabelText('Query').type('SELECT * FROM test');
      // ensure that CTRL/CMD+ENTER shortcut works
      cy.getByLabelText('Query').type('{meta}{enter}'); // meta = command/cmd
      // ensure
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
          // 10000 - 10100 , 1 - 100
          new Array(100)
            .fill(0)
            .map((el, index) => `${index + 10000},${index + 1}`)
            .join('\n'),
        { delay: 500 }, // ensure delay for executing state
      );
      cy.visit('/');
      cy.getByLabelText('Database URL').type('http://localhost:8086');
      cy.getByLabelText('Query').type('SELECT * FROM test');
    });
    it('shows executing state', () => {
      cy.getByText('Run query').click();
      cy.getByText('Executing query...').should('exist');
    });
    it('shows data returned from API', () => {
      cy.get('form')
        .next()
        .within(() => {
          cy.contains('SELECT * FROM test').should('exist');
          cy.get('tr').should('have.length', 1 + 1 + 100); // header + footer + content
        });
      cy.getByText('1-100 of 100').should('exist');
      cy.get('thead').within(() => {
        cy.getByText('first').should('exist');
        cy.getByText('second').should('exist');
      });
      cy.get('tbody').within(() => {
        for (let i = 0; i < 10; i++) {
          cy.getByText(`${i + 10000}`).should('exist');
          cy.getByText(`${i + 1}`).should('exist');
        }
      });
    });
    it('sorts returned data', () => {
      cy.get('thead').within(() => {
        cy.getByText('second').click();
      });

      cy.get('tbody').within(() => {
        for (let i = 0; i < 10; i++) {
          cy.getByText(`${100 - i}`).should('exist');
        }
      });

      cy.get('thead').within(() => {
        cy.getByText('second').click();
      });
      cy.get('tbody').within(() => {
        for (let i = 0; i < 10; i++) {
          cy.getByText(`${i + 1}`).should('exist');
        }
      });
    });
    it('limits rows per page', () => {
      cy.getByText('Rows per page:')
        .next()
        .within(() => {
          cy.getByText('100').click();
        });
      cy.get('[data-value=20]').click();
      cy.getByText('1-20 of 100').should('exist');
      cy.get('form')
        .next()
        .within(() => {
          cy.get('tr').should('have.length', 1 + 1 + 20); // header + footer + content
        });
      cy.getByLabelText('Next Page').click();
      for (let i = 20; i < 40; i++) {
        cy.getByText(`${i + 1}`).should('exist');
      }
      cy.getByLabelText('Previous Page').click(); // go back to default 1st page
    });
  });
});
