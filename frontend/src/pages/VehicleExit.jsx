import React, { useState } from 'react';
import { LogOut, Search } from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Alert from '../components/common/Alert';
import vehicleService from '../services/vehicleService';

const VehicleExit = () => {
  const [plate, setPlate] = useState('');
  const [observations, setObservations] = useState('');
  const [vehicle, setVehicle] = useState(null);
  const [alert, setAlert] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    setAlert(null);
    setVehicle(null);
    setIsLoading(true);

    try {
      const response = await vehicleService.searchVehicle(plate);
      
      if (response.success) {
        setVehicle(response.data);
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Vehículo no encontrado';
      setAlert({
        type: 'error',
        message: errorMessage
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleExit = async () => {
    setAlert(null);
    setIsProcessing(true);

    try {
      const response = await vehicleService.registerExit(plate, observations);
      
      if (response.success) {
        setAlert({
          type: 'success',
          title: '¡Salida registrada!',
          message: `Tiempo total: ${response.data.duration.hours} horas`
        });
        setVehicle(null);
        setPlate('');
        setObservations('');
      }
    } catch (error) {
      setAlert({
        type: 'error',
        message: error.response?.data?.message || 'Error al registrar salida'
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Navbar />
      
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gradient mb-2">Registro de Salida</h1>
          <p className="text-gray-600">Registra la salida de un vehículo del parqueadero</p>
        </div>

        <div className="glass rounded-2xl p-8 shadow-xl">
          {alert && (
            <Alert type={alert.type} title={alert.title} message={alert.message} className="mb-6" onClose={() => setAlert(null)} />
          )}

          {/* Buscar vehículo */}
          <form onSubmit={handleSearch} className="mb-6">
            <div className="flex gap-4">
              <Input
                label="Placa del Vehículo"
                type="text"
                value={plate}
                onChange={(e) => setPlate(e.target.value.toUpperCase())}
                placeholder="ABC-123"
                required
                className="flex-1 uppercase"
              />
              <Button type="submit" icon={Search} isLoading={isLoading} className="mt-7">
                Buscar
              </Button>
            </div>
          </form>

          {/* Información del vehículo */}
          {vehicle && (
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 mb-6 animate-slide-up">
              <h3 className="text-xl font-bold mb-4">Información del Vehículo</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div><span className="font-semibold">Placa:</span> {vehicle.plate}</div>
                <div><span className="font-semibold">Tipo:</span> {vehicle.type}</div>
                <div><span className="font-semibold">Propietario:</span> {vehicle.ownerName}</div>
                <div><span className="font-semibold">Hora Entrada:</span> {new Date(vehicle.entryTime).toLocaleString()}</div>
                {vehicle.parkingSpace && <div><span className="font-semibold">Espacio:</span> {vehicle.parkingSpace}</div>}
                <div><span className="font-semibold">Tiempo:</span> {vehicle.duration.hours} horas</div>
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium mb-2">Observaciones de salida</label>
                <textarea
                  value={observations}
                  onChange={(e) => setObservations(e.target.value)}
                  rows="2"
                  className="w-full rounded-lg border-2 border-gray-300 px-4 py-2"
                  placeholder="Notas adicionales..."
                />
              </div>

              <Button
                onClick={handleExit}
                variant="danger"
                size="lg"
                icon={LogOut}
                isLoading={isProcessing}
                className="w-full mt-4"
              >
                Registrar Salida
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VehicleExit;
