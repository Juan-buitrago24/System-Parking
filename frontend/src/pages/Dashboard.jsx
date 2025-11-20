import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Spinner from '../components/common/Spinner';
import vehicleService from '../services/vehicleService';
import { Car, LogIn, Users, BarChart3, MapPin, RefreshCcw, DollarSign, ScanLine } from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadStats = async () => {
    try {
      const response = await vehicleService.getStats();
      if (response.success) {
        setStats(response.data);
      }
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="xl" />
      </div>
    );
  }

  const statsCards = [
    {
      title: 'Vehiculos Activos',
      value: stats?.active || 0,
      icon: Car,
      color: 'from-blue-500 to-blue-700',
    },
    {
      title: 'Entradas Hoy',
      value: stats?.today || 0,
      icon: LogIn,
      color: 'from-green-500 to-green-700',
    },
    {
      title: 'Total Registrados',
      value: stats?.total || 0,
      icon: Users,
      color: 'from-purple-500 to-purple-700',
    },
    {
      title: 'Carros/Motos',
      value: `${stats?.byType?.CARRO || 0}/${stats?.byType?.MOTO || 0}`,
      icon: BarChart3,
      color: 'from-orange-500 to-orange-700',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8 animate-fade-in flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold text-gray-800 mb-2">
              Bienvenido, {user?.firstName}! 👋
            </h1>
            <p className="text-gray-600 text-lg">
              Panel de control del sistema de parqueadero
            </p>
          </div>
          <button
            onClick={loadStats}
            className="p-3 rounded-lg bg-white shadow-md hover:shadow-lg transition-all"
            title="Actualizar estadisticas"
          >
            <RefreshCcw className="w-5 h-5 text-primary-600" />
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statsCards.map((stat, index) => (
            <div
              key={index}
              className="glass rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 animate-slide-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-xl flex items-center justify-center shadow-lg`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
              </div>
              <h3 className="text-gray-600 text-sm font-medium mb-1">
                {stat.title}
              </h3>
              <p className="text-3xl font-bold text-gray-800">
                {stat.value}
              </p>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="glass rounded-2xl p-6 shadow-xl animate-slide-up" style={{ animationDelay: '0.4s' }}>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Acciones Rapidas
            </h2>

            <div className={`grid ${user?.role === 'ADMIN' ? 'grid-cols-2 lg:grid-cols-3' : 'grid-cols-2'} gap-4`}>
              <Link
                to="/vehicles/entry"
                className="p-6 bg-gradient-to-r from-blue-500 to-blue-700 rounded-xl text-white hover:shadow-lg transition-all duration-300 hover:-translate-y-1 text-center"
              >
                <LogIn className="w-8 h-8 mb-3 mx-auto" />
                <p className="font-semibold">Registrar Entrada</p>
              </Link>

              <Link
                to="/vehicles/exit"
                className="p-6 bg-gradient-to-r from-red-500 to-red-700 rounded-xl text-white hover:shadow-lg transition-all duration-300 hover:-translate-y-1 text-center"
              >
                <Car className="w-8 h-8 mb-3 mx-auto" />
                <p className="font-semibold">Registrar Salida</p>
              </Link>

              <Link
                to="/vehicles/active"
                className="p-6 bg-gradient-to-r from-purple-500 to-purple-700 rounded-xl text-white hover:shadow-lg transition-all duration-300 hover:-translate-y-1 text-center"
              >
                <BarChart3 className="w-8 h-8 mb-3 mx-auto" />
                <p className="font-semibold">Ver Activos</p>
              </Link>

              <Link
                to="/exit-control"
                className="p-6 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl text-white hover:shadow-lg transition-all duration-300 hover:-translate-y-1 text-center"
              >
                <ScanLine className="w-8 h-8 mb-3 mx-auto" />
                <p className="font-semibold">Control Salida AI</p>
              </Link>

              <Link
                to="/reports"
                className="p-6 bg-gradient-to-r from-indigo-500 to-indigo-700 rounded-xl text-white hover:shadow-lg transition-all duration-300 hover:-translate-y-1 text-center"
              >
                <BarChart3 className="w-8 h-8 mb-3 mx-auto" />
                <p className="font-semibold">Reportes</p>
              </Link>

              {user?.role === 'ADMIN' && (
                <Link
                  to="/rates"
                  className="p-6 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-xl text-white hover:shadow-lg transition-all duration-300 hover:-translate-y-1 text-center"
                >
                  <DollarSign className="w-8 h-8 mb-3 mx-auto" />
                  <p className="font-semibold">Gestionar Tarifas</p>
                </Link>
              )}

              <Link
                to="/profile"
                className="p-6 bg-gradient-to-r from-green-500 to-green-700 rounded-xl text-white hover:shadow-lg transition-all duration-300 hover:-translate-y-1 text-center"
              >
                <Users className="w-8 h-8 mb-3 mx-auto" />
                <p className="font-semibold">Mi Perfil</p>
              </Link>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="glass rounded-2xl p-6 shadow-xl animate-slide-up" style={{ animationDelay: '0.5s' }}>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Actividad Reciente
            </h2>

            <div className="space-y-4">
              {stats?.recentActivity && stats.recentActivity.length > 0 ? (
                stats.recentActivity.map((activity, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center space-x-4">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        activity.status === 'ACTIVO' 
                          ? 'bg-green-100 text-green-600' 
                          : 'bg-blue-100 text-blue-600'
                      }`}>
                        <Car className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800">{activity.plate}</p>
                        <p className="text-sm text-gray-500">{activity.type}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-700">
                        {activity.status === 'ACTIVO' ? 'Entrada' : 'Salida'}
                      </p>
                      {activity.parkingSpace && (
                        <p className="text-sm text-gray-500 flex items-center justify-end">
                          <MapPin className="w-3 h-3 mr-1" />
                          {activity.parkingSpace}
                        </p>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No hay actividad reciente
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sistema Completado Banner */}
        <div className="mt-8 glass rounded-2xl p-6 shadow-xl animate-slide-up" style={{ animationDelay: '0.6s' }}>
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <div className="flex items-center justify-center h-12 w-12 rounded-full bg-gradient-to-r from-green-400 to-emerald-500">
                <BarChart3 className="h-6 w-6 text-white" />
              </div>
            </div>
            <div className="ml-4 flex-1">
              <h3 className="text-lg font-semibold text-gray-800">
                Sistema de Parking Completo 🎉
              </h3>
              <p className="mt-2 text-sm text-gray-600">
                Plataforma completa con autenticación, gestión de vehículos, control de espacios, 
                sistema de facturación automática y reportes analíticos. ¡Listo para producción!
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <span className="px-3 py-1 text-xs font-medium bg-green-100 text-green-700 rounded-full">✓ Auth & Roles</span>
                <span className="px-3 py-1 text-xs font-medium bg-blue-100 text-blue-700 rounded-full">✓ Vehículos</span>
                <span className="px-3 py-1 text-xs font-medium bg-purple-100 text-purple-700 rounded-full">✓ Espacios</span>
                <span className="px-3 py-1 text-xs font-medium bg-orange-100 text-orange-700 rounded-full">✓ Facturación</span>
                <span className="px-3 py-1 text-xs font-medium bg-indigo-100 text-indigo-700 rounded-full">✓ Reportes</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
