import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Home } from '../modules/Home';
import SignIn from '../pages/SignIn'
import SignUp from '../pages/SignUp'

export enum Paths {
  'SignIn'='/sign-in',
  'SignUp'='/sign-up',
  'Home'="/"
}


const authRouter = createBrowserRouter([
    {
      path: Paths.Home,
      element: <Home />
    },
]);

const publicRouter = createBrowserRouter([
  {
    path: Paths.SignIn,
    element: <SignIn />
  },
  {
    path: Paths.SignUp,
    element: <SignUp />
  }
])
  
export const AuthRoutes = () => <RouterProvider router={authRouter} />;
export const PublicRoutes = () => <RouterProvider router={publicRouter} />;