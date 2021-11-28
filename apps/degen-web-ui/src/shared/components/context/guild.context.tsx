import React, { createContext, useEffect, useState } from 'react';

export const GuildContext = createContext(null);

export function ActiveGuildProvider({ children }) {
  const [activeGuild, setActiveGuild] = useState(null);
  const sessionKey = 'degen.activeGuild';

  // Attempt to load the activeGuild from sessionStorage
  useEffect(() => {
    try {
      const activeGuild = sessionStorage.getItem(sessionKey);
      if (activeGuild) {
        setActiveGuild(JSON.parse(activeGuild));
      }
    } catch (e) {
      sessionStorage.removeItem(sessionKey);
    }
  }, []);

  // Wrapper method that attempts to save the new activeGuild to sessionStorage
  const setSessionWrapper = (guild) => {
    try {
      sessionStorage.setItem(sessionKey, JSON.stringify(guild));
    } catch (e) {
      // do nothing...
    }
    setActiveGuild(guild);
  };

  return (
    <GuildContext.Provider value={{ activeGuild, setActiveGuild: setSessionWrapper }}>
      {children}
    </GuildContext.Provider>
  );
}
