// @flow
import React from 'react';
import gql from 'graphql-tag';
import { Query, Mutation } from 'react-apollo';
import { withStyles } from '@material-ui/core/styles';
import { Button, Grid } from '@material-ui/core';
import { Form, Field } from 'react-final-form';
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
  onSubmit: (values: {}) => Promise<void>,
};
const FormInflux = ({ classes, onSubmit }: Props) => (
  <Query query={GET_INITIAL}>
    {({ loading, data }) => (
      <Form
        onSubmit={onSubmit}
        initialValues={get(data, 'form', {})}
        render={({ handleSubmit, form, submitting, values }) => (
          <form onSubmit={handleSubmit} className={classes.form}>
            {/* It is here to prevent Chrome from autofilling user and password form fields */}
            <input type="password" style={{ display: 'none' }} />

            <Grid container spacing={16}>
              <Grid item xs={6}>
                <Field
                  id="influx-url"
                  disabled={submitting || loading}
                  name="url"
                  component={renderField}
                  label="Database URL"
                  placeholder="https://myinfluxdb.test:8086"
                  validate={composeValidators(isRequired)}
                />
              </Grid>
              <Grid item xs={6}>
                <Field
                  id="influx-u"
                  disabled={submitting || loading}
                  name="u"
                  component={renderField}
                  label="User"
                />
              </Grid>

              <Grid item xs={6}>
                <Field
                  id="influx-p"
                  disabled={submitting || loading}
                  name="p"
                  component={renderField}
                  label="Password"
                  type="password"
                />
              </Grid>
              <Grid item xs={6}>
                <Field
                  id="influx-db"
                  disabled={submitting || loading}
                  name="db"
                  component={renderField}
                  label="Database"
                />
              </Grid>

              <Grid item xs={12}>
                <Mutation mutation={SAVE_CONNECTION} variables={values}>
                  {(mutate, { loading }) => (
                    <Button
                      disabled={loading}
                      type="button"
                      variant="outlined"
                      color="primary"
                      style={{ float: 'right' }}
                      onClick={() => mutate()}
                    >
                      {loading ? 'Saving...' : 'Save connection data'}
                    </Button>
                  )}
                </Mutation>
              </Grid>

              <Grid item xs={12}>
                <Field
                  id="influx-q"
                  disabled={submitting || loading}
                  name="q"
                  component={renderField}
                  label="Query"
                  validate={composeValidators(isRequired)}
                  multiline
                  rows={10}
                  helperText="Use CTRL/CMD+ENTER to submit"
                  onKeyDown={event => {
                    if (
                      event.keyCode === 13 &&
                      (event.metaKey || event.ctrlKey)
                    ) {
                      form.submit();
                    }
                  }}
                />
              </Grid>

              <Grid item xs={12} className={classes.footer}>
                <Button
                  disabled={submitting || loading}
                  type="submit"
                  variant="contained"
                  color="secondary"
                  className={classes.submit}
                  classes={{
                    root: classes.submit,
                    disabled: classes.disabled,
                  }}
                >
                  {submitting
                    ? 'Executing query...'
                    : loading
                    ? 'Loading data...'
                    : 'Run query'}
                </Button>
              </Grid>
            </Grid>
          </form>
        )}
      />
    )}
  </Query>
);

export const GET_INITIAL = gql`
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

export const SAVE_CONNECTION = gql`
  mutation($url: String!, $u: String, $p: String, $db: String) {
    saveConnection(url: $url, u: $u, p: $p, db: $db) @client
  }
`;

export default withStyles(styles)(FormInflux);
