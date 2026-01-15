import { Ticket, TicketPriority, TicketStatus, User, UserRole } from './types';

export const COLORS = {
  yellow: '#F8AB1B',
  blue: '#426FA6',
  dark: '#4D4D4D',
  white: '#FFFFFF',
  bg: '#F3F4F6'
};

// Mock Users
export const MOCK_USERS: User[] = [
  {
    id: '1',
    name: 'Carlos Admin',
    email: 'admin@delta.com',
    role: UserRole.ADMIN,
    department: 'TI'
  },
  {
    id: '2',
    name: 'Ana Suporte',
    email: 'ana@delta.com',
    role: UserRole.AGENT,
    department: 'TI'
  },
  {
    id: '3',
    name: 'João Usuário',
    email: 'joao@delta.com',
    role: UserRole.USER,
    department: 'Vendas'
  },
  {
    id: '4',
    name: 'Maria Usuário',
    email: 'maria@delta.com',
    role: UserRole.USER,
    department: 'RH'
  }
];

// Mock Tickets
export const MOCK_TICKETS: Ticket[] = [
  {
    id: 'TK-1001',
    title: 'Erro ao acessar o ERP',
    description: 'Não consigo logar no sistema financeiro desde hoje cedo. Aparece erro 500.',
    status: TicketStatus.OPEN,
    priority: TicketPriority.HIGH,
    requesterId: '3',
    requesterName: 'João Usuário',
    department: 'Financeiro',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(), // 2 days ago
    updatedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    comments: []
  },
  {
    id: 'TK-1002',
    title: 'Solicitação de novo monitor',
    description: 'Meu monitor está piscando, preciso de troca.',
    status: TicketStatus.IN_PROGRESS,
    priority: TicketPriority.MEDIUM,
    requesterId: '4',
    requesterName: 'Maria Usuário',
    assigneeId: '2',
    assigneeName: 'Ana Suporte',
    department: 'RH',
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    updatedAt: new Date(Date.now() - 3600000).toISOString(),
    comments: [
      {
        id: 'c1',
        userId: '2',
        userName: 'Ana Suporte',
        content: 'Verifiquei o estoque, temos um monitor disponível. Agendarei a troca.',
        createdAt: new Date(Date.now() - 7200000).toISOString(),
        isInternal: false
      }
    ]
  },
  {
    id: 'TK-1003',
    title: 'Internet lenta no setor comercial',
    description: 'Vários vendedores reclamando de lentidão.',
    status: TicketStatus.RESOLVED,
    priority: TicketPriority.CRITICAL,
    requesterId: '3',
    requesterName: 'João Usuário',
    assigneeId: '1',
    assigneeName: 'Carlos Admin',
    department: 'Vendas',
    createdAt: new Date(Date.now() - 86400000 * 10).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 8).toISOString(),
    comments: []
  }
];
