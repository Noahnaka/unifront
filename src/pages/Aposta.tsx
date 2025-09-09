import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';
import { toast } from 'sonner';

interface Fight {
  id: number;
  id_evento: number; // Add event ID
  id_luta: number;
  fighter1: string;
  fighter2: string;
  weightClass: string;
  event: string;
  date: string;
  rounds: number;
  duration: string;
}

const Aposta = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { fight } = location.state as { fight: Fight };

  const [betData, setBetData] = useState({
    method: '',
    round: '',
    winner: '',
    amount: ''
  });

  const methods = [
    'Knockout',
    'Submission',
    'Unanimous Decision',
    'Split Decision',
    'Draw',
    'No Contest',
  ];

  const rounds = Array.from({ length: fight.rounds }, (_, i) => (i + 1).toString());

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Você precisa estar logado para fazer uma aposta');
        navigate('/login');
        return;
      }

      const payload = await fetch('http://localhost:3000/api/token/conta/cliente', {
        method: 'GET',
        headers:  {
           'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      const data2 = await payload.json();
      const id_cliente = data2.payload.id_cliente;

      
      const body = {
        id_cliente: id_cliente,
        id_evento: fight.id_evento,
        id_luta: fight.id_luta,
        vencedor: betData.winner === fight.fighter1 ? 'redFighter' : 'blueFighter',
        metodo: betData.method,
        rodada: betData.round
      };
      console.log('Bet body:', body);
      const response = await fetch('http://localhost:3000/api/ufc/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();
      console.log(data);
      if (!response.ok) {
        throw new Error(data.message || 'Erro ao fazer aposta');
      }

      toast.success('Aposta realizada com sucesso!');
      navigate('/fights');
    } catch (err) {
      console.error('Erro ao fazer aposta:', err);
      toast.error(err instanceof Error ? err.message : 'Erro ao fazer aposta');
    }
  };

  return (
    <div className="min-h-screen pt-16 pb-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gradient mb-2">Fazer Aposta</h1>
          <p className="text-gray-400">Selecione as opções da sua aposta</p>
        </div>

        {/* Fight Info */}
        <div className="glass-card p-4 sm:p-6 mb-8">
          <h2 className="text-xl font-semibold text-white mb-4">{fight.event}</h2>
          <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-4">
            <div className="text-center">
              <div className="text-lg font-semibold text-white">{fight.fighter1}</div>
              <div className="text-gray-400 text-sm">Red Corner</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold text-white">{fight.fighter2}</div>
              <div className="text-gray-400 text-sm">Blue Corner</div>
            </div>
          </div>
          <div className="text-center text-gray-400">
            <div>{fight.weightClass}</div>
          </div>
        </div>

        {/* Bet Form */}
        <div className="glass-card p-4 sm:p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Winner Selection */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">
                Vencedor
              </label>
              <div className="relative">
                <select
                  value={betData.winner}
                  onChange={(e) => setBetData(prev => ({ ...prev, winner: e.target.value }))}
                  className="w-full p-3 pl-4 pr-10 text-sm sm:text-base bg-gray-800/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-white appearance-none cursor-pointer hover:border-red-500/50 transition-colors duration-300"
                  required
                >
                  <option value="" className="bg-gray-800 text-gray-400">Selecione o vencedor</option>
                  <option value={fight.fighter1} className="bg-gray-800 text-white">{fight.fighter1}</option>
                  <option value={fight.fighter2} className="bg-gray-800 text-white">{fight.fighter2}</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
              </div>
            </div>

            {/* Method Selection */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">
                Método de Vitória
              </label>
              <div className="relative">
                <select
                  value={betData.method}
                  onChange={(e) => setBetData(prev => ({ ...prev, method: e.target.value }))}
                  className="w-full p-3 pl-4 pr-10 text-sm sm:text-base bg-gray-800/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-white appearance-none cursor-pointer hover:border-red-500/50 transition-colors duration-300"
                  required
                >
                  <option value="" className="bg-gray-800 text-gray-400">Selecione o método</option>
                  {methods.map((method) => (
                    <option key={method} value={method} className="bg-gray-800 text-white">{method}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
              </div>
            </div>

            {/* Round Selection */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">
                Round
              </label>
              <div className="relative">
                <select
                  value={betData.round}
                  onChange={(e) => setBetData(prev => ({ ...prev, round: e.target.value }))}
                  className="w-full p-3 pl-4 pr-10 text-sm sm:text-base bg-gray-800/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-white appearance-none cursor-pointer hover:border-red-500/50 transition-colors duration-300"
                  required
                >
                  <option value="" className="bg-gray-800 text-gray-400">Selecione o round</option>
                  {rounds.map((round) => (
                    <option key={round} value={round} className="bg-gray-800 text-white">Round {round}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-300 font-medium text-sm sm:text-base"
            >
              Confirmar Aposta
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Aposta; 