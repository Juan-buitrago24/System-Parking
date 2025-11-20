import React, { useState } from 'react';
import { Camera, AlertTriangle, CheckCircle, X, DollarSign } from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import CameraCapture from '../components/common/CameraCapture';
import { validateExit } from '../services/plateRecognitionService';
import paymentService from '../services/paymentService';
import { useNavigate } from 'react-router-dom';

const ExitControl = () => {
  const navigate = useNavigate();
  const [scanResult, setScanResult] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [showCamera, setShowCamera] = useState(false);

  const handleCapture = async (imageFile) => {
    setIsScanning(true);
    setShowCamera(false);

    try {
      const result = await validateExit(imageFile);
      setScanResult(result);
    } catch (error) {
      setScanResult({
        success: false,
        allowExit: false,
        reason: error.response?.data?.reason || 'ERROR',
        message: error.response?.data?.message || 'Error al validar salida',
        data: error.response?.data?.data
      });
    } finally {
      setIsScanning(false);
    }
  };

  const handleProcessPayment = () => {
    // Redirigir a página de salida con la placa pre-llena
    if (scanResult?.data?.plate) {
      navigate(`/vehicle-exit?plate=${scanResult.data.plate}`);
    }
  };

  const resetScan = () => {
    setScanResult(null);
    setIsScanning(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <h1 className="text-4xl font-bold text-gradient mb-2">
            🚦 Control de Salida
          </h1>
          <p className="text-gray-600 text-lg">
            Escanea la placa del vehículo para verificar el pago antes de autorizar salida
          </p>
        </div>

        {/* Sin resultado - Mostrar botón de escaneo */}
        {!scanResult && !isScanning && (
          <div className="glass rounded-2xl p-12 text-center shadow-xl animate-slide-up">
            <Camera className="w-24 h-24 mx-auto mb-6 text-primary-600" />
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Escanear Placa del Vehículo
            </h2>
            <p className="text-gray-600 mb-8">
              Toma una foto de la placa para verificar el estado del pago
            </p>
            <button
              onClick={() => setShowCamera(true)}
              className="px-12 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-bold text-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 inline-flex items-center gap-3"
            >
              <Camera className="w-6 h-6" />
              Escanear Placa
            </button>
          </div>
        )}

        {/* Procesando */}
        {isScanning && (
          <div className="glass rounded-2xl p-12 text-center shadow-xl">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-6"></div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Analizando Placa...
            </h2>
            <p className="text-gray-600">
              Verificando en el sistema
            </p>
          </div>
        )}

        {/* Resultado: PAGO PENDIENTE */}
        {scanResult && !scanResult.allowExit && scanResult.reason === 'PAYMENT_REQUIRED' && (
          <div className="glass rounded-2xl p-8 border-4 border-red-500 shadow-2xl animate-slide-up">
            <div className="flex items-center justify-center mb-6">
              <div className="bg-red-100 p-4 rounded-full animate-pulse">
                <AlertTriangle className="w-20 h-20 text-red-600" />
              </div>
            </div>

            <h2 className="text-4xl font-bold text-center text-red-600 mb-6">
              🚫 SALIDA NO AUTORIZADA
            </h2>

            <div className="bg-red-50 rounded-xl p-6 space-y-4 mb-6">
              <div className="flex justify-between items-center text-lg pb-3 border-b border-red-200">
                <span className="font-semibold text-gray-700">Placa:</span>
                <span className="font-mono text-3xl font-bold text-gray-900">
                  {scanResult.data.plate}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="font-semibold text-gray-700">Tipo:</span>
                <span className="text-gray-900">{scanResult.data.vehicleType}</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="font-semibold text-gray-700">Propietario:</span>
                <span className="text-gray-900">{scanResult.data.ownerName}</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="font-semibold text-gray-700">Entrada:</span>
                <span className="text-gray-900">
                  {new Date(scanResult.data.entryTime).toLocaleString('es-CO')}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="font-semibold text-gray-700">Tiempo:</span>
                <span className="text-gray-900 font-medium">{scanResult.data.duration}</span>
              </div>

              <div className="border-t-2 border-red-400 pt-4 flex justify-between items-center">
                <span className="font-bold text-xl text-gray-800">Monto a Pagar:</span>
                <span className="font-bold text-3xl text-red-600">
                  ${scanResult.data.estimatedAmount?.toLocaleString()} COP
                </span>
              </div>
            </div>

            <div className="space-y-3">
              <button
                onClick={handleProcessPayment}
                className="w-full py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-bold text-lg hover:from-green-600 hover:to-emerald-700 transition-all flex items-center justify-center gap-3 shadow-lg"
              >
                <DollarSign className="w-6 h-6" />
                Procesar Pago Ahora
              </button>
              <button
                onClick={resetScan}
                className="w-full py-3 bg-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-300 transition-colors"
              >
                Escanear Otro Vehículo
              </button>
            </div>
          </div>
        )}

        {/* Resultado: SALIDA AUTORIZADA */}
        {scanResult && scanResult.allowExit && (
          <div className="glass rounded-2xl p-8 border-4 border-green-500 shadow-2xl animate-slide-up">
            <div className="flex items-center justify-center mb-6">
              <div className="bg-green-100 p-4 rounded-full animate-bounce">
                <CheckCircle className="w-20 h-20 text-green-600" />
              </div>
            </div>

            <h2 className="text-4xl font-bold text-center text-green-600 mb-6">
              ✅ SALIDA AUTORIZADA
            </h2>

            <div className="bg-green-50 rounded-xl p-6 space-y-4 mb-6">
              <div className="flex justify-between items-center text-lg pb-3 border-b border-green-200">
                <span className="font-semibold text-gray-700">Placa:</span>
                <span className="font-mono text-3xl font-bold text-gray-900">
                  {scanResult.data.plate}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="font-semibold text-gray-700">Tipo:</span>
                <span className="text-gray-900">{scanResult.data.vehicleType}</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="font-semibold text-gray-700">Duración:</span>
                <span className="text-gray-900 font-medium">{scanResult.data.duration}</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="font-semibold text-gray-700">Método de Pago:</span>
                <span className="text-gray-900">{scanResult.data.paymentMethod}</span>
              </div>

              <div className="border-t-2 border-green-400 pt-4 flex justify-between items-center">
                <span className="font-bold text-xl text-gray-800">Monto Pagado:</span>
                <span className="font-bold text-3xl text-green-600">
                  ${scanResult.data.paidAmount?.toLocaleString()} COP
                </span>
              </div>
            </div>

            <div className="text-center mb-6">
              <p className="text-lg text-green-700 font-semibold mb-2">
                🚧 Barrera Abierta
              </p>
              <p className="text-gray-600">
                El vehículo puede salir del parqueadero
              </p>
            </div>

            <button
              onClick={resetScan}
              className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-bold text-lg hover:shadow-xl transition-all"
            >
              Siguiente Vehículo
            </button>
          </div>
        )}

        {/* Resultado: VEHÍCULO NO ENCONTRADO */}
        {scanResult && scanResult.reason === 'VEHICLE_NOT_FOUND' && (
          <div className="glass rounded-2xl p-8 border-4 border-yellow-500 shadow-2xl animate-slide-up">
            <div className="flex items-center justify-center mb-6">
              <AlertTriangle className="w-20 h-20 text-yellow-600" />
            </div>

            <h2 className="text-3xl font-bold text-center text-yellow-600 mb-4">
              ⚠️ Vehículo No Registrado
            </h2>

            <div className="bg-yellow-50 rounded-xl p-6 mb-6 text-center">
              <p className="text-lg text-gray-700 mb-2">
                {scanResult.data?.detectedPlate && (
                  <span className="font-mono text-2xl font-bold block mb-2">
                    {scanResult.data.detectedPlate}
                  </span>
                )}
                Este vehículo no tiene registro de entrada en el sistema
              </p>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => navigate('/active-vehicles')}
                className="w-full py-4 bg-yellow-500 text-white rounded-xl font-bold text-lg hover:bg-yellow-600 transition-colors"
              >
                Verificar Manualmente en Lista
              </button>
              <button
                onClick={resetScan}
                className="w-full py-3 bg-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-300 transition-colors"
              >
                Escanear Otro Vehículo
              </button>
            </div>
          </div>
        )}

        {/* Resultado: ERROR */}
        {scanResult && scanResult.reason === 'NO_PLATE_DETECTED' && (
          <div className="glass rounded-2xl p-8 border-4 border-gray-400 shadow-xl animate-slide-up">
            <div className="text-center">
              <X className="w-16 h-16 mx-auto mb-4 text-gray-500" />
              <h2 className="text-2xl font-bold text-gray-700 mb-4">
                No se Pudo Leer la Placa
              </h2>
              <p className="text-gray-600 mb-6">
                Intenta con mejor iluminación o ángulo, o verifica manualmente
              </p>
              <button
                onClick={resetScan}
                className="px-8 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors"
              >
                Intentar de Nuevo
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Cámara Modal */}
      {showCamera && (
        <CameraCapture
          onCapture={handleCapture}
          onClose={() => setShowCamera(false)}
        />
      )}
    </div>
  );
};

export default ExitControl;
