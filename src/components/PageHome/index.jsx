// @flow
import React from 'react';
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';
import FormInflux from '../FormInflux';
import ResultsTable from '../ResultsTable';

const PageHome = () => (
  <div>
    <br/>
    <Mutation mutation={QUERY_DB} fetchPolicy="no-cache">
      {(queryMutate, queryState) => (
        <Mutation mutation={UPDATE_FORM}>
          {(formMutate, _mutationState) => {
            const onSubmit = (values): void => {
              formMutate({ variables: values });
              queryMutate({ variables: values });
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
const QUERY_DB = gql`
  mutation influxQuery($url: String, $u: String, $p: String, $db: String, $q: String) {
    influxQuery(url: $url, u: $u, p: $p, db: $db, q: $q) @client
  }
`;

const UPDATE_FORM = gql`
  mutation updateForm($url: String, $u: String, $p: String, $db: String, $q: String) {
    updateForm(url: $url, u: $u, p: $p, db: $db, q: $q) @client 
  }
`;

export default PageHome;
