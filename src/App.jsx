import { useState, useEffect } from 'react';
import { ReactLenis } from 'lenis/react';
import AppRoutes from './AppRoutes';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './utils/queryClient';
import MessageBox from './components/admin/MessageBox/MessageBox';
import SplashScreen from './components/SplashScreen/SplashScreen';
import { AppLoadingContext } from './context/AppLoadingContext';

// Show splash only once per browser session
const SPLASH_KEY = 'bm_splash_shown';

function App() {
  const initialShowSplash = !sessionStorage.getItem(SPLASH_KEY);
  const [showSplash, setShowSplash] = useState(initialShowSplash);
  
  // If splash is showing, wait for it. If not, start loading immediately.
  const [isAppLoading, setIsAppLoading] = useState(true);

  useEffect(() => {
    if (!initialShowSplash) {
      // If no splash, run the 5s loading timer immediately
      const timer = setTimeout(() => setIsAppLoading(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [initialShowSplash]);

  const handleSplashFinish = () => {
    sessionStorage.setItem(SPLASH_KEY, '1');
    setShowSplash(false);
    // Start 5s timer after splash finishes
    setTimeout(() => setIsAppLoading(false), 5000);
  };

  return (
    <AppLoadingContext.Provider value={{ isLoading: isAppLoading }}>
      {showSplash && <SplashScreen onFinish={handleSplashFinish} />}
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
