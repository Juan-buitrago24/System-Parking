import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import authService from '../services/authService';
import Button from '../components/common/Button';

const VerifyAccount = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('loading'); // loading, success, error
  const [message, setMessage] = useState('');

  useEffect(() => {
    const verifyToken = async () => {
      try {
        const response = await authService.verifyAccount(token);
        
        if (response.success) {
          setStatus('success');
          setMessage(response.message || 'Tu cuenta ha sido verificada exitosamente.');
        }
      } catch (error) {
        setStatus('error');
        setMessage(error.response?.data?.message || 'Error al verificar la cuenta.');
      }
    };

    if (token) {
      verifyToken();
    } else {
      setStatus('error');
      setMessage('Token de verificación no válido.');
    }
  }, [token]);

  const handleRedirect = () => {
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full">
        <div className="glass rounded-2xl p-8 shadow-2xl text-center animate-slide-up">
          {status === 'loading' && (
            <>
              <Loader2 className="w-16 h-16 text-primary-500 animate-spin mx-auto mb-6" />
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Verificando tu cuenta...
              </h2>
              <p className="text-gray-600">
                Por favor espera mientras verificamos tu cuenta.
              </p>
            </>
          )}

          {status === 'success' && (
            <>
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 mb-6">
                <CheckCircle className="w-12 h-12 text-green-500" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                ¡Cuenta Verificada!
              </h2>
              <p className="text-gray-600 mb-6">{message}</p>
              <Button
                onClick={handleRedirect}
                variant="primary"
                size="lg"
                className="w-full"
              >
                Ir al Login
              </Button>
            </>
          )}

          {status === 'error' && (
            <>
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-red-100 mb-6">
                <XCircle className="w-12 h-12 text-red-500" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Error en la Verificación
              </h2>
              <p className="text-gray-600 mb-6">{message}</p>
              <Button
                onClick={handleRedirect}
                variant="outline"
                size="lg"
                className="w-full"
              >
                Ir al Login
              </Button>
            </>
          )}
        </div>

        <p className="text-center text-gray-500 text-sm mt-8">
          © 2025 System Parking. Todos los derechos reservados.
        </p>
      </div>
    </div>
  );
};

export default VerifyAccount;
