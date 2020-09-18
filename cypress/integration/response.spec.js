describe('Response', () => {
  before(() => {
    cy.visit('/');
  });
  it('displays default message', () => {
    cy.findByText('Go ahead and "RUN QUERY"!').should('exist');
  });
  describe('invalid request', () => {
    before(() => {
      cy.server({
        status: 401,
      });
      cy.route(
        'POST',
        'http://localhost:8086/query?q=SELECT+*+FROM+test&db=',
        'error\nunable to parse authentication credentials',
      );
    });
    it('is displaying 401 error message', () => {
      cy.findByLabelText('Database URL').type('http://localhost:8086');
      cy.findByLabelText('Query').type('SELECT * FROM test');
      // ensure that CTRL/CMD+ENTER shortcut works
      cy.findByLabelText('Query').type('{meta}{enter}'); // meta = command/cmd
      // ensure
      cy.findByText('401: Unauthorized').should('exist');
    });
  });
  describe('valid request', () => {
    before(() => {
      cy.server();
      cy.route(
        'POST',
        'http://localhost:8086/query?q=SELECT+*+FROM+test&db=',
        'first,second\n' +
          // 10000 - 10100 , 1 - 100
          new Array(100)
            .fill(0)
            .map((el, index) => `${index + 10000},${index + 1}`)
            .join('\n'),
        { delay: 500 }, // ensure delay for executing state
      );
      cy.visit('/');
      cy.findByLabelText('Database URL').type('http://localhost:8086');
      cy.findByLabelText('Query').type('SELECT * FROM test');
    });
    it('shows executing state', () => {
      cy.findByText('Run query').click();
      cy.findByText('Executing query...').should('exist');
    });
    it('shows data returned from API', () => {
      cy.get('form')
        .next()
        .within(() => {
          cy.contains('SELECT * FROM test').should('exist');
          cy.get('tr').should('have.length', 1 + 1 + 100); // header + footer + content
        });
      cy.findByText('1-100 of 100').should('exist');
      cy.get('thead').within(() => {
        cy.findByText('first').should('exist');
        cy.findByText('second').should('exist');
      });
      cy.get('tbody').within(() => {
        for (let i = 0; i < 10; i++) {
          cy.findByText(`${i + 10000}`).should('exist');
          cy.findByText(`${i + 1}`).should('exist');
        }
      });
    });
    it('sorts returned data', () => {
      cy.get('thead').within(() => {
        cy.findByText('second').click();
      });

      cy.get('tbody').within(() => {
        for (let i = 0; i < 10; i++) {
          cy.findByText(`${100 - i}`).should('exist');
        }
      });

      cy.get('thead').within(() => {
        cy.findByText('second').click();
      });
      cy.get('tbody').within(() => {
        for (let i = 0; i < 10; i++) {
          cy.findByText(`${i + 1}`).should('exist');
        }
      });
    });
    it('limits rows per page', () => {
      cy.findByText('Rows per page:')
        .next()
        .within(() => {
          cy.findByText('100').click();
        });
      cy.get('[data-value=20]').click();
      cy.findByText('1-20 of 100').should('exist');
      cy.get('form')
        .next()
        .within(() => {
          cy.get('tr').should('have.length', 1 + 1 + 20); // header + footer + content
        });
      cy.findByLabelText('Next Page').click();
      for (let i = 60; i < 80; i++) {
        cy.findByText(`${i + 1}`).should('exist');
      }
      cy.findByLabelText('Previous Page').click(); // go back to default 1st page
    });
  });
});
