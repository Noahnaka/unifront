
import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Trophy, Target, TrendingUp, Users, Star } from 'lucide-react';

const Home = () => {
  const stats = [
    { label: 'Vitórias', value: '22', color: 'text-green-400' },
    { label: 'Nocautes', value: '15', color: 'text-red-400' },
    { label: 'Usuários Ativos', value: '12.5K', color: 'text-blue-400' },
    { label: 'Apostas Hoje', value: '1.2M', color: 'text-yellow-400' },
  ];

  const featuredEvents = [
    {
      id: 1,
      title: 'UFC 300',
      date: '24 de Abril',
      location: 'Univap',
      fighters: ['Jon Jones', 'Stipe Miocic'],
      odds: { fighter1: 1.85, fighter2: 2.10 },
      image: '/lovable-uploads/ef213dba-e1b7-4b1c-a649-99c8e1860342.png'
    },
    {
      id: 2,
      title: 'Bellator Championship',
      date: '1 de Maio',
      location: 'São Paulo',
      fighters: ['Patricio Freire', 'Adam Borics'],
      odds: { fighter1: 1.65, fighter2: 2.35 },
      image: '/lovable-uploads/ef213dba-e1b7-4b1c-a649-99c8e1860342.png'
    },
  ];

  return (
    <div className="min-h-screen pt-16">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-red-950 opacity-90"></div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="space-y-8 animate-in fade-in duration-1000">
            <h1 className="text-6xl md:text-8xl font-bold leading-tight">
              <span className="block text-white">APOSTE NA</span>
              <span className="block text-gradient text-7xl md:text-9xl">VITÓRIA</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto">
              A plataforma mais completa para apostas em artes marciais. 
              Análises profissionais, odds competitivas e transmissões ao vivo.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                to="/register"
                className="px-8 py-4 bg-red-600 text-white text-lg font-semibold rounded-lg hover:bg-red-700 transition-all duration-300 hover:shadow-lg transform hover:scale-105"
              >
                Comece a Apostar
              </Link>
              <Link
                to="/events"
                className="px-8 py-4 border-2 border-gray-600 text-gray-300 text-lg font-semibold rounded-lg hover:border-red-500 hover:text-red-400 transition-all duration-300"
              >
                Ver Eventos
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16">
              {stats.map((stat, index) => (
                <div key={index} className="glass-card p-6 text-center hover-lift">
                  <div className={`text-3xl font-bold ${stat.color} mb-2`}>
                    {stat.value}
                  </div>
                  <div className="text-gray-400 text-sm">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Boxing Image */}
       
      </section>

      {/* Featured Events */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Próximos Eventos</h2>
            <p className="text-gray-400 text-lg">Não perca as melhores lutas e oportunidades de apostas</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {featuredEvents.map((event) => (
              <div key={event.id} className="glass-card p-6 hover-lift animated-border">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-2">{event.title}</h3>
                    <div className="flex items-center space-x-4 text-gray-400">
                      <span className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4" />
                        <span>{event.date}</span>
                      </span>
                      <span>{event.location}</span>
                    </div>
                  </div>
                  <div className="text-yellow-400 text-lg font-bold">
                    UFC 300
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="text-center">
                    <div className="text-lg font-semibold text-white">{event.fighters[0]}</div>
                    <div className="text-red-400 text-xl font-bold">{event.odds.fighter1}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-semibold text-white">{event.fighters[1]}</div>
                    <div className="text-red-400 text-xl font-bold">{event.odds.fighter2}</div>
                  </div>
                </div>

                <Link
                  to={`/events/${event.id}`}
                  className="block w-full py-3 bg-red-600 text-white text-center rounded-lg hover:bg-red-700 transition-colors duration-300 font-medium"
                >
                  Ver Detalhes
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-black/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Por que escolher UNIBET?</h2>
            <p className="text-gray-400 text-lg">A experiência de apostas mais completa do mercado</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
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
          <h2 className="text-4xl font-bold text-white mb-4">Pronto para começar?</h2>
          <p className="text-gray-400 text-lg mb-8">
            Junte-se a milhares de apostadores que já confiam na UNIBET
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="px-8 py-4 bg-red-600 text-white text-lg font-semibold rounded-lg hover:bg-red-700 transition-all duration-300 hover:shadow-lg transform hover:scale-105"
            >
              Criar Conta Grátis
            </Link>
            <Link
              to="/leaderboard"
              className="px-8 py-4 border-2 border-gray-600 text-gray-300 text-lg font-semibold rounded-lg hover:border-red-500 hover:text-red-400 transition-all duration-300"
            >
              Ver Ranking
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
