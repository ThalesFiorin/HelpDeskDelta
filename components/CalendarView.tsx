import React, { useState, useMemo } from 'react';
import { Ticket, TicketStatus } from '../types';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';

interface CalendarViewProps {
  tickets: Ticket[];
  onSelectTicket: (ticket: Ticket) => void;
}

export const CalendarView: React.FC<CalendarViewProps> = ({ tickets, onSelectTicket }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay();

  const monthNames = [
    "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
  ];

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const isSameDay = (d1: Date, d2: Date) => {
    return d1.getDate() === d2.getDate() &&
           d1.getMonth() === d2.getMonth() &&
           d1.getFullYear() === d2.getFullYear();
  };

  const getTicketsForDay = (day: number) => {
    const date = new Date(year, month, day);
    return tickets.filter(t => isSameDay(new Date(t.createdAt), date));
  };

  const hasActiveTickets = (day: number) => {
    const dayTickets = getTicketsForDay(day);
    return dayTickets.some(t => t.status === TicketStatus.OPEN || t.status === TicketStatus.IN_PROGRESS);
  };

  const renderCalendarDays = () => {
    const days = [];
    
    // Empty cells for days before start of month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className="h-24 bg-gray-50 border border-gray-100/50"></div>);
    }

    // Days of month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const dayTickets = getTicketsForDay(day);
      const isActive = hasActiveTickets(day);
      const isSelected = selectedDate && isSameDay(date, selectedDate);
      const isToday = isSameDay(date, new Date());

      days.push(
        <div 
          key={day}
          onClick={() => setSelectedDate(date)}
          className={`h-24 border border-gray-100 p-2 relative cursor-pointer transition-colors hover:bg-blue-50/50
            ${isSelected ? 'bg-blue-50 ring-2 ring-delta-blue inset-0 z-10' : 'bg-white'}
          `}
        >
          <div className="flex justify-between items-start">
            <span className={`text-sm font-medium w-6 h-6 flex items-center justify-center rounded-full
              ${isToday ? 'bg-delta-blue text-white' : 'text-gray-700'}
            `}>
              {day}
            </span>
            {isActive && (
              <span className="w-2 h-2 rounded-full bg-delta-yellow animate-pulse" title="Chamados em aberto/andamento"></span>
            )}
          </div>
          <div className="mt-2 space-y-1 overflow-hidden max-h-[50px]">
            {dayTickets.slice(0, 2).map(t => (
               <div key={t.id} className="text-[10px] truncate bg-gray-100 rounded px-1 text-gray-600 border border-gray-200">
                 {t.id}
               </div>
            ))}
            {dayTickets.length > 2 && (
               <div className="text-[10px] text-gray-400 text-center">+{dayTickets.length - 2} mais</div>
            )}
          </div>
        </div>
      );
    }
    return days;
  };

  const selectedDayTickets = selectedDate 
    ? tickets.filter(t => isSameDay(new Date(t.createdAt), selectedDate))
    : [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-delta-blue flex items-center gap-2">
            <CalendarIcon /> Calendário de Chamados
          </h2>
          <p className="text-gray-500">Visualize a criação de chamados por data</p>
        </div>
        
        <div className="flex items-center gap-4 bg-white p-2 rounded-lg shadow-sm border border-gray-200">
          <button onClick={handlePrevMonth} className="p-2 hover:bg-gray-100 rounded-full text-gray-600 transition-colors">
            <ChevronLeft size={20} />
          </button>
          <span className="font-bold text-gray-800 w-40 text-center select-none">
            {monthNames[month]} {year}
          </span>
          <button onClick={handleNextMonth} className="p-2 hover:bg-gray-100 rounded-full text-gray-600 transition-colors">
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="grid grid-cols-7 bg-gray-50 border-b border-gray-200">
          {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(d => (
            <div key={d} className="py-3 text-center text-xs font-semibold text-gray-500 uppercase">
              {d}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7">
          {renderCalendarDays()}
        </div>
      </div>

      {/* Selected Day Details */}
      {selectedDate && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="font-bold text-lg text-gray-800 mb-4 border-b border-gray-100 pb-2">
            Chamados de {selectedDate.getDate()} de {monthNames[selectedDate.getMonth()]}
          </h3>
          
          {selectedDayTickets.length > 0 ? (
            <div className="space-y-3">
              {selectedDayTickets.map(ticket => (
                <div 
                  key={ticket.id} 
                  onClick={() => onSelectTicket(ticket)}
                  className="flex items-center justify-between p-3 rounded-lg border border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs text-gray-500 bg-gray-100 px-1 rounded">{ticket.id}</span>
                      <h4 className="font-medium text-gray-800">{ticket.title}</h4>
                    </div>
                    <p className="text-sm text-gray-500 truncate mt-1">{ticket.description}</p>
                  </div>
                  <div className="flex items-center gap-2">
                     <span className={`px-2 py-1 rounded-full text-xs font-medium border
                       ${ticket.status === TicketStatus.OPEN ? 'bg-yellow-100 text-yellow-800 border-yellow-200' : 
                         ticket.status === TicketStatus.IN_PROGRESS ? 'bg-blue-100 text-blue-800 border-blue-200' :
                         ticket.status === TicketStatus.RESOLVED ? 'bg-green-100 text-green-800 border-green-200' :
                         'bg-gray-100 text-gray-800 border-gray-200'}
                     `}>
                        {ticket.status}
                     </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8 bg-gray-50 rounded-lg border border-dashed border-gray-200">
                Nenhum chamado criado nesta data.
            </p>
          )}
        </div>
      )}
    </div>
  );
};