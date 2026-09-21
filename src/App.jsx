import { useState, useEffect } from 'react';
import { ReactLenis } from 'lenis/react';
import AppRoutes from './AppRoutes';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './utils/queryClient';
import MessageBox from './components/admin/MessageBox/MessageBox';
import { AppLoadingContext } from './context/AppLoadingContext';

function App() {
  const [isAppLoading, setIsAppLoading] = useState(true);

  useEffect(() => {
    // 5s loading timer
    const timer = setTimeout(() => setIsAppLoading(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AppLoadingContext.Provider value={{ isLoading: isAppLoading }}>
      <ReactLenis root>
        <QueryClientProvider client={queryClient}>
          <AppRoutes />
          <MessageBox />
        </QueryClientProvider>
      </ReactLenis>
    </AppLoadingContext.Provider>
  );
}

export default App;
