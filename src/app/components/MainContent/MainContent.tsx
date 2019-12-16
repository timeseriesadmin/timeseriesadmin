import React, { useState, useContext } from 'react';
import Form from './form/Form';
import Results from './results/Results';
import { queryBase } from 'app/apollo/helpers/queryBase';
import { commonError } from 'app/shared/commonError';
import { QueryHistoryContext } from 'app/contexts/QueryHistoryContext';

const MainContent: React.FC<{}> = () => {
  // const [form, setForm] = useState({
  //   q: 'show databases',
  //   u: 'admin',
  //   p: 'password',
  //   url: 'https://localhost:8086',
  //   db: 'issue3',
  //   unsafeSsl: false,
  // });
  const [results, setResults] = useState();
  const [error, setError] = useState();
  const [loading, setLoading] = useState();
  const { appendHistoryEntry } = useContext<QueryHistoryContext>(
    QueryHistoryContext,
  );

  const onSubmit = async (values: any): Promise<void> => {
    setLoading(true);
    setError(false);
    // setForm(values);
    try {
      const response = await queryBase(values);
      setResults(response);
      appendHistoryEntry({ query: values.q });
    } catch (error) {
      const stdError = commonError(error);
      setError(stdError);
      appendHistoryEntry({ query: values.q, error: stdError.title });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Form onSubmit={onSubmit} />
      <Results loading={loading} results={results} error={error} />
    </div>
  );
};

export default MainContent;
