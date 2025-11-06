import React, { useState } from 'react';
import { LogOut, Search, DollarSign } from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Alert from '../components/common/Alert';
import vehicleService from '../services/vehicleService';
import paymentService from '../services/paymentService';

const VehicleExit = () => {
  const [plate, setPlate] = useState('');
  const [vehicle, setVehicle] = useState(null);
  const [paymentInfo, setPaymentInfo] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('EFECTIVO');
  const [discount, setDiscount] = useState(0);
  const [isPercentage, setIsPercentage] = useState(true);
  const [notes, setNotes] = useState('');
  const [alert, setAlert] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isCalculating, setIsCalculating] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    setAlert(null);
    setVehicle(null);
    setPaymentInfo(null);
    setIsLoading(true);

    try {
      const response = await vehicleService.searchVehicle(plate);
      
      if (response.success && response.data) {
        setVehicle(response.data);
        // Calcular pago automáticamente
        await calculatePayment(response.data.id);
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Vehiculo no encontrado';
      setAlert({
        type: 'error',
        message: errorMessage
      });
    } finally {
      setIsLoading(false);
    }
  };

  const calculatePayment = async (vehicleId, newDiscount = discount, newIsPercentage = isPercentage) => {
    setIsCalculating(true);
    try {
      const response = await paymentService.calculatePayment(vehicleId, newDiscount, newIsPercentage);
      if (response.success) {
        setPaymentInfo(response.data);
      }
    } catch (error) {
      setAlert({
        type: 'error',
        message: 'Error al calcular el pago'
      });
    } finally {
      setIsCalculating(false);
    }
  };

  const handleDiscountChange = (value) => {
    setDiscount(value);
    if (vehicle) {
      calculatePayment(vehicle.id, value, isPercentage);
    }
  };

  const handleDiscountTypeChange = (type) => {
    setIsPercentage(type === 'percentage');
    if (vehicle) {
      calculatePayment(vehicle.id, discount, type === 'percentage');
    }
  };

  const handleExit = async () => {
    setAlert(null);
    setIsProcessing(true);

    try {
      const response = await paymentService.registerPayment({
        vehicleId: vehicle.id,
        method: paymentMethod,
        discount: discount,
        isPercentage: isPercentage,
        notes: notes.trim() || undefined
      });
      
      if (response.success) {
        setAlert({
          type: 'success',
          title: '¡Pago registrado!',
          message: `Recibo: ${response.data.receiptNumber}`
        });
        // Resetear formulario
        setVehicle(null);
        setPaymentInfo(null);
        setPlate('');
        setDiscount(0);
        setNotes('');
        setPaymentMethod('EFECTIVO');
      }
    } catch (error) {
      setAlert({
        type: 'error',
        message: error.response?.data?.message || 'Error al registrar pago'
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Navbar />
      
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gradient mb-2">Registro de Salida</h1>
          <p className="text-gray-600">Registra la salida de un vehiculo y procesa el pago</p>
        </div>

        <div className="glass rounded-2xl p-8 shadow-xl">
          {alert && (
            <Alert type={alert.type} title={alert.title} message={alert.message} className="mb-6" onClose={() => setAlert(null)} />
          )}

          {/* Buscar vehículo */}
          <form onSubmit={handleSearch} className="mb-6">
            <div className="flex gap-4">
              <Input
                label="Placa del Vehiculo"
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

          {/* Información del vehículo y pago */}
          {vehicle && paymentInfo && (
            <div className="space-y-6 animate-slide-up">
              {/* Info del vehículo */}
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6">
                <h3 className="text-xl font-bold mb-4">Informacion del Vehiculo</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div><span className="font-semibold">Placa:</span> {paymentInfo.vehicle.plate}</div>
                  <div><span className="font-semibold">Tipo:</span> {paymentInfo.vehicle.type}</div>
                  <div><span className="font-semibold">Hora Entrada:</span> {new Date(paymentInfo.vehicle.entryTime).toLocaleString()}</div>
                  <div><span className="font-semibold">Duracion:</span> {paymentInfo.duration.actual.toFixed(2)} horas</div>
                </div>
              </div>

              {/* Cálculo del pago */}
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <DollarSign className="w-6 h-6" />
                  Calculo del Pago
                </h3>
                
                {isCalculating ? (
                  <div className="text-center py-4">Calculando...</div>
                ) : (
                  <div className="space-y-4">
                    {/* Tarifa aplicada */}
                    <div className="bg-white rounded-lg p-4">
                      <p className="text-sm text-gray-600">Tarifa Aplicada</p>
                      <p className="font-semibold">{paymentInfo.rate.name}</p>
                      <p className="text-xs text-gray-500">{paymentInfo.rate.description}</p>
                    </div>

                    {/* Tiempo cobrado */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">Tiempo Real</p>
                        <p className="font-semibold">{paymentInfo.duration.actual.toFixed(2)} h</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Tiempo Cobrado</p>
                        <p className="font-semibold">{paymentInfo.duration.billed.toFixed(2)} h</p>
                      </div>
                    </div>

                    {/* Descuento */}
                    <div>
                      <label className="block text-sm font-medium mb-2">Descuento</label>
                      <div className="flex gap-2 mb-2">
                        <Input
                          type="number"
                          value={discount}
                          onChange={(e) => handleDiscountChange(parseFloat(e.target.value) || 0)}
                          min="0"
                          step="0.01"
                          className="flex-1"
                        />
                        <select
                          value={isPercentage ? 'percentage' : 'fixed'}
                          onChange={(e) => handleDiscountTypeChange(e.target.value)}
                          className="rounded-lg border-2 border-gray-300 px-4"
                        >
                          <option value="percentage">%</option>
                          <option value="fixed">$</option>
                        </select>
                      </div>
                    </div>

                    {/* Resumen de pago */}
                    <div className="border-t pt-4 space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Subtotal:</span>
                        <span>{formatCurrency(paymentInfo.subtotal)}</span>
                      </div>
                      <div className="flex justify-between text-sm text-green-600">
                        <span>Descuento:</span>
                        <span>- {formatCurrency(paymentInfo.discount)}</span>
                      </div>
                      <div className="flex justify-between text-2xl font-bold border-t pt-2">
                        <span>Total:</span>
                        <span className="text-blue-600">{formatCurrency(paymentInfo.total)}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Método de pago y notas */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Metodo de Pago</label>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-full rounded-lg border-2 border-gray-300 px-4 py-2"
                  >
                    <option value="EFECTIVO">Efectivo</option>
                    <option value="TARJETA">Tarjeta</option>
                    <option value="TRANSFERENCIA">Transferencia</option>
                    <option value="OTRO">Otro</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Notas</label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows="2"
                    className="w-full rounded-lg border-2 border-gray-300 px-4 py-2"
                    placeholder="Observaciones adicionales..."
                  />
                </div>
              </div>

              {/* Botón de confirmar */}
              <Button
                onClick={handleExit}
                variant="primary"
                size="lg"
                icon={LogOut}
                isLoading={isProcessing}
                className="w-full"
              >
                Confirmar Salida y Pago
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VehicleExit;
