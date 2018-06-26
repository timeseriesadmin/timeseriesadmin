// @flow
type Validator = (value: any) => void | string;
// TODO: write some unit tests...
// const normalizeInt = value => {
  // console.log(value);
  // return value.replace(/[^\d]/g, '');
// }
export const isRequired: Validator = value => value && `${value}`.length > 0 ? undefined : 'Wartość jest wymagana';
export const isPositiveInt: Validator = value => value && /^[1-9][0-9]*$/.test(value) ? undefined : 'Wartość musi być dodatnią liczbą całkowitą';
// const positive = value => parseInt(value, 10) > 0 ? undefined : 'Wartość musi być większa od 0';
export const inRange = (min: number, max: number): Validator => value => {
  if (!isNaN(value) && value !== null && value !== undefined) {
    if (value > max)
      return `Wartość musi być mniejsza od ${max}`;
    if (value < min)
      return `Wartość musi być większa od ${min}`;
  }

  return undefined;
};
export const hasLength = (min: number, max: number): Validator => value => {
  if (value !== null && value !== undefined) {
    if (value.length > max)
      return `Maksymalna długość wpisu to ${max}`;
    if (value.length < min)
      return `Minimalna długość wpisu to ${min}`;
  }

  return undefined;
};
export const composeValidators = (...validators: Validator[]) => (value: any) =>
  validators.reduce((error, validator) => error || validator(value), undefined);
