import React, { useState } from 'react';
import { Ticket, TicketStatus, User, UserRole, Comment, TicketPriority } from '../types';
import { ArrowLeft, Send, CheckCircle, User as UserIcon, Clock, Lock } from 'lucide-react';
import { COLORS } from '../constants';

interface TicketDetailProps {
  ticket: Ticket;
  users: User[]; // For assignment dropdown
  currentUser: User;
  onBack: () => void;
  onAddComment: (ticketId: string, content: string, isInternal: boolean) => Promise<void>;
  onUpdateStatus: (ticketId: string, status: TicketStatus) => Promise<void>;
  onAssign: (ticketId: string, userId: string) => Promise<void>;
}

export const TicketDetail: React.FC<TicketDetailProps> = ({ 
  ticket, 
  users,
  currentUser,
  onBack,
  onAddComment,
  onUpdateStatus,
  onAssign
}) => {
  const [commentText, setCommentText] = useState('');

  const isAdminOrAgent = currentUser.role === UserRole.ADMIN || currentUser.role === UserRole.AGENT;

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    // Always pass false for isInternal as feature is removed from UI
    await onAddComment(ticket.id, commentText, false);
    setCommentText('');
  };

  return (
    <div className="max-w-5xl mx-auto h-[calc(100vh-100px)] flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button 
          onClick={onBack}
          className="p-2 rounded-full hover:bg-gray-200 text-gray-600 transition-colors"
        >
          <ArrowLeft size={24} />
        </button>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
              <span className="text-sm font-mono text-gray-500 bg-gray-100 px-2 rounded">#{ticket.id}</span>
              <span className={`text-xs px-2 py-0.5 rounded-full border ${ticket.status === TicketStatus.RESOLVED ? 'bg-green-100 text-green-700 border-green-200' : 'bg-yellow-100 text-yellow-700 border-yellow-200'}`}>
                  {ticket.status}
              </span>
          </div>
          <h1 className="text-2xl font-bold text-delta-dark">{ticket.title}</h1>
        </div>
        
        {/* Actions for Agents/Admin */}
        {isAdminOrAgent && (
          <div className="flex gap-2">
             <select 
               value={ticket.status}
               onChange={(e) => onUpdateStatus(ticket.id, e.target.value as TicketStatus)}
               className="border border-gray-300 bg-white text-gray-900 rounded-lg px-3 py-2 text-sm"
             >
                {Object.values(TicketStatus).map(s => (
                    <option key={s} value={s}>{s}</option>
                ))}
             </select>
          </div>
        )}
      </div>

      <div className="flex-1 flex flex-col lg:flex-row gap-6 overflow-hidden">
        {/* Main Content (Description + Chat) */}
        <div className="flex-1 flex flex-col bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
             {/* Ticket Description */}
             <div className="p-6 border-b border-gray-100 bg-gray-50/50">
                 <div className="flex items-start gap-4">
                     <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold shrink-0">
                         {ticket.requesterName.charAt(0)}
                     </div>
                     <div>
                         <div className="flex items-baseline gap-2">
                             <span className="font-semibold text-gray-900">{ticket.requesterName}</span>
                             <span className="text-xs text-gray-500">
                                {new Date(ticket.createdAt).toLocaleString('pt-BR')}
                             </span>
                         </div>
                         <p className="mt-2 text-gray-700 whitespace-pre-wrap leading-relaxed">{ticket.description}</p>
                     </div>
                 </div>
             </div>

             {/* Chat History */}
             <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-white">
                 {ticket.comments.map(comment => (
                     <div key={comment.id} className={`flex gap-4 ${comment.isInternal ? 'bg-yellow-50/50 p-4 rounded-lg border border-yellow-100' : ''}`}>
                         <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${comment.isInternal ? 'bg-delta-yellow text-delta-dark' : 'bg-gray-200 text-gray-600'}`}>
                             {comment.isInternal ? <Lock size={14}/> : comment.userName.charAt(0)}
                         </div>
                         <div className="flex-1">
                             <div className="flex items-center gap-2 mb-1">
                                 <span className="font-semibold text-sm">{comment.userName}</span>
                                 {comment.isInternal && <span className="text-[10px] uppercase tracking-wider font-bold text-yellow-700 bg-yellow-100 px-1 rounded">Nota Interna</span>}
                                 <span className="text-xs text-gray-400">{new Date(comment.createdAt).toLocaleString('pt-BR')}</span>
                             </div>
                             <p className="text-sm text-gray-700 whitespace-pre-wrap">{comment.content}</p>
                         </div>
                     </div>
                 ))}
                 
                 {ticket.comments.length === 0 && (
                     <div className="text-center py-10 text-gray-400 italic">
                         Nenhuma interação registrada ainda.
                     </div>
                 )}
             </div>

             {/* Input Area */}
             <div className="p-4 border-t border-gray-100 bg-gray-50">
                 <form onSubmit={handleSubmitComment}>
                     <div className="flex gap-2">
                         <textarea 
                             value={commentText}
                             onChange={e => setCommentText(e.target.value)}
                             placeholder="Escreva uma resposta..."
                             className="flex-1 rounded-lg border p-3 text-sm focus:ring-2 outline-none resize-none h-20 transition-all bg-white border-gray-300 focus:ring-delta-blue/50 text-gray-900"
                         />
                         <button 
                             type="submit"
                             disabled={!commentText.trim()}
                             className={`px-4 rounded-lg flex items-center justify-center transition-colors ${!commentText.trim() ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-delta-blue text-white hover:bg-blue-700'}`}
                         >
                             <Send size={20} />
                         </button>
                     </div>
                 </form>
             </div>
        </div>

        {/* Sidebar Info */}
        <div className="w-full lg:w-80 space-y-6">
            <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
                <h3 className="font-bold text-gray-900 mb-4 text-sm uppercase tracking-wide">Detalhes</h3>
                
                <div className="space-y-4">
                    <div>
                        <label className="text-xs text-gray-500 block mb-1">Responsável</label>
                        {isAdminOrAgent ? (
                            <select 
                                value={ticket.assigneeId || ''}
                                onChange={(e) => onAssign(ticket.id, e.target.value)}
                                className="w-full text-sm border-gray-200 bg-white text-gray-900 rounded-md focus:ring-delta-blue focus:border-delta-blue"
                            >
                                <option value="">Sem responsável</option>
                                {users.map(u => (
                                    <option key={u.id} value={u.id}>{u.name}</option>
                                ))}
                            </select>
                        ) : (
                            <div className="flex items-center gap-2 text-sm text-gray-700">
                                <UserIcon size={16} className="text-gray-400"/>
                                {ticket.assigneeName || 'Aguardando atribuição'}
                            </div>
                        )}
                    </div>

                    <div>
                        <label className="text-xs text-gray-500 block mb-1">Prioridade</label>
                        <div className="flex items-center gap-2 text-sm font-medium">
                            {ticket.priority === TicketPriority.CRITICAL && <span className="w-2 h-2 rounded-full bg-red-500"></span>}
                            {ticket.priority === TicketPriority.HIGH && <span className="w-2 h-2 rounded-full bg-orange-500"></span>}
                            {ticket.priority === TicketPriority.MEDIUM && <span className="w-2 h-2 rounded-full bg-blue-500"></span>}
                            {ticket.priority === TicketPriority.LOW && <span className="w-2 h-2 rounded-full bg-gray-500"></span>}
                            {ticket.priority}
                        </div>
                    </div>

                    <div>
                        <label className="text-xs text-gray-500 block mb-1">Departamento</label>
                        <div className="text-sm text-gray-700">{ticket.department}</div>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};