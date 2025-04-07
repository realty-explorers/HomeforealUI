import React from 'react';
import { createContext, useState, useContext } from 'react';

// Match next-auth session structure based on the Wizard component usage
interface User {
  id: string;
  name?: string;
  email?: string;
}

interface SessionData {
  user?: User;
  expires: string;
}

interface SessionContextType {
  data: SessionData | null;
  status: 'authenticated' | 'unauthenticated' | 'loading' | string;
  update: (data?: SessionData) => void;
}

// Create context with next-auth structure
export const SessionContext = createContext<SessionContextType>({
  data: null,
  status: 'unauthenticated',
  update: () => {}
});

// Hook to match next-auth's useSession
export const useSession = () => useContext(SessionContext);

export const MockSessionProvider = ({
  children,
  initialSession = null,
  initialStatus = 'unauthenticated'
}: {
  children: React.ReactNode;
  initialSession?: SessionData | null;
  initialStatus?: 'authenticated' | 'unauthenticated' | 'loading' | string;
}) => {
  const [session, setSession] = useState<SessionData | null>(initialSession);
  const [status, setStatus] = useState<
    'authenticated' | 'unauthenticated' | 'loading' | string
  >(initialStatus);

  // Update function to match next-auth behavior
  const update = (data?: SessionData) => {
    if (data) {
      setSession(data);
      setStatus('authenticated');
    } else {
      setSession(null);
      setStatus('unauthenticated');
    }
  };

  // Create value matching next-auth structure
  const contextValue: SessionContextType = {
    data: session,
    status,
    update
  };

  return (
    <SessionContext.Provider value={contextValue}>
      {children}
    </SessionContext.Provider>
  );
};

// Default authenticated session for quick testing
export const getDefaultSession = (): SessionData => ({
  user: {
    id: 'user123',
    name: 'Test User',
    email: 'test@example.com'
  },
  expires: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString() // 24 hours from now
});

export default MockSessionProvider;
