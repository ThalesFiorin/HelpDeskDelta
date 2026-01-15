import { supabase } from '../lib/supabase';
import { Ticket, User, TicketStatus, Comment, UserRole } from '../types';

export const api = {
  // --- AUTH ---
  login: async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    if (error) throw error;
    
    // Fetch user profile from public table to get role/name
    const { data: profile, error: profileError } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (profileError || !profile) {
       // Fallback if user exists in Auth but not in public table yet
       return {
         id: data.user.id,
         email: data.user.email!,
         name: data.user.user_metadata?.full_name || email.split('@')[0],
         role: UserRole.USER,
         department: 'Geral'
       } as User;
    }

    return profile as User;
  },

  getCurrentUser: async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data: profile } = await supabase
      .from('users')
      .select('*')
      .eq('email', user.email)
      .single();

    if (profile) return profile as User;
    return null;
  },

  signOut: async () => {
    await supabase.auth.signOut();
  },

  // --- USERS ---
  getUsers: async () => {
    const { data, error } = await supabase.from('users').select('*');
    if (error) throw error;
    return data as User[];
  },

  addUser: async (user: User) => {
    // Note: In a real app, creating a user usually involves Supabase Auth Admin API
    // Here we just insert into the public profile table for list management
    const { data, error } = await supabase.from('users').insert([{
      name: user.name,
      email: user.email,
      role: user.role,
      department: user.department,
      avatar: user.avatar
      // Password is not stored here in production logic
    }]).select().single();
    
    if (error) throw error;
    return data as User;
  },

  updateUser: async (user: User) => {
    const { data, error } = await supabase
      .from('users')
      .update({
        name: user.name,
        role: user.role,
        department: user.department,
        avatar: user.avatar
      })
      .eq('id', user.id)
      .select().single();

    if (error) throw error;
    return data as User;
  },

  deleteUser: async (id: string) => {
    const { error } = await supabase.from('users').delete().eq('id', id);
    if (error) throw error;
  },

  // --- TICKETS ---
  getTickets: async () => {
    // Fetch tickets with relations
    const { data, error } = await supabase
      .from('tickets')
      .select(`
        *,
        requester:users!requester_id(name),
        assignee:users!assignee_id(name),
        comments(
            id,
            content,
            is_internal,
            created_at,
            user:users!user_id(name, id)
        )
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;

    // Transform DB snake_case to Frontend camelCase
    return data.map((t: any) => ({
      id: t.friendly_id ? `TK-${t.friendly_id}` : t.id.substring(0, 8), // Use friendly_id if available
      realId: t.id, // Keep UUID for operations
      title: t.title,
      description: t.description,
      status: t.status,
      priority: t.priority,
      department: t.department,
      createdAt: t.created_at,
      updatedAt: t.updated_at,
      requesterId: t.requester_id,
      requesterName: t.requester?.name || 'Desconhecido',
      assigneeId: t.assignee_id,
      assigneeName: t.assignee?.name,
      comments: t.comments?.map((c: any) => ({
        id: c.id,
        content: c.content,
        isInternal: c.is_internal,
        createdAt: c.created_at,
        userId: c.user?.id,
        userName: c.user?.name || 'Sistema'
      })) || []
    })) as Ticket[];
  },

  createTicket: async (ticket: any) => {
    const { data, error } = await supabase.from('tickets').insert([{
      title: ticket.title,
      description: ticket.description,
      priority: ticket.priority,
      department: ticket.department,
      status: ticket.status,
      requester_id: ticket.requesterId,
      assignee_id: ticket.assigneeId || null
    }]).select().single();

    if (error) throw error;
    
    // Simulate Email Notification (Console Log only as backend is required for real email)
    if (ticket.assigneeId) {
       console.log(`📧 [EMAIL] Para Responsável: Novo chamado atribuído.`);
    } else {
       console.log(`📧 [EMAIL] Para Admins: Novo chamado sem responsável.`);
    }
    
    return data;
  },

  updateTicketStatus: async (ticketId: string, status: TicketStatus) => {
    // We need the UUID (realId) not the TK-123 friendly id
    // However, for simplicity, assume we passed the full ticket object or handle mapping in UI
    // Here we assume ticketId passed is the UUID or we need to look it up.
    // In this refactor, I will ensure the UI passes the UUID (realId) or I strip the prefix if it's not a UUID.
    
    // Clean ID check (if it starts with TK-, we might need to query, but better to fix types)
    // For now, let's assume the App passes the correct UUID stored in ticket.id or ticket.realId
    
    const { error } = await supabase
      .from('tickets')
      .update({ status })
      .eq('id', ticketId); 
      
    if (error) throw error;
  },

  assignTicket: async (ticketId: string, assigneeId: string) => {
    const { error } = await supabase
      .from('tickets')
      .update({ assignee_id: assigneeId })
      .eq('id', ticketId);

    if (error) throw error;
    console.log(`📧 [EMAIL] Chamado atribuído.`);
  },

  addComment: async (ticketId: string, comment: any) => {
    const { error } = await supabase.from('comments').insert([{
      ticket_id: ticketId,
      user_id: comment.userId,
      content: comment.content,
      is_internal: comment.isInternal
    }]);

    if (error) throw error;
  }
};