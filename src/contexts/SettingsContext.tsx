import React, { useState } from 'react';

type SettingsContext = {
  compactLayout: boolean;
  setCompactLayout: (compactLayout: boolean) => void;
};

export const SETTINGS_CONTEXT_DEFAULT = {
  compactLayout: false,
  setCompactLayout: function(compactLayout: boolean): void {
    this.compactLayout = compactLayout;
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
