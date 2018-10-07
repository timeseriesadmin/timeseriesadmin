// @flow
import React from 'react';
import {
  InputLabel, FormControl, FormHelperText, TextField,
} from '@material-ui/core';
import PasswordField from 'material-ui-password-field';

export const renderField = ({
  input,
  label,
  meta: { touched, error },
  ...custom
}: any): any => (custom.type === 'password' ? (
  <FormControl error={touched && !!error} fullWidth>
    <InputLabel htmlFor={custom.name}>Password</InputLabel>
    <PasswordField
      id={custom.name}
      {...input}
      {...custom}
    />
    {touched && !!error ? (
      <FormHelperText>{error}</FormHelperText>
    ) : ''}
  </FormControl>

) : (
  <FormControl error={touched && !!error} fullWidth>
    <TextField
      error={touched && !!error}
      label={label}
      fullWidth
      {...input}
      {...custom}
    />
    {touched && !!error ? (
      <FormHelperText>{error}</FormHelperText>
    ) : ''}
  </FormControl>
));

export default { renderField };