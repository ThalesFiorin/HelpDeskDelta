import React, { useState, useEffect } from 'react';
import { Login } from './components/Login';
import { Layout } from './components/Layout';
import { Dashboard } from './components/Dashboard';
import { TicketList } from './components/TicketList';
import { TicketDetail } from './components/TicketDetail';
import { UserManagement } from './components/UserManagement';
import { CalendarView } from './components/CalendarView';
import { ResetPassword } from './components/ResetPassword'; // Importando a nova página
import { Ticket, User, ViewState, UserRole, TicketStatus } from './types';
import { api } from './services/api';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentView, setCurrentView] = useState<ViewState | 'RESET_PASSWORD'>('LOGIN');
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [loading, setLoading] = useState(true);
  
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    // Detecta se o usuário veio pelo link de recuperação de senha
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash && (hash.includes('type=recovery') || hash.includes('access_token='))) {
        setCurrentView('RESET_PASSWORD');
      }
    };

    handleHashChange(); // Verifica ao carregar a página
    window.addEventListener('hashchange', handleHashChange);

    const checkSession = async () => {
        try {
            const user = await api.getCurrentUser();
            if (user) {
                setCurrentUser(user);
                // Se estiver logado e não for reset de senha, vai pro dashboard
                if (window.location.hash.indexOf('type=recovery') === -1) {
                  setCurrentView('DASHBOARD');
                }
            }
        } catch (e) {
            console.error("Erro ao verificar sessão:", e);
        } finally {
            setLoading(false);
        }
    };
    checkSession();

    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  useEffect(() => {
    if (currentUser && currentView !== 'RESET_PASSWORD') {
      loadData();
    }
  }, [currentUser, currentView]);

  const loadData = async () => {
    try {
        const [fetchedTickets, fetchedUsers] = await Promise.all([
          api.getTickets(),
          api.getUsers()
        ]);
        setTickets(fetchedTickets);
        setUsers(fetchedUsers);
    } catch (e) {
        console.error("Falha ao carregar dados do Supabase:", e);
    }
  };

  const handleLogin = async (email: string, password: string) => {
    const user = await api.login(email, password);
    setCurrentUser(user);
    setCurrentView('DASHBOARD');
  };

  const handleForgotPassword = async (email: string) => {
    if (!email) {
      alert("Por favor, digite seu e-mail no campo de login primeiro.");
      return;
    }
    try {
      await api.resetPassword(email); 
      alert("E-mail de recuperação enviado! Verifique sua caixa de entrada.");
    } catch (e: any) {
      alert("Erro ao enviar e-mail: " + e.message);
    }
  };

  const handleLogout = async () => {
    await api.signOut();
    setCurrentUser(null);
    setCurrentView('LOGIN');
    setSelectedTicket(null);
    setTickets([]);
  };

  const handleCreateTicket = async (ticketData: any) => {
    await api.createTicket(ticketData);
    await loadData();
    setCurrentView('TICKETS');
  };

  const handleAddComment = async (ticketId: string, content: string, isInternal: boolean) => {
    const ticket = tickets.find(t => t.id === ticketId);
    if (!ticket) return;
    const dbId = (ticket as any).realId || ticketId;
    await api.addComment(dbId, { userId: currentUser!.id, content, isInternal });
    await loadData();
    const updatedTickets = await api.getTickets();
    const updatedSelection = updatedTickets.find(t => t.id === ticketId);
    if (updatedSelection) setSelectedTicket(updatedSelection);
  };

  const handleUpdateStatus = async (ticketId: string, status: TicketStatus) => {
    const ticket = tickets.find(t => t.id === ticketId);
    if (!ticket) return;
    const dbId = (ticket as any).realId || ticketId;
    await api.updateTicketStatus(dbId, status);
    await loadData();
    const updatedTickets = await api.getTickets();
    const updatedSelection = updatedTickets.find(t => t.id === ticketId);
    if (updatedSelection) setSelectedTicket(updatedSelection);
  };

  const handleAssign = async (ticketId: string, userId: string) => {
    const ticket = tickets.find(t => t.id === ticketId);
    if (!ticket) return;
    const dbId = (ticket as any).realId || ticketId;
    await api.assignTicket(dbId, userId);
    await loadData();
    const updatedTickets = await api.getTickets();
    const updatedSelection = updatedTickets.find(t => t.id === ticketId);
    if (updatedSelection) setSelectedTicket(updatedSelection);
  };

  const handleAddUser = async (user: User) => {
      await api.addUser(user);
      await loadData();
  };

  const handleUpdateUser = async (user: User) => {
      await api.updateUser(user);
      await loadData();
      if (currentUser?.id === user.id) setCurrentUser(user);
  };

  const handleDeleteUser = async (id: string) => {
      await api.deleteUser(id);
      await loadData();
  };

  if (loading) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
          <div className="w-8 h-8 border-4 border-delta-blue border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-gray-500 font-medium">Conectando ao banco de dados...</p>
        </div>
      );
  }

  // Lógica de exibição das telas de autenticação
  if (currentView === 'RESET_PASSWORD') {
    return <ResetPassword onSuccess={() => setCurrentView('LOGIN')} />;
  }

  if (!currentUser) {
    return <Login onLogin={handleLogin} onForgotPassword={handleForgotPassword} />;
  }

  let content;
  if (selectedTicket) {
      content = (
          <TicketDetail 
            ticket={selectedTicket} 
            users={users}
            currentUser={currentUser}
            onBack={() => setSelectedTicket(null)}
            onAddComment={handleAddComment}
            onUpdateStatus={handleUpdateStatus}
            onAssign={handleAssign}
          />
      );
  } else {
      switch (currentView) {
        case 'DASHBOARD':
          content = <Dashboard tickets={tickets} />;
          break;
        case 'CALENDAR':
          content = <CalendarView tickets={tickets} onSelectTicket={setSelectedTicket} />;
          break;
        case 'TICKETS':
          content = (
            <TicketList 
              tickets={tickets} 
              users={users}
              currentUser={currentUser}
              onSelectTicket={setSelectedTicket}
              onCreateTicket={handleCreateTicket}
            />
          );
          break;
        case 'USERS':
          if (currentUser.role === UserRole.ADMIN) {
              content = <UserManagement 
                users={users} 
                onAddUser={handleAddUser} 
                onUpdateUser={handleUpdateUser}
                onDeleteUser={handleDeleteUser} 
              />;
          } else {
              content = (
                <div className="flex flex-col items-center justify-center h-[50vh] text-gray-400">
                  <p>Você não tem permissão para acessar este módulo.</p>
                </div>
              );
          }
          break;
        default:
          content = <Dashboard tickets={tickets} />;
      }
  }

  return (
    <Layout 
      user={currentUser} 
      currentView={currentView as ViewState} 
      onNavigate={(view) => {
        setSelectedTicket(null);
        setCurrentView(view);
      }}
      onLogout={handleLogout}
    >
      {content}
    </Layout>
  );
};

export default App;
