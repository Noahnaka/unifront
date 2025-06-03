
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Trophy, Calendar, Users, Target } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { name: 'Home', path: '/', icon: Trophy },
    { name: 'Eventos', path: '/events', icon: Calendar },
    { name: 'Lutas', path: '/fights', icon: Target },
    { name: 'Apostas', path: '/betting', icon: Users },
    { name: 'Ranking', path: '/leaderboard', icon: Trophy },
  ];

  return (
    <nav className="fixed top-0 w-full z-50 glass-card border-b border-red-500/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <img 
              src="/lovable-uploads/78360296-cdb9-4f57-bbd8-a809fa46aa25.png" 
              alt="UNIBET" 
              className="h-8 w-auto transform hover:scale-110 transition-transform duration-300"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-8">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-all duration-300 ${
                    isActive
                      ? 'text-red-400 bg-red-500/10 neon-glow'
                      : 'text-gray-300 hover:text-red-400 hover:bg-red-500/5'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex space-x-4">
            <Link
              to="/login"
              className="px-4 py-2 text-gray-300 hover:text-red-400 transition-colors duration-300 border border-gray-600 rounded-md hover:border-red-500"
            >
              Entrar
            </Link>
            <Link
              to="/register"
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors duration-300 neon-glow hover:shadow-lg transform hover:scale-105"
            >
              Registrar
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-400 hover:text-red-400 transition-colors duration-300"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden glass-card border-t border-red-500/20 animate-in slide-in-from-top-2 duration-300">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium transition-all duration-300 ${
                    isActive
                      ? 'text-red-400 bg-red-500/10'
                      : 'text-gray-300 hover:text-red-400 hover:bg-red-500/5'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
            <div className="pt-4 space-y-2">
              <Link
                to="/login"
                onClick={() => setIsOpen(false)}
                className="block w-full text-center px-3 py-2 text-gray-300 hover:text-red-400 transition-colors duration-300 border border-gray-600 rounded-md hover:border-red-500"
              >
                Entrar
              </Link>
              <Link
                to="/register"
                onClick={() => setIsOpen(false)}
                className="block w-full text-center px-3 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors duration-300"
              >
                Registrar
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
