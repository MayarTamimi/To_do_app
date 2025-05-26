import { createContext } from 'react';

export const UserContext = createContext({
  isAuthenticated: false,
  profilePhoto: null,
  setAuthenticated: () => {},
  setProfilePhoto: () => {},
});

export default UserContext.Provider;