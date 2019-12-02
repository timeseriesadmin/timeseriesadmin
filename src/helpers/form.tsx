import React, { useState } from 'react';
import {
  InputLabel,
  FormControl,
  FormControlLabel,
  FormHelperText,
  TextField,
  Checkbox,
  Input,
  InputAdornment,
  IconButton,
} from '@material-ui/core';
import { Visibility, VisibilityOff } from '@material-ui/icons';

export function RenderField({
  input,
  label,
  meta: { touched, error },
  ...custom
}: any) {
  const [isPasswordVisible, setPasswordVisible] = useState(false);

  if (input.type === 'password') {
    return (
      <FormControl error={touched && !!error} fullWidth>
        <InputLabel htmlFor={custom.id}>Password</InputLabel>
        <Input
          id={custom.id}
          endAdornment={
            <InputAdornment position="end">
              <IconButton
                aria-label="Toggle password visibility"
                onClick={() => setPasswordVisible(true)}
                onMouseDown={() => setPasswordVisible(false)}
                edge="end"
              >
                {isPasswordVisible ? <Visibility /> : <VisibilityOff />}
              </IconButton>
            </InputAdornment>
          }
          {...input}
          type={isPasswordVisible ? 'text' : 'password'}
        />
        {touched && !!error && <FormHelperText>{error}</FormHelperText>}
      </FormControl>
    );
  }
  if (input.type === 'checkbox') {
    return (
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
    );
  }
  return (
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

export default { RenderField };
