import React, { useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AdminDashboard from './pages/Admin/AdminDashboard';
import SupplierDashboard from './pages/Supplier/SupplierDashboard';
import ItemForm from './pages/Admin/ItemForm';
import { AuthContext } from './context/AuthContext';
import Layout from './components/Layout';

const theme = createTheme();

function App() {
  const { user, loading } = useContext(AuthContext);

  if (loading) return null;

  const AdminRoute = ({ children }) => {
    return user && user.role === 'Admin' ? children : <Navigate to="/login" />;
  };

  const SupplierRoute = ({ children }) => {
    return user && user.role === 'Supplier' ? children : <Navigate to="/login" />;
  };

  const HomeRoute = () => {
    if (!user) return <Navigate to="/login" />;
    if (user.role === 'Admin') return <Navigate to="/admin/dashboard" />;
    if (user.role === 'Supplier') return <Navigate to="/supplier/dashboard" />;
    return <Navigate to="/login" />;
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route path="/" element={<Layout />}>
          <Route index element={<HomeRoute />} />
          <Route path="admin/dashboard" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
          <Route path="admin/item/new" element={<AdminRoute><ItemForm /></AdminRoute>} />
          <Route path="admin/item/edit/:id" element={<AdminRoute><ItemForm /></AdminRoute>} />
          <Route path="supplier/dashboard" element={<SupplierRoute><SupplierDashboard /></SupplierRoute>} />
        </Route>

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </ThemeProvider>
  );
}
export default App;