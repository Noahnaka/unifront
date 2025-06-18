import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, Shield, Crown, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

const Admin = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; size: number; speedX: number; speedY: number }>>([]);
  const navigate = useNavigate();

  // Generate floating particles
  useEffect(() => {
    const generateParticles = () => {
      const newParticles = Array.from({ length: 20 }, (_, i) => ({
        id: i,
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        size: Math.random() * 3 + 1,
        speedX: (Math.random() - 0.5) * 0.5,
        speedY: (Math.random() - 0.5) * 0.5,
      }));
      setParticles(newParticles);
    };

    generateParticles();
    const interval = setInterval(() => {
      setParticles(prev => prev.map(particle => {
        let newX = particle.x + particle.speedX;
        let newY = particle.y + particle.speedY;
        
        // Wrap around screen edges
        if (newX > window.innerWidth) newX = 0;
        if (newX < 0) newX = window.innerWidth;
        if (newY > window.innerHeight) newY = 0;
        if (newY < 0) newY = window.innerHeight;
        
        return {
          ...particle,
          x: newX,
          y: newY,
        };
      }));
    }, 50);

    return () => clearInterval(interval);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Simulate admin login - replace with actual admin API endpoint
      const response = await fetch('http://localhost:3000/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email_admin: email, senha_admin: password }),
      });

      const data = await response.json();
      
      if (response.ok) {
        toast.success('Login administrativo realizado com sucesso!');
        localStorage.setItem('adminToken', data.token);
        localStorage.setItem('isAdmin', 'true');
        navigate('/admin/dashboard');
      } else {
        toast.error(data.message || 'Credenciais inválidas');
      }
    } catch (error) {
      toast.error('Erro ao conectar com o servidor');
      console.error('Admin login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-black via-gray-900 to-red-950">
      {/* Animated Background Particles */}
      <div className="absolute inset-0 overflow-hidden">
        {particles.map(particle => (
          <div
            key={particle.id}
            className="absolute w-1 h-1 bg-red-500/30 rounded-full animate-pulse"
            style={{
              left: `${particle.x}px`,
              top: `${particle.y}px`,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
            }}
          />
        ))}
      </div>

      {/* Floating Elements */}
      <div className="absolute top-20 left-20 animate-bounce">
        <Crown className="w-8 h-8 text-red-400/30" />
      </div>
      <div className="absolute top-40 right-32 animate-pulse">
        <Shield className="w-6 h-6 text-blue-400/30" />
      </div>
      <div className="absolute bottom-32 left-32 animate-spin-slow">
        <Sparkles className="w-5 h-5 text-yellow-400/30" />
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 pt-16">
        <div className="max-w-md w-full space-y-8">
          {/* Header with Animation */}
          <div className="text-center animate-fade-in">
            <div className="mb-4 flex justify-center">
              <div className="relative">
                <div className="absolute inset-0 bg-red-500 rounded-full blur-lg animate-pulse"></div>
                <div className="relative bg-gradient-to-r from-red-600 to-red-800 p-4 rounded-full">
                  <Crown className="w-8 h-8 text-white" />
                </div>
              </div>
            </div>
            <h1 className="text-4xl font-bold text-gradient mb-2 animate-slide-up">
              Painel Administrativo
            </h1>
            <p className="text-gray-400 animate-slide-up-delay">
              Acesso restrito para administradores
            </p>
          </div>

          {/* Login Form with Glass Effect */}
          <div className="glass-card p-8 space-y-6 animated-border hover-lift transform transition-all duration-500">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Field */}
              <div className="space-y-2 animate-slide-up-delay-2">
                <label htmlFor="email" className="text-sm font-medium text-gray-300 flex items-center">
                  <Mail className="w-4 h-4 mr-2" />
                  Email Administrativo
                </label>
                <div className="relative group">
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-white placeholder-gray-400 transition-all duration-300 group-hover:border-red-500/50"
                    placeholder="admin@unibet.com"
                    required
                    disabled={isLoading}
                  />
                  <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-red-500/0 to-red-500/0 group-hover:from-red-500/10 group-hover:to-red-500/5 transition-all duration-300 pointer-events-none"></div>
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2 animate-slide-up-delay-3">
                <label htmlFor="password" className="text-sm font-medium text-gray-300 flex items-center">
                  <Lock className="w-4 h-4 mr-2" />
                  Senha Administrativa
                </label>
                <div className="relative group">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-12 py-3 bg-gray-800/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-white placeholder-gray-400 transition-all duration-300 group-hover:border-red-500/50"
                    placeholder="••••••••"
                    required
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300 transition-colors duration-300"
                    disabled={isLoading}
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                  <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-red-500/0 to-red-500/0 group-hover:from-red-500/10 group-hover:to-red-500/5 transition-all duration-300 pointer-events-none"></div>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:from-red-700 hover:to-red-800 transition-all duration-300 font-medium hover:shadow-lg transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed animate-slide-up-delay-4"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Autenticando...
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    <Shield className="w-5 h-5 mr-2" />
                    Acessar Painel
                  </div>
                )}
              </button>
            </form>

            {/* Security Notice */}
            <div className="text-center animate-slide-up-delay-5">
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
                <div className="flex items-center justify-center mb-2">
                  <Shield className="w-5 h-5 text-red-400 mr-2" />
                  <span className="text-red-400 font-medium">Acesso Restrito</span>
                </div>
                <p className="text-gray-400 text-sm">
                  Esta área é exclusiva para administradores autorizados
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin; 