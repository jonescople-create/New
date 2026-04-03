import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { Toaster } from "sonner";
import LoginPage from "@/pages/LoginPage";
import Desktop from "@/pages/Desktop";
import "@/App.css";

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <div className="loading-screen" data-testid="loading-screen">
        <div className="loading-spinner" />
        <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13 }}>Loading AuraOS...</span>
      </div>
    );
  }
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

function PublicRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <div className="loading-screen" data-testid="loading-screen">
        <div className="loading-spinner" />
      </div>
    );
  }
  if (user) return <Navigate to="/" replace />;
  return children;
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
          <Route path="/*" element={<ProtectedRoute><Desktop /></ProtectedRoute>} />
        </Routes>
      </BrowserRouter>
      <Toaster position="top-center" theme="dark" />
    </AuthProvider>
  );
}

export default App;
