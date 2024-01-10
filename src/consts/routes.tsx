import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Todo from '../modules/Todo';
import Todos from "../modules/Todo/todos"
const router = createBrowserRouter([
    {
      path: '/',
      element: <Todo />
    },
    {
      path: '/todo',
      element: <Todos />
    },
  ]);
  
  const Routes = () => <RouterProvider router={router} />;
  
  export default Routes;