import React, { useState, ReactNode } from 'react';
import Typography from '@material-ui/core/Typography';
import Collapse from '@material-ui/core/Collapse';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import RefreshIcon from '@material-ui/icons/Refresh';
import useAsyncFn from 'react-use/lib/useAsyncFn';
import { queryBase } from 'app/apollo/helpers/queryBase';

import ExplorerButton from '../ExplorerButton';
import theme from '../../../theme';
import TooltipError from '../../../TooltipError';

type Props = {
  /** Makes label uppercase and bold */
  featured?: boolean;
  label: string;
  children: (data: any) => ReactNode;
  params: any;
};

const ExplorerItem: React.FC<Props> = (props: Props) => {
  const { featured = true, label, params, children } = props;

  const [isExpanded, setExpanded] = useState(false);
  // const { appendHistoryEntry } = useContext<QueryHistoryContext>(
  //   QueryHistoryContext,
  // );

  const [{ loading, error, value }, fetch] = useAsyncFn(async () => {
    return await queryBase(params);
  }, [params]);

  const handleExpand = (): void => {
    if (!value) {
      // execute mutation on first expansion
      fetch();
    }
    setExpanded(expanded => !expanded);
  };

  const handleRefresh = (): void => {
    fetch();
  };

  return (
    <div>
      <ExplorerButton
        featured={featured}
        label={label}
        isExpanded={isExpanded}
        toggle={handleExpand}
        suffixedContent={
          value && (
            <IconButton
              aria-label="Refresh"
              onClick={handleRefresh}
              style={{
                marginLeft: theme.spacing(),
                width: 24,
                height: 24,
              }}
            >
              <RefreshIcon
                style={{
                  margin: 0,
                  fontSize: 18,
                  color: theme.palette.secondary.dark,
                }}
              />
            </IconButton>
          )
        }
      />
      <Collapse in={isExpanded} timeout="auto" unmountOnExit>
        {loading ? (
          <div>Loading...</div>
        ) : error ? (
          <div>
            <TooltipError content={JSON.stringify(error)} />
          </div>
        ) : !value ||
          !value.response ||
          !value.response.data ||
          !value.response.data.length ? (
          <Typography
            variant="caption"
            color="primary"
            style={{ marginLeft: 22 }}
          >
            Results are empty, probably there is no data in this section.
          </Typography>
        ) : (
          <List>{children(value.response.data)}</List>
        )}
      </Collapse>
    </div>
  );
};

export default ExplorerItem;
