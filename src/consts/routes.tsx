// import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
// import { Home } from '../modules/Home';
// import SignIn from '../pages/SignIn';
// import SignUp from '../pages/SignUp';
// import { WorkspacePage } from '../pages/Workspace';

// export enum Paths {
//   SignIn = '/sign-in',
//   SignUp = '/sign-up',
//   Home = '/',
//   Workspace = '/:id',
// }

// const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
//   return children;
// };

// const router = createBrowserRouter([
//   {
//     path: Paths.SignIn,
//     element: <SignIn />,
//   },
//   {
//     path: Paths.SignUp,
//     element: <SignUp />,
//   },
//   {
//     path: Paths.Home,
//     element: (
//       <ProtectedRoute>
//         <Home />
//       </ProtectedRoute>
//     ),
//   },
//   {
//     path: Paths.Workspace,
//     element: (
//       <ProtectedRoute>
//         <WorkspacePage />
//       </ProtectedRoute>
//     ),
//   },
//   {
//     path: '*',
//     element: <Navigate to={Paths.Home} replace />,
//   },
// ]);

// export const AuthRoutes = () => <RouterProvider router={router} />;
// export const PublicRoutes = () => <RouterProvider router={router} />;



import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { Home } from '../modules/Home';
import SignIn from '../pages/SignIn';
import SignUp from '../pages/SignUp';
import { WorkspacePage } from '../pages/Workspace';

export enum Paths {
  SignIn = '/sign-in',
  SignUp = '/sign-up',
  Home = '/',
  Workspace = '/:id',
  PageNotFound = "/*"
}

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  return children;
};

const router = createBrowserRouter([
  {
    path: Paths.SignIn,
    element: <SignIn />,
  },
  {
    path: Paths.SignUp,
    element: <SignUp />,
  },
  {
    path: Paths.Home,
    element: (
      <ProtectedRoute>
        <Home />
      </ProtectedRoute>
    ),
  },
  {
    path: Paths.Workspace,
    element: (
      <ProtectedRoute>
        <WorkspacePage />
      </ProtectedRoute>
    ),
  },
  {
    path: '*',
    element: <Navigate to={Paths.Home} replace />,
  },
]);

export const AuthRoutes = () => <RouterProvider router={router} />;
export const PublicRoutes = () => <RouterProvider router={router} />;
