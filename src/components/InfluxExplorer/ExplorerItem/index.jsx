// @flow
import React from 'react';
import gql from 'graphql-tag';
import { Collapse, Button, ListSubheader, List, ListItem, ListItemIcon, ListItemText, Typography } from '@material-ui/core';
import { ErrorOutline as ErrorIcon } from '@material-ui/icons';
import { Query, Mutation } from 'react-apollo';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  root: {
  },
});

type Props = {
  classes: any,
  database?: string,
  query: any, // gql string
  label: string,
  id: string,
  showData: any,
};
type State = {
  isExpanded: boolean,
};
class ExplorerItem extends React.Component<Props, State> {
  state = {
    isExpanded: false,
  };

  render() {
    const { classes, database, label, query, id, showData } = this.props;

    return (
      <ListItem key={id}>
        <Mutation mutation={query} variables={{ id }}>
          {(mutate, { called, loading, data, error }) => (
            <div>
              <Button onClick={() => mutate()}>
                {label}
              </Button>
              {!called ? null :
                loading ? <div>Loading...</div> :
                error ? <div>ERROR</div> :
                !data ? <div>NO DATA</div> :
                showData(data)
              }
            </div>
          )}
        </Mutation>
      </ListItem>
    );
  }
}
  /*
    return (
      <Mutation mutation={QUERY}>
      {(executeQuery, {data, loading, error, called}) => {
        const handleClick = () => {
          this.setState({
            isExpanded: !this.state.isExpanded,
          });
          console.log('click ' + database + ' ' + query);
          executeQuery({ variables: { db: database, q: query } });
        };

        return (
          <ListItem disableGutters className={classes.listItem}>
            <Button className={classes.itemContent} onClick={handleClick}>
              <ListItemText inset primary={label} />
            </Button>
            <Collapse in={this.state.isExpanded} timeout="auto" unmountOnExit className={classes.itemContent}>
              {(() => {
                if (!called) return (<div>Not called</div>);
                if (loading) return (<div>Loading...</div>);
                if (!data) return (<div>No data</div>);

                console.log(data);

                let results = data.executeQuery.response.data.split('\n')
                  .filter(line => line !== '') // remove empty lines
                  .map(line => line.split(',')); // create array of values for each line

                const headers = results.shift() || [];


                return (
                  <List>
                    {results.map((result, index) =>
                      this.props.children.map((child, childIndex) => (
                        <ExplorerItem {...child}
                          key={index} classes={classes} label={result[2]}
                        />
                      ))
                    )}
                  </List>
                );
              })()}
            </Collapse>
          </ListItem>
        );
      }}
      </Mutation>
    );
  }
}
  /*
        // TODO: ensure that required array elements exists e.g. results[2]
        switch (type) {
          case 'measurements': 
            listItems.concat(results.map((result, index) => [(
              <ListItem key={`m_${result[2]}`} disableGutters>
                <ListItemText inset primary={result[2]} />
              </ListItem>
            ),(
              <ExplorerItem
                classes={classes}
                key={`fk_${index}`}
                label="Field keys" 
                query={`SHOW FIELD KEYS FROM "${result[2]}"`}
                database={database}
                type="field_keys"
              />
            ),(
              <ExplorerItem
                classes={classes}
                key={`tk_${index}`}
                label="Tag keys" 
                query={`SHOW TAG KEYS FROM "${result[2]}"`}
                database={database}
                type="tag_keys"
              />
            )]));
          case 'field_keys':
            listItems.concat(results.map((result, index) => (
              <ListItem key={`fk_${result[2]}_${index}`}>
                <ListItemText inset primary={result[2]} secondary={result[3]} />
              </ListItem>
            )));
          case 'tag_keys':
            listItems.concat(results.map((result, index) => (
              <ListItem key={`tk_${result[2]}_${index}`}>
                <ListItemText inset primary={result[2]} />
              </ListItem>
            )));
          case 'series':
            listItems.push((
              <div>
                <div>Series</div>
                {JSON.stringify(data)}
              </div>
            ));
          case 'retention_policies':
            listItems.push((
              <div>
                <div>Retention policies</div>
                {JSON.stringify(data)}
              </div>
            ));
        }
        return listItems;
      }}
      </Mutation>
    )
  }
}*/

export default withStyles(styles)(ExplorerItem);
