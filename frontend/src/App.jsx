import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import MainLayout from './presentation/layouts/MainLayout';
import AppRoutes from './routes/AppRoutes';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <Router>
      <MainLayout>
        <AppRoutes />
      </MainLayout>
      <ToastContainer theme="dark" position="bottom-right" />
    </Router>
  );
}

export default App;
