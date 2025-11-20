import React, { useState } from 'react';
import { Car, User, Phone, Mail, MapPin, FileText, Camera } from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Alert from '../components/common/Alert';
import CameraCapture from '../components/common/CameraCapture';
import vehicleService from '../services/vehicleService';
import { recognizePlate } from '../services/plateRecognitionService';

const VehicleEntry = () => {
  const [formData, setFormData] = useState({
    plate: '',
    type: 'CARRO',
    color: '',
    brand: '',
    model: '',
    ownerName: '',
    ownerPhone: '',
    ownerEmail: '',
    parkingSpace: '',
    observations: ''
  });
  const [alert, setAlert] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [recognitionData, setRecognitionData] = useState(null);
  const [isScanning, setIsScanning] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCapture = async (imageFile) => {
    setIsScanning(true);
    setShowCamera(false);
    
    try {
      const result = await recognizePlate(imageFile);
      
      if (result.success) {
        console.log('📥 Datos recibidos de la API:', result.data);
        setRecognitionData(result.data);
        
        // Formatear valores detectados
        const capitalizeWords = (str) => {
          if (!str) return '';
          return str.split(' ').map(word => 
            word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
          ).join(' ');
        };
        
        // Auto-rellenar formulario con datos detectados
        const detectedData = {
          plate: result.data.plate?.toUpperCase() || '',
          type: result.data.vehicleType || '',
          color: capitalizeWords(result.data.color) || '',
          brand: capitalizeWords(result.data.make) || '',
          model: capitalizeWords(result.data.model) || ''
        };
        
        console.log('🎨 Datos formateados para el formulario:', detectedData);
        
        setFormData(prev => ({
          ...prev,
          ...detectedData,
          recognizedBy: 'AI',
          plateConfidence: result.data.confidence
        }));
        
        // Construir mensaje detallado de lo detectado
        const confidence = Math.round(result.data.confidence * 100);
        let detectedFields = [`Placa: ${detectedData.plate}`];
        if (detectedData.type) detectedFields.push(`Tipo: ${detectedData.type}`);
        if (detectedData.color) detectedFields.push(`Color: ${detectedData.color}`);
        if (detectedData.brand) detectedFields.push(`Marca: ${detectedData.brand}`);
        if (detectedData.model) detectedFields.push(`Modelo: ${detectedData.model}`);
        
        let alertType = 'success';
        let title = '✅ Datos detectados por IA!';
        let message = `${detectedFields.join(' | ')}`;
        
        // Advertencia si falta información del vehículo
        const missingVehicleInfo = !detectedData.color && !detectedData.brand && !detectedData.model;
        if (missingVehicleInfo) {
          message += '\n\n⚠️ Color, marca y modelo no detectados.';
          message += '\n💡 Razón: Plan gratuito de PlateRecognizer solo detecta placa y tipo.';
          message += '\n✏️ Ingresa manualmente o actualiza plan en platerecognizer.com';
          alertType = 'info';
          title = '✅ Placa y tipo detectados';
        }
        
        if (confidence < 70) {
          alertType = 'warning';
          title = '⚠️ Verificación requerida';
          message += ` (${confidence}% confianza - Verifica antes de guardar)`;
        } else if (confidence < 85) {
          message += ` (${confidence}% confianza - Revisa los datos)`;
        } else if (!missingVehicleInfo) {
          message += ` (${confidence}% confianza)`;
        }
        
        setAlert({
          type: alertType,
          title,
          message
        });
      }
    } catch (error) {
      console.error('Error al reconocer placa:', error);
      const suggestion = error.response?.data?.suggestion;
      setAlert({
        type: 'error',
        title: 'Error al escanear',
        message: error.response?.data?.message || 'No se pudo reconocer la placa.',
        suggestion: suggestion || 'Intenta de nuevo o ingresa manualmente.'
      });
    } finally {
      setIsScanning(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAlert(null);
    setIsLoading(true);

    try {
      const response = await vehicleService.registerEntry(formData);
      
      if (response.success) {
        setAlert({
          type: 'success',
          title: '¡Entrada registrada!',
          message: `Vehículo ${formData.plate} registrado exitosamente.`
        });
        
        // Limpiar formulario
        setFormData({
          plate: '',
          type: 'CARRO',
          color: '',
          brand: '',
          model: '',
          ownerName: '',
          ownerPhone: '',
          ownerEmail: '',
          parkingSpace: '',
          observations: ''
        });
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Error al registrar entrada';
      const errorsList = error.response?.data?.errors;
      
      setAlert({
        type: 'error',
        title: 'Error',
        message: errorsList || errorMessage
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <h1 className="text-4xl font-bold text-gradient mb-2">
            Registro de Entrada
          </h1>
          <p className="text-gray-600 text-lg">
            Registra la entrada de un vehículo al parqueadero
          </p>
        </div>

        <div className="glass rounded-2xl p-8 shadow-xl animate-slide-up">
          {alert && (
            <Alert
              type={alert.type}
              title={alert.title}
              message={alert.message}
              className="mb-6"
              onClose={() => setAlert(null)}
            />
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Información del Vehículo */}
            <div className="border-b border-gray-200 pb-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                <Car className="w-6 h-6 mr-2 text-primary-600" />
                Información del Vehículo
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Placa * {recognitionData && formData.plate && (
                      <span className="text-green-600 text-xs ml-2">
                        🤖 IA: {Math.round(recognitionData.confidence * 100)}% confianza
                      </span>
                    )}
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      name="plate"
                      placeholder="ABC-123"
                      value={formData.plate}
                      onChange={handleChange}
                      required
                      className="flex-1 block w-full rounded-lg border-2 border-gray-300 px-4 py-3 uppercase focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowCamera(true)}
                      disabled={isScanning}
                      className="px-4 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all flex items-center gap-2 shadow-lg disabled:opacity-50"
                      title="Escanear placa con cámara"
                    >
                      <Camera className="w-5 h-5" />
                      {isScanning ? '...' : ''}
                    </button>
                  </div>
                  {isScanning && (
                    <p className="text-sm text-gray-600 mt-1 flex items-center gap-2">
                      <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-600"></div>
                      Analizando imagen...
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tipo de Vehículo * {recognitionData && formData.type && recognitionData.vehicleType && (
                      <span className="text-green-600 text-xs ml-2">
                        🤖 Detectado por IA
                      </span>
                    )}
                  </label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    className="block w-full rounded-lg border-2 border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
                    required
                  >
                    <option value="CARRO">Carro</option>
                    <option value="MOTO">Moto</option>
                    <option value="CAMIONETA">Camioneta</option>
                    <option value="CAMION">Camión</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Color {recognitionData && formData.color && recognitionData.color && (
                      <span className="text-blue-600 text-xs ml-2">
                        🎨 IA
                      </span>
                    )}
                  </label>
                  <input
                    label="Color"
                    type="text"
                    name="color"
                    placeholder="Rojo, Azul, Negro..."
                    value={formData.color}
                    onChange={handleChange}
                    className="block w-full rounded-lg border-2 border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Marca {recognitionData && formData.brand && recognitionData.make && (
                      <span className="text-purple-600 text-xs ml-2">
                        🏭 IA
                      </span>
                    )}
                  </label>
                  <input
                    label="Marca"
                    type="text"
                    name="brand"
                    placeholder="Toyota, Mazda, Honda..."
                    value={formData.brand}
                    onChange={handleChange}
                    className="block w-full rounded-lg border-2 border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Modelo {recognitionData && formData.model && recognitionData.model && (
                      <span className="text-indigo-600 text-xs ml-2">
                        🚗 IA
                      </span>
                    )}
                  </label>
                  <input
                    label="Modelo"
                    type="text"
                    name="model"
                    placeholder="2020, Corolla, etc."
                    value={formData.model}
                    onChange={handleChange}
                    className="block w-full rounded-lg border-2 border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
                  />
                </div>

                <Input
                  label="Espacio de Parqueo"
                  type="text"
                  name="parkingSpace"
                  placeholder="A-15, B-08..."
                  value={formData.parkingSpace}
                  onChange={handleChange}
                  icon={MapPin}
                />
              </div>
            </div>

            {/* Información del Propietario */}
            <div className="border-b border-gray-200 pb-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                <User className="w-6 h-6 mr-2 text-secondary-600" />
                Información del Propietario
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Nombre del Propietario *"
                  type="text"
                  name="ownerName"
                  placeholder="Juan Pérez"
                  value={formData.ownerName}
                  onChange={handleChange}
                  icon={User}
                  required
                />

                <Input
                  label="Teléfono"
                  type="tel"
                  name="ownerPhone"
                  placeholder="3001234567"
                  value={formData.ownerPhone}
                  onChange={handleChange}
                  icon={Phone}
                />

                <Input
                  label="Email"
                  type="email"
                  name="ownerEmail"
                  placeholder="propietario@email.com"
                  value={formData.ownerEmail}
                  onChange={handleChange}
                  icon={Mail}
                  className="md:col-span-2"
                />
              </div>
            </div>

            {/* Observaciones */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FileText className="w-4 h-4 inline mr-2" />
                Observaciones
              </label>
              <textarea
                name="observations"
                value={formData.observations}
                onChange={handleChange}
                rows="3"
                className="block w-full rounded-lg border-2 border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all resize-none"
                placeholder="Notas adicionales sobre el vehículo..."
              />
            </div>

            {/* Botones */}
            <div className="flex gap-4">
              <Button
                type="submit"
                variant="primary"
                size="lg"
                isLoading={isLoading}
                className="flex-1"
              >
                Registrar Entrada
              </Button>
              
              <Button
                type="button"
                variant="outline"
                size="lg"
                onClick={() => window.history.back()}
                className="px-8"
              >
                Cancelar
              </Button>
            </div>
          </form>
        </div>
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

export default VehicleEntry;
