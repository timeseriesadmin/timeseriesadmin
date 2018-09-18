// @flow
import React from 'react';
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';
import FormInflux from '../FormInflux';
import ResultsTable from '../ResultsTable';

const PageHome = () => (
  <div>
    <br/>
    <Mutation mutation={FORM_QUERY} fetchPolicy="no-cache">
      {(executeQuery, queryState) => (
        <Mutation mutation={UPDATE_FORM}>
          {(formMutate, _mutationState) => {
            const onSubmit = (values): void => {
              formMutate({ variables: values });
              // prevent displaying errors in console (they are handled in resolvers)
              executeQuery({ variables: {} }).catch(err => {});
            };

            return (
              <div>
                <FormInflux onSubmit={onSubmit} />
                <ResultsTable queryState={queryState} />
              </div>
            );
          }}
        </Mutation>
      )}
    </Mutation>
  </div>
);

// TODO: use query instead, with no-cache policy
const FORM_QUERY = gql`
  mutation executeQuery {
    executeQuery @client
  }
`;

const UPDATE_FORM = gql`
  mutation updateForm($url: String, $u: String, $p: String, $db: String, $q: String) {
    updateForm(url: $url, u: $u, p: $p, db: $db, q: $q) @client 
  }
`;

export default PageHome;
