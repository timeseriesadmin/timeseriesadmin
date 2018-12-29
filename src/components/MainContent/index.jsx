// @flow
import React from 'react';
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';
import FormInflux from '../FormInflux';
import QueryResults from '../QueryResults';

const MainContent = () => (
  <Mutation mutation={FORM_QUERY}>
    {(executeQuery, { called, loading, data, error }) => (
      <Mutation mutation={UPDATE_FORM}>
        {formMutate => {
          const onSubmit = async (values): Promise<void> => {
            await formMutate({ variables: values });
            // prevent displaying errors in console (they are handled in resolvers)
            await executeQuery({ variables: {} }).catch(err => {});
          };

          return (
            <div>
              <FormInflux onSubmit={onSubmit} />
              <QueryResults
                called={called}
                loading={loading}
                query={data}
                error={error}
              />
            </div>
          );
        }}
      </Mutation>
    )}
  </Mutation>
);

export const FORM_QUERY = gql`
  mutation executeQuery {
    executeQuery @client
  }
`;

export const UPDATE_FORM = gql`
  mutation updateForm(
    $url: String
    $u: String
    $p: String
    $db: String
    $q: String
  ) {
    updateForm(url: $url, u: $u, p: $p, db: $db, q: $q) @client
  }
`;

export default MainContent;
