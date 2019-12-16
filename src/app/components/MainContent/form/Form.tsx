import React, { ChangeEvent } from 'react';
import gql from 'graphql-tag';
import { useQuery, useMutation } from 'react-apollo';
import { withStyles } from '@material-ui/core/styles';
import { Button, Grid, Theme } from '@material-ui/core';
import { Form, Field } from 'react-final-form';
import get from 'lodash/get';

import { composeValidators, isRequired } from 'app/helpers/validators';
import { RenderField } from 'app/helpers/form';
import { isElectron } from 'app/apollo/helpers/isElectron';
import { SettingsContext } from 'app/contexts/SettingsContext';

const styles = (theme: Theme): any => ({
  footer: {
    textAlign: 'right',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
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

export const GET_INITIAL = gql`
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
`;

export const SAVE_CONNECTION = gql`
  mutation(
    $url: String!
    $u: String
    $p: String
    $db: String
    $unsafeSsl: Boolean
  ) {
    saveConnection(url: $url, u: $u, p: $p, db: $db, unsafeSsl: $unsafeSsl)
      @client
  }
`;

type Props = {
  classes: any;
  onSubmit: (values: {}) => Promise<void>;
};
const FormInflux: React.FC<Props> = ({ classes, onSubmit }: Props) => {
  const { loading: fetching, data } = useQuery(GET_INITIAL);
  const [saveConnection, { loading: sending }] = useMutation(SAVE_CONNECTION);
  const settings = React.useContext(SettingsContext);

  return (
    <Form
      onSubmit={onSubmit}
      initialValues={get(data, 'form', {
        compactLayout: settings.compactLayout,
      })}
    >
      {({ handleSubmit, form, submitting, values }: any): React.ReactNode => (
        <form onSubmit={handleSubmit} className={classes.form}>
          {/* It is here to prevent Chrome from autofilling user and password form fields */}
          <input type="password" style={{ display: 'none' }} />

          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Field
                id="influx-url"
                disabled={submitting || fetching}
                name="url"
                component={RenderField}
                label="Database URL"
                placeholder="https://myinfluxdb.test:8086"
                validate={composeValidators(isRequired)}
              />
            </Grid>
            <Grid item xs={6}>
              <Field
                id="influx-u"
                disabled={submitting || fetching}
                name="u"
                component={RenderField}
                label="User"
              />
            </Grid>

            <Grid item xs={6}>
              <Field
                id="influx-p"
                disabled={submitting || fetching}
                name="p"
                component={RenderField}
                label="Password"
                type="password"
              />
            </Grid>
            <Grid item xs={6}>
              <Field
                id="influx-db"
                disabled={submitting || fetching}
                name="db"
                component={RenderField}
                label="Database"
              />
            </Grid>
            <Grid item xs={6}>
              <Field
                id="influx-unsafeSsl"
                disabled={!isElectron() || submitting || fetching}
                helperText={
                  !isElectron() && 'Available only in Electron Application'
                }
                name="unsafeSsl"
                component={RenderField}
                label="Ignore SSL errors"
                type="checkbox"
              />
            </Grid>

            <Grid
              item
              xs={6}
              style={{
                display: 'flex',
                alignItems: 'flex-end',
                justifyContent: 'flex-end',
              }}
            >
              <Button
                disabled={sending}
                type="button"
                variant="outlined"
                color="primary"
                style={{ float: 'right' }}
                onClick={(): void => {
                  saveConnection({ variables: values });
                }}
              >
                {sending ? 'Saving...' : 'Save connection data'}
              </Button>
            </Grid>

            <Grid item xs={12}>
              <Field
                id="influx-q"
                disabled={submitting || fetching}
                name="q"
                component={RenderField}
                label="Query"
                validate={composeValidators(isRequired)}
                multiline
                rows={10}
                helperText="Use CTRL/CMD+ENTER to submit"
                onKeyDown={(event: {
                  keyCode: number;
                  metaKey: any;
                  ctrlKey: any;
                }): void => {
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
              <Field
                id="compact-layout"
                helperText="Results table layout"
                name="compactLayout"
                component={RenderField}
                label="Compact view"
                input={{
                  type: 'checkbox',
                  onChange: (event: ChangeEvent<HTMLInputElement>): void => {
                    const value = event.target.checked;
                    settings.setCompactLayout(value);
                  },
                }}
              />
              <Button
                disabled={submitting || fetching}
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
                  : fetching
                  ? 'Loading data...'
                  : 'Run query'}
              </Button>
            </Grid>
          </Grid>
        </form>
      )}
    </Form>
  );
};

export default withStyles(styles)(FormInflux);
