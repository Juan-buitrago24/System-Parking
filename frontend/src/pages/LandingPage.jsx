import { Link } from 'react-router-dom';
import { Car, ParkingSquare, DollarSign, BarChart3, Shield, Clock, CheckCircle, ArrowRight, Zap, Users } from 'lucide-react';

const LandingPage = () => {
  const features = [
    {
      icon: Shield,
      title: 'Autenticación Segura',
      description: 'Sistema de login robusto con JWT, roles de usuario y verificación por email.',
      gradient: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Car,
      title: 'Gestión de Vehículos',
      description: 'Registro de entrada/salida, búsqueda inteligente e historial completo.',
      gradient: 'from-purple-500 to-pink-500'
    },
    {
      icon: ParkingSquare,
      title: 'Control de Espacios',
      description: 'Asignación automática, vista en tiempo real y gestión de capacidad.',
      gradient: 'from-green-500 to-emerald-500'
    },
    {
      icon: DollarSign,
      title: 'Facturación Inteligente',
      description: 'Cálculo automático de tarifas, múltiples métodos de pago y recibos digitales.',
      gradient: 'from-orange-500 to-red-500'
    },
    {
      icon: BarChart3,
      title: 'Reportes Avanzados',
      description: 'Analytics completos, métricas en tiempo real y exportación a CSV.',
      gradient: 'from-indigo-500 to-purple-500'
    },
    {
      icon: Clock,
      title: 'Tiempo Real',
      description: 'Actualización instantánea de ocupación y disponibilidad de espacios.',
      gradient: 'from-yellow-500 to-orange-500'
    }
  ];

  const stats = [
    { value: '5', label: 'Módulos Completos', icon: CheckCircle },
    { value: '47+', label: 'Endpoints API', icon: Zap },
    { value: '100%', label: 'Responsive', icon: Users }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-1/2 -right-1/4 w-96 h-96 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-1/2 -left-1/4 w-96 h-96 bg-gradient-to-br from-green-400/20 to-blue-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>

        {/* Navigation */}
        <nav className="relative z-10 container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                <ParkingSquare className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                System Parking
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                to="/login"
                className="px-6 py-2.5 text-gray-700 hover:text-blue-600 font-medium transition-colors"
              >
                Iniciar Sesión
              </Link>
              <Link
                to="/register"
                className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-medium hover:shadow-lg hover:scale-105 transition-all duration-300"
              >
                Comenzar Gratis
              </Link>
            </div>
          </div>
        </nav>

        {/* Hero Content */}
        <div className="relative z-10 container mx-auto px-6 pt-20 pb-32">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center space-x-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full shadow-lg mb-8 animate-fade-in">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span className="text-sm font-medium text-gray-700">100% Operacional · 5 Sprints Completados</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 animate-slide-up">
              Gestión de Parqueaderos
              <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mt-2">
                Simplificada y Moderna
              </span>
            </h1>

            <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto animate-slide-up" style={{ animationDelay: '0.1s' }}>
              Plataforma completa para administrar tu parqueadero: control de vehículos, espacios, facturación automática y reportes detallados. Todo en un solo lugar.
            </p>

            <div className="flex items-center justify-center space-x-4 animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <Link
                to="/register"
                className="group px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-2xl hover:scale-105 transition-all duration-300 flex items-center space-x-2"
              >
                <span>Empezar Ahora</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/login"
                className="px-8 py-4 bg-white/80 backdrop-blur-sm text-gray-700 rounded-xl font-semibold hover:shadow-xl hover:scale-105 transition-all duration-300 border border-gray-200"
              >
                Ver Demo
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 mt-20 max-w-3xl mx-auto animate-slide-up" style={{ animationDelay: '0.3s' }}>
              {stats.map((stat, index) => (
                <div key={index} className="glass rounded-2xl p-6 hover:scale-105 transition-transform">
                  <stat.icon className="w-8 h-8 text-blue-600 mx-auto mb-3" />
                  <div className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="relative py-24 bg-white/50 backdrop-blur-sm">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Características Principales
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Todo lo que necesitas para gestionar tu parqueadero de forma profesional
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group glass rounded-2xl p-8 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 animate-slide-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className={`w-14 h-14 bg-gradient-to-br ${feature.gradient} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                  <feature.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tech Stack Section */}
      <div className="relative py-24">
        <div className="container mx-auto px-6">
          <div className="glass rounded-3xl p-12 max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">
              Stack Tecnológico Moderno
            </h2>
            <p className="text-center text-gray-600 mb-10">
              Construido con las últimas tecnologías para garantizar rendimiento y escalabilidad
            </p>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Backend</h3>
                <div className="flex flex-wrap gap-3">
                  <span className="px-4 py-2 bg-gradient-to-r from-green-400 to-green-600 text-white rounded-lg text-sm font-medium">Node.js</span>
                  <span className="px-4 py-2 bg-gradient-to-r from-gray-700 to-gray-900 text-white rounded-lg text-sm font-medium">Express</span>
                  <span className="px-4 py-2 bg-gradient-to-r from-blue-400 to-blue-600 text-white rounded-lg text-sm font-medium">PostgreSQL</span>
                  <span className="px-4 py-2 bg-gradient-to-r from-indigo-400 to-indigo-600 text-white rounded-lg text-sm font-medium">Prisma ORM</span>
                  <span className="px-4 py-2 bg-gradient-to-r from-purple-400 to-purple-600 text-white rounded-lg text-sm font-medium">JWT</span>
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Frontend</h3>
                <div className="flex flex-wrap gap-3">
                  <span className="px-4 py-2 bg-gradient-to-r from-cyan-400 to-cyan-600 text-white rounded-lg text-sm font-medium">React 18</span>
                  <span className="px-4 py-2 bg-gradient-to-r from-purple-400 to-purple-600 text-white rounded-lg text-sm font-medium">Vite</span>
                  <span className="px-4 py-2 bg-gradient-to-r from-blue-400 to-blue-600 text-white rounded-lg text-sm font-medium">Tailwind CSS</span>
                  <span className="px-4 py-2 bg-gradient-to-r from-orange-400 to-orange-600 text-white rounded-lg text-sm font-medium">React Router</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600"></div>
        <div className="absolute inset-0 bg-black/10"></div>
        
        <div className="relative z-10 container mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            ¿Listo para transformar tu parqueadero?
          </h2>
          <p className="text-xl text-white/90 mb-10 max-w-2xl mx-auto">
            Únete a los negocios que están modernizando su gestión con System Parking
          </p>
          <Link
            to="/register"
            className="inline-flex items-center space-x-2 px-10 py-4 bg-white text-purple-600 rounded-xl font-bold text-lg hover:shadow-2xl hover:scale-105 transition-all duration-300"
          >
            <span>Comenzar Gratis</span>
            <ArrowRight className="w-6 h-6" />
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <ParkingSquare className="w-6 h-6" />
              <span className="text-lg font-bold">System Parking</span>
            </div>
            <div className="text-gray-400 text-sm">
              © 2025 System Parking. Hecho con ❤️ por Juan Buitrago & Kevin Coy
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
