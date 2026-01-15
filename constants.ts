import { Ticket, TicketPriority, TicketStatus, User, UserRole } from './types';

export const COLORS = {
  yellow: '#F8AB1B',
  blue: '#426FA6',
  dark: '#4D4D4D',
  white: '#FFFFFF',
  bg: '#F3F4F6'
};

export const MOCK_USERS: User[] = [
  {
    id: '1',
    name: 'Admin',
    email: 'admin@delta.com',
    role: UserRole.ADMIN,
    password: '123',
    department: 'TI',
    avatar: 'https://ui-avatars.com/api/?name=Admin&background=0D8ABC&color=fff'
  },
  {
    id: '2',
    name: 'Agente Suporte',
    email: 'agente@delta.com',
    role: UserRole.AGENT,
    password: '123',
    department: 'Suporte',
    avatar: 'https://ui-avatars.com/api/?name=Agente+Suporte&background=random'
  },
  {
    id: '3',
    name: 'Usuário',
    email: 'usuario@delta.com',
    role: UserRole.USER,
    password: '123',
    department: 'Vendas',
    avatar: 'https://ui-avatars.com/api/?name=Usuario&background=random'
  }
];

export const MOCK_TICKETS: Ticket[] = [
  {
    id: 'TK-1001',
    title: 'Impressora falhando',
    description: 'A impressora do setor de vendas não está imprimindo.',
    status: TicketStatus.OPEN,
    priority: TicketPriority.HIGH,
    requesterId: '3',
    requesterName: 'Usuário',
    department: 'Vendas',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    comments: []
  },
  {
    id: 'TK-1002',
    title: 'Acesso ao CRM',
    description: 'Preciso de redefinição de senha para o CRM.',
    status: TicketStatus.RESOLVED,
    priority: TicketPriority.MEDIUM,
    requesterId: '3',
    requesterName: 'Usuário',
    assigneeId: '2',
    assigneeName: 'Agente Suporte',
    department: 'Vendas',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    updatedAt: new Date().toISOString(),
    comments: []
  }
];