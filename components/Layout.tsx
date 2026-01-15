import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Ticket as TicketIcon, 
  Users, 
  LogOut, 
  Menu, 
  X,
  UserCircle,
  Calendar
} from 'lucide-react';
import { User, UserRole, ViewState } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  user: User;
  currentView: ViewState;
  onNavigate: (view: ViewState) => void;
  onLogout: () => void;
}

const NavItem = ({ 
  view, 
  icon: Icon, 
  label, 
  isActive, 
  onClick 
}: { 
  view: ViewState; 
  icon: any; 
  label: string; 
  isActive: boolean; 
  onClick: () => void; 
}) => {
  return (
    <button
      onClick={onClick}
      className={`flex items-center w-full px-4 py-3 mb-1 text-sm font-medium transition-colors rounded-lg
        ${isActive 
          ? 'bg-delta-yellow text-delta-dark' 
          : 'text-white hover:bg-white/10'
        }`}
    >
      <Icon className="w-5 h-5 mr-3" />
      {label}
    </button>
  );
};

export const Layout: React.FC<LayoutProps> = ({ 
  children, 
  user, 
  currentView, 
  onNavigate, 
  onLogout 
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      {/* Mobile Header */}
      <div className="md:hidden bg-white border-b border-gray-200 p-4 flex items-center justify-between sticky top-0 z-20">
        <div className="flex items-center">
             {/* Logo Placeholder */}
            <div className="w-8 h-8 mr-2 flex items-center justify-center">
                <svg viewBox="0 0 370.53 280.34" width="100%" height="100%" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg">
                  <path fill="#55739b" d="M260.52,230.49c8.53,0,15.9-1.88,22.11-5.65s11.34-8.72,15.38-14.85,6.99-13.04,8.86-20.74c1.87-7.7,2.81-15.48,2.81-23.33,0-9.27-1.17-17.84-3.49-25.69-2.33-7.86-5.97-14.62-10.92-20.27s-11.29-10.09-19.03-13.32c-7.73-3.21-17-4.83-27.81-4.83-3,0-6.11.16-9.34.47-3.23.32-6.57.79-10.02,1.41v148.26h-31.43V83.66c10.02-2.2,19.38-3.77,28.06-4.71,8.68-.95,16.31-1.41,22.9-1.41,14.97,0,28.32,2,40.08,6.01,11.75,4,21.7,9.78,29.86,17.32,8.16,7.54,14.37,16.78,18.64,27.7,4.27,10.92,6.4,23.37,6.4,37.36,0,12.41-2.02,24.04-6.06,34.88-4.05,10.84-9.58,20.27-16.62,28.28-7.04,8.02-15.46,14.3-25.26,18.86-9.8,4.56-20.39,6.84-31.77,6.84-2.1,0-4.01-.04-5.73-.12s-3.56-.27-5.5-.59c-1.95-.32-4.08-.71-6.4-1.18-2.33-.47-5.13-1.17-8.42-2.12.9-2.04,2.02-4.24,3.37-6.6,1.35-2.36,2.92-4.56,4.71-6.6,1.8-2.04,3.89-3.73,6.29-5.07,2.39-1.33,5.16-2,8.31-2l.02-.02Z"/>
                  <path fill="#f5b524" d="M181.27,140.31c-2.85-10.07-7.46-19.17-13.82-27.31-5-6.39-11.19-11.81-18.45-16.31-6.24-4.42-13.42-9.41-13.42-9.41l-46.68-35.42,79.49-.42v-25.87c-5.51-.08-124.28.24-124.28.24l.17,26.36-.17.08,47.52,34.46c-6.76,1.06-13.04,2.88-18.83,5.47-9.8,4.4-18.09,10.44-24.89,18.13s-11.99,16.67-15.58,26.97c-3.58,10.29-5.37,21.26-5.37,32.9s1.76,23.27,5.26,33.57c3.51,10.29,8.67,19.21,15.47,26.74,6.8,7.54,15.1,13.47,24.9,17.79,9.8,4.33,21.06,6.49,33.78,6.49s24.02-2.35,33.89-7.05c9.87-4.7,18.13-10.97,24.79-18.8,6.65-7.83,11.73-16.82,15.24-26.97,3.51-10.14,5.26-20.73,5.26-31.78,0-9.85-1.43-19.81-4.27-29.87h0ZM148.58,196.36c-2.56,7.61-5.96,14.03-10.2,19.25-4.25,5.22-9.14,9.21-14.7,11.97s-11.34,4.14-17.33,4.14c-7.61,0-14.26-1.75-19.96-5.26-5.7-3.51-10.5-8.13-14.37-13.87-3.88-5.75-6.8-12.31-8.78-19.7-1.97-7.38-2.96-14.95-2.96-22.71,0-8.2.98-16.03,2.96-23.5,1.97-7.46,4.9-14.02,8.78-19.7,3.87-5.67,8.67-10.14,14.37-13.43,5.7-3.28,12.35-4.92,19.96-4.92,7.17,0,13.6,1.56,19.31,4.7,5.7,3.13,10.53,7.42,14.48,12.87,3.95,5.45,6.98,11.94,9.1,19.47,2.12,7.54,3.18,15.7,3.18,24.5,0,9.85-1.28,18.58-3.84,26.18h0Z"/>
                </svg>
            </div>
            <span className="font-bold text-delta-blue text-lg">Help Desk Delta</span>
        </div>
        <div className="flex items-center gap-4">
             <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-delta-dark">
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
             </button>
        </div>
      </div>

      {/* Sidebar Navigation */}
      <aside 
        className={`
          fixed md:sticky md:top-0 h-screen w-64 bg-delta-blue text-white flex flex-col z-30 transition-transform duration-300 ease-in-out
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}
      >
        {/* Sidebar Header with Logo */}
        <div className="p-6 bg-white flex items-center shadow-sm">
             <div className="h-10 w-10 relative mr-3 flex items-center justify-center">
                 <svg viewBox="0 0 370.53 280.34" width="100%" height="100%" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg">
                  <path fill="#55739b" d="M260.52,230.49c8.53,0,15.9-1.88,22.11-5.65s11.34-8.72,15.38-14.85,6.99-13.04,8.86-20.74c1.87-7.7,2.81-15.48,2.81-23.33,0-9.27-1.17-17.84-3.49-25.69-2.33-7.86-5.97-14.62-10.92-20.27s-11.29-10.09-19.03-13.32c-7.73-3.21-17-4.83-27.81-4.83-3,0-6.11.16-9.34.47-3.23.32-6.57.79-10.02,1.41v148.26h-31.43V83.66c10.02-2.2,19.38-3.77,28.06-4.71,8.68-.95,16.31-1.41,22.9-1.41,14.97,0,28.32,2,40.08,6.01,11.75,4,21.7,9.78,29.86,17.32,8.16,7.54,14.37,16.78,18.64,27.7,4.27,10.92,6.4,23.37,6.4,37.36,0,12.41-2.02,24.04-6.06,34.88-4.05,10.84-9.58,20.27-16.62,28.28-7.04,8.02-15.46,14.3-25.26,18.86-9.8,4.56-20.39,6.84-31.77,6.84-2.1,0-4.01-.04-5.73-.12s-3.56-.27-5.5-.59c-1.95-.32-4.08-.71-6.4-1.18-2.33-.47-5.13-1.17-8.42-2.12.9-2.04,2.02-4.24,3.37-6.6,1.35-2.36,2.92-4.56,4.71-6.6,1.8-2.04,3.89-3.73,6.29-5.07,2.39-1.33,5.16-2,8.31-2l.02-.02Z"/>
                  <path fill="#f5b524" d="M181.27,140.31c-2.85-10.07-7.46-19.17-13.82-27.31-5-6.39-11.19-11.81-18.45-16.31-6.24-4.42-13.42-9.41-13.42-9.41l-46.68-35.42,79.49-.42v-25.87c-5.51-.08-124.28.24-124.28.24l.17,26.36-.17.08,47.52,34.46c-6.76,1.06-13.04,2.88-18.83,5.47-9.8,4.4-18.09,10.44-24.89,18.13s-11.99,16.67-15.58,26.97c-3.58,10.29-5.37,21.26-5.37,32.9s1.76,23.27,5.26,33.57c3.51,10.29,8.67,19.21,15.47,26.74,6.8,7.54,15.1,13.47,24.9,17.79,9.8,4.33,21.06,6.49,33.78,6.49s24.02-2.35,33.89-7.05c9.87-4.7,18.13-10.97,24.79-18.8,6.65-7.83,11.73-16.82,15.24-26.97,3.51-10.14,5.26-20.73,5.26-31.78,0-9.85-1.43-19.81-4.27-29.87h0ZM148.58,196.36c-2.56,7.61-5.96,14.03-10.2,19.25-4.25,5.22-9.14,9.21-14.7,11.97s-11.34,4.14-17.33,4.14c-7.61,0-14.26-1.75-19.96-5.26-5.7-3.51-10.5-8.13-14.37-13.87-3.88-5.75-6.8-12.31-8.78-19.7-1.97-7.38-2.96-14.95-2.96-22.71,0-8.2.98-16.03,2.96-23.5,1.97-7.46,4.9-14.02,8.78-19.7,3.87-5.67,8.67-10.14,14.37-13.43,5.7-3.28,12.35-4.92,19.96-4.92,7.17,0,13.6,1.56,19.31,4.7,5.7,3.13,10.53,7.42,14.48,12.87,3.95,5.45,6.98,11.94,9.1,19.47,2.12,7.54,3.18,15.7,3.18,24.5,0,9.85-1.28,18.58-3.84,26.18h0Z"/>
                </svg>
                 </div>
             <span className="font-bold text-delta-blue text-lg">Help Desk Delta</span>
        </div>

        {/* User Info */}
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white overflow-hidden border border-white/10">
               {user.avatar ? (
                 <img src={user.avatar} alt="Profile" className="w-full h-full object-cover" />
               ) : (
                 <UserCircle />
               )}
            </div>
            <div className="overflow-hidden flex-1">
              <p className="font-medium truncate">{user.name}</p>
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          <NavItem 
            view="DASHBOARD" 
            icon={LayoutDashboard} 
            label="Dashboard" 
            isActive={currentView === 'DASHBOARD'}
            onClick={() => {
                onNavigate('DASHBOARD');
                setIsMobileMenuOpen(false);
            }}
          />
          <NavItem 
            view="CALENDAR" 
            icon={Calendar} 
            label="Calendário" 
            isActive={currentView === 'CALENDAR'}
            onClick={() => {
                onNavigate('CALENDAR');
                setIsMobileMenuOpen(false);
            }}
          />
          <NavItem 
            view="TICKETS" 
            icon={TicketIcon} 
            label="Meus Chamados" 
            isActive={currentView === 'TICKETS'}
            onClick={() => {
                onNavigate('TICKETS');
                setIsMobileMenuOpen(false);
            }}
          />
          {user.role === UserRole.ADMIN && (
            <NavItem 
                view="USERS" 
                icon={Users} 
                label="Colaboradores" 
                isActive={currentView === 'USERS'}
                onClick={() => {
                    onNavigate('USERS');
                    setIsMobileMenuOpen(false);
                }}
            />
          )}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-white/10">
          <button
            onClick={onLogout}
            className="flex items-center w-full px-4 py-2 text-sm text-white/80 hover:bg-white/10 rounded-lg transition-colors"
          >
            <LogOut className="w-5 h-5 mr-3" />
            Sair do Sistema
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto h-[calc(100vh-60px)] md:h-screen">
        {children}
      </main>

      {/* Overlay for mobile menu */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-20 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </div>
  );
};