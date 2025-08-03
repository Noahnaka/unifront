import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Trophy, Calendar, Users, Target } from 'lucide-react';
import AuthButtons from './AuthButtons';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const [hasToken, setHasToken] = useState(false);
  const [points, setPoints] = useState<number | null>(null);
  const [isLoadingPoints, setIsLoadingPoints] = useState(false);

  useEffect(() => {
    const checkToken = () => {
      setHasToken(!!localStorage.getItem('token'));
    };

    // Check token on mount
    checkToken();

    // Listen for storage changes (when token is added/removed from other tabs/windows)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'token') {
        checkToken();
      }
    };

    // Listen for custom events (when token changes in same tab)
    const handleTokenChange = () => {
      checkToken();
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('tokenChanged', handleTokenChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('tokenChanged', handleTokenChange);
    };
  }, []);

  useEffect(() => {
    const fetchPoints = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setPoints(null);
        return;
      }

      setIsLoadingPoints(true);
      try {

        const token = localStorage.getItem('token');
        const id = await fetch('http://localhost:3000/api/token/conta/cliente', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });
        const idData = await id.json();
        const idCliente = idData.payload.id_cliente;

        const response = await fetch(`http://localhost:3000/api/cliente/pontos/${idCliente}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });

        const data = await response.json();
        if (response.ok && data.data) {
          setPoints(data.data.pontos_cliente);
        } else {
          setPoints(null);
        }
      } catch (err) {
        console.error('Error fetching points:', err);
        setPoints(null);
      } finally {
        setIsLoadingPoints(false);
      }
    };

    if (hasToken) {
      fetchPoints();
    }
  }, [hasToken]);

  const navItems = [
    { name: 'Home', path: '/', icon: Trophy },
    ...(hasToken ? [{ name: 'Lutas', path: '/fights', icon: Target }] : []),
    { name: 'Ranking', path: '/leaderboard', icon: Trophy },
  ];

  const formatPoints = (points: number | null) => {
    if (points === null) return '0';
    return points.toLocaleString();
  };

  return (
    <nav className="fixed top-0 w-full z-50 glass-card border-b border-red-500/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-16 w-full">
          {/* Left: Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center space-x-2">
              <img 
                src="/lovable-uploads/78360296-cdb9-4f57-bbd8-a809fa46aa25.png" 
                alt="UNIBET" 
                className="h-8 w-auto transform hover:scale-110 transition-transform duration-300"
              />
            </Link>
          </div>

          {/* Center: Nav Items */}
          <div className="hidden md:flex flex-1 justify-center items-center space-x-8">
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

          {/* Right: Auth + Points */}
          <div className="flex items-center ml-auto space-x-4">
            <div className="hidden md:block">
              <AuthButtons />
            </div>
            {/* Points Section (Desktop, Far Right) */}
            {hasToken && (
              <div className="hidden md:flex items-center">
                <span className="bg-red-500/20 text-red-400 border border-red-400 rounded-full px-4 py-1 font-semibold text-sm shadow-sm">
                  Points: <span className="text-white font-bold">
                    {isLoadingPoints ? (
                      <span className="animate-pulse">...</span>
                    ) : (
                      formatPoints(points)
                    )}
                  </span>
                </span>
              </div>
            )}
            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden text-gray-300 hover:text-white transition-colors duration-300"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden py-4 space-y-4">
            {/* Points Section (Mobile) */}
            {hasToken && (
              <div className="px-4 py-2">
                <span className="bg-red-500/20 text-red-400 border border-red-400 rounded-full px-4 py-1 font-semibold text-sm shadow-sm">
                  Points: <span className="text-white font-bold">
                    {isLoadingPoints ? (
                      <span className="animate-pulse">...</span>
                    ) : (
                      formatPoints(points)
                    )}
                  </span>
                </span>
              </div>
            )}
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
