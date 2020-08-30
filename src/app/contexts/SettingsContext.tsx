import React, { useState } from 'react';

export type TimeFormat = 's' | 'ms' | 'ns' | 'timestamp';
export type SettingsContext = {
  compactLayout: boolean;
  timeFormat: TimeFormat;
  setCompactLayout: (compactLayout: boolean) => void;
  setTimeFormat: (timeFormat: TimeFormat) => void;
};

export const SETTINGS_CONTEXT_DEFAULT = {
  compactLayout: false,
  timeFormat: 'timestamp' as TimeFormat,
  isDrawerOpen: true,
  setCompactLayout: function (compactLayout: boolean): void {
    this.compactLayout = compactLayout;
  },
  setTimeFormat: function (timeFormat: TimeFormat): void {
    this.timeFormat = timeFormat;
  },
  setDrawerOpen: function (isOpen: boolean): void {
    this.isDrawerOpen = isOpen;
  },
};

export const SettingsContext = React.createContext<SettingsContext>(
  SETTINGS_CONTEXT_DEFAULT,
);

export const SettingsContextProvider: React.FC<any> = ({ children }: any) => {
  const [compactLayout, setCompactLayout] = useState(false);
  const [timeFormat, setTimeFormat] = useState<TimeFormat>('timestamp');

  return (
    <SettingsContext.Provider
      value={{ compactLayout, setCompactLayout, timeFormat, setTimeFormat }}
    >
      {children}
    </SettingsContext.Provider>
  );
};
