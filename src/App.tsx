import './App.css';
import { AuthWrapper } from "./components/AuthWrapper";
import { AuthRoutes } from './consts/routes';

function App() {
  return (
    <div className="App">
      <AuthWrapper>
        <AuthRoutes />
      </AuthWrapper>
    </div>
  );
}

export default App;
