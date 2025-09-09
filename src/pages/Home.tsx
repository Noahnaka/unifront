import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Trophy, Target, TrendingUp, Users, Star } from 'lucide-react';
import { useQuery, useQueries } from '@tanstack/react-query';

const Home = () => {
  const token = localStorage.getItem('token');

  const { data: eventsData, isLoading: isLoadingEvents } = useQuery<any>({
    queryKey: ['events'],
    queryFn: async () => {
      const response = await fetch('http://localhost:3000/api/ufc/eventos');
      const data = await response.json();
      console.log('Events data:', data);
      return data;
    }
  });

  const { data: statsData, isLoading: isLoadingStats } = useQuery({
    queryKey: ['stats'],
    queryFn: async () => {
      const response = await fetch('http://localhost:3000/api/ufc/payload');
      const data = await response.json();
      return data;
    }
  });

  const stats = [
    { 
      label: 'Usuários Ativos', 
      value: statsData?.data?.total_usuarios?.toString() || '0', 
      color: 'text-blue-400' 
    },
    { 
      label: 'Apostas Hoje', 
      value: statsData?.data?.total_apostas?.toString() || '0', 
      color: 'text-yellow-400' 
    },
  ];

  // Fetch fights for each event using useQueries
  const eventList = eventsData?.data || [];
  const fightsQueries = useQueries({
    queries: eventList.map((event: any) => ({
      queryKey: ['fights', event.id_evento],
      queryFn: async () => {
        const response = await fetch(`http://localhost:3000/api/ufc/fights/${event.id_evento}`);
        const data = await response.json();
        return data;
      },
      enabled: !!event.id_evento
    }))
  });

  const featuredEvents = eventList.map((event, idx) => {
    const fightsData = (fightsQueries[idx] && 'data' in fightsQueries[idx] && (fightsQueries[idx] as any).data) ? (fightsQueries[idx] as any).data : undefined;
    const isLoadingFights = fightsQueries[idx]?.isLoading;
    const fights = fightsData?.data || [];
    const mainEvent = fights[0];
    return {
      id: event.id_evento,
      title: event.nome_evento,
      date: new Date(event.created_at).toLocaleDateString('pt-BR'),
      location: event.local_evento,
      fighters: mainEvent ? [mainEvent.red_fighter, mainEvent.blue_fighter] : ['TBD', 'TBD'],
      odds: { fighter1: 1.85, fighter2: 2.10 },
      image: '/lovable-uploads/ef213dba-e1b7-4b1c-a649-99c8e1860342.png',
      weightClass: mainEvent?.categoria || 'TBD',
      status: event.status_evento,
      isLoadingFights
    };
  });

  return (
    <div className="min-h-screen pt-16">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-red-950 opacity-90"></div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="space-y-8 animate-in fade-in duration-1000">
            <h1 className="text-4xl sm:text-6xl md:text-8xl font-bold leading-tight">
              <span className="block text-white">APOSTE NA</span>
              <span className="block text-gradient text-5xl sm:text-7xl md:text-9xl">VITÓRIA</span>
            </h1>
            
            <p className="text-base sm:text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto px-2">
              A plataforma mais completa para apostas em artes marciais. 
              Análises profissionais, odds competitivas e transmissões ao vivo.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              {!token && (
                <Link
                  to="/register"
                  className="px-8 py-4 bg-red-600 text-white text-lg font-semibold rounded-lg hover:bg-red-700 transition-all duration-300 hover:shadow-lg transform hover:scale-105"
                >
                  Comece a Apostar
                </Link>
              )}
              <Link
                to="/fights"
                className="px-8 py-4 border-2 border-gray-600 text-gray-300 text-lg font-semibold rounded-lg hover:border-red-500 hover:text-red-400 transition-all duration-300"
              >
                Ver Eventos
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 sm:gap-6 mt-10 sm:mt-16 max-w-2xl mx-auto">
              {isLoadingStats ? (
                <>
                  <div className="glass-card p-6 text-center hover-lift animate-pulse">
                    <div className="h-8 bg-gray-700 rounded mb-2"></div>
                    <div className="h-4 bg-gray-700 rounded w-24 mx-auto"></div>
                  </div>
                  <div className="glass-card p-6 text-center hover-lift animate-pulse">
                    <div className="h-8 bg-gray-700 rounded mb-2"></div>
                    <div className="h-4 bg-gray-700 rounded w-24 mx-auto"></div>
                  </div>
                </>
              ) : (
                stats.map((stat, index) => (
                  <div key={index} className="glass-card p-6 text-center hover-lift">
                    <div className={`text-3xl font-bold ${stat.color} mb-2`}>
                      {stat.value}
                    </div>
                    <div className="text-gray-400 text-sm">{stat.label}</div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Featured Events */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-2xl sm:text-4xl font-bold text-white mb-2 sm:mb-4">Próximos Eventos</h2>
            <p className="text-gray-400 text-base sm:text-lg px-2">Não perca as melhores lutas e oportunidades de apostas</p>
          </div>

          <div className={`grid gap-6 sm:gap-8 ${
            featuredEvents.length === 1 
              ? 'max-w-2xl mx-auto' 
              : 'md:grid-cols-2'
          }`}>
            {isLoadingEvents ? (
              <div className="text-center col-span-2">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto"></div>
                <p className="text-gray-400 mt-4">Carregando eventos...</p>
              </div>
            ) : (
              featuredEvents.map((event) => (
                <div key={event.id} className="glass-card p-6 hover-lift animated-border">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h4 className="text-xl font-semibold text-white mb-2">{event.title}</h4>
                      <div className="flex items-center space-x-4 text-gray-400">
                        <span className="flex items-center space-x-1">
                          <Calendar className="w-4 h-4" />
                          <span>{event.date}</span>
                        </span>
                        <span>{event.location}</span>
                      </div>
                    </div>
                    <div className="bg-red-500/20 border border-red-500/50 text-red-400 px-3 py-1 rounded-full text-sm font-medium">
                      Main Event
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-6">
                    <div className="text-center">
                      <div className="text-lg font-semibold text-white">{event.fighters[0]}</div>
                      <div className="text-gray-400 text-sm mt-1">Red Corner</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-semibold text-white">{event.fighters[1]}</div>
                      <div className="text-gray-400 text-sm mt-1">Blue Corner</div>
                    </div>
                  </div>

                  <div className="bg-gray-800/30 rounded-lg p-3 mb-6 text-sm sm:text-base">
                    <div className="text-center">
                      <div className="text-gray-400 text-sm">Weight Class</div>
                      <div className="text-white font-semibold mt-1">{event.weightClass || 'N/A'}</div>
                    </div>
                  </div>

                  {event.isLoadingFights ? (
                    <div className="block w-full py-3 bg-gray-700 text-gray-400 text-center rounded-lg opacity-60 animate-pulse">Carregando luta principal...</div>
                  ) : event.status === 1 ? (
                    <Link
                      to={token ? `/fights` : `/login`}
                      className="block w-full py-3 bg-red-600 text-white text-center rounded-lg hover:bg-red-700 transition-colors duration-300 font-medium"
                    >
                      Ver Detalhes
                    </Link>
                  ) : (
                    <button disabled className="block w-full py-3 bg-gray-700 text-gray-400 text-center rounded-lg cursor-not-allowed opacity-60 text-sm sm:text-base" title="Evento indisponível">Indisponível</button>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-black/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-2xl sm:text-4xl font-bold text-white mb-2 sm:mb-4">Por que escolher UNIBET?</h2>
            <p className="text-gray-400 text-base sm:text-lg">A experiência de apostas mais completa do mercado</p>
          </div>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
            <div className="glass-card p-8 text-center hover-lift">
              <Trophy className="w-12 h-12 text-red-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-3">Odds Competitivas</h3>
              <p className="text-gray-400">As melhores cotações do mercado para maximizar seus ganhos</p>
            </div>

            <div className="glass-card p-8 text-center hover-lift">
              <Target className="w-12 h-12 text-red-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-3">Análises Profissionais</h3>
              <p className="text-gray-400">Relatórios detalhados e estatísticas para decisões informadas</p>
            </div>

            <div className="glass-card p-8 text-center hover-lift">
              <Users className="w-12 h-12 text-red-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-3">Comunidade Ativa</h3>
              <p className="text-gray-400">Participe de discussões e compartilhe estratégias</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-4xl font-bold text-white mb-2 sm:mb-4">Pronto para começar?</h2>
          <p className="text-gray-400 text-base sm:text-lg mb-6 sm:mb-8 px-2">
            Junte-se a milhares de apostadores que já confiam na UNIBET
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {!token && (
              <Link
                to="/register"
                className="px-8 py-4 bg-red-600 text-white text-lg font-semibold rounded-lg hover:bg-red-700 transition-all duration-300 hover:shadow-lg transform hover:scale-105"
              >
                Criar Conta Grátis
              </Link>
            )}
            <Link
              to="/leaderboard"
              className="px-8 py-4 border-2 border-gray-600 text-gray-300 text-lg font-semibold rounded-lg hover:border-red-500 hover:text-red-400 transition-all duration-300"
            >
              Ver Ranking
            </Link>
          </div>
        </div>
      </section>

      {/* Premium Section */}
      {token && localStorage.getItem('acesso') !== 'premium' && (
        <section className="py-20 bg-black/30">
          <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl sm:text-4xl font-bold text-white mb-2 sm:mb-4">Deseja melhorar suas apostas?</h2>
            <p className="text-gray-400 text-base sm:text-lg mb-6 sm:mb-8">
              Vire membro Premium da UNIBET
            </p>
            
            <div className="flex justify-center">
              <Link
                to="/premium"
                className="px-8 py-4 border-2 border-gray-600 text-gray-300 text-lg font-semibold rounded-lg hover:border-red-500 hover:text-red-400 transition-all duration-300"
              >
                Ver Detalhes
              </Link>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default Home;
