import { useState, useEffect } from 'react';
import { ReactLenis } from 'lenis/react';
import AppRoutes from './AppRoutes';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './utils/queryClient';
import MessageBox from './components/admin/MessageBox/MessageBox';
import { AppLoadingContext } from './context/AppLoadingContext';
import SplashScreen from './components/SplashScreen/SplashScreen';

import { authService } from './api/user/services/authService';
import { useAuthStore } from './pages/Auth/store/AuthStore';

import { getBanner, getCategories, getProducts, getVariants } from './api/shared/service';
import { getDeliveryLocations, getDeliveryModes, getPaymentModes } from './api/admin/service';
import { useAppStore } from './store/appStore';

function App() {
  const [isAppLoading, setIsAppLoading] = useState(false);
  const [authInitialized, setAuthInitialized] = useState(false);
  const [showSplash, setShowSplash] = useState(() => {
    return !sessionStorage.getItem('splashShown');
  });
  const loginSuccess = useAuthStore((s) => s.loginSuccess);

  useEffect(() => {
    const fetchAuthToken = async () => {
      try {
        const response = await authService.getAuthenticated();
        if (response.isSucess && response.data?._accessToken) {
          // Store the dynamic access token but keep other info generic or null since no user is explicitly logged in
          useAuthStore.setState({ accessToken: response.data._accessToken });
          
          try {
            // 1. Fetch banner first as requested
            try {
              const bannerData = await getBanner();
              useAppStore.getState().setBanner(bannerData);
            } catch (err) {
              console.error("Failed to fetch banner", err);
            }
            
            // 2. Fetch the rest concurrently
            const results = await Promise.allSettled([
              getCategories(),
              getVariants(),
              getDeliveryLocations(),
              getDeliveryModes(),
              getPaymentModes(),
              getProducts({ page: 1, pageSize: 1000 })
            ]);

            const store = useAppStore.getState();
            if (results[0].status === 'fulfilled') store.setCategories(results[0].value.data || []);
            if (results[1].status === 'fulfilled') store.setVariants(results[1].value.data || []);
            if (results[2].status === 'fulfilled') store.setDeliveryLocations(results[2].value.data || []);
            if (results[3].status === 'fulfilled') store.setDeliveryModes(results[3].value.data || []);
            if (results[4].status === 'fulfilled') store.setPaymentModes(results[4].value.data || []);
            if (results[5].status === 'fulfilled') store.setProducts(results[5].value.data || []);
            
          } catch (err) {
            console.error("Prefetch error", err);
          }
        }
      } catch (error) {
        console.error("Failed to fetch authenticated token", error);
      } finally {
        setAuthInitialized(true);
      }
    };
    fetchAuthToken();
  }, []);

  const handleSplashFinish = () => {
    sessionStorage.setItem('splashShown', 'true');
    setShowSplash(false);
  };

  return (
    <AppLoadingContext.Provider value={{ isLoading: isAppLoading }}>
      <ReactLenis root>
        <QueryClientProvider client={queryClient}>
          {showSplash && <SplashScreen isDataLoaded={authInitialized} onFinish={handleSplashFinish} />}
          {authInitialized && (
            <>
              <AppRoutes />
              <MessageBox />
            </>
          )}
        </QueryClientProvider>
      </ReactLenis>
    </AppLoadingContext.Provider>
  );
}

export default App;
