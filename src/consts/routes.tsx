import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Todo from '../modules/Todo';
import Todos from "../modules/TodoPage/TodoPage";

const router = createBrowserRouter([
    {
      path: '/',
      element: <Todo />
    },
    {
      path: '/todo/:id',
      element: <Todos />
    },
  ]);
  
  const Routes = () => <RouterProvider router={router} />;
  
  export default Routes;