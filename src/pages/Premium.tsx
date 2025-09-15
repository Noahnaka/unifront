import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Crown, Check, Star, Zap, Shield, Users, X, CreditCard, Lock } from 'lucide-react';

const Premium = () => {
  const [selectedPlan, setSelectedPlan] = useState('monthly');
  const [isLoading, setIsLoading] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentData, setPaymentData] = useState({
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: '',
    planId: ''
  });

  const plans = [
    {
      id: 'monthly',
      name: 'Plano Mensal',
      price: 'R$ 29,90',
      originalPrice: 'R$ 39,90',
      period: 'mês',
      features: [
        'Análises exclusivas de especialistas',
        'Odds em tempo real',
        'Alertas de apostas',
        'Estatísticas avançadas',
        'Suporte prioritário',
        'Sem anúncios'
      ],
      popular: false
    },
    {
      id: 'yearly',
      name: 'Plano Anual',
      price: 'R$ 299,90',
      originalPrice: 'R$ 478,80',
      period: 'ano',
      features: [
        'Todas as funcionalidades do plano mensal',
        '2 meses grátis',
        'Acesso antecipado a novos recursos',
        'Consultoria personalizada',
        'Grupo exclusivo de membros',
        'Cashback de 5%'
      ],
      popular: true
    }
  ];

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    value = value.replace(/(\d{4})/g, '$1 ').trim();
    setPaymentData({ ...paymentData, cardNumber: value });
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length >= 2) {
      value = value.slice(0, 2) + '/' + value.slice(2, 4);
    }
    setPaymentData({ ...paymentData, expiryDate: value });
  };

  const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    setPaymentData({ ...paymentData, cvv: value });
  };

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 2000));

      localStorage.setItem('acesso', 'premium');

      const token = localStorage.getItem('token');
      if (token) {
        const clientResponse = await fetch('https://ufc-opal.vercel.app/api/token/conta/cliente', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (clientResponse.ok) {
          const clientData = await clientResponse.json();
          const clienteId = clientData.payload.id_cliente;

          const response = await fetch(`https://ufc-opal.vercel.app/api/cliente/acesso/${clienteId}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
              nivel_acesso_cliente: 'premium'
            })
          });

          if (!response.ok) {
            console.error('Erro ao atualizar acesso do usuário');
          }
        }
      }

      window.dispatchEvent(new Event('tokenChanged'));

      setShowPaymentModal(false);
      alert('Pagamento realizado com sucesso! Você agora tem acesso Premium.');
      
      window.location.href = '/';

    } catch (error) {
      console.error('Erro no pagamento:', error);
      alert('Erro ao processar pagamento. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const openPaymentModal = (planId: string) => {
    setPaymentData({ ...paymentData, planId });
    setShowPaymentModal(true);
  };

  return (
    <div className="min-h-screen pt-16 bg-gradient-to-br from-black via-gray-900 to-red-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <Crown className="w-16 h-16 text-yellow-400" />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-gradient mb-4">UNIBET Premium</h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Eleve suas apostas ao próximo nível com análises exclusivas, odds em tempo real e muito mais
          </p>
        </div>

        <div className="flex justify-center mb-12">
          <div className="glass-card p-2 flex space-x-2">
            <button
              onClick={() => setSelectedPlan('monthly')}
              className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                selectedPlan === 'monthly'
                  ? 'bg-red-600 text-white'
                  : 'text-gray-300 hover:text-white hover:bg-gray-700'
              }`}
            >
              Mensal
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-16">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`glass-card p-8 relative ${
                plan.popular ? 'border-2 border-yellow-500' : ''
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-yellow-500 text-black px-4 py-1 rounded-full text-sm font-semibold">
                    Mais Popular
                  </span>
                </div>
              )}

              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                <div className="mb-4">
                  <span className="text-4xl font-bold text-white">{plan.price}</span>
                  <span className="text-gray-400 ml-2">/{plan.period}</span>
                </div>
                <div className="text-gray-400 line-through text-lg">
                  {plan.originalPrice}
                </div>
              </div>

              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-center space-x-3">
                    <Check className="w-5 h-5 text-green-400 flex-shrink-0" />
                    <span className="text-gray-300">{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => openPaymentModal(plan.id)}
                disabled={isLoading}
                className={`w-full py-4 rounded-lg font-semibold text-lg transition-all duration-300 ${
                  plan.popular
                    ? 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-black hover:from-yellow-400 hover:to-yellow-500'
                    : 'bg-red-600 text-white hover:bg-red-700'
                } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {isLoading ? 'Processando...' : 'Assinar Agora'}
              </button>
            </div>
          ))}
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="glass-card p-6 text-center">
            <Zap className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-3">Odds detalhadas</h3>
            <p className="text-gray-400">
              Visualização de odds detalhadas para cada luta
            </p>
          </div>

          <div className="glass-card p-6 text-center">
            <Shield className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-3">Análises Exclusivas</h3>
            <p className="text-gray-400">
              Acesso a relatórios detalhados e análises de especialistas em artes marciais
            </p>
          </div>

        </div>

        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-white text-center mb-8">Perguntas Frequentes</h2>
          <div className="space-y-6">
            <div className="glass-card p-6">
              <h3 className="text-lg font-semibold text-white mb-2">Como funciona o pagamento?</h3>
              <p className="text-gray-400">
                Utilizamos o Mercado Pago para processar pagamentos de forma segura. Aceitamos cartões de crédito, débito e PIX.
              </p>
            </div>
            <div className="glass-card p-6">
              <h3 className="text-lg font-semibold text-white mb-2">Posso cancelar a qualquer momento?</h3>
              <p className="text-gray-400">
                Sim! Você pode cancelar sua assinatura a qualquer momento através da sua conta ou entrando em contato conosco.
              </p>
            </div>
            <div className="glass-card p-6">
              <h3 className="text-lg font-semibold text-white mb-2">O que acontece após o pagamento?</h3>
              <p className="text-gray-400">
                Após a confirmação do pagamento, você terá acesso imediato a todas as funcionalidades Premium da plataforma.
              </p>
            </div>
          </div>
        </div>

        <div className="text-center mt-16">
          <Link
            to="/"
            className="px-8 py-4 border-2 border-gray-600 text-gray-300 text-lg font-semibold rounded-lg hover:border-red-500 hover:text-red-400 transition-all duration-300"
          >
            Voltar ao Início
          </Link>
        </div>
      </div>

      {showPaymentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-white">Pagamento Seguro</h3>
              <button
                onClick={() => setShowPaymentModal(false)}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="bg-yellow-600/20 border border-yellow-600/30 rounded-lg p-4 mb-6">
              <div className="flex items-start space-x-2">
                <div className="w-4 h-4 text-yellow-400 mt-0.5">⚠️</div>
                <div>
                  <p className="text-yellow-400 font-semibold text-sm mb-1">AVISO IMPORTANTE</p>
                  <p className="text-yellow-300 text-xs leading-relaxed">
                    Este é um ambiente de teste. Nenhum dado será salvo, utilizado ou confirmado. 
                    Esta funcionalidade é apenas para demonstração do sistema de pagamento.
                  </p>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <div className="bg-gray-800 rounded-lg p-4 mb-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Plano Selecionado:</span>
                  <span className="text-white font-semibold">
                    {plans.find(p => p.id === paymentData.planId)?.name}
                  </span>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-gray-300">Valor:</span>
                  <span className="text-yellow-400 font-bold">
                    {plans.find(p => p.id === paymentData.planId)?.price}
                  </span>
                </div>
              </div>
            </div>

            <form onSubmit={handlePaymentSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Número do Cartão
                </label>
                <div className="relative">
                  <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={paymentData.cardNumber}
                    onChange={handleCardNumberChange}
                    placeholder="0000 0000 0000 0000"
                    maxLength={19}
                    className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-yellow-500 focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Nome no Cartão
                </label>
                <input
                  type="text"
                  value={paymentData.cardName}
                  onChange={(e) => setPaymentData({ ...paymentData, cardName: e.target.value })}
                  placeholder="Nome como está no cartão"
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-yellow-500 focus:outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">
                    Validade
                  </label>
                  <input
                    type="text"
                    value={paymentData.expiryDate}
                    onChange={handleExpiryChange}
                    placeholder="MM/AA"
                    maxLength={5}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-yellow-500 focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">
                    CVV
                  </label>
                  <input
                    type="text"
                    value={paymentData.cvv}
                    onChange={handleCvvChange}
                    placeholder="123"
                    maxLength={4}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-yellow-500 focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2 mt-4">
                <Lock className="w-4 h-4 text-green-400" />
                <span className="text-sm text-gray-400">
                  Pagamento seguro com criptografia SSL
                </span>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-4 bg-gradient-to-r from-yellow-500 to-yellow-600 text-black font-semibold rounded-lg hover:from-yellow-400 hover:to-yellow-500 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed mt-6"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center space-x-2">
                    <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                    <span>Processando...</span>
                  </span>
                ) : (
                  'Finalizar Pagamento'
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Premium;
