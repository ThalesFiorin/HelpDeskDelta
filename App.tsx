import React, { useState, useEffect } from 'react';
import { Login } from './components/Login';
import { Layout } from './components/Layout';
import { Dashboard } from './components/Dashboard';
import { TicketList } from './components/TicketList';
import { TicketDetail } from './components/TicketDetail';
import { UserManagement } from './components/UserManagement';
import { CalendarView } from './components/CalendarView';
import { Ticket, User, ViewState, UserRole, TicketStatus } from './types';
import { mockService } from './services/mockService';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentView, setCurrentView] = useState<ViewState>('LOGIN');
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  
  // Data State
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [users, setUsers] = useState<User[]>([]);

  // Load Initial Data
  useEffect(() => {
    if (currentUser) {
      loadData();
    }
  }, [currentUser]);

  const loadData = async () => {
    const [fetchedTickets, fetchedUsers] = await Promise.all([
      mockService.getTickets(),
      mockService.getUsers()
    ]);
    setTickets(fetchedTickets);
    setUsers(fetchedUsers);
  };

  const handleLogin = async (email: string) => {
    const user = await mockService.login(email);
    setCurrentUser(user);
    setCurrentView('DASHBOARD');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentView('LOGIN');
    setSelectedTicket(null);
  };

  const handleCreateTicket = async (ticketData: any) => {
    await mockService.createTicket(ticketData);
    await loadData();
    setCurrentView('TICKETS');
  };

  const handleAddComment = async (ticketId: string, content: string, isInternal: boolean) => {
    await mockService.addComment(ticketId, {
      userId: currentUser!.id,
      userName: currentUser!.name,
      content,
      isInternal
    });
    // Refresh local ticket state immediately for UI response
    const updated = await mockService.getTickets();
    setTickets(updated);
    // Update selected ticket view
    const specific = updated.find(t => t.id === ticketId);
    if (specific) setSelectedTicket(specific);
  };

  const handleUpdateStatus = async (ticketId: string, status: TicketStatus) => {
    await mockService.updateTicketStatus(ticketId, status);
    const updated = await mockService.getTickets();
    setTickets(updated);
    const specific = updated.find(t => t.id === ticketId);
    if (specific) setSelectedTicket(specific);
  };

  const handleAssign = async (ticketId: string, userId: string) => {
    await mockService.assignTicket(ticketId, userId);
    const updated = await mockService.getTickets();
    setTickets(updated);
    const specific = updated.find(t => t.id === ticketId);
    if (specific) setSelectedTicket(specific);
  };

  const handleAddUser = async (user: User) => {
      await mockService.addUser(user);
      await loadData();
  };

  const handleUpdateUser = async (user: User) => {
      await mockService.updateUser(user);
      await loadData();
      // Update current user if self-editing
      if (currentUser?.id === user.id) {
          setCurrentUser(user);
      }
  };

  const handleDeleteUser = async (id: string) => {
      await mockService.deleteUser(id);
      await loadData();
  };

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