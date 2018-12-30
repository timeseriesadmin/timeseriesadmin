// @flow
import storage from '../../helpers/storage';
import gql from 'graphql-tag';

export type FormParams = {
  url: string,
  u?: string,
  p?: string,
  db?: string, // required for most SELECT and SHOW queries
  q?: string,
};

export const updateForm = (
  _obj: void,
  submitted: FormParams,
  { cache }: any,
): null => {
  const form = getForm(cache);

  const newForm = {
    ...form,
    ...submitted,
    __typename: 'FormData',
  };
  storage.set('form', JSON.stringify(newForm));
  cache.writeData({
    data: {
      form: newForm,
    },
  });
  // it is important to return anything e.g. null (in other case you will see a warning)
  return null;
};

export const getForm = (cache: any) => {
  const { form } = cache.readQuery({
    query: gql`
      {
        form {
          url
          u
          p
          db
          q
        }
      }
    `,
  });
  return form;
};
