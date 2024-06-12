import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Home } from '../modules/Home';
import SignIn from '../pages/SignIn'
import SignUp from '../pages/SignUp'
const router = createBrowserRouter([
    {
      path: '/',
      element: <Home />
    },
    {
      path: '/SignIn',
      element: <SignIn />
    },
    {
      path: '/SignUp',
      element: <SignUp />
    }
  ]);
  
  const Routes = () => <RouterProvider router={router} />;
  
  export default Routes;