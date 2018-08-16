// @flow
import React from 'react';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import { withStyles } from '@material-ui/core/styles';
import { Button, Grid } from '@material-ui/core';
import { Form, Field } from 'react-final-form'
import get from 'lodash/get';

import { composeValidators, isRequired } from '../../helpers/validators';
import { renderField } from '../../helpers/form';

const styles = (theme: Object) => ({
  footer: {
    textAlign: 'right',
  },
  submit: {
    display: 'inline-block',
    minWidth: 200,
    '&$disabled': {
      color: theme.palette.common.black,
    },
  },
  disabled: {},
  downloading: {
    marginRight: 12,
    verticalAlign: 'middle',
  },
});

type Props = {
  classes: any,
  onSubmit: Function,
};
const FormInflux = (props: Props) => {
  const { classes, onSubmit } = props;

  return (
    <Query query={GET_INITIAL} >
      {({ loading, error, data }) => {
      const initialValues = get(data, 'form', {});
      return (
        <Form onSubmit={onSubmit}
          initialValues={initialValues}
          render={({ handleSubmit, form, submitting, pristine, values }) => (
            <form onSubmit={handleSubmit} className={classes.form}>
              <Grid container spacing={16}>

                <Grid item xs={6}>
                  <Field
                    disabled={submitting || loading}
                    name="url"
                    component={renderField}
                    label="Database URL"
                    validate={composeValidators(isRequired)}
                  />
                </Grid>
                <Grid item xs={6}>
                  <Field
                    disabled={submitting || loading}
                    name="u"
                    component={renderField}
                    label="User"
                  />
                </Grid>

                <Grid item xs={6}>
                  <Field
                    disabled={submitting || loading}
                    name="p"
                    component={renderField}
                    label="Password"
                    type="password"
                  />
                </Grid>
                <Grid item xs={6}>
                  <Field
                    disabled={submitting || loading}
                    name="db"
                    component={renderField}
                    label="Database"
                  />
                </Grid>

                <Grid item xs={12}>
                  <Field
                    disabled={submitting || loading}
                    name="q"
                    component={renderField}
                    label="Query"
                    validate={composeValidators(isRequired)}
                    multiline
                    rows={5}
                  />
                </Grid>

                <Grid item xs={12} className={classes.footer}>
                  <Button
                    disabled={submitting || loading}
                    type="submit"
                    variant="contained"
                    color="secondary"
                    className={classes.submit}
                    classes={{root: classes.submit, disabled: classes.disabled}}
                  >
                    {submitting ? 'Executing query...' : loading ? 'Loading saved' : 'Run query'}
                  </Button>
                </Grid>

              </Grid>
            </form>
          )}
        />
      );
      }}
    </Query>
  );
};

const GET_INITIAL = gql`
  {
    form @client {
      url
      u
      p
      db
      q
    }
  }
`;

export default withStyles(styles)(FormInflux);
