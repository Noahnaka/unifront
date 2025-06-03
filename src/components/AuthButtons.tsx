import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';

const AuthButtons = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  if (token) {
    return (
      <button
        onClick={handleLogout}
        className="group flex items-center space-x-2 px-4 py-2 border border-red-500/50 text-red-400 rounded-lg hover:bg-red-500/10 hover:border-red-500 transition-all duration-300 hover:shadow-lg hover:shadow-red-500/20"
      >
        <LogOut className="w-4 h-4 group-hover:rotate-12 transition-transform duration-300" />
        <span>Sair</span>
      </button>
    );
  }

  return (
    <div className="flex items-center space-x-4">
      <Link
        to="/login"
        className="px-4 py-2 text-gray-300 hover:text-white transition-colors duration-300"
      >
        Entrar
      </Link>
      <Link
        to="/register"
        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all duration-300"
      >
        Registrar
      </Link>
    </div>
  );
};

export default AuthButtons;
