import { ReactLenis } from 'lenis/react';
import AppRoutes from './AppRoutes';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './utils/queryClient';
import MessageBox from './components/admin/MessageBox/MessageBox';

function App() {
  return (
    <ReactLenis root>
      <QueryClientProvider client={queryClient}>
        <AppRoutes />
        <MessageBox />
      </QueryClientProvider>
    </ReactLenis>
  );
}

export default App;
