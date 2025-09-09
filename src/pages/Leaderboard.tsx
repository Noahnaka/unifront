
import React, { useState, useEffect } from 'react';
import { Trophy, Medal, Crown, TrendingUp, Target } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface Cliente {
  id_cliente: number;
  nome_cliente: string;
  email_cliente: string;
  senha_cliente: string;
  celular_cliente: string;
  pontos_cliente: number;
}

const Leaderboard = () => {
  const [leaderboardData, setLeaderboardData] = useState<Cliente[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const response = await fetch('http://localhost:3000/api/cliente');
        const result = await response.json();
        
        if (response.ok && result.status && result.data) {
          // Sort by pontos_cliente in descending order
          const sortedData = result.data.sort((a: Cliente, b: Cliente) => b.pontos_cliente - a.pontos_cliente);
          setLeaderboardData(sortedData);
        } else {
          setError('Erro ao carregar classificação');
        }
      } catch (err) {
        console.error('Error fetching leaderboard:', err);
        setError('Erro ao conectar com o servidor');
      } finally {
        setIsLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  const getPositionIcon = (position: number) => {
    switch (position) {
      case 1: return <Trophy className="w-5 h-5 text-yellow-400" />;
      case 2: return <Medal className="w-5 h-5 text-gray-300" />;
      case 3: return <Trophy className="w-5 h-5 text-orange-400" />;
      default: return <span className="text-gray-400 font-bold">#{position}</span>;
    }
  };

  const formatPoints = (points: number) => {
    return points.toLocaleString();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto mb-4"></div>
            <p className="text-gray-400">Carregando classificação...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <p className="text-red-400 mb-4">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Tentar Novamente
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8 md:mb-12">
          <h1 className="text-3xl md:text-6xl font-bold text-gradient mb-3 md:mb-4 flex items-center justify-center space-x-3 md:space-x-4">
            <Trophy className="w-7 h-7 md:w-12 md:h-12 text-red-500" />
            <span>Classificação Completa</span>
          </h1>
          <p className="text-gray-400 text-base md:text-lg">Os melhores apostadores da plataforma</p>
        </div>

        {/* Leaderboard Table */}
        <div className="glass-card p-4 sm:p-6">
          <div className="w-full overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-gray-700">
                <TableHead className="text-gray-400 font-semibold whitespace-nowrap">Posição</TableHead>
                <TableHead className="text-gray-400 font-semibold whitespace-nowrap">Usuário</TableHead>
                <TableHead className="text-gray-400 font-semibold text-center whitespace-nowrap">Pontos</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {leaderboardData.map((user, index) => (
                <TableRow key={user.id_cliente} className="border-b border-gray-800 hover:bg-gray-800/30 transition-colors">
                  <TableCell className="py-3 sm:py-4">
                    <div className="flex items-center space-x-2">
                      {getPositionIcon(index + 1)}
                    </div>
                  </TableCell>
                  <TableCell className="py-3 sm:py-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full bg-red-600 flex items-center justify-center">
                        <span className="text-white font-bold text-sm">
                          {user.nome_cliente.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <span className="text-white font-medium">{user.nome_cliente}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-center py-3 sm:py-4">
                    <span className="text-green-400 font-semibold text-base sm:text-lg">
                      {formatPoints(user.pontos_cliente)}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
