import React, { useMemo } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import { Ticket, TicketStatus, TicketPriority } from '../types';
import { COLORS } from '../constants';
import { CheckCircle, AlertTriangle, Clock, PlayCircle } from 'lucide-react';

interface DashboardProps {
  tickets: Ticket[];
}

export const Dashboard: React.FC<DashboardProps> = ({ tickets }) => {
  
  const stats = useMemo(() => {
    return {
      total: tickets.length,
      open: tickets.filter(t => t.status === TicketStatus.OPEN).length,
      inProgress: tickets.filter(t => t.status === TicketStatus.IN_PROGRESS).length,
      resolved: tickets.filter(t => t.status === TicketStatus.RESOLVED || t.status === TicketStatus.CLOSED).length,
    };
  }, [tickets]);

  const statusData = useMemo(() => {
    const counts = tickets.reduce((acc, ticket) => {
      acc[ticket.status] = (acc[ticket.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [tickets]);

  const priorityData = useMemo(() => {
    const counts = tickets.reduce((acc, ticket) => {
      acc[ticket.priority] = (acc[ticket.priority] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [tickets]);

  const StatCard = ({ title, value, icon: Icon, colorClass, bgClass }: any) => (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
        <h3 className="text-2xl font-bold text-gray-800">{value}</h3>
      </div>
      <div className={`p-3 rounded-full ${bgClass}`}>
        <Icon className={`w-6 h-6 ${colorClass}`} />
      </div>
    </div>
  );

  const STATUS_COLORS = [COLORS.yellow, COLORS.blue, '#10B981', '#6B7280', '#EF4444'];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h2 className="text-2xl font-bold text-delta-blue">Dashboard Gerencial</h2>
          <p className="text-gray-500">Visão geral dos chamados e métricas</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="Total de Chamados" 
          value={stats.total} 
          icon={AlertTriangle}
          colorClass="text-delta-blue"
          bgClass="bg-blue-50"
        />
        <StatCard 
          title="Em Aberto" 
          value={stats.open} 
          icon={Clock}
          colorClass="text-delta-yellow"
          bgClass="bg-yellow-50"
        />
        <StatCard 
          title="Em Andamento" 
          value={stats.inProgress} 
          icon={PlayCircle}
          colorClass="text-blue-500"
          bgClass="bg-blue-50"
        />
        <StatCard 
          title="Resolvidos" 
          value={stats.resolved} 
          icon={CheckCircle}
          colorClass="text-green-500"
          bgClass="bg-green-50"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Status Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-[400px]">
          <h3 className="text-lg font-bold text-delta-dark mb-4">Chamados por Status</h3>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                fill="#8884d8"
                paddingAngle={5}
                dataKey="value"
              >
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={STATUS_COLORS[index % STATUS_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend verticalAlign="bottom" height={36}/>
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Priority Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-[400px]">
          <h3 className="text-lg font-bold text-delta-dark mb-4">Chamados por Prioridade</h3>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={priorityData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip cursor={{fill: 'transparent'}} />
              <Bar dataKey="value" fill={COLORS.blue} radius={[4, 4, 0, 0]} barSize={50} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};