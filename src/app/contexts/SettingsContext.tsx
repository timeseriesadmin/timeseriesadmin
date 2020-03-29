import React, { useState } from 'react';

export type SettingsContext = {
  compactLayout: boolean;
  timeFormat: string;
  setCompactLayout: (compactLayout: boolean) => void;
  setTimeFormat: (timeFormat: string) => void;
};

export const SETTINGS_CONTEXT_DEFAULT = {
  compactLayout: false,
  timeFormat: 'timestamp',
  isDrawerOpen: true,
  setCompactLayout: function (compactLayout: boolean): void {
    this.compactLayout = compactLayout;
  },
  setTimeFormat: function (timeFormat: string): void {
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
  const [timeFormat, setTimeFormat] = useState('timestamp');

  return (
    <SettingsContext.Provider
      value={{ compactLayout, setCompactLayout, timeFormat, setTimeFormat }}
    >
      {children}
    </SettingsContext.Provider>
  );
};
