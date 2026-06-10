import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '@/context/AuthContext';
import { Toaster } from '@/components/ui/toaster';
import ScrollToTop from '@/components/ScrollToTop';
import ProtectedRoute from '@/components/ProtectedRoute';
import AdminRoute from '@/components/AdminRoute';

// Pages
import Home from '@/pages/Home';
import LoginPage from '@/pages/LoginPage';
import SignUp from '@/pages/SignUp'; 
import SupportPage from '@/pages/SupportPage';
import DashboardInicio from '@/pages/DashboardInicio';
import DashboardPerfil from '@/pages/DashboardPerfil';
import DashboardSimularAcordo from '@/pages/DashboardSimularAcordo';
import DashboardPagamentos from '@/pages/DashboardPagamentos';
import DashboardAjuda from '@/pages/DashboardAjuda';
import DashboardAdiantamento from '@/pages/DashboardAdiantamento';
import ReceiptsCenter from '@/pages/ReceiptsCenter';
import ProcessarAdiantamento from '@/pages/ProcessarAdiantamento';
import DashboardConfirmacaoPagamento from '@/pages/DashboardConfirmacaoPagamento';
import ConsolidatedAgreementsPage from '@/pages/ConsolidatedAgreementsPage';
import AdiantarParcelasLista from '@/pages/AdiantarParcelasLista';
import SimularAcordoLista from '@/pages/SimularAcordoLista';
import AdiantarParcelasPage from '@/pages/AdiantarParcelasPage';
import SimularAcordoPage from '@/pages/SimularAcordoPage';

// Product Pages
import DashboardMeusProdutos from '@/pages/DashboardMeusProdutos';
import DashboardCarneDigital from '@/pages/DashboardCarneDigital';
import DashboardCartaoCasasBahia from '@/pages/DashboardCartaoCasasBahia';
import DashboardCasasBahia from '@/pages/DashboardCasasBahia';

// Admin Pages
import AdminDashboard from '@/pages/AdminDashboard';
import AdminUsers from '@/pages/AdminUsers';

// Components
import DashboardLayout from '@/components/DashboardLayout';
import CPFStatusDashboard from '@/components/CPFStatusDashboard';

function App() {
  return (
    <AuthProvider>
      <Router>
        <ScrollToTop />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/suporte" element={<SupportPage />} />
          
          {/* Protected Dashboard Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<DashboardInicio />} />
            <Route path="inicio" element={<DashboardInicio />} /> 
            <Route path="perfil" element={<DashboardPerfil />} />
            
            {/* Products Page & Routes */}
            <Route path="produtos" element={<Navigate to="/dashboard/meus-produtos" replace />} />
            <Route path="meus-produtos" element={<DashboardMeusProdutos />} />
            
            {/* Direct Product Routes */}
            <Route path="carne-digital" element={<DashboardCarneDigital />} />
            <Route path="cartao-casas-bahia" element={<DashboardCartaoCasasBahia />} />
            <Route path="casas-bahia" element={<DashboardCasasBahia />} />
            <Route path="casas-bahia-pay" element={<DashboardCasasBahia />} />
            <Route path="emprestimo" element={<DashboardCasasBahia />} />

            {/* Alias Product Detail Routes (Task 4 specific structure) */}
            <Route path="meus-produtos/carne-digital" element={<DashboardCarneDigital />} />
            <Route path="meus-produtos/cartao-casas-bahia" element={<DashboardCartaoCasasBahia />} />
            <Route path="meus-produtos/emprestimo" element={<DashboardCasasBahia />} />
            <Route path="meus-produtos/casas-bahia-pay" element={<DashboardCasasBahia />} />

            {/* Agreements - Consolidated Route */}
            <Route path="acordos" element={<ConsolidatedAgreementsPage />} />
            <Route path="meus-acordos" element={<Navigate to="/dashboard/acordos" replace />} /> 

            {/* Selection Lists for Flows */}
            <Route path="adiantar-parcelas-lista" element={<AdiantarParcelasLista />} />
            <Route path="simular-acordo-lista" element={<SimularAcordoLista />} />

            {/* Flow Pages */}
            <Route path="adiantar-parcelas" element={<AdiantarParcelasPage />} />
            <Route path="simular-acordo" element={<SimularAcordoPage />} />
            <Route path="adiantamento" element={<DashboardAdiantamento />} /> 
            <Route path="simular-acordo/:contractId" element={<DashboardSimularAcordo />} />

            <Route path="pagamentos" element={<DashboardPagamentos />} />
            <Route path="ajuda" element={<DashboardAjuda />} />
            <Route path="comprovantes" element={<ReceiptsCenter />} />
            <Route path="processar-adiantamento" element={<ProcessarAdiantamento />} />
            <Route path="confirmacao-pagamento" element={<DashboardConfirmacaoPagamento />} />
            
          </Route>

          {/* Admin Routes */}
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <DashboardLayout />
              </AdminRoute>
            }
          >
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="cpf-status" element={<CPFStatusDashboard />} />
          </Route>

        </Routes>
        <Toaster />
      </Router>
    </AuthProvider>
  );
}

export default App;
