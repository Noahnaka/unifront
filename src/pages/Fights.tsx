import React, { useState } from 'react';
import { Calendar, Clock, Trophy, Target, TrendingUp, Users, Filter } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

const Fights = () => {
  const [activeTab, setActiveTab] = useState('upcoming');
  const navigate = useNavigate();

  const { data: eventsData, isLoading } = useQuery({
    queryKey: ['events'],
    queryFn: async () => {
      const response = await fetch('http://localhost:3000/api/ufc/eventos');
      const data = await response.json();
      console.log('Events data:', data);
      return data;
    }
  });

  const fights = {
    upcoming: eventsData?.data?.map(event => {
      const fights = JSON.parse(event.lutas_evento);
      return fights.map(fight => ({
        id: `${event.id_evento}-${fight.id}`,
        fighter1: { 
          name: fight.redFighter, 
          record: '0-0-0', // This would come from the API
          rank: '#1', 
          avatar: '/lovable-uploads/ef213dba-e1b7-4b1c-a649-99c8e1860342.png' 
        },
        fighter2: { 
          name: fight.blueFighter, 
          record: '0-0-0', // This would come from the API
          rank: '#2', 
          avatar: '/lovable-uploads/ef213dba-e1b7-4b1c-a649-99c8e1860342.png' 
        },
        event: event.nome_evento,
        date: event.created_at,
        time: '22:00', // This would come from the API
        weightClass: fight.weightClass,
        title: fight.title || 'Luta Principal',
        odds: { fighter1: 1.85, fighter2: 2.10 }, // This would come from the API
        analysis: 'Análise detalhada da luta'
      }));
    }).flat() || [],
    live: [], // This would come from a live events API
    finished: [] // This would come from a past events API
  };

  const tabs = [
    { id: 'upcoming', label: 'Próximas', icon: Calendar },
  ];

  return (
    <div className="min-h-screen pt-16 bg-gradient-to-br from-black via-gray-900 to-red-950">
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
              {isLoading ? (
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto"></div>
                  <p className="text-gray-400 mt-4">Carregando lutas...</p>
                </div>
              ) : fights.upcoming.length === 0 ? (
                <div className="text-center py-16">
                  <Trophy className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-400 mb-2">Nenhuma luta encontrada</h3>
                  <p className="text-gray-500">Não há lutas programadas no momento</p>
                </div>
              ) : (
                fights.upcoming.map((fight) => (
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
                          <div className="absolute -top-2 -right-2 bg-red-600 text-white text-xs px-2 py-1 rounded-full">
                            {fight.fighter1.rank}
                          </div>
                        </div>
                        <h4 className="text-lg font-semibold text-white mb-2">{fight.fighter1.name}</h4>
                        <div className="bg-gray-800/30 rounded-lg p-3">
                          <div className="text-sm text-gray-400">Red Corner</div>
                          <div className="text-red-400 font-semibold mt-1">Desafiante</div>
                        </div>
                      </div>

                      {/* VS */}
                      <div className="flex items-center justify-center">
                        <div className="text-center">
                          <div className="text-4xl font-bold text-gradient mb-2">VS</div>
                          <div className="bg-gray-800/30 rounded-lg p-3">
                            <div className="text-sm text-gray-400">Categoria</div>
                            <div className="text-white font-semibold mt-1">{fight.weightClass}</div>
                          </div>
                        </div>
                      </div>

                      {/* Fighter 2 */}
                      <div className="text-center">
                        <div className="relative mb-4">
                          <div className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
                            {fight.fighter2.rank}
                          </div>
                        </div>
                        <h4 className="text-lg font-semibold text-white mb-2">{fight.fighter2.name}</h4>
                        <div className="bg-gray-800/30 rounded-lg p-3">
                          <div className="text-sm text-gray-400">Blue Corner</div>
                          <div className="text-blue-400 font-semibold mt-1">Campeão</div>
                        </div>
                      </div>
                    </div>

                    {/* Analysis */}
                    <div className="bg-gray-800/30 rounded-lg p-4 mb-4">
                      <h5 className="text-white font-semibold mb-2">Análise</h5>
                      <p className="text-gray-400">{fight.analysis}</p>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-4 mb-6">
                      <div className="bg-gray-800/30 rounded-lg p-3 text-center">
                        <div className="text-gray-400 text-sm">Rounds</div>
                        <div className="text-white font-semibold mt-1">
                          {fights.upcoming.indexOf(fight) <= 1 ? '5' : '3'}
                        </div>
                      </div>
                      <div className="bg-gray-800/30 rounded-lg p-3 text-center">
                        <div className="text-gray-400 text-sm">Duração</div>
                        <div className="text-white font-semibold mt-1">
                          {fights.upcoming.indexOf(fight) <= 1 ? '25 min' : '15 min'}
                        </div>
                      </div>
                      <div className="bg-gray-800/30 rounded-lg p-3 text-center">
                        <div className="text-gray-400 text-sm">Título</div>
                        <div className="text-white font-semibold mt-1">
                          {fight.weightClass}
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex justify-center w-full">
                      <button 
                        onClick={() => navigate('/aposta', { 
                          state: { 
                            fight: {
                              id: fight.id,
                              fighter1: fight.fighter1.name,
                              fighter2: fight.fighter2.name,
                              weightClass: fight.weightClass,
                              event: fight.event,
                              date: fight.date,
                              time: fight.time,
                              rounds: fights.upcoming.indexOf(fight) <= 1 ? 5 : 3,
                              duration: fights.upcoming.indexOf(fight) <= 1 ? '25 min' : '15 min'
                            }
                          }
                        })}
                        className="w-full max-w-xl py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-300 font-medium"
                      >
                        Apostar Agora
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Live Fights */}
          {activeTab === 'live' && (
            <div className="space-y-6">
              {fights.live.length === 0 ? (
                <div className="text-center py-16">
                  <Target className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-400 mb-2">Nenhuma luta ao vivo</h3>
                  <p className="text-gray-500">Não há lutas acontecendo no momento</p>
                </div>
              ) : (
                fights.live.map((fight) => (
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
                        <h4 className="text-lg font-semibold text-white mb-2">{fight.fighter1.name}</h4>
                        <div className="bg-gray-800/30 rounded-lg p-3">
                          <div className="text-sm text-gray-400">Red Corner</div>
                          <div className="text-red-400 font-semibold mt-1">Desafiante</div>
                        </div>
                      </div>

                      <div className="flex items-center justify-center">
                        <div className="text-center">
                          <div className="text-4xl font-bold text-red-400 mb-2 animate-pulse">LIVE</div>
                          <div className="bg-gray-800/30 rounded-lg p-3">
                            <div className="text-sm text-gray-400">Categoria</div>
                            <div className="text-white font-semibold mt-1">{fight.weightClass}</div>
                          </div>
                        </div>
                      </div>

                      <div className="text-center">
                        <h4 className="text-lg font-semibold text-white mb-2">{fight.fighter2.name}</h4>
                        <div className="bg-gray-800/30 rounded-lg p-3">
                          <div className="text-sm text-gray-400">Blue Corner</div>
                          <div className="text-blue-400 font-semibold mt-1">Campeão</div>
                        </div>
                      </div>
                    </div>

                    {/* Live Stats */}
                    <div className="grid grid-cols-3 gap-4 mb-6">
                      <div className="bg-gray-800/30 rounded-lg p-3 text-center">
                        <div className="text-gray-400 text-sm">Round Atual</div>
                        <div className="text-white font-semibold mt-1">{fight.round}</div>
                      </div>
                      <div className="bg-gray-800/30 rounded-lg p-3 text-center">
                        <div className="text-gray-400 text-sm">Tempo Restante</div>
                        <div className="text-white font-semibold mt-1">{fight.timeLeft}</div>
                      </div>
                      <div className="bg-gray-800/30 rounded-lg p-3 text-center">
                        <div className="text-gray-400 text-sm">Categoria</div>
                        <div className="text-white font-semibold mt-1">{fight.weightClass}</div>
                      </div>
                    </div>

                    <button className="w-full py-4 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-300 font-bold text-lg pulse-red">
                      ASSISTIR AO VIVO
                    </button>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Finished Fights */}
          {activeTab === 'finished' && (
            <div className="space-y-6">
              {fights.finished.length === 0 ? (
                <div className="text-center py-16">
                  <Trophy className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-400 mb-2">Nenhuma luta finalizada</h3>
                  <p className="text-gray-500">Não há resultados disponíveis no momento</p>
                </div>
              ) : (
                fights.finished.map((fight) => (
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
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Fights;
