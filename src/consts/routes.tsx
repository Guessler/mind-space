import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Todo from "../modules/Todo"
const router = createBrowserRouter([
    {
      path: '/',
      element: <Todo/>
    },
  ]);
  
  const Routes = () => <RouterProvider router={router} />;
  
  export default Routes;