import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft } from 'lucide-react';
import authService from '../services/authService';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Alert from '../components/common/Alert';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [alert, setAlert] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAlert(null);
    setIsLoading(true);

    try {
      const response = await authService.forgotPassword(email);
      
      if (response.success) {
        setEmailSent(true);
        setAlert({
          type: 'success',
          title: '¡Correo enviado!',
          message: 'Si el correo existe, recibirás instrucciones para recuperar tu contraseña.',
        });
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Error al enviar el correo';
      setAlert({
        type: 'error',
        title: 'Error',
        message: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-purple-500 to-pink-600 mb-4 shadow-lg">
            <Mail className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gradient mb-2">
            ¿Olvidaste tu contraseña?
          </h1>
          <p className="text-gray-600">
            No te preocupes, te enviaremos instrucciones para recuperarla
          </p>
        </div>

        {/* Form Card */}
        <div className="glass rounded-2xl p-8 shadow-2xl animate-slide-up">
          {alert && (
            <Alert
              type={alert.type}
              title={alert.title}
              message={alert.message}
              className="mb-6"
              onClose={() => setAlert(null)}
            />
          )}

          {!emailSent ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <Input
                label="Correo electrónico"
                type="email"
                name="email"
                placeholder="tu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                icon={Mail}
                required
              />

              <Button
                type="submit"
                variant="primary"
                size="lg"
                isLoading={isLoading}
                className="w-full"
              >
                Enviar instrucciones
              </Button>
            </form>
          ) : (
            <div className="text-center py-4">
              <p className="text-gray-600 mb-4">
                Revisa tu bandeja de entrada y sigue las instrucciones para restablecer tu contraseña.
              </p>
              <Button
                onClick={() => {
                  setEmailSent(false);
                  setEmail('');
                  setAlert(null);
                }}
                variant="outline"
                size="md"
              >
                Enviar otro correo
              </Button>
            </div>
          )}

          <div className="mt-6 text-center">
            <Link
              to="/login"
              className="inline-flex items-center text-sm text-primary-600 hover:text-primary-700 font-medium transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver al inicio de sesión
            </Link>
          </div>
        </div>

        <p className="text-center text-gray-500 text-sm mt-8">
          © 2025 System Parking. Todos los derechos reservados.
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;
