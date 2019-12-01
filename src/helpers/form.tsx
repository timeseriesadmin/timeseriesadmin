import React from 'react';
import {
  InputLabel,
  FormControl,
  FormControlLabel,
  FormHelperText,
  TextField,
  Checkbox,
} from '@material-ui/core';
import PasswordField from 'material-ui-password-field';

export function renderField({
  input,
  label,
  meta: { touched, error },
  ...custom
}: any) {
  return input.type === 'password' ? (
    <FormControl error={touched && !!error} fullWidth>
      <InputLabel htmlFor={custom.id}>Password</InputLabel>
      <PasswordField {...input} {...custom} />
      {touched && !!error ? <FormHelperText>{error}</FormHelperText> : ''}
    </FormControl>
  ) : input.type === 'checkbox' ? (
    <FormControl error={touched && !!error}>
      <FormControlLabel
        label={label}
        control={<Checkbox {...input} disabled={custom.disabled} />}
      />
      {custom.helperText && (
        <FormHelperText style={{ marginTop: -10 }} disabled>
          {custom.helperText}
        </FormHelperText>
      )}
      {touched && !!error ? <FormHelperText>{error}</FormHelperText> : ''}
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
      {touched && !!error ? <FormHelperText>{error}</FormHelperText> : ''}
    </FormControl>
  );
}

export default { renderField };
