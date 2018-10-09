// @flow

export default {
  get: (name: string, defaultVal?: string) => {
    const val = window.localStorage.getItem(name);
    if (val === null && defaultVal !== undefined) {
      return defaultVal;
    }
    return val;
  },
  set: (name: string, value: string) => window.localStorage.setItem(name, value)
  ,
};
