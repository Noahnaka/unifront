
import React, { useState } from 'react';
import { Trophy, Medal, Crown, TrendingUp, Target } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const Leaderboard = () => {
  const [activeTab, setActiveTab] = useState('weekly');

  const leaderboardData = {
    weekly: [
      { id: 1, name: 'Carlos Silva', avatar: '/lovable-uploads/ef213dba-e1b7-4b1c-a649-99c8e1860342.png', wins: 28, total: 35, rate: 80, profit: 2450, sequence: 9 },
      { id: 2, name: 'Ana Santos', avatar: '/lovable-uploads/ef213dba-e1b7-4b1c-a649-99c8e1860342.png', wins: 24, total: 32, rate: 75, profit: 1890, sequence: 5 },
      { id: 3, name: 'João Oliveira', avatar: '/lovable-uploads/ef213dba-e1b7-4b1c-a649-99c8e1860342.png', wins: 22, total: 30, rate: 73, profit: 1650, sequence: 3 },
      { id: 4, name: 'Maria Costa', avatar: '/lovable-uploads/ef213dba-e1b7-4b1c-a649-99c8e1860342.png', wins: 20, total: 28, rate: 71, profit: 1420, sequence: 2 },
      { id: 5, name: 'Pedro Almeida', avatar: '/lovable-uploads/ef213dba-e1b7-4b1c-a649-99c8e1860342.png', wins: 18, total: 26, rate: 69, profit: 1250, sequence: 1 },
      { id: 6, name: 'Lucia Fernandes', avatar: '/lovable-uploads/ef213dba-e1b7-4b1c-a649-99c8e1860342.png', wins: 16, total: 24, rate: 67, profit: 1080, sequence: 0 },
      { id: 7, name: 'Rafael Lima', avatar: '/lovable-uploads/ef213dba-e1b7-4b1c-a649-99c8e1860342.png', wins: 14, total: 22, rate: 64, profit: 920, sequence: 2 },
      { id: 8, name: 'Fernanda Rocha', avatar: '/lovable-uploads/ef213dba-e1b7-4b1c-a649-99c8e1860342.png', wins: 12, total: 20, rate: 60, profit: 750, sequence: 1 },
    ],
    monthly: [
      { id: 1, name: 'Carlos Silva', avatar: '/lovable-uploads/ef213dba-e1b7-4b1c-a649-99c8e1860342.png', wins: 128, total: 155, rate: 83, profit: 12450, sequence: 15 },
      { id: 2, name: 'Ana Santos', avatar: '/lovable-uploads/ef213dba-e1b7-4b1c-a649-99c8e1860342.png', wins: 124, total: 152, rate: 82, profit: 11980, sequence: 12 },
      { id: 3, name: 'João Oliveira', avatar: '/lovable-uploads/ef213dba-e1b7-4b1c-a649-99c8e1860342.png', wins: 112, total: 140, rate: 80, profit: 11520, sequence: 8 },
    ],
    allTime: [
      { id: 1, name: 'Carlos Silva', avatar: '/lovable-uploads/ef213dba-e1b7-4b1c-a649-99c8e1860342.png', wins: 650, total: 750, rate: 87, profit: 125000, sequence: 25 },
      { id: 2, name: 'Ana Santos', avatar: '/lovable-uploads/ef213dba-e1b7-4b1c-a649-99c8e1860342.png', wins: 620, total: 730, rate: 85, profit: 118000, sequence: 18 },
      { id: 3, name: 'João Oliveira', avatar: '/lovable-uploads/ef213dba-e1b7-4b1c-a649-99c8e1860342.png', wins: 580, total: 700, rate: 83, profit: 112000, sequence: 15 },
    ]
  };

  const tabs = [
    { id: 'weekly', label: 'Semanal', icon: Target },
    { id: 'monthly', label: 'Mensal', icon: TrendingUp },
    { id: 'allTime', label: 'Histórico', icon: Crown }
  ];

  const getPositionIcon = (position: number) => {
    switch (position) {
      case 1: return <Trophy className="w-5 h-5 text-yellow-400" />;
      case 2: return <Medal className="w-5 h-5 text-gray-300" />;
      case 3: return <Trophy className="w-5 h-5 text-orange-400" />;
      default: return <span className="text-gray-400 font-bold">#{position}</span>;
    }
  };

  const getRateColor = (rate: number) => {
    if (rate >= 80) return 'bg-green-600';
    if (rate >= 70) return 'bg-yellow-600';
    return 'bg-orange-600';
  };

  const currentData = leaderboardData[activeTab as keyof typeof leaderboardData];

  return (
    <div className="min-h-screen pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-gradient mb-4 flex items-center justify-center space-x-4">
            <Trophy className="w-8 h-8 md:w-12 md:h-12 text-red-500" />
            <span>Classificação Completa</span>
          </h1>
          <p className="text-gray-400 text-lg">Os melhores apostadores da plataforma</p>
        </div>

        {/* Tabs */}
        <div className="flex justify-center mb-8">
          <div className="glass-card p-2 flex space-x-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                    activeTab === tab.id
                      ? 'bg-red-600 text-white neon-glow'
                      : 'text-gray-300 hover:text-white hover:bg-gray-700'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Leaderboard Table */}
        <div className="glass-card p-6">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-gray-700">
                <TableHead className="text-gray-400 font-semibold">Posição</TableHead>
                <TableHead className="text-gray-400 font-semibold">Usuário</TableHead>
                <TableHead className="text-gray-400 font-semibold text-center">Vitórias</TableHead>
                <TableHead className="text-gray-400 font-semibold text-center">Total</TableHead>
                <TableHead className="text-gray-400 font-semibold text-center">Taxa</TableHead>
                <TableHead className="text-gray-400 font-semibold text-center">Lucro</TableHead>
                <TableHead className="text-gray-400 font-semibold text-center">Sequência</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentData.map((user, index) => (
                <TableRow key={user.id} className="border-b border-gray-800 hover:bg-gray-800/30 transition-colors">
                  <TableCell className="py-4">
                    <div className="flex items-center space-x-2">
                      {getPositionIcon(index + 1)}
                    </div>
                  </TableCell>
                  <TableCell className="py-4">
                    <div className="flex items-center space-x-3">
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <span className="text-white font-medium">{user.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-center py-4">
                    <span className="text-white font-semibold">{user.wins}</span>
                  </TableCell>
                  <TableCell className="text-center py-4">
                    <span className="text-gray-300">{user.total}</span>
                  </TableCell>
                  <TableCell className="text-center py-4">
                    <span className={`px-3 py-1 rounded-full text-white text-sm font-semibold ${getRateColor(user.rate)}`}>
                      {user.rate}%
                    </span>
                  </TableCell>
                  <TableCell className="text-center py-4">
                    <span className="text-green-400 font-semibold">R$ {user.profit.toLocaleString()}</span>
                  </TableCell>
                  <TableCell className="text-center py-4">
                    <div className="flex items-center justify-center">
                      <span className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                        {user.sequence}
                      </span>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
