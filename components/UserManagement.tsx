import React, { useState } from 'react';
import { User, UserRole } from '../types';
import { Trash2, UserPlus, Shield, Edit2, X, UserCircle } from 'lucide-react';
import { COLORS } from '../constants';

interface UserManagementProps {
  users: User[];
  onAddUser: (user: User) => Promise<void>;
  onUpdateUser: (user: User) => Promise<void>;
  onDeleteUser: (id: string) => Promise<void>;
}

export const UserManagement: React.FC<UserManagementProps> = ({ users, onAddUser, onUpdateUser, onDeleteUser }) => {
    const [editingId, setEditingId] = useState<string | null>(null);
    
    // Form State
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState<UserRole>(UserRole.USER);
    const [dept, setDept] = useState('');
    const [avatar, setAvatar] = useState('');

    const handleEdit = (user: User) => {
        setEditingId(user.id);
        setName(user.name);
        setEmail(user.email);
        setPassword(user.password || '');
        setRole(user.role);
        setDept(user.department || '');
        setAvatar(user.avatar || '');
    };

    const handleCancel = () => {
        setEditingId(null);
        setName('');
        setEmail('');
        setPassword('');
        setDept('');
        setAvatar('');
        setRole(UserRole.USER);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const userData: User = {
            id: editingId || Date.now().toString(),
            name,
            email,
            role,
            password,
            department: dept,
            avatar: avatar || undefined
        };

        if (editingId) {
            await onUpdateUser(userData);
        } else {
            await onAddUser(userData);
        }
        handleCancel();
    };

    return (
        <div className="space-y-8">
            <h2 className="text-2xl font-bold text-delta-blue">Gestão de Colaboradores</h2>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Add/Edit User Form */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-fit">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-bold text-lg flex items-center gap-2 text-delta-dark">
                            {editingId ? <Edit2 className="text-delta-blue" size={20}/> : <UserPlus className="text-delta-yellow" size={20}/>}
                            {editingId ? 'Editar Colaborador' : 'Novo Cadastro'}
                        </h3>
                        {editingId && (
                            <button onClick={handleCancel} className="text-gray-400 hover:text-gray-600">
                                <X size={20} />
                            </button>
                        )}
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Avatar Preview */}
                        <div className="flex justify-center mb-4">
                            <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden border-2 border-gray-200">
                                {avatar ? (
                                    <img src={avatar} alt="Preview" className="w-full h-full object-cover" />
                                ) : (
                                    <UserCircle size={40} className="text-gray-300" />
                                )}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm text-gray-600 mb-1">Nome Completo</label>
                            <input 
                                required 
                                value={name} 
                                onChange={e => setName(e.target.value)} 
                                className="w-full border border-gray-300 bg-white text-gray-900 p-2 rounded-lg outline-none focus:border-delta-blue focus:ring-1 focus:ring-delta-blue/20" 
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-gray-600 mb-1">Email</label>
                            <input 
                                required 
                                type="email" 
                                value={email} 
                                onChange={e => setEmail(e.target.value)} 
                                className="w-full border border-gray-300 bg-white text-gray-900 p-2 rounded-lg outline-none focus:border-delta-blue focus:ring-1 focus:ring-delta-blue/20" 
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-gray-600 mb-1">
                                Senha {editingId && <span className="text-xs text-gray-400 font-normal">(Opcional ao editar)</span>}
                            </label>
                            <input 
                                required={!editingId}
                                type="password" 
                                value={password} 
                                onChange={e => setPassword(e.target.value)} 
                                className="w-full border border-gray-300 bg-white text-gray-900 p-2 rounded-lg outline-none focus:border-delta-blue focus:ring-1 focus:ring-delta-blue/20" 
                                placeholder="******"
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-gray-600 mb-1">URL da Foto (Avatar)</label>
                            <input 
                                value={avatar} 
                                onChange={e => setAvatar(e.target.value)} 
                                className="w-full border border-gray-300 bg-white text-gray-900 p-2 rounded-lg outline-none focus:border-delta-blue focus:ring-1 focus:ring-delta-blue/20" 
                                placeholder="https://..."
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-gray-600 mb-1">Departamento</label>
                            <input 
                                required 
                                value={dept} 
                                onChange={e => setDept(e.target.value)} 
                                className="w-full border border-gray-300 bg-white text-gray-900 p-2 rounded-lg outline-none focus:border-delta-blue focus:ring-1 focus:ring-delta-blue/20" 
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-gray-600 mb-1">Função</label>
                            <select 
                                value={role} 
                                onChange={e => setRole(e.target.value as UserRole)} 
                                className="w-full border border-gray-300 bg-white text-gray-900 p-2 rounded-lg outline-none focus:border-delta-blue focus:ring-1 focus:ring-delta-blue/20"
                            >
                                <option value={UserRole.USER}>Usuário Comum</option>
                                <option value={UserRole.AGENT}>Agente de Suporte</option>
                                <option value={UserRole.ADMIN}>Administrador</option>
                            </select>
                        </div>
                        
                        <div className="pt-2">
                             <button type="submit" className={`w-full font-bold py-2 rounded-lg transition-colors shadow-sm ${editingId ? 'bg-delta-yellow text-delta-dark hover:brightness-105' : 'bg-delta-blue text-white hover:bg-blue-700'}`}>
                                {editingId ? 'Salvar Alterações' : 'Cadastrar'}
                            </button>
                            {editingId && (
                                <button 
                                    type="button" 
                                    onClick={handleCancel}
                                    className="w-full mt-2 text-sm text-gray-500 hover:text-gray-700 underline"
                                >
                                    Cancelar Edição
                                </button>
                            )}
                        </div>
                    </form>
                </div>

                {/* User List */}
                <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 border-b">
                            <tr>
                                <th className="p-4 text-xs font-semibold text-gray-500">Colaborador</th>
                                <th className="p-4 text-xs font-semibold text-gray-500">Email</th>
                                <th className="p-4 text-xs font-semibold text-gray-500">Função</th>
                                <th className="p-4 text-xs font-semibold text-gray-500">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {users.map(u => (
                                <tr key={u.id} className={editingId === u.id ? 'bg-blue-50' : ''}>
                                    <td className="p-4">
                                        <div 
                                            onClick={() => handleEdit(u)}
                                            className="flex items-center gap-3 cursor-pointer group"
                                            title="Clique para editar"
                                        >
                                            <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden flex items-center justify-center shrink-0 border border-gray-100 group-hover:border-delta-blue/50 transition-colors text-gray-500">
                                                {u.avatar ? (
                                                    <img src={u.avatar} alt={u.name} className="w-full h-full object-cover" />
                                                ) : (
                                                    <span className="font-bold text-sm">{u.name.charAt(0)}</span>
                                                )}
                                            </div>
                                            <div>
                                                <div className="font-medium text-delta-dark group-hover:text-delta-blue group-hover:underline transition-colors">{u.name}</div>
                                                <div className="text-xs text-gray-400">{u.department}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4 text-sm text-gray-600">{u.email}</td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 rounded text-xs font-bold ${
                                            u.role === UserRole.ADMIN ? 'bg-purple-100 text-purple-700' :
                                            u.role === UserRole.AGENT ? 'bg-blue-100 text-blue-700' :
                                            'bg-gray-100 text-gray-700'
                                        }`}>
                                            {u.role}
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        <button 
                                            onClick={() => onDeleteUser(u.id)}
                                            className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                                            title="Remover"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};