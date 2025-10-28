import React from 'react';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/layout/Navbar';
import { 
  Users, 
  Car, 
  DollarSign, 
  BarChart3, 
  Calendar,
  TrendingUp,
  Clock,
  MapPin
} from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();

  const stats = [
    {
      title: 'Espacios Ocupados',
      value: '45/100',
      icon: Car,
      color: 'from-blue-500 to-blue-700',
      change: '+12%',
    },
    {
      title: 'Ingresos Hoy',
      value: '$250,000',
      icon: DollarSign,
      color: 'from-green-500 to-green-700',
      change: '+8%',
    },
    {
      title: 'Vehículos Hoy',
      value: '78',
      icon: Users,
      color: 'from-purple-500 to-purple-700',
      change: '+15%',
    },
    {
      title: 'Tiempo Promedio',
      value: '2.5 hrs',
      icon: Clock,
      color: 'from-orange-500 to-orange-700',
      change: '-5%',
    },
  ];

  const recentActivity = [
    {
      id: 1,
      plate: 'ABC-123',
      action: 'Entrada',
      time: 'Hace 5 minutos',
      space: 'A-15',
    },
    {
      id: 2,
      plate: 'XYZ-789',
      action: 'Salida',
      time: 'Hace 12 minutos',
      space: 'B-08',
    },
    {
      id: 3,
      plate: 'DEF-456',
      action: 'Entrada',
      time: 'Hace 20 minutos',
      space: 'C-22',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            ¡Bienvenido, {user?.firstName}! 👋
          </h1>
          <p className="text-gray-600 text-lg">
            Este es tu panel de control del sistema de parqueadero
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="glass rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 animate-slide-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-xl flex items-center justify-center shadow-lg`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                <span className={`text-sm font-semibold ${
                  stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'
                }`}>
                  {stat.change}
                </span>
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Actividad Reciente */}
          <div className="glass rounded-2xl p-6 shadow-xl animate-slide-up" style={{ animationDelay: '0.4s' }}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                <Calendar className="w-6 h-6 mr-2 text-primary-600" />
                Actividad Reciente
              </h2>
              <button className="text-primary-600 hover:text-primary-700 font-medium text-sm transition-colors">
                Ver todo
              </button>
            </div>

            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      activity.action === 'Entrada' 
                        ? 'bg-green-100 text-green-600' 
                        : 'bg-blue-100 text-blue-600'
                    }`}>
                      <Car className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">{activity.plate}</p>
                      <p className="text-sm text-gray-500">{activity.time}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-700">{activity.action}</p>
                    <p className="text-sm text-gray-500 flex items-center">
                      <MapPin className="w-3 h-3 mr-1" />
                      {activity.space}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="glass rounded-2xl p-6 shadow-xl animate-slide-up" style={{ animationDelay: '0.5s' }}>
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
              <TrendingUp className="w-6 h-6 mr-2 text-secondary-600" />
              Acciones Rápidas
            </h2>

            <div className="grid grid-cols-2 gap-4">
              <button className="p-6 bg-gradient-to-r from-blue-500 to-blue-700 rounded-xl text-white hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <Car className="w-8 h-8 mb-3 mx-auto" />
                <p className="font-semibold text-center">Registrar Entrada</p>
              </button>

              <button className="p-6 bg-gradient-to-r from-green-500 to-green-700 rounded-xl text-white hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <DollarSign className="w-8 h-8 mb-3 mx-auto" />
                <p className="font-semibold text-center">Registrar Salida</p>
              </button>

              <button className="p-6 bg-gradient-to-r from-purple-500 to-purple-700 rounded-xl text-white hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <BarChart3 className="w-8 h-8 mb-3 mx-auto" />
                <p className="font-semibold text-center">Ver Reportes</p>
              </button>

              <button className="p-6 bg-gradient-to-r from-orange-500 to-orange-700 rounded-xl text-white hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <MapPin className="w-8 h-8 mb-3 mx-auto" />
                <p className="font-semibold text-center">Mapa de Espacios</p>
              </button>
            </div>
          </div>
        </div>

        {/* Info Banner */}
        <div className="mt-8 glass rounded-2xl p-6 shadow-xl animate-slide-up" style={{ animationDelay: '0.6s' }}>
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <div className="flex items-center justify-center h-12 w-12 rounded-full bg-blue-100">
                <BarChart3 className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <div className="ml-4 flex-1">
              <h3 className="text-lg font-semibold text-gray-800">
                Sistema de Autenticación Completado ✅
              </h3>
              <p className="mt-2 text-sm text-gray-600">
                El Sprint 1 está completo: Login, Registro, Verificación de cuenta, Recuperación de contraseña,
                Actualización de perfil y Cierre de sesión están funcionando correctamente.
              </p>
              <p className="mt-2 text-sm text-gray-500 font-medium">
                Próximos sprints: Gestión de vehículos, Control de espacios, Facturación y Reportes.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
