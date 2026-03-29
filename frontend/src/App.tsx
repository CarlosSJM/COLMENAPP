import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import { Login } from './components/auth/Login';
import { Register } from './components/auth/Register';
import { ForgotPassword } from './components/auth/ForgotPassword';
import { Layout } from './components/Layout';
import { Dashboard } from './components/Dashboard';
import { Apiaries } from './components/Apiaries';
import { Hives } from './components/Hives';
import { Inspections } from './components/Inspections';
import { Production } from './components/Production';
import { Tasks } from './components/Tasks';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  if (isLoading) return <div className="min-h-screen flex items-center justify-center">Cargando...</div>;
  if (!user) return <Navigate to="/login" />;
  return <>{children}</>;
}

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="apiaries" element={<Apiaries />} />
        <Route path="apiaries/:apiaryId/hives" element={<Hives />} />
        <Route path="hives" element={<Hives />} />
        <Route path="inspections" element={<Inspections />} />
        <Route path="production" element={<Production />} />
        <Route path="tasks" element={<Tasks />} />
      </Route>
    </Routes>
  );
}

export default App;
