export enum UserRole {
  ADMIN = 'ADMIN',
  AGENT = 'AGENT',
  USER = 'USER'
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  password?: string; // Added password field
  avatar?: string;
  department?: string;
}

export enum TicketStatus {
  OPEN = 'Aberto',
  IN_PROGRESS = 'Em Andamento',
  WAITING = 'Aguardando',
  RESOLVED = 'Resolvido',
  CLOSED = 'Fechado'
}

export enum TicketPriority {
  LOW = 'Baixa',
  MEDIUM = 'Média',
  HIGH = 'Alta',
  CRITICAL = 'Crítica'
}

export interface Comment {
  id: string;
  userId: string;
  userName: string;
  content: string;
  createdAt: string;
  isInternal: boolean; // For agent-only notes
}

export interface Ticket {
  id: string;
  title: string;
  description: string;
  status: TicketStatus;
  priority: TicketPriority;
  requesterId: string;
  requesterName: string;
  assigneeId?: string;
  assigneeName?: string;
  department: string;
  createdAt: string;
  updatedAt: string;
  comments: Comment[];
}

// ViewState atualizado para suportar a tela de redefinição de senha
export type ViewState = 'LOGIN' | 'DASHBOARD' | 'TICKETS' | 'USERS' | 'PROFILE' | 'CALENDAR' | 'RESET_PASSWORD';
