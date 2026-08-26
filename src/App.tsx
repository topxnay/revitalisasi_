import React, { useState, useEffect } from 'react';
import { 
  Navbar 
} from './components/Navbar';
import { 
  LandingPage 
} from './components/LandingPage';
import { 
  LoginModal 
} from './components/LoginModal';
import { 
  AdminDashboard 
} from './components/AdminDashboard';
import { 
  UserDashboard 
} from './components/UserDashboard';
import { 
  FormPengajuan 
} from './components/FormPengajuan';
import { 
  UserManagementModal 
} from './components/UserManagementModal';
import { 
  VerificationModal 
} from './components/VerificationModal';
import { 
  DetailProposalModal 
} from './components/DetailProposalModal';
import { 
  PrintReceiptModal 
} from './components/PrintReceiptModal';

import { 
  User, 
  PengajuanRevitalisasi 
} from './types';
import { 
  getStoredCurrentUser, 
  setStoredCurrentUser, 
  getStoredUsers, 
  saveUserToStorage, 
  deleteUserFromStorage, 
  getStoredProposals, 
  saveProposalToStorage, 
  deleteProposalFromStorage, 
  resetToInitialData,
  toggleUserStatus
} from './utils/storage';

export function App() {
  // Main State
  const [currentUser, setCurrentUser] = useState<User | null>(() => getStoredCurrentUser());
  const [users, setUsers] = useState<User[]>(() => getStoredUsers());
  const [proposals, setProposals] = useState<PengajuanRevitalisasi[]>(() => getStoredProposals());
  
  // Navigation / View State
  const [activeView, setActiveView] = useState<'landing' | 'admin' | 'user' | 'form'>(() => {
    const user = getStoredCurrentUser();
    if (!user) return 'landing';
    return user.role === 'admin' ? 'admin' : 'user';
  });

  // Modal States
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [initialRoleLogin, setInitialRoleLogin] = useState<'admin' | 'user'>('user');
  
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const [isVerificationModalOpen, setIsVerificationModalOpen] = useState(false);
  const [verifyingProposal, setVerifyingProposal] = useState<PengajuanRevitalisasi | null>(null);

  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [detailProposal, setDetailProposal] = useState<PengajuanRevitalisasi | null>(null);

  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
  const [printProposal, setPrintProposal] = useState<PengajuanRevitalisasi | null>(null);

  const [editingProposal, setEditingProposal] = useState<PengajuanRevitalisasi | null>(null);

  // Sync state on user change
  useEffect(() => {
    if (currentUser) {
      if (currentUser.role === 'admin' && activeView !== 'form') {
        setActiveView('admin');
      } else if (currentUser.role === 'user' && activeView !== 'form') {
        setActiveView('user');
      }
    } else {
      setActiveView('landing');
    }
  }, [currentUser]);

  // Auth Handlers
  const handleLogin = (user: User) => {
    setCurrentUser(user);
    setStoredCurrentUser(user);
    setIsLoginModalOpen(false);
    if (user.role === 'admin') {
      setActiveView('admin');
    } else {
      setActiveView('user');
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setStoredCurrentUser(null);
    setActiveView('landing');
  };

  const handleSwitchRole = (role: 'admin' | 'user') => {
    const targetUser = users.find(u => u.role === role && u.status === 'active');
    if (targetUser) {
      handleLogin(targetUser);
    } else {
      setInitialRoleLogin(role);
      setIsLoginModalOpen(true);
    }
  };

  const handleResetData = () => {
    const { users: newUsers, proposals: newProposals } = resetToInitialData();
    setUsers(newUsers);
    setProposals(newProposals);
    const updatedUser = newUsers.find(u => u.id === currentUser?.id) || null;
    setCurrentUser(updatedUser);
    setStoredCurrentUser(updatedUser);
    alert('Data sistem berhasil direset ke data awal master!');
  };

  // Proposal Operations
  const handleSaveProposal = (savedProposal: PengajuanRevitalisasi) => {
    const updatedList = saveProposalToStorage(savedProposal);
    setProposals(updatedList);
    setEditingProposal(null);
    if (currentUser?.role === 'admin') {
      setActiveView('admin');
    } else {
      setActiveView('user');
    }
  };

  const handleDeleteProposal = (proposalId: string) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus data usulan ini?')) {
      const updatedList = deleteProposalFromStorage(proposalId);
      setProposals(updatedList);
    }
  };

  const handleSaveVerification = (updatedProposal: PengajuanRevitalisasi) => {
    const updatedList = saveProposalToStorage(updatedProposal);
    setProposals(updatedList);
    if (detailProposal?.id === updatedProposal.id) {
      setDetailProposal(updatedProposal);
    }
  };

  // User Operations
  const handleSaveUser = (savedUser: User) => {
    const updatedUsers = saveUserToStorage(savedUser);
    setUsers(updatedUsers);
    if (currentUser?.id === savedUser.id) {
      setCurrentUser(savedUser);
      setStoredCurrentUser(savedUser);
    }
  };

  const handleDeleteUser = (userId: string) => {
    if (window.confirm('Hapus akun pengguna ini dari sistem?')) {
      const updatedUsers = deleteUserFromStorage(userId);
      setUsers(updatedUsers);
    }
  };

  const handleToggleUser = (userId: string) => {
    const updatedUsers = toggleUserStatus(userId);
    setUsers(updatedUsers);
    if (currentUser?.id === userId) {
      const updatedCurrent = updatedUsers.find(u => u.id === userId) || null;
      setCurrentUser(updatedCurrent);
    }
  };

  // Navigation Trigger Helpers
  const handleOpenCreateForm = () => {
    if (!currentUser) {
      setInitialRoleLogin('user');
      setIsLoginModalOpen(true);
      return;
    }
    setEditingProposal(null);
    setActiveView('form');
  };

  const handleOpenEditForm = (proposal: PengajuanRevitalisasi) => {
    setEditingProposal(proposal);
    setActiveView('form');
  };

  const handleOpenDetailModal = (proposal: PengajuanRevitalisasi) => {
    setDetailProposal(proposal);
    setIsDetailModalOpen(true);
  };

  const handleOpenVerificationModal = (proposal: PengajuanRevitalisasi) => {
    setVerifyingProposal(proposal);
    setIsVerificationModalOpen(true);
  };

  const handleOpenPrintModal = (proposal: PengajuanRevitalisasi) => {
    setPrintProposal(proposal);
    setIsPrintModalOpen(true);
  };

  // Filter proposals belonging to current user
  const userProposals = currentUser && Array.isArray(proposals)
    ? proposals.filter(p => p.userId === currentUser.id || (currentUser.npsn && p.npsn === currentUser.npsn))
    : [];

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white relative overflow-x-hidden">
      
      {/* Frosted Glass Ambient Glow Orbs */}
      <div className="fixed top-[-140px] left-[-140px] w-[460px] h-[460px] bg-indigo-600/25 rounded-full blur-[140px] pointer-events-none -z-10" />
      <div className="fixed bottom-[-140px] right-[-140px] w-[500px] h-[500px] bg-emerald-600/20 rounded-full blur-[140px] pointer-events-none -z-10" />
      <div className="fixed top-[45%] right-[10%] w-[380px] h-[380px] bg-cyan-600/15 rounded-full blur-[130px] pointer-events-none -z-10" />
      
      {/* Top Navigation */}
      <Navbar
        currentUser={currentUser}
        onOpenLogin={(role) => {
          setInitialRoleLogin(role);
          setIsLoginModalOpen(true);
        }}
        onLogout={handleLogout}
        onSwitchRole={handleSwitchRole}
        onResetData={handleResetData}
        activeView={activeView}
        onNavigate={(view) => setActiveView(view)}
        onOpenUserManagement={() => {
          setEditingUser(null);
          setIsUserModalOpen(true);
        }}
      />

      {/* Main Content Area */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 relative z-10 max-w-7xl w-full mx-auto">
        {activeView === 'landing' && (
          <LandingPage
            proposals={proposals}
            currentUser={currentUser}
            onOpenLogin={(role) => {
              setInitialRoleLogin(role);
              setIsLoginModalOpen(true);
            }}
            onSelectProposalDetail={handleOpenDetailModal}
            onNavigateToForm={handleOpenCreateForm}
          />
        )}

        {activeView === 'admin' && currentUser?.role === 'admin' && (
          <AdminDashboard
            currentUser={currentUser}
            proposals={proposals}
            users={users}
            onOpenCreateUser={() => {
              setEditingUser(null);
              setIsUserModalOpen(true);
            }}
            onOpenEditUser={(user) => {
              setEditingUser(user);
              setIsUserModalOpen(true);
            }}
            onDeleteUser={handleDeleteUser}
            onToggleUserStatus={handleToggleUser}
            onOpenVerification={handleOpenVerificationModal}
            onOpenDetail={handleOpenDetailModal}
            onOpenPrintReceipt={handleOpenPrintModal}
            onOpenEditProposal={handleOpenEditForm}
            onDeleteProposal={handleDeleteProposal}
            onOpenCreateProposal={handleOpenCreateForm}
          />
        )}

        {activeView === 'user' && currentUser && (
          <UserDashboard
            currentUser={currentUser}
            userProposals={userProposals}
            onOpenCreateForm={handleOpenCreateForm}
            onOpenEditForm={handleOpenEditForm}
            onOpenDetail={handleOpenDetailModal}
            onOpenPrintReceipt={handleOpenPrintModal}
          />
        )}

        {activeView === 'form' && currentUser && (
          <FormPengajuan
            currentUser={currentUser}
            editingProposal={editingProposal}
            onSaveProposal={handleSaveProposal}
            onCancel={() => setActiveView(currentUser.role === 'admin' ? 'admin' : 'user')}
            allProposals={proposals}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="no-print bg-slate-900/60 backdrop-blur-xl border-t border-white/10 py-6 text-center text-xs text-slate-400 relative z-10">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-white tracking-wide">SIM-REVIT 2027</span>
            <span className="text-slate-600">•</span>
            <span>Sistem Informasi Terpadu Program Revitalisasi Sekolah</span>
          </div>
          <div className="text-slate-400">
            Cakupan 7 Jenjang: <span className="text-slate-200 font-medium">TK/PAUD, SD, SMP, SMA, SMK, SLB, & PKBM</span>
          </div>
        </div>
      </footer>

      {/* MODALS */}
      {/* 1. Login & Registration Modal */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLoginSuccess={handleLogin}
        users={users}
        registeredUsers={users}
        onRegisterUser={handleSaveUser}
        initialRole={initialRoleLogin}
      />

      {/* 2. Admin User Management Modal */}
      <UserManagementModal
        isOpen={isUserModalOpen}
        onClose={() => {
          setIsUserModalOpen(false);
          setEditingUser(null);
        }}
        onSaveUser={handleSaveUser}
        editingUser={editingUser}
        existingUsers={users}
      />

      {/* 3. Proposal Verification Modal */}
      <VerificationModal
        isOpen={isVerificationModalOpen}
        onClose={() => {
          setIsVerificationModalOpen(false);
          setVerifyingProposal(null);
        }}
        proposal={verifyingProposal}
        onSaveVerification={handleSaveVerification}
        currentUser={currentUser}
      />

      {/* 4. Detail 18-Column & Cost Breakdown Modal */}
      <DetailProposalModal
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false);
          setDetailProposal(null);
        }}
        proposal={detailProposal}
        currentUser={currentUser}
        onOpenVerification={currentUser?.role === 'admin' ? handleOpenVerificationModal : undefined}
        onOpenPrintReceipt={handleOpenPrintModal}
        onEditProposal={handleOpenEditForm}
      />

      {/* 5. Printable Receipt Modal */}
      <PrintReceiptModal
        isOpen={isPrintModalOpen}
        onClose={() => {
          setIsPrintModalOpen(false);
          setPrintProposal(null);
        }}
        proposal={printProposal}
      />

    </div>
  );
}

export default App;
