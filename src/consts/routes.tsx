import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Home } from '../modules/Home';
import SignIn from '../pages/SignIn'
import SignUp from '../pages/SignUp'
import { WorkspacePage } from '../pages/Workspace';

export enum Paths {
  'SignIn'='/sign-in',
  'SignUp'='/sign-up',
  'Home'="/",
  'Workspace'="/:id"
}

const authRouter = createBrowserRouter([
    {
      path: Paths.Home,
      element: <Home />
    },
    {
      path: Paths.Workspace,
      element: <WorkspacePage />
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