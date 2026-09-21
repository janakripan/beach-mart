import { createContext, useContext } from 'react';

export const AppLoadingContext = createContext({
  isLoading: false,
});

export const useAppLoading = () => useContext(AppLoadingContext);
