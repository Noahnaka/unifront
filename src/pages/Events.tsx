import React, { useState } from 'react';
import { Calendar, MapPin, Clock, Trophy, Filter, Search } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';

const Events = () => {
  const [filter, setFilter] = useState('todos');
  const [searchTerm, setSearchTerm] = useState('');

  const { data: eventsData, isLoading } = useQuery({
    queryKey: ['events'],
    queryFn: async () => {
      const response = await fetch('http://localhost:3000/api/ufc/eventos');
      const data = await response.json();
      console.log('Events data:', data);
      return data;
    }
  });

  const events = eventsData?.data?.map(event => {
    const fights = JSON.parse(event.lutas_evento);
    const mainEvent = fights[0]; // First fight is usually the main event
    
    return {
      id: event.id_evento,
      title: event.nome_evento,
      date: event.created_at,
      time: '22:00', // This would come from the API
      location: event.local_evento,
      category: 'UFC',
      status: 'upcoming',
      mainEvent: `${mainEvent.redFighter} vs ${mainEvent.blueFighter}`,
      image: '/lovable-uploads/ef213dba-e1b7-4b1c-a649-99c8e1860342.png',
      fights: fights.length,
      viewers: '2.1M esperados'
    };
  }) || [];

  const categories = ['todos', 'UFC'];
  const statusMap = {
    upcoming: { label: 'Próximo', color: 'bg-blue-500' },
    live: { label: 'AO VIVO', color: 'bg-red-500 animate-pulse' },
    finished: { label: 'Finalizado', color: 'bg-gray-500' }
  };

  const filteredEvents = events.filter(event => {
    const matchesCategory = filter === 'todos' || event.category === filter;
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.mainEvent.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen pt-16 bg-gradient-to-br from-black via-gray-900 to-red-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-gradient mb-4">Eventos</h1>
          <p className="text-gray-400 text-lg">Acompanhe todas as lutas e eventos de MMA</p>
        </div>

        {/* Filters */}
        <div className="mb-8 space-y-4">
          {/* Search */}
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Buscar eventos ou lutadores..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-white placeholder-gray-400 transition-all duration-300"
            />
          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap justify-center gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setFilter(category)}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                  filter === category
                    ? 'bg-red-600 text-white neon-glow'
                    : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Events Grid */}
        <div className="grid lg:grid-cols-2 gap-8">
          {isLoading ? (
            <div className="text-center col-span-2">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto"></div>
              <p className="text-gray-400 mt-4">Carregando eventos...</p>
            </div>
          ) : (
            filteredEvents.map((event) => (
              <div key={event.id} className="glass-card p-6 hover-lift animated-border">
                {/* Event Header */}
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center space-x-2 mb-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold text-white ${statusMap[event.status as keyof typeof statusMap].color}`}>
                        {statusMap[event.status as keyof typeof statusMap].label}
                      </span>
                      <span className="text-gray-400 text-sm">{event.category}</span>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">{event.title}</h3>
                    <p className="text-red-400 font-semibold">{event.mainEvent}</p>
                  </div>
                  <Trophy className="w-8 h-8 text-yellow-400" />
                </div>

                {/* Event Details */}
                <div className="space-y-3 mb-6">
                  <div className="flex items-center space-x-2 text-gray-400">
                    <Calendar className="w-4 h-4" />
                    <span>{new Date(event.date).toLocaleDateString('pt-BR')}</span>
                    <Clock className="w-4 h-4 ml-4" />
                    <span>{event.time}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-400">
                    <MapPin className="w-4 h-4" />
                    <span>{event.location}</span>
                  </div>
                </div>

                {/* Event Stats */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-gray-800/30 rounded-lg p-3 text-center">
                    <div className="text-2xl font-bold text-white">{event.fights}</div>
                    <div className="text-gray-400 text-sm">Lutas</div>
                  </div>
                  <div className="bg-gray-800/30 rounded-lg p-3 text-center">
                    <div className="text-sm font-semibold text-blue-400">{event.viewers}</div>
                    <div className="text-gray-400 text-sm">Espectadores</div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-3">
                  <button className="py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-300 font-medium">
                    {event.status === 'live' ? 'Assistir Agora' : event.status === 'finished' ? 'Ver Resultados' : 'Apostar'}
                  </button>
                  <button className="py-3 border border-gray-600 text-gray-300 rounded-lg hover:border-red-500 hover:text-red-400 transition-all duration-300 font-medium">
                    Detalhes
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* No Results */}
        {!isLoading && filteredEvents.length === 0 && (
          <div className="text-center py-16">
            <Trophy className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-400 mb-2">Nenhum evento encontrado</h3>
            <p className="text-gray-500">Tente ajustar os filtros ou termo de busca</p>
          </div>
        )}

        {/* Load More */}
        {!isLoading && filteredEvents.length > 0 && (
          <div className="text-center mt-12">
            <button className="px-8 py-3 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 hover:text-white transition-all duration-300 font-medium">
              Carregar Mais Eventos
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Events;
