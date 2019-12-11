declare module 'material-ui-password-field';
declare module 'influx-api' {
  type QueryArgs = {
    url: string;
    q: string;
    db: string;
    u: string;
    p: string;
    epoch?: 'ns' | 'u' | 'ms' | 's' | 'm' | 'h';
    responseType?: 'json' | 'csv' | 'msgpack';
  };

  export function query(queryArgs: QueryArgs): string | {};
}
