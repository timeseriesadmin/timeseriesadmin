import React from 'react';
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';
import FormInflux from '../FormInflux';
import QueryResults from '../QueryResults';

const MainContent = () => (
  <Mutation mutation={FORM_QUERY}>
    {(executeQuery: any, { called, loading, data, error }: any) => (
      <Mutation mutation={UPDATE_FORM}>
        {(formMutate: (arg0: { variables: any }) => void) => {
          const onSubmit = async (values: any): Promise<void> => {
            await formMutate({ variables: values });
            // prevent displaying errors in console (they are handled in resolvers)
            await executeQuery({ variables: {} }).catch(() => {});
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
    $unsafeSsl: Boolean
  ) {
    updateForm(url: $url, u: $u, p: $p, db: $db, q: $q, unsafeSsl: $unsafeSsl)
      @client
  }
`;

export default MainContent;
