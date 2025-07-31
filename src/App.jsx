import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/auth/LoginPage";
import AuthCallback from "./pages/auth/AuthCallback";
import UserDashboard from "./pages/guest/UserDashboard";
import StaffDashboard from "./pages/staff/StaffDashboard";
import AdminDashboard from "./pages/admin/AdminDashboard";
import UserProfilePage from "./pages/guest/UserProfilePage";
import { AuthProvider } from "./contexts/AuthContext";
import { useAuth } from "./contexts/useAuth";

function ProtectedRoute({ children, allowedRoles }) {
  const { user, userRole } = useAuth();
  
  if (!user) {
    return <Navigate to="/" />;
  }
  
  if (!userRole || !allowedRoles.includes(userRole)) {
    return <Navigate to="/" />;
  }
  
  return children;
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
                     <Route path="/" element={<LoginPage />} />
           <Route path="/auth/callback" element={<AuthCallback />} />
          <Route
            path="/user-dashboard"
            element={
              <ProtectedRoute allowedRoles={["User"]}>
                <UserDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/staff-dashboard"
            element={
              <ProtectedRoute allowedRoles={["Staff"]}>
                <StaffDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin-dashboard"
            element={
              <ProtectedRoute allowedRoles={["Admin"]}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/user-profile"
            element={
              <ProtectedRoute allowedRoles={["User"]}>
                <UserProfilePage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;