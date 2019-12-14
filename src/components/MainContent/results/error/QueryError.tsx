import React from 'react';
import Inspector from 'react-inspector';
import Typography from '@material-ui/core/Typography';
// import { commonError } from 'src/shared/commonError';

const QueryError: React.FC<any> = ({ error }: any) => (
  <div>
    <Typography
      variant="h5"
      component="h3"
      style={{ marginBottom: 8, color: 'red' }}
    >
      {error.title}
    </Typography>
    <Typography
      variant="subtitle1"
      component="h4"
      style={{ margin: '18px 0 6px' }}
    >
      Error details
    </Typography>
    <Typography variant="caption" component="p" style={{ margin: '6px 0 6px' }}>
      You should probably look at "response" key
    </Typography>
    <Inspector theme="chromeLight" data={error.details} expandLevel={2} />
  </div>
);

export default QueryError;
