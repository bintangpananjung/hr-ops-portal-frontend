import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { UserProvider } from "./contexts/user";
import Login from "./pages/Login/Login";
import Attendance from "./pages/Attendance/Attendance";
import { ProtectedRoute } from "./components/layout/ProtectedRoute";

function App() {
  return (
    <UserProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/attendance"
            element={
              <ProtectedRoute
                allowedRoles={["EMPLOYEE", "ADMIN", "SUPERADMIN", "HR"]}
              >
                <Attendance />
              </ProtectedRoute>
            }
          />
          <Route path="/" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </UserProvider>
  );
}

export default App;
