import { UserProvider } from "./context/user";
import Login from "./pages/Login/Login";

function App() {
  return (
    <UserProvider>
      <Login />
    </UserProvider>
  );
}

export default App;
