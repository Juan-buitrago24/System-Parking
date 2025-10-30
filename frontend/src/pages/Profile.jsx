import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, Lock, Save } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import authService from '../services/authService';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Alert from '../components/common/Alert';
import Spinner from '../components/common/Spinner';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [alert, setAlert] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await authService.getProfile();
        if (response.success) {
          setProfileData({
            firstName: response.data.firstName || '',
            lastName: response.data.lastName || '',
            phone: response.data.phone || '',
            email: response.data.email || '',
          });
        }
      } catch (error) {
        console.error('Error al cargar perfil:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setAlert(null);
    setIsUpdating(true);

    try {
      const { email, ...dataToUpdate } = profileData;
      const response = await authService.updateProfile(dataToUpdate);
      
      if (response.success) {
        updateUser(response.data);
        setAlert({
          type: 'success',
          message: 'Perfil actualizado exitosamente.',
        });
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Error al actualizar perfil';
      setAlert({
        type: 'error',
        message: errorMessage,
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setAlert(null);
    setErrors({});

    // Validar contraseñas
    const newErrors = {};
    if (passwordData.newPassword.length < 6) {
      newErrors.newPassword = 'La contraseña debe tener al menos 6 caracteres';
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsChangingPassword(true);

    try {
      const response = await authService.changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });
      
      if (response.success) {
        setAlert({
          type: 'success',
          message: 'Contraseña actualizada exitosamente.',
        });
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        });
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Error al cambiar contraseña';
      setAlert({
        type: 'error',
        message: errorMessage,
      });
    } finally {
      setIsChangingPassword(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="xl" />
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 animate-fade-in">
          <h1 className="text-4xl font-bold text-gradient mb-2">
            Mi Perfil
          </h1>
          <p className="text-gray-600">Administra tu información personal</p>
        </div>

        {alert && (
          <Alert
            type={alert.type}
            message={alert.message}
            className="mb-6 animate-slide-down"
            onClose={() => setAlert(null)}
          />
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Información Personal */}
          <div className="glass rounded-2xl p-8 shadow-xl animate-slide-up">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
              <User className="w-6 h-6 mr-2 text-primary-600" />
              Información Personal
            </h2>

            <form onSubmit={handleProfileSubmit} className="space-y-4">
              <Input
                label="Nombre"
                type="text"
                name="firstName"
                value={profileData.firstName}
                onChange={handleProfileChange}
                icon={User}
                required
              />

              <Input
                label="Apellido"
                type="text"
                name="lastName"
                value={profileData.lastName}
                onChange={handleProfileChange}
                icon={User}
                required
              />

              <Input
                label="Correo electrónico"
                type="email"
                name="email"
                value={profileData.email}
                icon={Mail}
                disabled
                className="bg-gray-100 cursor-not-allowed"
              />

              <Input
                label="Teléfono"
                type="tel"
                name="phone"
                value={profileData.phone}
                onChange={handleProfileChange}
                icon={Phone}
              />

              <Button
                type="submit"
                variant="primary"
                size="lg"
                isLoading={isUpdating}
                icon={Save}
                className="w-full"
              >
                Guardar Cambios
              </Button>
            </form>
          </div>

          {/* Cambiar Contraseña */}
          <div className="glass rounded-2xl p-8 shadow-xl animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
              <Lock className="w-6 h-6 mr-2 text-secondary-600" />
              Cambiar Contraseña
            </h2>

            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <Input
                label="Contraseña actual"
                type="password"
                name="currentPassword"
                placeholder="••••••••"
                value={passwordData.currentPassword}
                onChange={handlePasswordChange}
                icon={Lock}
                required
              />

              <Input
                label="Nueva contraseña"
                type="password"
                name="newPassword"
                placeholder="••••••••"
                value={passwordData.newPassword}
                onChange={handlePasswordChange}
                error={errors.newPassword}
                icon={Lock}
                required
              />

              <Input
                label="Confirmar nueva contraseña"
                type="password"
                name="confirmPassword"
                placeholder="••••••••"
                value={passwordData.confirmPassword}
                onChange={handlePasswordChange}
                error={errors.confirmPassword}
                icon={Lock}
                required
              />

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-sm text-yellow-800">
                <p className="font-medium mb-1">Consejos de seguridad:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Usa al menos 6 caracteres</li>
                  <li>Combina letras y números</li>
                  <li>Evita información personal</li>
                </ul>
              </div>

              <Button
                type="submit"
                variant="secondary"
                size="lg"
                isLoading={isChangingPassword}
                className="w-full"
              >
                Actualizar Contraseña
              </Button>
            </form>
          </div>
        </div>

        {/* Info Card */}
        <div className="glass rounded-2xl p-6 shadow-xl mt-6 animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <div className="flex items-center justify-center h-12 w-12 rounded-full bg-blue-100">
                <Mail className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-800">Información de cuenta</h3>
              <p className="mt-1 text-sm text-gray-600">
                Tu correo electrónico no puede ser modificado. Si necesitas cambiar tu email, 
                contacta al administrador del sistema.
              </p>
              <div className="mt-3 flex items-center text-sm text-gray-500">
                <span className="font-medium">Rol:</span>
                <span className="ml-2 px-3 py-1 rounded-full bg-primary-100 text-primary-700 font-semibold">
                  {user?.role || 'EMPLOYEE'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
