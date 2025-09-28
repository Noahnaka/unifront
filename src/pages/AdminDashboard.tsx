import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, 
  Calendar, 
  Users, 
  TrendingUp, 
  DollarSign, 
  Shield, 
  Crown,
  LogOut,
  Settings,
  BarChart3,
  Activity,
  Target,
  Sparkles,
  X,
  MapPin,
  Clock,
  Swords,
  Eye,
  User,
  Zap
} from 'lucide-react';
import { toast } from 'sonner';

interface Event {
  id_evento: number;
  nome_evento: string;
  local_evento: string;
  data_evento: string;
  created_at: string;
  status_evento: number;
}

interface Fight {
  id_luta: number;
  id_evento: number;
  red_fighter: string;
  blue_fighter: string;
  categoria: string;
  titulo?: string;
  created_at: string;
}

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateEvent, setShowCreateEvent] = useState(false);
  const [showCreateFight, setShowCreateFight] = useState(false);
  const [showEditFight, setShowEditFight] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState<number | null>(null);
  const [selectedFight, setSelectedFight] = useState<Fight | null>(null);
  const [isCreatingEvent, setIsCreatingEvent] = useState(false);
  const [isCreatingFight, setIsCreatingFight] = useState(false);
  const [isUpdatingFight, setIsUpdatingFight] = useState(false);
  const [isDeletingFight, setIsDeletingFight] = useState(false);
  const [events, setEvents] = useState<Event[]>([]);
  const [fights, setFights] = useState<{ [eventId: number]: Fight[] }>({});
  const [isLoadingEvents, setIsLoadingEvents] = useState(true);
  const [isLoadingFights, setIsLoadingFights] = useState<{ [eventId: number]: boolean }>({});
  const [eventForm, setEventForm] = useState({
    nome_evento: '',
    local_evento: '',
    data_evento: ''
  });
  const [fightForm, setFightForm] = useState({
    redFighter: '',
    blueFighter: '',
    weightClass: '',
    title: ''
  });
  const [editFightForm, setEditFightForm] = useState({
    redFighter: '',
    blueFighter: '',
    weightClass: '',
    title: ''
  });
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalBets: 0,
    totalEvents: 0,
    totalRevenue: 0
  });
  const [isUpdatingEventStatus, setIsUpdatingEventStatus] = useState<{ [eventId: number]: boolean }>({});
  const [isDeletingEvent, setIsDeletingEvent] = useState<{ [eventId: number]: boolean }>({});
  const [showCloseEventModal, setShowCloseEventModal] = useState(false);
  const [closeEventFights, setCloseEventFights] = useState<Fight[]>([]);
  const [closeEventId, setCloseEventId] = useState<number | null>(null);
  const [fightResults, setFightResults] = useState<{ [fightId: number]: { winner: string; method: string; round: string } }>({});
  const [isClosingEvent, setIsClosingEvent] = useState(false);
  const [isEndingEvent, setIsEndingEvent] = useState<{ [eventId: number]: boolean }>({});

  const weightClasses = [
    'Flyweight',
    'Bantamweight', 
    'Featherweight',
    'Lightweight',
    'Welterweight',
    'Middleweight',
    'Light Heavyweight',
    'Heavyweight',
    'Women\'s Strawweight',
    'Women\'s Flyweight',
    'Women\'s Bantamweight',
    'Women\'s Featherweight'
  ];

  const finishMethods = [
    'Knockout',
    'Submission',
    'Unanimous Decision',
    'Split Decision',
    'No Contest',
    'Draw'
  ];

  // Check authentication on component mount
  useEffect(() => {
    const adminToken = localStorage.getItem('adminToken');
    if (!adminToken) {
      toast.error('Acesso negado. Faça login como administrador.');
      navigate('/admin');
      return;
    }

    // Fetch stats from payload
    const fetchStats = async () => {
      try {
        const response = await fetch('https://ufc-opal.vercel.app/api/ufc/payload');
        const data = await response.json();
        if (data.status && data.data) {
          setStats(prev => ({
            ...prev,
            totalUsers: data.data.total_usuarios ?? 0,
            totalBets: data.data.total_apostas ?? 0,
            totalRevenue: data.data.total_receita ?? 0 // Only if exists
          }));
        }
      } catch (error) {
        console.error('Erro ao buscar estatísticas:', error);
      }
    };
    fetchStats();

    // Fetch events
    fetchEvents();
    setIsLoading(false);
  }, [navigate]);

  const fetchEvents = async () => {
    try {
      const response = await fetch('https://ufc-opal.vercel.app/api/ufc/eventos');
      const data = await response.json();
      
      if (response.ok && data.status) {
        setEvents(data.data);
        // Fetch fights for each event
        data.data.forEach((event: Event) => {
          fetchFightsForEvent(event.id_evento);
        });
      } else {
        toast.error('Erro ao carregar eventos');
      }
    } catch (error) {
      toast.error('Erro ao conectar com o servidor');
      console.error('Fetch events error:', error);
    } finally {
      setIsLoadingEvents(false);
    }
  };

  const fetchFightsForEvent = async (eventId: number) => {
    try {
      setIsLoadingFights(prev => ({ ...prev, [eventId]: true }));
      const response = await fetch(`https://ufc-opal.vercel.app/api/ufc/fights/${eventId}`);
      const data = await response.json();
      
      if (response.ok && data.status) {
        setFights(prev => ({
          ...prev,
          [eventId]: data.data
        }));
      } else {
        console.error('Error fetching fights for event:', eventId, data.message);
      }
    } catch (error) {
      console.error('Fetch fights error for event:', eventId, error);
    } finally {
      setIsLoadingFights(prev => ({ ...prev, [eventId]: false }));
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('isAdmin');
    toast.success('Logout realizado com sucesso');
    navigate('/admin');
  };

  const handleCreateEvent = () => {
    setShowCreateEvent(true);
  };

  const handleCloseModal = () => {
    setShowCreateEvent(false);
    setEventForm({
      nome_evento: '',
      local_evento: '',
      data_evento: ''
    });
  };

  const handleSubmitEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreatingEvent(true);

    try {
      const adminToken = localStorage.getItem('adminToken');
      const response = await fetch('https://ufc-opal.vercel.app/api/ufc/create/event', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`
        },
        body: JSON.stringify({
          nome_evento: eventForm.nome_evento,
          local_evento: eventForm.local_evento,
          data_evento: eventForm.data_evento
        }),
      });

      const data = await response.json();
      
      if (response.ok) {
        toast.success('Evento criado com sucesso!');
        handleCloseModal();
        // Refresh events and stats
        fetchEvents();
        setStats(prev => ({
          ...prev,
          totalEvents: prev.totalEvents + 1
        }));
      } else {
        toast.error(data.message || 'Erro ao criar evento');
      }
    } catch (error) {
      toast.error('Erro ao conectar com o servidor');
      console.error('Create event error:', error);
    } finally {
      setIsCreatingEvent(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEventForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddFight = (eventId: number) => {
    setSelectedEventId(eventId);
    setShowCreateFight(true);
  };

  const handleCloseFightModal = () => {
    setShowCreateFight(false);
    setSelectedEventId(null);
    setFightForm({
      redFighter: '',
      blueFighter: '',
      weightClass: '',
      title: ''
    });
  };

  const handleFightInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFightForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmitFight = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEventId) return;
    
    setIsCreatingFight(true);

    try {
      const adminToken = localStorage.getItem('adminToken');
      const response = await fetch('https://ufc-opal.vercel.app/api/ufc/create/fight', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`
        },
        body: JSON.stringify({
          id_evento: selectedEventId,
          red_fighter: fightForm.redFighter,
          blue_fighter: fightForm.blueFighter,
          categoria: fightForm.weightClass,
          titulo: fightForm.title || null
        }),
      });

      const data = await response.json();
      
      if (response.ok) {
        toast.success('Luta criada com sucesso!');
        handleCloseFightModal();
        // Refresh fights for this event
        fetchFightsForEvent(selectedEventId);
      } else {
        toast.error(data.message || 'Erro ao criar luta');
      }
    } catch (error) {
      toast.error('Erro ao conectar com o servidor');
      console.error('Create fight error:', error);
    } finally {
      setIsCreatingFight(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getSelectedEventName = () => {
    if (!selectedEventId) return '';
    const event = events.find(e => e.id_evento === selectedEventId);
    return event?.nome_evento || '';
  };

  const getFightsForEvent = (eventId: number): Fight[] => {
    return fights[eventId] || [];
  };

  const isLoadingFightsForEvent = (eventId: number): boolean => {
    return isLoadingFights[eventId] || false;
  };

  const handleEditFight = (fight: Fight) => {
    setSelectedFight(fight);
    setEditFightForm({
      redFighter: fight.red_fighter,
      blueFighter: fight.blue_fighter,
      weightClass: fight.categoria,
      title: fight.titulo || ''
    });
    setShowEditFight(true);
  };

  const handleCloseEditModal = () => {
    setShowEditFight(false);
    setSelectedFight(null);
    setEditFightForm({
      redFighter: '',
      blueFighter: '',
      weightClass: '',
      title: ''
    });
  };

  const handleEditFightInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEditFightForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleUpdateFight = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFight) return;
    
    setIsUpdatingFight(true);

    try {
      const adminToken = localStorage.getItem('adminToken');
      const response = await fetch(`https://ufc-opal.vercel.app/api/ufc/update/fight/${selectedFight.id_luta}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`
        },
        body: JSON.stringify({
          red_fighter: editFightForm.redFighter,
          blue_fighter: editFightForm.blueFighter,
          categoria: editFightForm.weightClass,
          titulo: editFightForm.title || null
        }),
      });

      const data = await response.json();
      
      if (response.ok) {
        toast.success('Luta atualizada com sucesso!');
        handleCloseEditModal();
        // Refresh fights for this event
        fetchFightsForEvent(selectedFight.id_evento);
      } else {
        toast.error(data.message || 'Erro ao atualizar luta');
      }
    } catch (error) {
      toast.error('Erro ao conectar com o servidor');
      console.error('Update fight error:', error);
    } finally {
      setIsUpdatingFight(false);
    }
  };

  const handleDeleteFight = async (fight: Fight) => {
    if (!confirm('Tem certeza que deseja excluir esta luta? Esta ação não pode ser desfeita.')) {
      return;
    }

    setIsDeletingFight(true);

    try {
      const adminToken = localStorage.getItem('adminToken');
      const response = await fetch(`https://ufc-opal.vercel.app/api/ufc/delete/fight/${fight.id_luta}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${adminToken}`
        },
      });

      const data = await response.json();
      
      if (response.ok) {
        toast.success('Luta excluída com sucesso!');
        // Refresh fights for this event
        fetchFightsForEvent(fight.id_evento);
      } else {
        toast.error(data.message || 'Erro ao excluir luta');
      }
    } catch (error) {
      toast.error('Erro ao conectar com o servidor');
      console.error('Delete fight error:', error);
    } finally {
      setIsDeletingFight(false);
    }
  };

  const handleToggleEventStatus = async (event: Event) => {
    setIsUpdatingEventStatus(prev => ({ ...prev, [event.id_evento]: true }));
    const newStatus = event.status_evento === 1 ? 0 : 1;
    try {
      const adminToken = localStorage.getItem('adminToken');
      const response = await fetch(`https://ufc-opal.vercel.app/api/ufc/event/status/${event.id_evento}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`
        },
        body: JSON.stringify({ status_evento: newStatus })
      });
      const data = await response.json();
      if (response.ok && data.status) {
        toast.success('Status do evento atualizado!');
        // Update local state
        setEvents(prev => prev.map(ev => ev.id_evento === event.id_evento ? { ...ev, status_evento: newStatus } : ev));
      } else {
        toast.error(data.message || 'Erro ao atualizar status do evento');
      }
    } catch (error) {
      toast.error('Erro ao conectar com o servidor');
      console.error('Update event status error:', error);
    } finally {
      setIsUpdatingEventStatus(prev => ({ ...prev, [event.id_evento]: false }));
    }
  };

  const handleDeleteEvent = async (event: Event) => {
    if (!confirm('Tem certeza que deseja excluir este evento? Esta ação não pode ser desfeita.')) return;
    setIsDeletingEvent(prev => ({ ...prev, [event.id_evento]: true }));
    try {
      const adminToken = localStorage.getItem('adminToken');
      const response = await fetch(`https://ufc-opal.vercel.app/api/ufc/delete/evento/${event.id_evento}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${adminToken}`
        },
      });
      const data = await response.json();
      if (response.ok && data.status) {
        toast.success('Evento excluído com sucesso!');
        // Refresh events
        fetchEvents();
      } else {
        toast.error(data.message || 'Erro ao excluir evento');
      }
    } catch (error) {
      toast.error('Erro ao conectar com o servidor');
      console.error('Delete event error:', error);
    } finally {
      setIsDeletingEvent(prev => ({ ...prev, [event.id_evento]: false }));
    }
  };

  const handleOpenCloseEventModal = (eventId: number) => {
    setCloseEventId(eventId);
    setCloseEventFights(getFightsForEvent(eventId));
    setShowCloseEventModal(true);
    // Initialize fightResults for this event
    const initialResults: { [fightId: number]: { winner: string; method: string; round: string } } = {};
    getFightsForEvent(eventId).forEach(fight => {
      initialResults[fight.id_luta] = { winner: '', method: '', round: '' };
    });
    setFightResults(initialResults);
  };

  const handleCloseCloseEventModal = () => {
    setShowCloseEventModal(false);
    setCloseEventId(null);
    setCloseEventFights([]);
    setFightResults({});
  };

  const handleFightResultChange = (fightId: number, field: 'winner' | 'method' | 'round', value: string) => {
    setFightResults(prev => ({
      ...prev,
      [fightId]: {
        ...prev[fightId],
        [field]: value,
      },
    }));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-red-950 flex items-center justify-center">
        <div className="text-center">
          <div className="relative mb-4">
            <div className="absolute inset-0 bg-red-500 rounded-full blur-lg animate-pulse"></div>
            <div className="relative bg-gradient-to-r from-red-600 to-red-800 p-4 rounded-full">
              <Crown className="w-8 h-8 text-white animate-spin" />
            </div>
          </div>
          <p className="text-gray-400">Carregando dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-red-950">
      {/* Header */}
      <div className="bg-gray-900/50 backdrop-blur-sm border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="absolute inset-0 bg-red-500 rounded-full blur-lg animate-pulse"></div>
                <div className="relative bg-gradient-to-r from-red-600 to-red-800 p-2 rounded-full">
                  <Crown className="w-6 h-6 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Painel Administrativo</h1>
                <p className="text-gray-400 text-sm">Bem-vindo, Administrador</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-4 py-2 bg-red-600/20 border border-red-500/30 rounded-lg text-red-400 hover:bg-red-600/30 transition-all duration-300"
              >
                <LogOut className="w-4 h-4" />
                <span>Sair</span>
              </button>
            </div>
          </div>
        </div>
      </div>
        
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="flex justify-center w-full mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-3xl w-full mx-auto">
            <div className="glass-card p-6 hover-lift animated-border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Total de Usuários</p>
                  <p className="text-2xl font-bold text-white">{stats.totalUsers.toLocaleString()}</p>
                </div>
                <div className="bg-blue-500/20 p-3 rounded-full">
                  <Users className="w-6 h-6 text-blue-400" />
                </div>
              </div>
            </div>

            <div className="glass-card p-6 hover-lift animated-border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Total de Apostas</p>
                  <p className="text-2xl font-bold text-white">{stats.totalBets.toLocaleString()}</p>
                </div>
                <div className="bg-green-500/20 p-3 rounded-full">
                  <TrendingUp className="w-6 h-6 text-green-400" />
                </div>
              </div>
            </div>

            <div className="glass-card p-6 hover-lift animated-border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Eventos Ativos</p>
                  <p className="text-2xl font-bold text-white">{events.filter(e => e.status_evento === 1).length}</p>
                </div>
                <div className="bg-yellow-500/20 p-3 rounded-full">
                  <Calendar className="w-6 h-6 text-yellow-400" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-8 flex justify-center w-full">
          <div className="glass-card p-8 hover-lift animated-border w-full max-w-2xl">
            <div className="text-center">
              <div className="mb-6">
                <div className="relative inline-block">
                  <div className="absolute inset-0 bg-red-500 rounded-full blur-lg animate-pulse"></div>
                  <div className="relative bg-gradient-to-r from-red-600 to-red-800 p-4 rounded-full">
                    <Plus className="w-8 h-8 text-white" />
                  </div>
                </div>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Criar Novo Evento</h3>
              <p className="text-gray-400 mb-6">
                Adicione um novo evento UFC com lutas, odds e informações detalhadas
              </p>
              <button
                onClick={handleCreateEvent}
                className="w-full py-4 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:from-red-700 hover:to-red-800 transition-all duration-300 font-medium hover:shadow-lg transform hover:scale-105 flex items-center justify-center space-x-2"
              >
                <Plus className="w-5 h-5" />
                <span>Criar Evento</span>
              </button>
            </div>
          </div>
        </div>

        {/* Events Section */}
        <div className="glass-card p-8 hover-lift animated-border mb-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-white flex items-center">
              <Calendar className="w-6 h-6 mr-3 text-red-400" />
              Eventos e Lutas
            </h3>
            <div className="text-gray-400 text-sm">
              Total: {events.length} eventos
            </div>
          </div>

          {isLoadingEvents ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500 mx-auto mb-4"></div>
              <p className="text-gray-400">Carregando eventos...</p>
            </div>
          ) : events.length === 0 ? (
            <div className="text-center py-8">
              <Calendar className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h4 className="text-xl font-semibold text-gray-400 mb-2">Nenhum evento encontrado</h4>
              <p className="text-gray-500">Crie seu primeiro evento para começar</p>
            </div>
          ) : (
            <div className="space-y-6">
              {events.map((event) => {
                const eventFights = getFightsForEvent(event.id_evento);
                const isLoadingEventFights = isLoadingFightsForEvent(event.id_evento);
                
                return (
                  <div key={event.id_evento} className="bg-gray-800/30 rounded-lg p-6 border border-gray-700">
                    {/* Event Header */}
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h4 className="text-xl font-bold text-white mb-1">{event.nome_evento}</h4>
                        <div className="flex items-center space-x-4 text-sm text-gray-400">
                          <div className="flex items-center space-x-1">
                            <MapPin className="w-4 h-4" />
                            <span>{event.local_evento}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Clock className="w-4 h-4" />
                            <span>{formatDate(event.data_evento)}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right flex flex-col items-end space-y-2">
                        <div className="flex items-center space-x-2">
                          <span className={`text-xs font-semibold px-2 py-1 rounded ${event.status_evento === 1 ? 'bg-green-700 text-green-300' : 'bg-gray-700 text-gray-400'}`}>{event.status_evento === 1 ? 'Ativo' : 'Inativo'}</span>
                          <button
                            onClick={() => handleToggleEventStatus(event)}
                            disabled={isUpdatingEventStatus[event.id_evento]}
                            className={`relative w-12 h-6 flex items-center rounded-full p-1 transition-colors duration-300 focus:outline-none ${event.status_evento === 1 ? 'bg-green-500' : 'bg-gray-600'} ${isUpdatingEventStatus[event.id_evento] ? 'opacity-60' : ''}`}
                            title="Alternar status do evento"
                          >
                            <span className={`absolute left-1 w-4 h-4 bg-white rounded-full shadow-md transform transition-transform duration-300 ${event.status_evento === 1 ? 'translate-x-6' : 'translate-x-0'}`}></span>
                            {isUpdatingEventStatus[event.id_evento] && (
                              <span className="absolute right-1 animate-spin w-4 h-4 text-green-700"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path></svg></span>
                            )}
                          </button>
                          <button
                            onClick={() => handleOpenCloseEventModal(event.id_evento)}
                            className="p-1 text-yellow-400 hover:text-yellow-300 hover:bg-yellow-500/20 rounded transition-all duration-300 ml-2"
                            title="Encerrar evento"
                          >
                            Vencedores
                          </button>
                          <button
                            onClick={async () => {
                              setIsEndingEvent(prev => ({ ...prev, [event.id_evento]: true }));
                              try {
                                const adminToken = localStorage.getItem('adminToken');
                                const response = await fetch('https://ufc-opal.vercel.app/api/pontos', {
                                  method: 'POST',
                                  headers: {
                                    'Content-Type': 'application/json',
                                    'Authorization': `Bearer ${adminToken}`
                                  },
                                  body: JSON.stringify({ id_evento: event.id_evento }),
                                });
                                const data = await response.json();
                                console.log(data);
                                if (response.ok && data.status) {
                                  toast.success('Evento encerrado com sucesso!');
                                  fetchEvents();
                                } else {
                                  toast.error(data.message || 'Erro ao encerrar evento');
                                }
                              } catch (error) {
                                toast.error('Erro ao conectar com o servidor');
                                console.error('Encerrar evento error:', error);
                              } finally {
                                setIsEndingEvent(prev => ({ ...prev, [event.id_evento]: false }));
                              }
                            }}
                            disabled={isEndingEvent[event.id_evento]}
                            className="p-1 text-red-400 hover:text-red-300 hover:bg-red-500/20 rounded transition-all duration-300 ml-2"
                            title="Encerrar evento"
                          >
                            Encerrar
                          </button>
                          <button
                            onClick={() => handleDeleteEvent(event)}
                            disabled={isDeletingEvent[event.id_evento]}
                            className="p-1 text-red-400 hover:text-red-300 hover:bg-red-500/20 rounded transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed ml-2"
                            title="Excluir evento"
                          >
                            {isDeletingEvent[event.id_evento] ? (
                              <span className="animate-spin w-4 h-4"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path></svg></span>
                            ) : (
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M1 7h22M8 7V5a2 2 0 012-2h4a2 2 0 012 2v2" /></svg>
                            )}
                          </button>
                        </div>
                        <div className="text-sm text-gray-400">ID: {event.id_evento}</div>
                        <div className="text-sm text-gray-500">Criado em {formatDate(event.created_at)}</div>
                      </div>
                    </div>

                    {/* Fights Section */}
                    <div className="border-t border-gray-700 pt-4">
                      <div className="flex items-center justify-between mb-3">
                        <h5 className="text-lg font-semibold text-white flex items-center">
                          <Swords className="w-5 h-5 mr-2 text-red-400" />
                          Lutas ({eventFights.length})
                        </h5>
                        <button
                          onClick={() => handleAddFight(event.id_evento)}
                          className="flex items-center space-x-2 px-3 py-1 bg-red-600/20 border border-red-500/30 rounded-lg text-red-400 hover:bg-red-600/30 transition-all duration-300 text-sm"
                        >
                          <Plus className="w-4 h-4" />
                          <span>Adicionar Luta</span>
                        </button>
                      </div>

                      {isLoadingEventFights ? (
                        <div className="text-center py-6">
                          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-red-500 mx-auto mb-2"></div>
                          <p className="text-gray-400 text-sm">Carregando lutas...</p>
                        </div>
                      ) : eventFights.length === 0 ? (
                        <div className="text-center py-6 bg-gray-800/20 rounded-lg">
                          <Swords className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                          <p className="text-gray-400 mb-3">Nenhuma luta cadastrada</p>
                          <button
                            onClick={() => handleAddFight(event.id_evento)}
                            className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all duration-300 mx-auto"
                          >
                            <Plus className="w-4 h-4" />
                            <span>Adicionar Primeira Luta</span>
                          </button>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {eventFights.map((fight) => (
                            <div key={fight.id_luta} className="bg-gray-800/50 rounded-lg p-4 border border-gray-600">
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-sm text-gray-400">Luta #{fight.id_luta}</span>
                                <div className="flex items-center space-x-2">
                                  <span className="text-xs bg-red-600/20 text-red-400 px-2 py-1 rounded">
                                    {fight.categoria}
                                  </span>
                                  <div className="flex items-center space-x-1">
                                    <button
                                      onClick={() => handleEditFight(fight)}
                                      disabled={isUpdatingFight || isDeletingFight}
                                      className="p-1 text-blue-400 hover:text-blue-300 hover:bg-blue-500/20 rounded transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                                      title="Editar luta"
                                    >
                                      <Settings className="w-4 h-4" />
                                    </button>
                                    <button
                                      onClick={() => handleDeleteFight(fight)}
                                      disabled={isUpdatingFight || isDeletingFight}
                                      className="p-1 text-red-400 hover:text-red-300 hover:bg-red-500/20 rounded transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                                      title="Excluir luta"
                                    >
                                      <X className="w-4 h-4" />
                                    </button>
                                  </div>
                                </div>
                              </div>
                              <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                  <span className="text-white font-medium">{fight.red_fighter}</span>
                                  <span className="text-red-400 text-sm">Red Corner</span>
                                </div>
                                <div className="text-center text-gray-400 text-lg font-bold">VS</div>
                                <div className="flex items-center justify-between">
                                  <span className="text-white font-medium">{fight.blue_fighter}</span>
                                  <span className="text-blue-400 text-sm">Blue Corner</span>
                                </div>
                              </div>
                              {fight.titulo && (
                                <div className="mt-2 pt-2 border-t border-gray-600">
                                  <span className="text-xs text-yellow-400 font-medium">{fight.titulo}</span>
                                </div>
                              )}
                              <div className="mt-2 pt-2 border-t border-gray-600">
                                <span className="text-xs text-gray-500">
                                  Criado em {formatDate(fight.created_at)}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>

      {/* Create Event Modal */}
      {showCreateEvent && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="glass-card p-8 max-w-md w-full space-y-6 animated-border">
            {/* Modal Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className="absolute inset-0 bg-red-500 rounded-full blur-lg animate-pulse"></div>
                  <div className="relative bg-gradient-to-r from-red-600 to-red-800 p-2 rounded-full">
                    <Plus className="w-5 h-5 text-white" />
                  </div>
                </div>
                <h2 className="text-2xl font-bold text-white">Criar Novo Evento</h2>
              </div>
              <button
                onClick={handleCloseModal}
                className="text-gray-400 hover:text-white transition-colors duration-300"
                disabled={isCreatingEvent}
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmitEvent} className="space-y-6">
              {/* Event Name */}
              <div className="space-y-2">
                <label htmlFor="nome_evento" className="text-sm font-medium text-gray-300 flex items-center">
                  <Calendar className="w-4 h-4 mr-2" />
                  Nome do Evento
                </label>
                <input
                  id="nome_evento"
                  name="nome_evento"
                  type="text"
                  value={eventForm.nome_evento}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-white placeholder-gray-400 transition-all duration-300"
                  placeholder="Ex: UFC 300"
                  required
                  disabled={isCreatingEvent}
                />
              </div>

              {/* Location */}
              <div className="space-y-2">
                <label htmlFor="local_evento" className="text-sm font-medium text-gray-300 flex items-center">
                  <MapPin className="w-4 h-4 mr-2" />
                  Local do Evento
                </label>
                <input
                  id="local_evento"
                  name="local_evento"
                  type="text"
                  value={eventForm.local_evento}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-white placeholder-gray-400 transition-all duration-300"
                  placeholder="Ex: T-Mobile Arena, Las Vegas"
                  required
                  disabled={isCreatingEvent}
                />
              </div>

              {/* Date */}
              <div className="space-y-2">
                <label htmlFor="data_evento" className="text-sm font-medium text-gray-300 flex items-center">
                  <Clock className="w-4 h-4 mr-2" />
                  Data e Hora do Evento
                </label>
                <input
                  id="data_evento"
                  name="data_evento"
                  type="datetime-local"
                  value={eventForm.data_evento}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-white placeholder-gray-400 transition-all duration-300"
                  required
                  disabled={isCreatingEvent}
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:from-red-700 hover:to-red-800 transition-all duration-300 font-medium hover:shadow-lg transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                disabled={isCreatingEvent}
              >
                {isCreatingEvent ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Criando Evento...</span>
                  </>
                ) : (
                  <>
                    <Plus className="w-5 h-5" />
                    <span>Criar Evento</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Create Fight Modal */}
      {showCreateFight && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="glass-card p-8 max-w-2xl w-full space-y-6 animated-border">
            {/* Modal Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className="absolute inset-0 bg-red-500 rounded-full blur-lg animate-pulse"></div>
                  <div className="relative bg-gradient-to-r from-red-600 to-red-800 p-2 rounded-full">
                    <Swords className="w-5 h-5 text-white" />
                  </div>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">Criar Nova Luta</h2>
                  <p className="text-gray-400 text-sm">Evento: {getSelectedEventName()}</p>
                </div>
              </div>
              <button
                onClick={handleCloseFightModal}
                className="text-gray-400 hover:text-white transition-colors duration-300"
                disabled={isCreatingFight}
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmitFight} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Red Fighter */}
                <div className="space-y-2">
                  <label htmlFor="redFighter" className="text-sm font-medium text-gray-300 flex items-center">
                    <div className="w-4 h-4 mr-2 bg-red-500 rounded-full"></div>
                    Lutador Red Corner
                  </label>
                  <div className="relative group">
                    <input
                      id="redFighter"
                      name="redFighter"
                      type="text"
                      value={fightForm.redFighter}
                      onChange={handleFightInputChange}
                      className="w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-white placeholder-gray-400 transition-all duration-300 group-hover:border-red-500/50"
                      placeholder="Ex: Jon Jones"
                      required
                      disabled={isCreatingFight}
                    />
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-red-500/0 to-red-500/0 group-hover:from-red-500/10 group-hover:to-red-500/5 transition-all duration-300 pointer-events-none"></div>
                  </div>
                </div>

                {/* Blue Fighter */}
                <div className="space-y-2">
                  <label htmlFor="blueFighter" className="text-sm font-medium text-gray-300 flex items-center">
                    <div className="w-4 h-4 mr-2 bg-blue-500 rounded-full"></div>
                    Lutador Blue Corner
                  </label>
                  <div className="relative group">
                    <input
                      id="blueFighter"
                      name="blueFighter"
                      type="text"
                      value={fightForm.blueFighter}
                      onChange={handleFightInputChange}
                      className="w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400 transition-all duration-300 group-hover:border-blue-500/50"
                      placeholder="Ex: Stipe Miocic"
                      required
                      disabled={isCreatingFight}
                    />
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-blue-500/0 to-blue-500/0 group-hover:from-blue-500/10 group-hover:to-blue-500/5 transition-all duration-300 pointer-events-none"></div>
                  </div>
                </div>
              </div>

              {/* Weight Class */}
              <div className="space-y-2">
                <label htmlFor="weightClass" className="text-sm font-medium text-gray-300 flex items-center">
                  <Zap className="w-4 h-4 mr-2" />
                  Categoria de Peso
                </label>
                <select
                  id="weightClass"
                  name="weightClass"
                  value={fightForm.weightClass}
                  onChange={handleFightInputChange}
                  className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-white transition-all duration-300"
                  required
                  disabled={isCreatingFight}
                >
                  <option value="" className="bg-gray-800 text-gray-400">Selecione a categoria</option>
                  {weightClasses.map((weightClass) => (
                    <option key={weightClass} value={weightClass} className="bg-gray-800 text-white">
                      {weightClass}
                    </option>
                  ))}
                </select>
              </div>

              {/* Title */}
              <div className="space-y-2">
                <label htmlFor="title" className="text-sm font-medium text-gray-300 flex items-center">
                  <Crown className="w-4 h-4 mr-2" />
                  Título da Luta (Opcional)
                </label>
                <input
                  id="title"
                  name="title"
                  type="text"
                  value={fightForm.title}
                  onChange={handleFightInputChange}
                  className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-white placeholder-gray-400 transition-all duration-300"
                  placeholder="Ex: Luta Principal, Co-Main Event"
                  disabled={isCreatingFight}
                />
              </div>

              {/* VS Display */}
              <div className="text-center py-4">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-red-500/20 to-blue-500/20 rounded-lg blur-lg"></div>
                  <div className="relative bg-gray-800/50 rounded-lg p-6 border border-gray-600">
                    <div className="grid grid-cols-3 gap-4 items-center">
                      <div className="text-center">
                        <div className="text-lg font-bold text-red-400 mb-2">Red Corner</div>
                        <div className="text-white font-semibold">{fightForm.redFighter || 'TBD'}</div>
                      </div>
                      <div className="text-center">
                        <div className="text-4xl font-bold text-gradient mb-2">VS</div>
                        <div className="text-sm text-gray-400">{fightForm.weightClass || 'TBD'}</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-blue-400 mb-2">Blue Corner</div>
                        <div className="text-white font-semibold">{fightForm.blueFighter || 'TBD'}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:from-red-700 hover:to-red-800 transition-all duration-300 font-medium hover:shadow-lg transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                disabled={isCreatingFight}
              >
                {isCreatingFight ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Criando Luta...</span>
                  </>
                ) : (
                  <>
                    <Swords className="w-5 h-5" />
                    <span>Criar Luta</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Edit Fight Modal */}
      {showEditFight && selectedFight && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="glass-card p-8 max-w-2xl w-full space-y-6 animated-border">
            {/* Modal Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className="absolute inset-0 bg-blue-500 rounded-full blur-lg animate-pulse"></div>
                  <div className="relative bg-gradient-to-r from-blue-600 to-blue-800 p-2 rounded-full">
                    <Settings className="w-5 h-5 text-white" />
                  </div>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">Editar Luta</h2>
                  <p className="text-gray-400 text-sm">Luta #{selectedFight.id_luta} - {getSelectedEventName()}</p>
                </div>
              </div>
              <button
                onClick={handleCloseEditModal}
                className="text-gray-400 hover:text-white transition-colors duration-300"
                disabled={isUpdatingFight}
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleUpdateFight} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Red Fighter */}
                <div className="space-y-2">
                  <label htmlFor="editRedFighter" className="text-sm font-medium text-gray-300 flex items-center">
                    <div className="w-4 h-4 mr-2 bg-red-500 rounded-full"></div>
                    Lutador Red Corner
                  </label>
                  <div className="relative group">
                    <input
                      id="editRedFighter"
                      name="redFighter"
                      type="text"
                      value={editFightForm.redFighter}
                      onChange={handleEditFightInputChange}
                      className="w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-white placeholder-gray-400 transition-all duration-300 group-hover:border-red-500/50"
                      placeholder="Ex: Jon Jones"
                      required
                      disabled={isUpdatingFight}
                    />
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-red-500/0 to-red-500/0 group-hover:from-red-500/10 group-hover:to-red-500/5 transition-all duration-300 pointer-events-none"></div>
                  </div>
                </div>

                {/* Blue Fighter */}
                <div className="space-y-2">
                  <label htmlFor="editBlueFighter" className="text-sm font-medium text-gray-300 flex items-center">
                    <div className="w-4 h-4 mr-2 bg-blue-500 rounded-full"></div>
                    Lutador Blue Corner
                  </label>
                  <div className="relative group">
                    <input
                      id="editBlueFighter"
                      name="blueFighter"
                      type="text"
                      value={editFightForm.blueFighter}
                      onChange={handleEditFightInputChange}
                      className="w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400 transition-all duration-300 group-hover:border-blue-500/50"
                      placeholder="Ex: Stipe Miocic"
                      required
                      disabled={isUpdatingFight}
                    />
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-blue-500/0 to-blue-500/0 group-hover:from-blue-500/10 group-hover:to-blue-500/5 transition-all duration-300 pointer-events-none"></div>
                  </div>
                </div>
              </div>

              {/* Weight Class */}
              <div className="space-y-2">
                <label htmlFor="editWeightClass" className="text-sm font-medium text-gray-300 flex items-center">
                  <Zap className="w-4 h-4 mr-2" />
                  Categoria de Peso
                </label>
                <select
                  id="editWeightClass"
                  name="weightClass"
                  value={editFightForm.weightClass}
                  onChange={handleEditFightInputChange}
                  className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white transition-all duration-300"
                  required
                  disabled={isUpdatingFight}
                >
                  <option value="" className="bg-gray-800 text-gray-400">Selecione a categoria</option>
                  {weightClasses.map((weightClass) => (
                    <option key={weightClass} value={weightClass} className="bg-gray-800 text-white">
                      {weightClass}
                    </option>
                  ))}
                </select>
              </div>

              {/* Title */}
              <div className="space-y-2">
                <label htmlFor="editTitle" className="text-sm font-medium text-gray-300 flex items-center">
                  <Crown className="w-4 h-4 mr-2" />
                  Título da Luta (Opcional)
                </label>
                <input
                  id="editTitle"
                  name="title"
                  type="text"
                  value={editFightForm.title}
                  onChange={handleEditFightInputChange}
                  className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400 transition-all duration-300"
                  placeholder="Ex: Luta Principal, Co-Main Event"
                  disabled={isUpdatingFight}
                />
              </div>

              {/* VS Display */}
              <div className="text-center py-4">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-red-500/20 to-blue-500/20 rounded-lg blur-lg"></div>
                  <div className="relative bg-gray-800/50 rounded-lg p-6 border border-gray-600">
                    <div className="grid grid-cols-3 gap-4 items-center">
                      <div className="text-center">
                        <div className="text-lg font-bold text-red-400 mb-2">Red Corner</div>
                        <div className="text-white font-semibold">{editFightForm.redFighter || 'TBD'}</div>
                      </div>
                      <div className="text-center">
                        <div className="text-4xl font-bold text-gradient mb-2">VS</div>
                        <div className="text-sm text-gray-400">{editFightForm.weightClass || 'TBD'}</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-blue-400 mb-2">Blue Corner</div>
                        <div className="text-white font-semibold">{editFightForm.blueFighter || 'TBD'}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-300 font-medium hover:shadow-lg transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                disabled={isUpdatingFight}
              >
                {isUpdatingFight ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Atualizando Luta...</span>
                  </>
                ) : (
                  <>
                    <Settings className="w-5 h-5" />
                    <span>Atualizar Luta</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Close Event Modal */}
      {showCloseEventModal && closeEventId && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="glass-card p-8 max-w-2xl w-full space-y-6 animated-border">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-white">Encerrar Evento</h2>
              <button
                onClick={handleCloseCloseEventModal}
                className="text-gray-400 hover:text-white transition-colors duration-300"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="space-y-6">
              {closeEventFights.length === 0 ? (
                <div className="text-gray-400">Nenhuma luta encontrada para este evento.</div>
              ) : (
                closeEventFights.map(fight => (
                  <div key={fight.id_luta} className="bg-gray-800/40 rounded-lg p-4 border border-gray-700 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="text-white font-semibold">{fight.red_fighter} <span className="text-gray-400">vs</span> {fight.blue_fighter}</div>
                      <div className="text-xs text-gray-400">Luta #{fight.id_luta}</div>
                    </div>
                    <div className="flex flex-col md:flex-row md:items-center md:space-x-4 space-y-2 md:space-y-0">
                      {/* Winner */}
                      <div>
                        <label className="text-sm text-gray-300 mr-2">Vencedor:</label>
                        <select
                          className="bg-gray-900 border border-gray-700 rounded px-2 py-1 text-white"
                          value={fightResults[fight.id_luta]?.winner || ''}
                          onChange={e => handleFightResultChange(fight.id_luta, 'winner', e.target.value)}
                        >
                          <option value="">Selecione</option>
                          <option value="redFighter">{fight.red_fighter}</option>
                          <option value="blueFighter">{fight.blue_fighter}</option>
                        </select>
                      </div>
                      {/* Method */}
                      <div>
                        <label className="text-sm text-gray-300 mr-2">Método:</label>
                        <select
                          className="bg-gray-900 border border-gray-700 rounded px-2 py-1 text-white"
                          value={fightResults[fight.id_luta]?.method || ''}
                          onChange={e => handleFightResultChange(fight.id_luta, 'method', e.target.value)}
                        >
                          <option value="">Selecione</option>
                          {finishMethods.map(method => (
                            <option key={method} value={method}>{method}</option>
                          ))}
                        </select>
                      </div>
                      {/* Round */}
                      <div>
                        <label className="text-sm text-gray-300 mr-2">Round:</label>
                        <select
                          className="bg-gray-900 border border-gray-700 rounded px-2 py-1 text-white"
                          value={fightResults[fight.id_luta]?.round || ''}
                          onChange={e => handleFightResultChange(fight.id_luta, 'round', e.target.value)}
                        >
                          <option value="">Selecione</option>
                          {[1,2,3,4,5].map(r => (
                            <option key={r} value={r}>{r}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
            <div className="flex justify-end space-x-2 pt-4">
              <button
                onClick={handleCloseCloseEventModal}
                className="px-4 py-2 rounded bg-gray-700 text-gray-300 hover:bg-gray-600 transition-all"
              >
                Cancelar
              </button>
              <button
                className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700 transition-all font-semibold"
                disabled={isClosingEvent}
                onClick={async () => {
                  setIsClosingEvent(true);
                  const results = closeEventFights.map(fight => {
                    const res: any = fightResults[fight.id_luta] || {};
                    let winnerName = '';
                    if (res.winner === 'redFighter') winnerName = fight.red_fighter;
                    else if (res.winner === 'blueFighter') winnerName = fight.blue_fighter;
                    return {
                      id_evento: fight.id_evento,
                      id_luta: fight.id_luta,
                      winner: res.winner,
                      method: res.method || '',
                      round: res.round || '',
                    };
                  });
                  try {
                    const adminToken = localStorage.getItem('adminToken');
                    const responses = await Promise.all(results.map(async (fightResult) => {
                      const response = await fetch('https://ufc-opal.vercel.app/api/ufc/vencedor', {
                        method: 'POST',
                        headers: {
                          'Content-Type': 'application/json',
                          'Authorization': `Bearer ${adminToken}`
                        },
                        body: JSON.stringify(fightResult),
                      });
                      const data = await response.json();
                      return { ok: response.ok, status: data.status, message: data.message };
                    }));
                    const allOk = responses.every(r => r.ok && r.status);
                    if (allOk) {
                      toast.success('Evento encerrado com sucesso!');
                      handleCloseCloseEventModal();
                      fetchEvents();
                    } else {
                      const firstError = responses.find(r => !r.ok || !r.status);
                      toast.error(firstError?.message || 'Erro ao encerrar evento');
                    }
                  } catch (error) {
                    toast.error('Erro ao conectar com o servidor');
                    console.error('Close event error:', error);
                  } finally {
                    setIsClosingEvent(false);
                  }
                }}
              >
                Confirmar Encerramento
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard; 