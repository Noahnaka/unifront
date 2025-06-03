
import React, { useState } from 'react';
import { Calendar, Clock, Trophy, Target, TrendingUp, Users, Filter } from 'lucide-react';

const Fights = () => {
  const [activeTab, setActiveTab] = useState('upcoming');

  const fights = {
    upcoming: [
      {
        id: 1,
        fighter1: { name: 'Jon Jones', record: '27-1-0', rank: '#1', avatar: '/lovable-uploads/ef213dba-e1b7-4b1c-a649-99c8e1860342.png' },
        fighter2: { name: 'Stipe Miocic', record: '20-4-0', rank: '#2', avatar: '/lovable-uploads/ef213dba-e1b7-4b1c-a649-99c8e1860342.png' },
        event: 'UFC 300',
        date: '2024-04-24',
        time: '22:00',
        weightClass: 'Peso Pesado',
        title: 'Cinturão Peso Pesado UFC',
        odds: { fighter1: 1.85, fighter2: 2.10 },
        analysis: 'Luta histórica entre dois dos maiores lutadores de todos os tempos'
      },
      {
        id: 2,
        fighter1: { name: 'Patricio Freire', record: '35-6-0', rank: '#1', avatar: '/lovable-uploads/ef213dba-e1b7-4b1c-a649-99c8e1860342.png' },
        fighter2: { name: 'Adam Borics', record: '18-1-0', rank: '#2', avatar: '/lovable-uploads/ef213dba-e1b7-4b1c-a649-99c8e1860342.png' },
        event: 'Bellator 300',
        date: '2024-05-01',
        time: '21:00',
        weightClass: 'Peso Pena',
        title: 'Cinturão Peso Pena Bellator',
        odds: { fighter1: 1.65, fighter2: 2.35 },
        analysis: 'Pitbull defende seu título contra o jovem promissor húngaro'
      }
    ],
    live: [
      {
        id: 3,
        fighter1: { name: 'Anderson Silva', record: '34-11-0', rank: 'Lenda', avatar: '/lovable-uploads/ef213dba-e1b7-4b1c-a649-99c8e1860342.png' },
        fighter2: { name: 'Carlos Rodriguez', record: '15-3-0', rank: '#5', avatar: '/lovable-uploads/ef213dba-e1b7-4b1c-a649-99c8e1860342.png' },
        event: 'ONE Championship',
        round: 'Round 2',
        timeLeft: '2:15',
        weightClass: 'Peso Médio',
        status: 'AO VIVO',
        analysis: 'Silva mostra que ainda tem muito a oferecer no octógono'
      }
    ],
    finished: [
      {
        id: 4,
        fighter1: { name: 'Charles Oliveira', record: '33-10-0', result: 'Vitória por Submissão' },
        fighter2: { name: 'Islam Makhachev', record: '25-2-0', result: 'Derrota' },
        event: 'UFC Fight Night',
        date: '2024-04-15',
        method: 'Mata Leão - 1º Round (4:32)',
        weightClass: 'Peso Leve',
        analysis: 'Do Bronx recupera o cinturão com performance dominante'
      }
    ]
  };

  const tabs = [
    { id: 'upcoming', label: 'Próximas', icon: Calendar },
    { id: 'live', label: 'Ao Vivo', icon: Target },
    { id: 'finished', label: 'Finalizadas', icon: Trophy }
  ];

  return (
    <div className="min-h-screen pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-gradient mb-4">Lutas</h1>
          <p className="text-gray-400 text-lg">Acompanhe todas as lutas com análises detalhadas</p>
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
                  {tab.id === 'live' && (
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Fights Content */}
        <div className="space-y-6">
          {/* Upcoming Fights */}
          {activeTab === 'upcoming' && (
            <div className="space-y-6">
              {fights.upcoming.map((fight) => (
                <div key={fight.id} className="glass-card p-6 hover-lift animated-border">
                  {/* Fight Header */}
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-xl font-bold text-white">{fight.event}</h3>
                      <p className="text-gray-400">{fight.weightClass} • {fight.title}</p>
                    </div>
                    <div className="text-right text-gray-400">
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(fight.date).toLocaleDateString('pt-BR')}</span>
                      </div>
                      <div className="flex items-center space-x-2 mt-1">
                        <Clock className="w-4 h-4" />
                        <span>{fight.time}</span>
                      </div>
                    </div>
                  </div>

                  {/* Fighters */}
                  <div className="grid md:grid-cols-3 gap-6 mb-6">
                    {/* Fighter 1 */}
                    <div className="text-center">
                      <div className="relative mb-4">
                        <img
                          src={fight.fighter1.avatar}
                          alt={fight.fighter1.name}
                          className="w-24 h-24 rounded-full mx-auto object-cover border-2 border-red-500"
                        />
                        <div className="absolute -top-2 -right-2 bg-red-600 text-white text-xs px-2 py-1 rounded-full">
                          {fight.fighter1.rank}
                        </div>
                      </div>
                      <h4 className="text-lg font-semibold text-white">{fight.fighter1.name}</h4>
                      <p className="text-gray-400">{fight.fighter1.record}</p>
                      <div className="mt-2">
                        <span className="text-2xl font-bold text-red-400">{fight.odds.fighter1}</span>
                      </div>
                    </div>

                    {/* VS */}
                    <div className="flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-4xl font-bold text-gradient mb-2">VS</div>
                        <div className="text-gray-400 text-sm">Odds</div>
                      </div>
                    </div>

                    {/* Fighter 2 */}
                    <div className="text-center">
                      <div className="relative mb-4">
                        <img
                          src={fight.fighter2.avatar}
                          alt={fight.fighter2.name}
                          className="w-24 h-24 rounded-full mx-auto object-cover border-2 border-blue-500"
                        />
                        <div className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
                          {fight.fighter2.rank}
                        </div>
                      </div>
                      <h4 className="text-lg font-semibold text-white">{fight.fighter2.name}</h4>
                      <p className="text-gray-400">{fight.fighter2.record}</p>
                      <div className="mt-2">
                        <span className="text-2xl font-bold text-blue-400">{fight.odds.fighter2}</span>
                      </div>
                    </div>
                  </div>

                  {/* Analysis */}
                  <div className="bg-gray-800/30 rounded-lg p-4 mb-4">
                    <h5 className="text-white font-semibold mb-2">Análise</h5>
                    <p className="text-gray-400">{fight.analysis}</p>
                  </div>

                  {/* Actions */}
                  <div className="grid grid-cols-2 gap-4">
                    <button className="py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-300 font-medium">
                      Apostar Agora
                    </button>
                    <button className="py-3 border border-gray-600 text-gray-300 rounded-lg hover:border-red-500 hover:text-red-400 transition-all duration-300 font-medium">
                      Ver Estatísticas
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Live Fights */}
          {activeTab === 'live' && (
            <div className="space-y-6">
              {fights.live.map((fight) => (
                <div key={fight.id} className="glass-card p-6 hover-lift animated-border">
                  {/* Live Header */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                        <span className="text-red-400 font-bold">{fight.status}</span>
                      </div>
                      <span className="text-white font-semibold">{fight.event}</span>
                    </div>
                    <div className="text-right">
                      <div className="text-white font-bold">{fight.round}</div>
                      <div className="text-gray-400">{fight.timeLeft} restante</div>
                    </div>
                  </div>

                  {/* Live Fighters */}
                  <div className="grid md:grid-cols-3 gap-6 mb-6">
                    <div className="text-center">
                      <img
                        src={fight.fighter1.avatar}
                        alt={fight.fighter1.name}
                        className="w-24 h-24 rounded-full mx-auto object-cover border-2 border-red-500 mb-4"
                      />
                      <h4 className="text-lg font-semibold text-white">{fight.fighter1.name}</h4>
                      <p className="text-gray-400">{fight.fighter1.record}</p>
                    </div>

                    <div className="flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-4xl font-bold text-red-400 mb-2 animate-pulse">LIVE</div>
                        <div className="text-gray-400 text-sm">{fight.weightClass}</div>
                      </div>
                    </div>

                    <div className="text-center">
                      <img
                        src={fight.fighter2.avatar}
                        alt={fight.fighter2.name}
                        className="w-24 h-24 rounded-full mx-auto object-cover border-2 border-blue-500 mb-4"
                      />
                      <h4 className="text-lg font-semibold text-white">{fight.fighter2.name}</h4>
                      <p className="text-gray-400">{fight.fighter2.record}</p>
                    </div>
                  </div>

                  <button className="w-full py-4 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-300 font-bold text-lg pulse-red">
                    ASSISTIR AO VIVO
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Finished Fights */}
          {activeTab === 'finished' && (
            <div className="space-y-6">
              {fights.finished.map((fight) => (
                <div key={fight.id} className="glass-card p-6 hover-lift">
                  {/* Result Header */}
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-xl font-bold text-white">{fight.event}</h3>
                      <p className="text-gray-400">{fight.weightClass} • {new Date(fight.date).toLocaleDateString('pt-BR')}</p>
                    </div>
                    <div className="bg-green-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                      Finalizada
                    </div>
                  </div>

                  {/* Result */}
                  <div className="grid md:grid-cols-3 gap-6 mb-4">
                    <div className="text-center">
                      <h4 className="text-lg font-semibold text-green-400">{fight.fighter1.name}</h4>
                      <p className="text-gray-400">{fight.fighter1.record}</p>
                      <p className="text-green-400 font-semibold mt-2">{fight.fighter1.result}</p>
                    </div>

                    <div className="flex items-center justify-center">
                      <Trophy className="w-8 h-8 text-yellow-400" />
                    </div>

                    <div className="text-center">
                      <h4 className="text-lg font-semibold text-red-400">{fight.fighter2.name}</h4>
                      <p className="text-gray-400">{fight.fighter2.record}</p>
                      <p className="text-red-400 font-semibold mt-2">{fight.fighter2.result}</p>
                    </div>
                  </div>

                  <div className="bg-gray-800/30 rounded-lg p-4 text-center">
                    <p className="text-white font-semibold">{fight.method}</p>
                    <p className="text-gray-400 mt-2">{fight.analysis}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Fights;
