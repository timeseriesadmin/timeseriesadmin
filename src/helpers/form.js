// @flow
import React from 'react';
import { FormControl, FormHelperText, TextField } from '@material-ui/core';

export const renderField = ({
  input,
  label,
  meta: { touched, error },
  ...custom
}: any): any => (
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
);
