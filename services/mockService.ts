import { MOCK_TICKETS, MOCK_USERS } from '../constants';
import { Ticket, User, TicketStatus, Comment, UserRole } from '../types';

// Simple in-memory storage simulation
let users = [...MOCK_USERS];
let tickets = [...MOCK_TICKETS];

// Helper to simulate email sending via console log
const simulateEmail = (toEmail: string, subject: string, body: string) => {
    console.groupCollapsed(`📧 [MOCK EMAIL SENT] To: ${toEmail}`);
    console.log(`Subject: ${subject}`);
    console.log(`Body: ${body}`);
    console.groupEnd();
};

export const mockService = {
  login: async (email: string) => {
    await new Promise(r => setTimeout(r, 500)); // Simulate delay
    const user = users.find(u => u.email === email);
    if (!user) throw new Error('Usuário não encontrado');
    return user;
  },

  getTickets: async () => {
    return [...tickets];
  },

  createTicket: async (ticket: Omit<Ticket, 'id' | 'createdAt' | 'updatedAt' | 'comments'>) => {
    const newTicket: Ticket = {
      ...ticket,
      id: `TK-${Math.floor(1000 + Math.random() * 9000)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      comments: []
    };
    tickets = [newTicket, ...tickets];

    // EMAIL LOGIC: New Ticket
    if (newTicket.assigneeId) {
        // Case 1: Assigned specifically
        const assignee = users.find(u => u.id === newTicket.assigneeId);
        if (assignee) {
            simulateEmail(
                assignee.email, 
                `Novo Chamado Atribuído: ${newTicket.title}`,
                `Olá ${assignee.name}, o chamado #${newTicket.id} foi atribuído a você pelo solicitante ${newTicket.requesterName}.`
            );
        }
    } else {
        // Case 2: Unassigned -> Email Admins
        const admins = users.filter(u => u.role === UserRole.ADMIN);
        admins.forEach(admin => {
            simulateEmail(
                admin.email,
                `Novo Chamado Pendente: ${newTicket.title}`,
                `Olá Admin ${admin.name}, um novo chamado #${newTicket.id} foi aberto por ${newTicket.requesterName} e aguarda atribuição.`
            );
        });
    }

    return newTicket;
  },

  updateTicketStatus: async (ticketId: string, status: TicketStatus) => {
    tickets = tickets.map(t => t.id === ticketId ? { ...t, status, updatedAt: new Date().toISOString() } : t);
  },

  assignTicket: async (ticketId: string, assigneeId: string) => {
    const assignee = users.find(u => u.id === assigneeId);
    if (!assignee) return;
    
    // Find ticket for context
    const ticket = tickets.find(t => t.id === ticketId);

    tickets = tickets.map(t => 
      t.id === ticketId 
        ? { ...t, assigneeId, assigneeName: assignee.name, updatedAt: new Date().toISOString() } 
        : t
    );

    // EMAIL LOGIC: Assignment
    if (ticket) {
        simulateEmail(
            assignee.email,
            `Chamado Atribuído a Você: ${ticket.title}`,
            `Olá ${assignee.name}, você foi definido como responsável pelo chamado #${ticket.id}.`
        );
    }
  },

  addComment: async (ticketId: string, comment: Omit<Comment, 'id' | 'createdAt'>) => {
    const newComment: Comment = {
      ...comment,
      id: `c-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    
    tickets = tickets.map(t => {
      if (t.id === ticketId) {
        return {
          ...t,
          updatedAt: new Date().toISOString(),
          comments: [...t.comments, newComment]
        };
      }
      return t;
    });
    return newComment;
  },

  getUsers: async () => {
    return [...users];
  },
  
  addUser: async (user: User) => {
      users = [...users, user];
      return user;
  },

  updateUser: async (user: User) => {
      users = users.map(u => u.id === user.id ? user : u);
      return user;
  },

  deleteUser: async (id: string) => {
      users = users.filter(u => u.id !== id);
  }
};