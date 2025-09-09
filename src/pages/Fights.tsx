import React, { useState, useEffect, useRef } from 'react';
import { Calendar, Clock, Trophy, Target, TrendingUp, Users, Filter } from 'lucide-react';
import { useQuery, useQueries } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

const Fights = () => {
  const [activeTab, setActiveTab] = useState('upcoming');
  const navigate = useNavigate();
  const [userBets, setUserBets] = useState<any[]>([]);
  const [fightOdds, setFightOdds] = useState<any>({});
  const [isPremium, setIsPremium] = useState(false);

  useEffect(() => {
    // Check premium status
    setIsPremium(localStorage.getItem('acesso') === 'premium');
  }, []);

  useEffect(() => {
    const fetchUserBets = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;
        const payload = await fetch('http://localhost:3000/api/token/conta/cliente', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });
        const data = await payload.json();
        const id_cliente = data.payload.id_cliente;
        const betsResponse = await fetch(`http://localhost:3000/api/ufc/user/bets?id_cliente=${id_cliente}`);
        const betsData = await betsResponse.json();
        setUserBets(betsData.data || []);
        console.log('User bets:', betsData);
      } catch (err) {
        console.error('Erro ao buscar apostas do usuário:', err);
      }
    };
    fetchUserBets();
  }, []);

  const { data: eventsData, isLoading: isLoadingEvents } = useQuery<any>({
    queryKey: ['events'],
    queryFn: async () => {
      const response = await fetch('http://localhost:3000/api/ufc/eventos');
      const data = await response.json();
      return data;
    }
  });

  const activeEvents = eventsData?.data?.filter((event: any) => event.status_evento === 1) || [];

  const fightsQueries = useQueries({
    queries: activeEvents.map((event: any) => ({
      queryKey: ['fights', event.id_evento],
      queryFn: async () => {
        const response = await fetch(`http://localhost:3000/api/ufc/fights/${event.id_evento}`);
        const data = await response.json();
        return data;
      },
      enabled: !!event.id_evento
    }))
  });

  // Group fights by event
  const fightsByEvent = activeEvents.map((event: any, idx: number) => {
    const fightsData = (fightsQueries[idx] && 'data' in fightsQueries[idx] && (fightsQueries[idx] as any).data) ? (fightsQueries[idx] as any).data : undefined;
    const isLoadingFights = fightsQueries[idx]?.isLoading;
    const fights = fightsData?.data || [];
    return {
      event,
      isLoadingFights,
      fights: fights.map((fight: any) => ({
        id: `${event.id_evento}-${fight.id_luta}`,
        id_luta: fight.id_luta,
        fighter1: {
          name: fight.red_fighter,
          record: '0-0-0',
          rank: '#1',
          avatar: '/lovable-uploads/ef213dba-e1b7-4b1c-a649-99c8e1860342.png'
        },
        fighter2: {
          name: fight.blue_fighter,
          record: '0-0-0',
          rank: '#2',
          avatar: '/lovable-uploads/ef213dba-e1b7-4b1c-a649-99c8e1860342.png'
        },
        event: event.nome_evento,
        date: event.created_at,
        time: '22:00',
        weightClass: fight.categoria,
        title: fight.titulo || 'Luta Principal',
        odds: { fighter1: 1.85, fighter2: 2.10 },
        analysis: 'Análise detalhada da luta'
      }))
    };
  });

  const fetchedOddsRef = useRef<Set<string | number>>(new Set());

  useEffect(() => {
    fightsByEvent.forEach(({ fights }) => {
      fights.forEach((fight: any) => {
        const fightId = fight.id_luta;
        if (!fetchedOddsRef.current.has(fightId)) {
          fetchedOddsRef.current.add(fightId);
          fetch(`http://localhost:3000/api/ufc/lutas/odds/${fightId}`)
            .then(res => res.json())
            .then(data => {
              const items = Array.isArray(data) ? data : (Array.isArray(data?.data) ? data.data : []);
              const redCount = items.filter((b: any) => b.vencedor === 'redFighter').length;
              const blueCount = items.filter((b: any) => b.vencedor === 'blueFighter').length;
              setFightOdds((prev: any) => ({
                ...prev,
                [fightId]: { redCount, blueCount }
              }));
            })
            .catch(err => {
              console.error('Erro ao buscar odds da luta', fightId, err);
            });
        }
      });
    });
  }, [fightsByEvent]);

  const fights = {
    upcoming: fightsByEvent.flatMap(e => e.fights),
    live: [],
    finished: []
  };

  const tabs = [
    { id: 'upcoming', label: 'Próximas', icon: Calendar },
  ];

  return (
    <div className="min-h-screen pt-16 bg-gradient-to-br from-black via-gray-900 to-red-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8 md:mb-12">
          <h1 className="text-3xl md:text-6xl font-bold text-gradient mb-3 md:mb-4">Lutas</h1>
          <p className="text-gray-400 text-base md:text-lg">Acompanhe todas as lutas com análises detalhadas</p>
        </div>

        {/* Tabs */}
        <div className="flex justify-center mb-8">
          <div className="glass-card p-1 sm:p-2 flex space-x-1 sm:space-x-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg font-medium transition-all duration-300 ${
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
            <div className="space-y-12">
              {isLoadingEvents ? (
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto"></div>
                  <p className="text-gray-400 mt-4">Carregando lutas...</p>
                </div>
              ) : fightsByEvent.length === 0 ? (
                <div className="text-center py-12 sm:py-16">
                  <Trophy className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-400 mb-2">Nenhuma luta encontrada</h3>
                  <p className="text-gray-500">Não há lutas programadas no momento</p>
                </div>
              ) : (
                fightsByEvent.map(({ event, isLoadingFights, fights }) => (
                  <div key={event.id_evento}>
                    <div className="mb-6">
                      <h2 className="text-2xl font-bold text-white mb-1">{event.nome_evento}</h2>
                      <div className="flex items-center space-x-4 text-gray-400 text-sm">
                        <span className="flex items-center space-x-1">
                          <Calendar className="w-4 h-4" />
                          <span>{new Date(event.data_evento).toLocaleDateString('pt-BR')}</span>
                        </span>
                        <span>{event.local_evento}</span>
                      </div>
                    </div>
                    {isLoadingFights ? (
                      <div className="text-center py-6 sm:py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500 mx-auto mb-4"></div>
                        <p className="text-gray-400">Carregando lutas deste evento...</p>
                      </div>
                    ) : fights.filter(fight => !userBets.some(bet => bet.id_luta === fight.id_luta)).length === 0 ? (
                      <div className="text-center py-8">
                        <Trophy className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                        <p className="text-gray-400 mb-3">Nenhuma luta cadastrada para este evento</p>
                      </div>
                    ) : (
                      fights.filter(fight => !userBets.some(bet => bet.id_luta === fight.id_luta)).map((fight) => (
                        <div key={fight.id} className="glass-card p-4 sm:p-6 hover-lift animated-border mb-8">
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
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mb-6">
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
                                <div className="text-red-400 font-semibold mt-1">redFighter</div>
                              </div>
                              <div className="mt-2">
                                {fightOdds[fight.id_luta]
                                  ? (
                                    fightOdds[fight.id_luta].redCount === fightOdds[fight.id_luta].blueCount
                                      ? (
                                        <span className="inline-block px-2 py-1 rounded-full text-xs font-semibold border border-gray-600 text-gray-300 bg-gray-700">
                                          -
                                        </span>
                                      )
                                      : (
                                        fightOdds[fight.id_luta].redCount > fightOdds[fight.id_luta].blueCount
                                          ? (
                                            <span className="inline-block px-2 py-1 rounded-full text-xs font-semibold border border-green-600/30 text-green-400 bg-green-600/20">
                                              Favorite
                                            </span>
                                          )
                                          : (
                                            <span className="inline-block px-2 py-1 rounded-full text-xs font-semibold border border-yellow-600/30 text-yellow-400 bg-yellow-600/20">
                                              Underdog
                                            </span>
                                          )
                                      )
                                  )
                                  : (
                                    <span className="inline-block px-2 py-1 rounded-full text-xs font-semibold border border-gray-600 text-gray-300 bg-gray-700">
                                      -
                                    </span>
                                  )}
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
                                <div className="text-blue-400 font-semibold mt-1">blueFighter</div>
                              </div>
                              <div className="mt-2">
                                {fightOdds[fight.id_luta]
                                  ? (
                                    fightOdds[fight.id_luta].redCount === fightOdds[fight.id_luta].blueCount
                                      ? (
                                        <span className="inline-block px-2 py-1 rounded-full text-xs font-semibold border border-gray-600 text-gray-300 bg-gray-700">
                                          -
                                        </span>
                                      )
                                      : (
                                        fightOdds[fight.id_luta].blueCount > fightOdds[fight.id_luta].redCount
                                          ? (
                                            <span className="inline-block px-2 py-1 rounded-full text-xs font-semibold border border-green-600/30 text-green-400 bg-green-600/20">
                                              Favorite
                                            </span>
                                          )
                                          : (
                                            <span className="inline-block px-2 py-1 rounded-full text-xs font-semibold border border-yellow-600/30 text-yellow-400 bg-yellow-600/20">
                                              Underdog
                                            </span>
                                          )
                                      )
                                  )
                                  : (
                                    <span className="inline-block px-2 py-1 rounded-full text-xs font-semibold border border-gray-600 text-gray-300 bg-gray-700">
                                      -
                                    </span>
                                  )}
                              </div>
                            </div>
                          </div>
                          {/* Analysis */}
                          <div className="bg-gray-800/30 rounded-lg p-3 sm:p-4 mb-4">
                            <h5 className="text-white font-semibold mb-2">Análise</h5>
                            <p className="text-gray-400">{fight.analysis}</p>
                          </div>
                          {/* Stats */}
                          <div className="grid grid-cols-3 gap-3 sm:gap-4 mb-6">
                            <div className="bg-gray-800/30 rounded-lg p-2.5 sm:p-3 text-center">
                              <div className="text-gray-400 text-sm">Rounds</div>
                              <div className="text-white font-semibold mt-1">
                                {fights.indexOf(fight) <= 1 ? '5' : '3'}
                              </div>
                            </div>
                            <div className="bg-gray-800/30 rounded-lg p-2.5 sm:p-3 text-center">
                              <div className="text-gray-400 text-sm">Duração</div>
                              <div className="text-white font-semibold mt-1">
                                {fights.indexOf(fight) <= 1 ? '25 min' : '15 min'}
                              </div>
                            </div>
                            <div className="bg-gray-800/30 rounded-lg p-2.5 sm:p-3 text-center">
                              <div className="text-gray-400 text-sm">Título</div>
                              <div className="text-white font-semibold mt-1">
                                {fight.weightClass}
                              </div>
                            </div>
                          </div>
                          {/* Actions */}
                          <div className="relative w-full">
                            {isPremium && (
                              <button
                                onClick={() => navigate('/analise-avancada', {
                                  state: {
                                    fight: {
                                      id: fight.id,
                                      id_evento: event.id_evento,
                                      id_luta: fight.id_luta,
                                      fighter1: fight.fighter1.name,
                                      fighter2: fight.fighter2.name,
                                      weightClass: fight.weightClass,
                                      event: fight.event,
                                      date: fight.date,
                                      time: fight.time,
                                      rounds: fights.indexOf(fight) <= 1 ? 5 : 3,
                                      duration: fights.indexOf(fight) <= 1 ? '25 min' : '15 min'
                                    }
                                  }
                                })}
                                className="absolute left-0 bottom-0 px-4 py-2 bg-gradient-to-r from-amber-400 via-yellow-500 to-orange-500 text-white rounded-lg hover:from-amber-300 hover:via-yellow-400 hover:to-orange-400 transition-all duration-500 font-medium text-sm shadow-lg hover:shadow-xl border border-amber-300/40 hover:border-amber-200/60"
                              >
                                Análise Avançada
                              </button>
                            )}
                            <div className="flex justify-center w-full">
                              <button
                                onClick={() => navigate('/aposta', {
                                  state: {
                                    fight: {
                                      id: fight.id,
                                      id_evento: event.id_evento, // Pass the event ID
                                      id_luta: fight.id_luta,
                                      fighter1: fight.fighter1.name,
                                      fighter2: fight.fighter2.name,
                                      weightClass: fight.weightClass,
                                      event: fight.event,
                                      date: fight.date,
                                      time: fight.time,
                                      rounds: fights.indexOf(fight) <= 1 ? 5 : 3,
                                      duration: fights.indexOf(fight) <= 1 ? '25 min' : '15 min'
                                    }
                                  }
                                })}
                                className="w-full max-w-xl py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-300 font-medium"
                              >
                                Apostar Agora
                              </button>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
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
