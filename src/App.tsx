import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { SWRProvider } from "./contexts/swr";
import { UserProvider } from "./contexts/user";
import Login from "./pages/Login/Login";
import Attendance from "./pages/Attendance/Attendance";
import Employees from "./pages/Employees/Employees";
import EmployeeDetail from "./pages/Employees/EmployeeDetail";
import { ProtectedRoute } from "./components/layout/ProtectedRoute";

function App() {
  return (
    <SWRProvider>
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
            <Route
              path="/employees"
              element={
                <ProtectedRoute allowedRoles={["ADMIN", "SUPERADMIN", "HR"]}>
                  <Employees />
                </ProtectedRoute>
              }
            />
            <Route
              path="/employees/:id"
              element={
                <ProtectedRoute allowedRoles={["ADMIN", "SUPERADMIN", "HR"]}>
                  <EmployeeDetail />
                </ProtectedRoute>
              }
            />
            <Route path="/" element={<Navigate to="/login" replace />} />
          </Routes>
        </BrowserRouter>
      </UserProvider>
    </SWRProvider>
  );
}

export default App;
