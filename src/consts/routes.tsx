import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Todo from "../modules/Todo"
import ModalBox from '../modules/Todo/modalBox';
const router = createBrowserRouter([
    {
      path: '/',
      // element: <Todo/>
      element: <ModalBox/>
    },
  ]);
  
  const Routes = () => <RouterProvider router={router} />;
  
  export default Routes;