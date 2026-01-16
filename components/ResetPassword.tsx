import React, { useState } from 'react';
import { api } from '../services/api';

interface ResetPasswordProps {
  onSuccess: () => void;
}

export const ResetPassword: React.FC<ResetPasswordProps> = ({ onSuccess }) => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      setError('As senhas não coincidem.');
      return;
    }

    if (password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Chama a função para atualizar a senha no banco
      await api.updatePassword(password);
      alert('Senha alterada com sucesso! Agora você pode fazer login.');
      onSuccess();
    } catch (err: any) {
      setError('Erro ao atualizar senha: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden flex flex-col">
        {/* Brand Header - Idêntico ao Login */}
        <div className="bg-delta-blue p-8 flex flex-col items-center justify-center relative overflow-hidden">
             <div className="absolute top-0 right-0 w-32 h-32 bg-delta-yellow opacity-10 rounded-full translate-x-10 -translate-y-10"></div>
             <div className="absolute bottom-0 left-0 w-24 h-24 bg-white opacity-10 rounded-full -translate-x-10 translate-y-10"></div>

             <div className="w-20 h-20 mb-4 bg-white rounded-full flex items-center justify-center shadow-lg relative z-10 p-2">
                 <svg viewBox="0 0 370.53 280.34" width="100%" height="100%" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg">
                  <path fill="#55739b" d="M260.52,230.49c8.53,0,15.9-1.88,22.11-5.65s11.34-8.72,15.38-14.85,6.99-13.04,8.86-20.74c1.87-7.7,2.81-15.48,2.81-23.33,0-9.27-1.17-17.84-3.49-25.69-2.33-7.86-5.97-14.62-10.92-20.27s-11.29-10.09-19.03-13.32c-7.73-3.21-17-4.83-27.81-4.83-3,0-6.11.16-9.34.47-3.23.32-6.57.79-10.02,1.41v148.26h-31.43V83.66c10.02-2.2,19.38-3.77,28.06-4.71,8.68-.95,16.31-1.41,22.9-1.41,14.97,0,28.32,2,40.08,6.01,11.75,4,21.7,9.78,29.86,17.32,8.16,7.54,14.37,16.78,18.64,27.7,4.27,10.92,6.4,23.37,6.4,37.36,0,12.41-2.02,24.04-6.06,34.88-4.05,10.84-9.58,20.27-16.62,28.28-7.04,8.02-15.46,14.3-25.26,18.86-9.8,4.56-20.39,6.84-31.77,6.84-2.1,0-4.01-.04-5.73-.12s-3.56-.27-5.5-.59c-1.95-.32-4.08-.71-6.4-1.18-2.33-.47-5.13-1.17-8.42-2.12.9-2.04,2.02-4.24,3.37-6.6,1.35-2.36,2.92-4.56,4.71-6.6,1.8-2.04,3.89-3.73,6.29-5.07,2.39-1.33,5.16-2,8.31-2l.02-.02Z"/>
                  <path fill="#f5b524" d="M181.27,140.31c-2.85-10.07-7.46-19.17-13.82-27.31-5-6.39-11.19-11.81-18.45-16.31-6.24-4.42-13.42-9.41-13.42-9.41l-46.68-35.42,79.49-.42v-25.87c-5.51-.08-124.28.24-124.28.24l.17,26.36-.17.08,47.52,34.46c-6.76,1.06-13.04,2.88-18.83,5.47-9.8,4.4-18.09,10.44-24.89,18.13s-11.99,16.67-15.58,26.97c-3.58,10.29-5.37,21.26-5.37,32.9s1.76,23.27,5.26,33.57c3.51,10.29,8.67,19.21,15.47,26.74,6.8,7.54,15.1,13.47,24.9,17.79,9.8,4.33,21.06,6.49,33.78,6.49s24.02-2.35,33.89-7.05c9.87-4.7,18.13-10.97,24.79-18.8,6.65-7.83,11.73-16.82,15.24-26.97,3.51-10.14,5.26-20.73,5.26-31.78,0-9.85-1.43-19.81-4.27-29.87h0ZM148.58,196.36c-2.56,7.61-5.96,14.03-10.2,19.25-4.25,5.22-9.14,9.21-14.7,11.97s-11.34,4.14-17.33,4.14c-7.61,0-14.26-1.75-19.96-5.26-5.7-3.51-10.5-8.13-14.37-13.87-3.88-5.75-6.8-12.31-8.78-19.7-1.97-7.38-2.96-14.95-2.96-22.71,0-8.2.98-16.03,2.96-23.5,1.97-7.46,4.9-14.02,8.78-19.7,3.87-5.67,8.67-10.14,14.37-13.43,5.7-3.28,12.35-4.92,19.96-4.92,7.17,0,13.6,1.56,19.31,4.7,5.7,3.13,10.53,7.42,14.48,12.87,3.95,5.45,6.98,11.94,9.1,19.47,2.12,7.54,3.18,15.7,3.18,24.5,0,9.85-1.28,18.58-3.84,26.18h0Z"/>
</svg>
             </div>
             <h1 className="text-2xl font-bold text-white tracking-wide">Help Desk Delta</h1>
             <p className="text-blue-100 text-sm mt-1">Gestão Inteligente de Suporte</p>
        </div>

        <div className="p-8">
            <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Senha nova</label>
                    <input 
                        required
                        type="password" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white text-gray-900 focus:ring-2 focus:ring-delta-yellow focus:border-transparent outline-none transition-all"
                        placeholder="******"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Confirme a senha</label>
                    <input 
                        required
                        type="password" 
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white text-gray-900 focus:ring-2 focus:ring-delta-yellow focus:border-transparent outline-none transition-all"
                        placeholder="******"
                    />
                </div>

                {error && <p className="text-red-500 text-sm text-center bg-red-50 p-2 rounded border border-red-100">{error}</p>}

                <button 
                    type="submit" 
                    disabled={loading}
                    className="w-full bg-delta-yellow text-delta-dark font-bold py-3 rounded-lg hover:brightness-105 transition-all shadow-md active:scale-[0.98]"
                >
                    {loading ? 'Enviando...' : 'Enviar'}
                </button>
            </form>
            
            <p className="text-center text-xs text-gray-400 mt-6">
                Protegido por Supabase Auth
            </p>
        </div>
      </div>
    </div>
  );
};
