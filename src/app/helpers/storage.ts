export default {
  get: (name: string, defaultVal?: any): any => {
    const val = window.localStorage.getItem(name) || defaultVal;
    return val || '';
  },
  set: (name: string, value: string) =>
    window.localStorage.setItem(name, value),
};
