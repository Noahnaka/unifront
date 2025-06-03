
import React, { useState } from 'react';
import { TrendingUp, DollarSign, Calculator, History, Target, Trophy } from 'lucide-react';

const Betting = () => {
  const [selectedBet, setSelectedBet] = useState<any>(null);
  const [betAmount, setBetAmount] = useState('');
  const [activeTab, setActiveTab] = useState('available');

  const availableBets = [
    {
      id: 1,
      fight: 'Jon Jones vs Stipe Miocic',
      event: 'UFC 300',
      type: 'Vencedor',
      options: [
        { name: 'Jon Jones', odds: 1.85, probability: 54.1 },
        { name: 'Stipe Miocic', odds: 2.10, probability: 47.6 }
      ]
    },
    {
      id: 2,
      fight: 'Jon Jones vs Stipe Miocic',
      event: 'UFC 300',
      type: 'Método de Vitória',
      options: [
        { name: 'Jones por Decisão', odds: 3.25, probability: 30.8 },
        { name: 'Jones por Finalização', odds: 4.50, probability: 22.2 },
        { name: 'Jones por Nocaute', odds: 6.00, probability: 16.7 },
        { name: 'Miocic por Nocaute', odds: 4.20, probability: 23.8 }
      ]
    },
    {
      id: 3,
      fight: 'Patricio Freire vs Adam Borics',
      event: 'Bellator 300',
      type: 'Total de Rounds',
      options: [
        { name: 'Menos de 2.5 rounds', odds: 1.95, probability: 51.3 },
        { name: 'Mais de 2.5 rounds', odds: 1.90, probability: 52.6 }
      ]
    }
  ];

  const myBets = [
    {
      id: 1,
      fight: 'Charles Oliveira vs Islam Makhachev',
      selection: 'Charles Oliveira',
      odds: 2.30,
      amount: 100,
      status: 'won',
      payout: 230,
      date: '2024-04-15'
    },
    {
      id: 2,
      fight: 'Anderson Silva vs Carlos Rodriguez',
      selection: 'Anderson Silva por Decisão',
      odds: 3.40,
      amount: 50,
      status: 'pending',
      potentialPayout: 170,
      date: '2024-04-20'
    }
  ];

  const calculatePayout = (amount: number, odds: number) => {
    return (amount * odds).toFixed(2);
  };

  const placeBet = () => {
    if (selectedBet && betAmount) {
      console.log('Placing bet:', {
        selection: selectedBet,
        amount: betAmount,
        potentialPayout: calculatePayout(parseFloat(betAmount), selectedBet.odds)
      });
      setSelectedBet(null);
      setBetAmount('');
    }
  };

  return (
    <div className="min-h-screen pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-gradient mb-4">Apostas</h1>
          <p className="text-gray-400 text-lg">Faça suas apostas com as melhores odds do mercado</p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="glass-card p-6 text-center">
            <DollarSign className="w-8 h-8 text-green-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">R$ 2.450</div>
            <div className="text-gray-400 text-sm">Saldo Disponível</div>
          </div>
          <div className="glass-card p-6 text-center">
            <TrendingUp className="w-8 h-8 text-blue-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">68%</div>
            <div className="text-gray-400 text-sm">Taxa de Acerto</div>
          </div>
          <div className="glass-card p-6 text-center">
            <Target className="w-8 h-8 text-red-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">23</div>
            <div className="text-gray-400 text-sm">Apostas Ativas</div>
          </div>
          <div className="glass-card p-6 text-center">
            <Trophy className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">R$ 8.920</div>
            <div className="text-gray-400 text-sm">Ganhos Totais</div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Betting Options */}
          <div className="lg:col-span-2">
            {/* Tabs */}
            <div className="flex space-x-2 mb-6">
              <button
                onClick={() => setActiveTab('available')}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                  activeTab === 'available'
                    ? 'bg-red-600 text-white neon-glow'
                    : 'bg-gray-800 text-gray-300 hover:text-white'
                }`}
              >
                Apostas Disponíveis
              </button>
              <button
                onClick={() => setActiveTab('my-bets')}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                  activeTab === 'my-bets'
                    ? 'bg-red-600 text-white neon-glow'
                    : 'bg-gray-800 text-gray-300 hover:text-white'
                }`}
              >
                Minhas Apostas
              </button>
            </div>

            {/* Available Bets */}
            {activeTab === 'available' && (
              <div className="space-y-6">
                {availableBets.map((bet) => (
                  <div key={bet.id} className="glass-card p-6 hover-lift">
                    <div className="mb-4">
                      <h3 className="text-xl font-bold text-white">{bet.fight}</h3>
                      <p className="text-gray-400">{bet.event} • {bet.type}</p>
                    </div>

                    <div className="grid gap-3">
                      {bet.options.map((option, index) => (
                        <button
                          key={index}
                          onClick={() => setSelectedBet({ ...option, fight: bet.fight, event: bet.event, type: bet.type })}
                          className={`flex items-center justify-between p-4 rounded-lg border transition-all duration-300 ${
                            selectedBet?.name === option.name
                              ? 'border-red-500 bg-red-500/10'
                              : 'border-gray-600 hover:border-gray-500 bg-gray-800/30'
                          }`}
                        >
                          <div className="text-left">
                            <div className="text-white font-semibold">{option.name}</div>
                            <div className="text-gray-400 text-sm">{option.probability}% de chance</div>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-red-400">{option.odds}</div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* My Bets */}
            {activeTab === 'my-bets' && (
              <div className="space-y-4">
                {myBets.map((bet) => (
                  <div key={bet.id} className="glass-card p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-white">{bet.fight}</h3>
                        <p className="text-gray-400">{bet.selection}</p>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        bet.status === 'won' ? 'bg-green-600 text-white' :
                        bet.status === 'lost' ? 'bg-red-600 text-white' :
                        'bg-yellow-600 text-white'
                      }`}>
                        {bet.status === 'won' ? 'Ganhou' : bet.status === 'lost' ? 'Perdeu' : 'Pendente'}
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <div className="text-gray-400 text-sm">Apostado</div>
                        <div className="text-white font-semibold">R$ {bet.amount}</div>
                      </div>
                      <div>
                        <div className="text-gray-400 text-sm">Odds</div>
                        <div className="text-white font-semibold">{bet.odds}</div>
                      </div>
                      <div>
                        <div className="text-gray-400 text-sm">
                          {bet.status === 'won' ? 'Ganho' : 'Potencial Ganho'}
                        </div>
                        <div className={`font-semibold ${bet.status === 'won' ? 'text-green-400' : 'text-yellow-400'}`}>
                          R$ {bet.payout || bet.potentialPayout}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Bet Slip */}
          <div className="lg:col-span-1">
            <div className="glass-card p-6 sticky top-24">
              <h3 className="text-xl font-bold text-white mb-6 flex items-center space-x-2">
                <Calculator className="w-5 h-5" />
                <span>Cupom de Aposta</span>
              </h3>

              {selectedBet ? (
                <div className="space-y-6">
                  <div className="bg-gray-800/30 rounded-lg p-4">
                    <div className="text-sm text-gray-400 mb-1">{selectedBet.event}</div>
                    <div className="text-white font-semibold mb-2">{selectedBet.fight}</div>
                    <div className="flex items-center justify-between">
                      <span className="text-white">{selectedBet.name}</span>
                      <span className="text-red-400 font-bold text-lg">{selectedBet.odds}</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-300 text-sm font-medium mb-2">
                      Valor da Aposta
                    </label>
                    <input
                      type="number"
                      value={betAmount}
                      onChange={(e) => setBetAmount(e.target.value)}
                      placeholder="R$ 0,00"
                      className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-white placeholder-gray-400"
                    />
                  </div>

                  {betAmount && (
                    <div className="bg-gray-800/30 rounded-lg p-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-gray-400">Ganho Potencial:</span>
                        <span className="text-green-400 font-bold text-lg">
                          R$ {calculatePayout(parseFloat(betAmount), selectedBet.odds)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400">Retorno Total:</span>
                        <span className="text-white font-semibold">
                          R$ {(parseFloat(betAmount) + parseFloat(calculatePayout(parseFloat(betAmount), selectedBet.odds))).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  )}

                  <button
                    onClick={placeBet}
                    disabled={!betAmount || parseFloat(betAmount) <= 0}
                    className="w-full py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-300 font-bold disabled:bg-gray-600 disabled:cursor-not-allowed neon-glow"
                  >
                    Confirmar Aposta
                  </button>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Target className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-400">Selecione uma aposta para começar</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Betting;
