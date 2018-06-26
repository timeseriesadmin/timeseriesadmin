// @flow
import React from 'react';
import gql from 'graphql-tag';
// $FlowFixMe
import { withApollo, compose, graphql } from 'react-apollo';
import { withStyles } from '@material-ui/core/styles';
import { Button, Grid } from '@material-ui/core';
// import CircularProgress from '@material-ui/core/CircularProgress';
import { Form, Field } from 'react-final-form'

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
  client: any,
  initialValues: any,
};
const FormInflux = (props: Props) => {
  const { classes, client, initialValues } = props;

  const onSubmit = async (values): Promise<void> => {
    client.mutate({
      mutation: gql`
        mutation updateForm($url: String, $u: String, $p: String, $db: String, $q: String) {
          updateForm(url: $url, u: $u, p: $p, db: $db, q: $q) @client 
        }
      `,
      variables: values,
    });
    await client.mutate({
      mutation: gql`
        mutation influxQuery($url: String, $u: String, $p: String, $db: String, $q: String) {
          influxQuery(url: $url, u: $u, p: $p, db: $db, q: $q) @client
        }
      `,
      fetchPolicy: 'no-cache',
      variables: values,
    });
  };

              // {submitting ? (
                // <CircularProgress className={classes.downloading} size={24} thickness={7} />
              // ) : ''}
  return (
    <Form onSubmit={onSubmit}
      initialValues={initialValues}
      render={({ handleSubmit, form, submitting, pristine, values }) => (
        <form onSubmit={handleSubmit} className={classes.form}>
          <Grid container spacing={16}>

            <Grid item xs={6}>
              <Field
                disabled={submitting}
                name="url"
                component={renderField}
                label="Database URL"
                validate={composeValidators(isRequired)}
              />
            </Grid>
            <Grid item xs={6}>
              <Field
                disabled={submitting}
                name="u"
                component={renderField}
                label="User"
              />
            </Grid>

            <Grid item xs={6}>
              <Field
                disabled={submitting}
                name="p"
                component={renderField}
                label="Password"
                type="password"
              />
            </Grid>
            <Grid item xs={6}>
              <Field
                disabled={submitting}
                name="db"
                component={renderField}
                label="Database"
              />
            </Grid>

            <Grid item xs={12}>
              <Field
                disabled={submitting}
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
                disabled={submitting}
                type="submit"
                variant="contained"
                color="secondary"
                className={classes.submit}
                classes={{root: classes.submit, disabled: classes.disabled}}
              >
                {submitting ? 'Executing query...' : 'Run query'}
              </Button>
            </Grid>

          </Grid>
        </form>
      )}
    />
  );
};

const initialValues = gql`
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

export default withApollo(compose(
  graphql(initialValues, {
    props: ({ data }) => ({
      initialValues: data.form
    }),
  }),
)(withStyles(styles)(FormInflux)));
