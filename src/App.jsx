import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
import LandingPage from './pages/LandingPage/LandingPage';
import Shop from './pages/Shop/Shop';
import Contact from './pages/Contact/Contact';
import Header from './components/Header/Header';
import { ReactLenis } from 'lenis/react';

function Layout() {
  return (
    <>
      <Header />
      <Outlet />
    </>
  );
}

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        path: '/',
        element: <LandingPage />,
      },
      {
        path: '/shop',
        element: <Shop />,
      },
      {
        path: '/contact',
        element: <Contact />,
      },
    ],
  },
]);

function App() {
  return (
    <ReactLenis root>
      <RouterProvider router={router} />
    </ReactLenis>
  );
}

export default App;
