import React, { useState } from 'react';

type SettingsContext = {
  compactLayout: boolean;
  setCompactLayout: (compactLayout: boolean) => void;
};

export const SETTINGS_CONTEXT_DEFAULT = {
  compactLayout: false,
  timeFormat: 'timestamp',
  isDrawerOpen: true,
  setCompactLayout: function(compactLayout: boolean): void {
    this.compactLayout = compactLayout;
  },
  setTimeFormat: function(timeFormat: string): void {
    this.timeFormat = timeFormat;
  },
  setDrawerOpen: function(isOpen: boolean): void {
    this.isDrawerOpen = isOpen;
  },
};

export const SettingsContext = React.createContext<SettingsContext>(
  SETTINGS_CONTEXT_DEFAULT,
);

export const SettingsContextProvider: React.FC<any> = ({ children }: any) => {
  const [compactLayout, setCompactLayout] = useState(false);

  return (
    <SettingsContext.Provider value={{ compactLayout, setCompactLayout }}>
      {children}
    </SettingsContext.Provider>
  );
};
