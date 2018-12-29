// @flow
type Validator = (value: any) => void | string;
export const isRequired: Validator = value =>
  value && `${value}`.length > 0 ? undefined : 'Value is required';
export const isPositiveInt: Validator = value =>
  value && /^[1-9][0-9]*$/.test(value)
    ? undefined
    : 'Value has to be a positive integer';
export const inRange = (min: number, max: number): Validator => value => {
  if (!Number.isNaN(value) && value !== null && value !== undefined) {
    if (value > max) return `Value has to be smaller than ${max}`;
    if (value < min) return `Value has to be larger than ${min}`;
  }

  return undefined;
};
export const hasLength = (min: number, max: number): Validator => value => {
  if (value !== null && value !== undefined) {
    if (value.length > max) return `Maximum length is ${max}`;
    if (value.length < min) return `Minimum length is ${min}`;
  }

  return undefined;
};
export const composeValidators = (...validators: Validator[]) => (value: any) =>
  validators.reduce((error, validator) => error || validator(value), undefined);
