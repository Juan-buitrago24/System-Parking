import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Spinner from '../components/common/Spinner';
import vehicleService from '../services/vehicleService';
import { Car, LogIn, Users, BarChart3, MapPin, RefreshCcw } from 'lucide-react';

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

            <div className="grid grid-cols-2 gap-4">
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

        {/* Info Banner */}
        <div className="mt-8 glass rounded-2xl p-6 shadow-xl animate-slide-up" style={{ animationDelay: '0.6s' }}>
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <div className="flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                <BarChart3 className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <div className="ml-4 flex-1">
              <h3 className="text-lg font-semibold text-gray-800">
                Sprint 2 Completado ✅
              </h3>
              <p className="mt-2 text-sm text-gray-600">
                Sistema de Gestion de Vehiculos implementado: Registro de entrada/salida, busqueda de vehiculos, 
                lista de activos e historial estan funcionando correctamente.
              </p>
              <p className="mt-2 text-sm text-gray-500 font-medium">
                Proximos sprints: Control de espacios, Facturacion y Reportes.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
