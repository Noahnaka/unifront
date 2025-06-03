
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Login attempt:', { email, password });
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 pt-16">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gradient mb-2">Bem-vindo de volta</h1>
          <p className="text-gray-400">Entre na sua conta para continuar apostando</p>
        </div>

        {/* Login Form */}
        <div className="glass-card p-8 space-y-6 animated-border">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-gray-300">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-white placeholder-gray-400 transition-all duration-300"
                  placeholder="seu@email.com"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium text-gray-300">
                Senha
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-12 py-3 bg-gray-800/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-white placeholder-gray-400 transition-all duration-300"
                  placeholder="Digite sua senha"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300 transition-colors duration-300"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Remember & Forgot */}
            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="rounded bg-gray-800 border-gray-600 text-red-600 focus:ring-red-500 focus:ring-offset-0"
                />
                <span className="ml-2 text-sm text-gray-400">Lembrar-me</span>
              </label>
              <Link to="/forgot-password" className="text-sm text-red-400 hover:text-red-300 transition-colors duration-300">
                Esqueceu a senha?
              </Link>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all duration-300 font-medium hover:shadow-lg transform hover:scale-105"
            >
              Entrar
            </button>
          </form>

          {/* Social Login */}
          <div className="space-y-4">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-600"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-gray-900 text-gray-400">Ou continue com</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button className="flex justify-center items-center px-4 py-2 border border-gray-600 rounded-lg hover:border-gray-500 transition-colors duration-300 text-gray-300 hover:text-white">
                <span>Google</span>
              </button>
              <button className="flex justify-center items-center px-4 py-2 border border-gray-600 rounded-lg hover:border-gray-500 transition-colors duration-300 text-gray-300 hover:text-white">
                <span>Facebook</span>
              </button>
            </div>
          </div>

          {/* Sign Up Link */}
          <p className="text-center text-gray-400">
            Não tem uma conta?{' '}
            <Link to="/register" className="text-red-400 hover:text-red-300 transition-colors duration-300 font-medium">
              Cadastre-se
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
