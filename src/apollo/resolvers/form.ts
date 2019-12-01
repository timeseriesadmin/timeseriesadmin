import storage from '../../helpers/storage';
import gql from 'graphql-tag';

export interface FormParams {
  url: string;
  u?: string;
  p?: string;
  db?: string; // required for most SELECT and SHOW queries
  q?: string;
  unsafeSsl?: boolean;
}

export const updateForm = (
  _obj: void,
  submitted: any, //FormParams,
  { cache }: any,
): null => {
  const normalized: any = {}; // with non-string values converted to strings
  Object.keys(submitted).forEach((key: any) => {
    normalized[key] = submitted[key] ? submitted[key].toString() : '';
  });
  const form = getForm(cache);

  const newForm = {
    ...form,
    ...normalized,
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
          unsafeSsl
        }
      }
    `,
  });
  return {
    url: '',
    u: '',
    p: '',
    db: '',
    q: '',
    unsafeSsl: false,
    ...form,
  };
};
