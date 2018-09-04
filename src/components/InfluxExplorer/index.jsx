// @flow
import React from 'react';
import gql from 'graphql-tag';
import { ListSubheader, Button, Collapse, List, ListItem, ListItemIcon, ListItemText, Typography } from '@material-ui/core';
import { ErrorOutline as ErrorIcon } from '@material-ui/icons';
import { Query, Mutation } from 'react-apollo';
import { withStyles } from '@material-ui/core/styles';
import ExplorerItem from './ExplorerItem';

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
		flexDirection: 'column',
  },
	itemContent: {
		width: '100%',
	},
  listItemText: {
    paddingLeft: theme.spacing.unit,
    paddingRight: 0,
  }
});

const GET_FORM = gql`
  query form {
    form {
      u
      url
    }
  }
`

const SHOW_SERVER = gql`
  mutation showServer {
    server(id: $id) @client {
      id
      name
      databases {
        id
        name
      }
    }
  }
`;

const SHOW_DATABASE = gql`
  mutation showDatabase($id: String) {
    database(id: $id) @client {
      id
      name
      measurements {
        id
        name
      }
    }
  }
`;

const SHOW_MEASUREMENT = gql`
  mutation showMeasurement($id: String) {
    measurement(id: $id) @client {
      id
      name
      fieldKeys {
        id
        name
        type
      }
      fieldTags {
        id
        name
      }
    }
  }
`;

// TODO: with fragments it is impossible to get nested data?

type Props = {
  classes: any,
};
const QueryHistory = ({ classes }: Props) => (
  <Query query={GET_FORM}>
    {({ data: { form } }) => (
    <List>
      <ExplorerItem key={`${form.u}@${form.url}`} id={`${form.u}@${form.url}`} query={SHOW_SERVER}
        label="Explore"
        showData={data => (
          <List>
          {data.server.databases.map(database => (
            <ExplorerItem key={database.id} id={database.id} query={SHOW_DATABASE}
              label={database.name}
              showData={data => (
                <List>
                {data.database.measurements.map(measurement => (
                  <ExplorerItem key={measurement.id} id={measurement.id} query={SHOW_MEASUREMENT}
                    label={measurement.name}
                    showData={data => 
                      [(<List key="fieldKeys">
                        {data.measurement.fieldKeys.map(fieldKey => (
                          <div key={fieldKey.name}>{fieldKey.name}</div>
                        ))}
                      </List>),
                      (<List key="fieldTags">
                        {data.measurement.fieldTags.map(fieldTag => (
                          <div key={fieldTag.name}>{fieldTag.name}</div>
                        ))}
                      </List>)]
                    } />
                ))}
                </List>
              )} />
          ))}
          </List>
      )} />
    </List>
    )}
  </Query>
);

// const QueryHistory = ({ classes }: Props) => (
//   <Query query={QUERY}>
//   {(executeQuery, {data, loading, error, called}) => {
//     const handleQueryClick = () => {
//       executeQuery({ variables: { q: 'SHOW DATABASES' } });
//     };
//     if (loading) {
//       return (
//         <div>Loading...</div>
//       );
//     }
//     // $FlowFixMe
//     if (!called) return (
//       <Button onClick={handleQueryClick}>Explore</Button>
//     );

//     if (!data) {
//       return (
//         <div>Data not ready</div>
//       );
//     }

//     console.log(data);

//     let results = data.executeQuery.response.data.split('\n')
//       .filter(line => line !== '') // remove empty lines
//       .map(line => line.split(',')); // create array of values for each line

//     const headers = results.shift() || [];
//     // return (
//       // <div>{JSON.stringify(results)}</div>
//     // );
// [>
// { type: 'databases', query: 'show databases', type: 'db_list', list: 'database' }
// { type: 'database', isOpen: false, items: ['measurements', 'ret_policies', 'series'] }
// { type: 'measurements', query: 'show measurements', type: 'ms_list', list: 'measurement' }
// { type: 'measurement', isOpen: false, items: ['field_keys', 'tag_keys'] }
// { type: 'field_keys', type: 'fk_list', list: 'field_key' }
// { type: 'tag_keys', type: 'tk_list', list: 'tag_key' }
// */
//     console.log(results);

//     const handleToggle = (index) => () => {
//     };
//     return (
//       <div className={classes.root}>
//         <Typography variant="body1" className={classes.info}>
//           To start server exploration click button below.
//         </Typography>
//         <List dense>
//           {results.map((result, index) => (
//             <ListItem key={`db_${index}`} disableGutters className={classes.listItem}>
//               <Button className={classes.itemContent} onClick={handleToggle(index)}>
//                 <ListItemText inset primary={result[2]} />
//               </Button>
//               <Collapse in={false} timeout="auto" unmountOnExit className={classes.itemContent}>
//                 <List dense>
//                   <ListItem disableGutters>
//                     <ListItemText inset primary="Measurements" />
//                   </ListItem>
//                 </List>
//                 {[><ExplorerItem
//                   key={`m_${index}`}
//                   label="Measurements" 
//                   query="SHOW MEASUREMENTS"
//                   database={result[2]}
//                   type="measurements"
//                 />
//                 <ExplorerItem
//                   key={`rp_${index}`}
//                   label="Retention policies" 
//                   query={`SHOW RETENTION POLICIES ON "${result[2]}"`}
//                   database={result[2]}
//                   type="retention_policies"
//                 />
//                 <ExplorerItem
//                   key={`s_${index}`}
//                   label="Series" 
//                   query={`SHOW SERIES ON "${result[2]}"`}
//                   database={result[2]}
//                   type="series"
//                 />*/}
//               </Collapse>
//             </ListItem>
//           ))}
//         </List>
//         {[><ListItem button disableGutters
//           className={classes.listItem}
//           key={index}
//           onClick={handleQueryClick(executeQuery.query)}
//         >
//           {executeQuery.error !== null &&
//           <ListItemIcon>
//             <ErrorIcon color="error" className={classes.btnIcon}/>
//           </ListItemIcon>
//           }
//           <ListItemText primary={executeQuery.query}
//             className={classes.listItemText}
//           />
//         </ListItem>*/}
//       </div>
//     );
//   }}
//   </Mutation>
// );

export default withStyles(styles)(QueryHistory);
