import React, { useState, useEffect } from 'react';
import { Login } from './components/Login';
import { Layout } from './components/Layout';
import { Dashboard } from './components/Dashboard';
import { TicketList } from './components/TicketList';
import { TicketDetail } from './components/TicketDetail';
import { UserManagement } from './components/UserManagement';
import { CalendarView } from './components/CalendarView';
import { Ticket, User, ViewState, UserRole, TicketStatus } from './types';
import { api } from './services/api';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentView, setCurrentView] = useState<ViewState>('LOGIN');
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Data State
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [users, setUsers] = useState<User[]>([]);

  // Check active session on load
  useEffect(() => {
    const checkSession = async () => {
        try {
            const user = await api.getCurrentUser();
            if (user) {
                setCurrentUser(user);
                setCurrentView('DASHBOARD');
            }
        } catch (e) {
            console.error("Session check failed", e);
        } finally {
            setLoading(false);
        }
    };
    checkSession();
  }, []);

  // Load Initial Data when user is logged in
  useEffect(() => {
    if (currentUser) {
      loadData();
    }
  }, [currentUser]);

  const loadData = async () => {
    try {
        const [fetchedTickets, fetchedUsers] = await Promise.all([
          api.getTickets(),
          api.getUsers()
        ]);
        setTickets(fetchedTickets);
        setUsers(fetchedUsers);
    } catch (e) {
        console.error("Failed to load data", e);
    }
  };

  const handleLogin = async (email: string, password: string) => {
    const user = await api.login(email, password);
    setCurrentUser(user);
    setCurrentView('DASHBOARD');
  };

  const handleLogout = async () => {
    await api.signOut();
    setCurrentUser(null);
    setCurrentView('LOGIN');
    setSelectedTicket(null);
  };

  const handleCreateTicket = async (ticketData: any) => {
    await api.createTicket(ticketData);
    await loadData();
    setCurrentView('TICKETS');
  };

  const handleAddComment = async (ticketId: string, content: string, isInternal: boolean) => {
    // We need to use the real UUID (ticket.realId or ticket.id depending on how we mapped it)
    // The api.getTickets maps id to TK-XXX, so we need to find the real ID from the tickets array or modify types
    // For now, let's assume ticketId passed here is the ID we have in the state. 
    // If the state ID is TK-XXX, we can't use it for DB updates. 
    // FIX: Retrieve the real UUID from the current tickets list based on the ID passed
    const ticket = tickets.find(t => t.id === ticketId);
    if (!ticket) return;

    // Use ticket.realId if we added it to the type (we did in the api mapper, but not TS interface)
    // To satisfy TS without changing types too much, cast or rely on api handling.
    // In api.ts we mapped `realId`. We need to use it.
    // Let's fallback to ticketId if realId missing (backwards compatibility attempt)
    const dbId = (ticket as any).realId || ticketId;

    await api.addComment(dbId, {
      userId: currentUser!.id,
      content,
      isInternal
    });
    
    await loadData();
    
    // Refresh selected ticket
    const updatedTickets = await api.getTickets();
    const updatedSelection = updatedTickets.find(t => t.id === ticketId); // match by friendly ID
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
      if (currentUser?.id === user.id) {
          setCurrentUser(user);
      }
  };

  const handleDeleteUser = async (id: string) => {
      await api.deleteUser(id);
      await loadData();
  };

  if (loading) {
      return <div className="min-h-screen flex items-center justify-center bg-gray-100">Carregando...</div>;
  }

  if (!currentUser) {
    return <Login onLogin={handleLogin} />;
  }

  // View Routing Logic
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
          content = (
            <CalendarView 
              tickets={tickets} 
              onSelectTicket={setSelectedTicket}
            />
          );
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
              content = <div className="text-center p-10">Acesso negado.</div>;
          }
          break;
        default:
          content = <Dashboard tickets={tickets} />;
      }
  }

  return (
    <Layout 
      user={currentUser} 
      currentView={currentView} 
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