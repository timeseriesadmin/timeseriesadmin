// @flow
import React from 'react';
import gql from 'graphql-tag';
import { List, ListItem, ListItemText, Typography } from '@material-ui/core';
import { Mutation } from 'react-apollo';
import { withStyles } from '@material-ui/core/styles';

const references = [
  { query: 'SHOW DATABASES' },
  { query: 'SHOW MEASUREMENTS' },
  { query: 'SELECT <field_key>[,<field_key>,<tag_key>] FROM <measurement_name>[,<measurement_name>]',
    example: 'SELECT "water_level","location" FROM "h2o_feet" LIMIT 3' },
  { query: 'SELECT_clause FROM_clause WHERE <conditional_expression> [(AND|OR) <conditional_expression> [...]]',
    example: 'SELECT "water_level" FROM "h2o_feet" WHERE "location" <> \'santa_monica\' AND (water_level < -0.59 OR water_level > 9.95)' },
  { query: 'SELECT_clause FROM_clause [WHERE_clause] GROUP BY [* | <tag_key>[,<tag_key]]',
    example: 'SELECT MEAN("water_level") FROM "h2o_feet" GROUP BY "location"' },
  { query: 'SELECT <function>(<field_key>) FROM_clause WHERE <time_range> GROUP BY time(<time_interval>),[tag_key] [fill(<fill_option>)]',
    example: 'SELECT COUNT("water_level") FROM "h2o_feet" WHERE time >= \'2015-08-18T00:00:00Z\' AND time <= \'2015-08-18T00:30:00Z\' GROUP BY time(12m),"location"' },
  { query: 'SELECT_clause INTO <measurement_name> FROM_clause [WHERE_clause] [GROUP_BY_clause]',
    example: 'SELECT "water_level" INTO "h2o_feet_copy_1" FROM "h2o_feet" WHERE "location" = \'coyote_creek\'' },
  { query: 'SHOW FIELD KEYS [ON <database_name>] [FROM <measurement_name>]',
    example: 'SHOW FIELD KEYS ON "NOAA_water_database"' },
  { query: 'SHOW TAG VALUES [ON <database_name>][FROM_clause] WITH KEY [ [<operator> "<tag_key>" | <regular_expression>] | [IN ("<tag_key1>","<tag_key2")]] [WHERE <tag_key> <operator> [\'<tag_value>\' | <regular_expression>]] [LIMIT_clause] [OFFSET_clause]',
    example: 'SHOW TAG VALUES ON "NOAA_water_database" WITH KEY = "randtag"' },
    // examples: ['SHOW TAG VALUES ON "NOAA_water_database" WITH KEY = "randtag"', 'SHOW TAG VALUES ON "NOAA_water_database" WITH KEY IN ("location","randtag") WHERE "randtag" =~ /./ LIMIT 3'] },
  { query: 'DROP MEASUREMENT <measurement_name>' },
  { query: 'DROP DATABASE <database_name>' },
  { query: 'SELECT FIRST(<field_name>) from /.*/' },
];

const styles = theme => ({
  info: {
    padding: theme.spacing.unit*2,
    paddingBottom: 0,
  },
  btnIcon: {
    color: theme.palette.error.main,
    marginRight: 0,
    fontSize: 18,
    textAlign: 'left',
  },
  listItem: {
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    paddingLeft: theme.spacing.unit*2,
    paddingRight: theme.spacing.unit*2,
  },
  listItemText: {
    paddingLeft: theme.spacing.unit,
    paddingRight: 0,
  }
});

const SET_FORM_QUERY = gql`
  mutation updateForm($query: String!) {
    updateForm(q: $query) @client
  }
`;

type Props = {
  classes: any,
};
const QueryReference = ({ classes }: Props) => (
  <Mutation mutation={SET_FORM_QUERY}>
  {(setFormQuery, mutateState) => {
    const handleQueryClick = (query: string) => (event: Event) => {
      setFormQuery({ variables: { query } });
    };
    return (
      <div className={classes.root}>
        <Typography variant="body1" className={classes.info}>
          Some examples taken from <a href="https://docs.influxdata.com/influxdb/v1.6/query_language/data_exploration/">official InfluxDB docs</a>.
        </Typography>
        <List dense>
          {references.map((example, index) => (
            <ListItem button disableGutters
              className={classes.listItem}
              key={index}
              onClick={handleQueryClick(example.query)}
            >
              <ListItemText primary={example.query}
                secondary={example.example || null}
                className={classes.listItemText}
              />
            </ListItem>
          ))}
        </List>
      </div>
    );
  }}
  </Mutation>
);

export default withStyles(styles)(QueryReference);
