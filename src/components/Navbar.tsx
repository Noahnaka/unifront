import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Trophy, Calendar, Users, Target } from 'lucide-react';
import AuthButtons from './AuthButtons';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { name: 'Home', path: '/', icon: Trophy },
    { name: 'Eventos', path: '/events', icon: Calendar },
    { name: 'Lutas', path: '/fights', icon: Target },
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
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-2 ${
                    location.pathname === item.path
                      ? 'text-red-400'
                      : 'text-gray-300 hover:text-white'
                  } transition-colors duration-300`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:block">
            <AuthButtons />
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-gray-300 hover:text-white transition-colors duration-300"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden py-4 space-y-4">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-2 px-4 py-2 ${
                    location.pathname === item.path
                      ? 'text-red-400'
                      : 'text-gray-300 hover:text-white'
                  } transition-colors duration-300`}
                  onClick={() => setIsOpen(false)}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
            <div className="px-4 py-2">
              <AuthButtons />
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
