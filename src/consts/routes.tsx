import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Home } from '../modules/Home';

const router = createBrowserRouter([
    {
      path: '/',
      element: <Home />
    },
  ]);
  
  const Routes = () => <RouterProvider router={router} />;
  
  export default Routes;