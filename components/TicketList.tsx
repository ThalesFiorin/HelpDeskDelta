import React, { useState, useEffect } from 'react';
import { Ticket, TicketStatus, TicketPriority, User, UserRole } from '../types';
import { Plus, Search, Filter, MessageSquare, AlertCircle, User as UserIcon, Building } from 'lucide-react';
import { COLORS } from '../constants';

interface TicketListProps {
  tickets: Ticket[];
  users: User[];
  currentUser: User;
  onSelectTicket: (ticket: Ticket) => void;
  onCreateTicket: (ticket: any) => Promise<void>;
}

export const TicketList: React.FC<TicketListProps> = ({ 
  tickets, 
  users,
  currentUser, 
  onSelectTicket,
  onCreateTicket
}) => {
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New Ticket Form State
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newPriority, setNewPriority] = useState<TicketPriority>(TicketPriority.MEDIUM);
   
  // Selection State
  const [newAssigneeId, setNewAssigneeId] = useState('');

  // Initialize defaults when modal opens
  useEffect(() => {
    if (isModalOpen) {
        setNewAssigneeId(''); // Default to unassigned
        setNewTitle('');
        setNewDesc('');
        setNewPriority(TicketPriority.MEDIUM);
    }
  }, [isModalOpen]);

  const filteredTickets = tickets.filter(ticket => {
    let matchesStatus = false;
    
    if (filterStatus === 'ALL') {
        matchesStatus = ticket.status !== TicketStatus.RESOLVED && ticket.status !== TicketStatus.CLOSED;
    } else if (filterStatus === 'MINE') {
        matchesStatus = ticket.assigneeId === currentUser.id;
    } else {
        matchesStatus = ticket.status === filterStatus;
    }
    
    const matchesSearch = ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          ticket.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          ticket.requesterName.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const assignee = users.find(u => u.id === newAssigneeId);

    // 1. Cria o chamado no Banco
    await onCreateTicket({
      title: newTitle,
      description: newDesc,
      priority: newPriority,
      department: currentUser.department || 'Geral', // Locked to current user
      status: TicketStatus.OPEN,
      requesterId: currentUser.id, // Locked to current user
      requesterName: currentUser.name,
      assigneeId: assignee?.id,
      assigneeName: assignee?.name
    });

    // 2. Tenta enviar o E-mail de notificação (Código Novo)
    if (assignee && assignee.email) {
      try {
        await fetch('/api/send-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            to: assignee.email,
            subject: `[Novo Chamado] ${newTitle}`,
            html: `
              <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px;">
                <h2 style="color: #0F52BA;">Olá, ${assignee.name}!</h2>
                <p>Um novo chamado foi atribuído a você por <strong>${currentUser.name}</strong>.</p>
                <div style="background: #f8f9fa; padding: 15px; border-left: 4px solid #F4B400; margin: 20px 0;">
                  <p style="margin: 5px 0;"><strong>Assunto:</strong> ${newTitle}</p>
                  <p style="margin: 5px 0;"><strong>Prioridade:</strong> ${newPriority}</p>
                  <p style="margin: 5px 0;"><strong>Descrição:</strong><br/>${newDesc}</p>
                </div>
                <p>Acesse o <a href="https://deltadomus-helpdesk.vercel.app" style="color: #0F52BA; font-weight: bold;">Delta Help Desk</a> para responder.</p>
              </div>
            `
          })
        });
        console.log('Notificação enviada por e-mail.');
      } catch (err) {
        console.error('Falha ao enviar notificação:', err);
      }
    }

    setIsModalOpen(false);
  };

  const getStatusColor = (status: TicketStatus) => {
    switch (status) {
      case TicketStatus.OPEN: return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case TicketStatus.IN_PROGRESS: return 'bg-blue-100 text-blue-800 border-blue-200';
      case TicketStatus.RESOLVED: return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityBadge = (priority: TicketPriority) => {
     const colors = {
         [TicketPriority.LOW]: 'text-gray-500',
         [TicketPriority.MEDIUM]: 'text-blue-500',
         [TicketPriority.HIGH]: 'text-orange-500',
         [TicketPriority.CRITICAL]: 'text-red-500 font-bold',
     };
     return <span className={`text-xs ${colors[priority]} flex items-center gap-1`}><AlertCircle size={12}/> {priority}</span>
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-delta-blue">Central de Chamados</h2>
          <p className="text-gray-500">Gerencie e acompanhe as solicitações</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-delta-yellow text-delta-dark px-4 py-2 rounded-lg font-medium shadow-sm hover:brightness-105 transition-all flex items-center justify-center gap-2"
        >
          <Plus size={20} />
          Novo Chamado
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input 
            type="text" 
            placeholder="Buscar por ID, título ou solicitante..." 
            className="w-full pl-10 pr-4 py-2 border border-gray-200 bg-white text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-delta-blue/20 focus:border-delta-blue"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
            <Filter className="text-gray-400" size={20} />
            <select 
                className="border border-gray-200 bg-white text-gray-900 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-delta-blue/20"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
            >
                <option value="ALL">Pendentes (Padrão)</option>
                <option value="MINE">Meus chamados</option>
                <option disabled className="text-gray-300">──────────</option>
                {Object.values(TicketStatus).map(s => (
                    <option key={s} value={s}>{s}</option>
                ))}
            </select>
        </div>
      </div>

      {/* List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">ID</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Assunto</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Solicitante</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Status</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Prioridade</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Atualizado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredTickets.map((ticket) => (
                <tr 
                  key={ticket.id} 
                  onClick={() => onSelectTicket(ticket)}
                  className="hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  <td className="px-6 py-4 text-sm font-mono text-gray-500">{ticket.id}</td>
                  <td className="px-6 py-4">
                    <div className="font-medium text-delta-dark">{ticket.title}</div>
                    <div className="text-xs text-gray-400 truncate max-w-[200px]">{ticket.department}</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-xs text-gray-600 font-bold">
                              {ticket.requesterName.charAt(0)}
                          </span>
                          {ticket.requesterName}
                      </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(ticket.status)}`}>
                      {ticket.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {getPriorityBadge(ticket.priority)}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {new Date(ticket.updatedAt).toLocaleDateString('pt-BR')}
                  </td>
                </tr>
              ))}
              {filteredTickets.length === 0 && (
                  <tr>
                      <td colSpan={6} className="px-6 py-12 text-center text-gray-400">
                          {filterStatus === 'ALL' 
                            ? 'Nenhum chamado pendente.' 
                            : 'Nenhum chamado encontrado com este filtro.'}
                      </td>
                  </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-gray-100 bg-gray-50">
              <h3 className="text-xl font-bold text-delta-blue">Abrir Novo Chamado</h3>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Título</label>
                <input 
                  required
                  type="text" 
                  className="w-full px-3 py-2 border border-gray-300 bg-white text-gray-900 rounded-lg focus:ring-2 focus:ring-delta-blue/50 focus:border-delta-blue outline-none transition-all"
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  placeholder="Ex: Erro na impressora"
                />
              </div>

              {/* READ ONLY FIELDS - LOCKED TO CURRENT USER */}
              <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                        <UserIcon size={14} className="text-delta-blue"/> Solicitante
                    </label>
                    <input
                        readOnly
                        className="w-full px-3 py-2 border border-gray-200 bg-gray-100 text-gray-600 rounded-lg cursor-not-allowed font-medium"
                        value={currentUser.name}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                        <Building size={14} className="text-delta-blue"/> Departamento
                    </label>
                    <input 
                      readOnly
                      type="text" 
                      className="w-full px-3 py-2 border border-gray-200 bg-gray-100 text-gray-600 rounded-lg cursor-not-allowed"
                      value={currentUser.department || 'N/A'}
                    />
                  </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                   <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Atribuído para (Opcional)</label>
                    <select
                        className="w-full px-3 py-2 border border-gray-300 bg-white text-gray-900 rounded-lg focus:ring-2 focus:ring-delta-blue/50 outline-none"
                        value={newAssigneeId}
                        onChange={e => setNewAssigneeId(e.target.value)}
                    >
                        <option value="">-- Em aberto --</option>
                        {users.map(u => (
                            <option key={u.id} value={u.id}>{u.name}</option>
                        ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Prioridade</label>
                    <select 
                      className="w-full px-3 py-2 border border-gray-300 bg-white text-gray-900 rounded-lg focus:ring-2 focus:ring-delta-blue/50 outline-none"
                      value={newPriority}
                      onChange={e => setNewPriority(e.target.value as TicketPriority)}
                    >
                        {Object.values(TicketPriority).map(p => (
                            <option key={p} value={p}>{p}</option>
                        ))}
                    </select>
                  </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Descrição Detalhada</label>
                <textarea 
                  required
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 bg-white text-gray-900 rounded-lg focus:ring-2 focus:ring-delta-blue/50 focus:border-delta-blue outline-none transition-all resize-none"
                  value={newDesc}
                  onChange={e => setNewDesc(e.target.value)}
                  placeholder="Descreva o problema..."
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 mt-2">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  className="px-4 py-2 bg-delta-blue text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Criar Chamado
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
