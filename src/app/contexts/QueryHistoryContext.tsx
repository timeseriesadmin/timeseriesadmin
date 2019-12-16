import React, { ReactNode } from 'react';
import { useStateAndStorage } from 'app/hooks/useStateAndStorage';
import { HistoryEntry } from 'app/types/HistoryEntry';
import { HISTORY_MAX_LENGTH } from '../../config';

type Props = {
  children: ReactNode;
};

type QueryHistoryContext = {
  queryHistory: HistoryEntry[];
  setQueryHistory: (queryHistory: HistoryEntry[]) => void;
  appendHistoryEntry: (historyEntry: HistoryEntry) => HistoryEntry[];
};

// according to https://kentcdodds.com/blog/how-to-use-react-context-effectively
export const QueryHistoryContext = React.createContext<
  QueryHistoryContext | undefined
>(undefined);

export const QueryHistoryContextProvider: React.FC<Props> = (props: Props) => {
  const [queryHistory, setQueryHistory] = useStateAndStorage<HistoryEntry[]>(
    'queryHistory',
    [],
  );

  const appendHistoryEntry = (historyEntry: HistoryEntry): HistoryEntry[] => {
    const queryIndex = queryHistory.findIndex(
      entry => entry.query === historyEntry.query,
    );

    const cleanHistory =
      queryIndex > -1
        ? [
            ...queryHistory.slice(0, queryIndex),
            ...queryHistory.slice(queryIndex + 1),
          ]
        : queryHistory.slice();

    const newHistory = [historyEntry, ...cleanHistory].slice(
      0,
      HISTORY_MAX_LENGTH,
    );
    setQueryHistory(newHistory);

    return newHistory;
  };

  return (
    <QueryHistoryContext.Provider
      value={{ queryHistory, setQueryHistory, appendHistoryEntry }}
    >
      {props.children}
    </QueryHistoryContext.Provider>
  );
};
