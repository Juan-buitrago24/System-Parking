import React, { useState, useEffect } from 'react';
import { DollarSign, Plus, Edit2, Trash2, Check, X } from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Alert from '../components/common/Alert';
import rateService from '../services/rateService';

const RateManagement = () => {
  const [rates, setRates] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [alert, setAlert] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingRate, setEditingRate] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    vehicleType: 'CARRO',
    rateType: 'POR_HORA',
    amount: '',
    minTime: '',
    validFrom: '',
    validUntil: ''
  });

  useEffect(() => {
    fetchRates();
  }, []);

  const fetchRates = async () => {
    setIsLoading(true);
    try {
      const response = await rateService.getRates();
      if (response.success) {
        setRates(response.data);
      }
    } catch (error) {
      setAlert({
        type: 'error',
        message: 'Error al cargar tarifas'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const data = {
        ...formData,
        amount: parseFloat(formData.amount),
        minTime: formData.minTime ? parseFloat(formData.minTime) : null,
        validFrom: formData.validFrom || null,
        validUntil: formData.validUntil || null
      };

      let response;
      if (editingRate) {
        response = await rateService.updateRate(editingRate.id, data);
      } else {
        response = await rateService.createRate(data);
      }

      if (response.success) {
        setAlert({
          type: 'success',
          message: editingRate ? 'Tarifa actualizada' : 'Tarifa creada exitosamente'
        });
        setShowModal(false);
        resetForm();
        fetchRates();
      }
    } catch (error) {
      setAlert({
        type: 'error',
        message: error.response?.data?.message || 'Error al guardar tarifa'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (rate) => {
    setEditingRate(rate);
    setFormData({
      name: rate.name,
      description: rate.description || '',
      vehicleType: rate.vehicleType,
      rateType: rate.rateType,
      amount: rate.amount.toString(),
      minTime: rate.minTime?.toString() || '',
      validFrom: rate.validFrom ? new Date(rate.validFrom).toISOString().split('T')[0] : '',
      validUntil: rate.validUntil ? new Date(rate.validUntil).toISOString().split('T')[0] : ''
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('¿Desactivar esta tarifa?')) return;

    try {
      const response = await rateService.deleteRate(id);
      if (response.success) {
        setAlert({
          type: 'success',
          message: 'Tarifa desactivada'
        });
        fetchRates();
      }
    } catch (error) {
      setAlert({
        type: 'error',
        message: 'Error al desactivar tarifa'
      });
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      vehicleType: 'CARRO',
      rateType: 'POR_HORA',
      amount: '',
      minTime: '',
      validFrom: '',
      validUntil: ''
    });
    setEditingRate(null);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const getRateTypeLabel = (type) => {
    const labels = {
      POR_HORA: 'Por Hora',
      POR_DIA: 'Por Dia',
      FRACCION: 'Fraccion',
      MENSUAL: 'Mensual'
    };
    return labels[type] || type;
  };

  const getVehicleTypeLabel = (type) => {
    const labels = {
      CARRO: 'Carro',
      MOTO: 'Moto',
      CAMIONETA: 'Camioneta',
      CAMION: 'Camion'
    };
    return labels[type] || type;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gradient mb-2">Gestion de Tarifas</h1>
            <p className="text-gray-600">Administra las tarifas de parqueo</p>
          </div>
          <Button
            icon={Plus}
            onClick={() => {
              resetForm();
              setShowModal(true);
            }}
          >
            Nueva Tarifa
          </Button>
        </div>

        {alert && (
          <Alert type={alert.type} message={alert.message} className="mb-6" onClose={() => setAlert(null)} />
        )}

        {isLoading && !showModal ? (
          <div className="text-center py-12">Cargando...</div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rates.map((rate) => (
              <div
                key={rate.id}
                className={`glass rounded-xl p-6 ${rate.isActive ? '' : 'opacity-50'}`}
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-1">{rate.name}</h3>
                    <p className="text-sm text-gray-600">{rate.description}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(rate)}
                      className="p-2 hover:bg-blue-100 rounded-lg transition-colors"
                    >
                      <Edit2 className="w-4 h-4 text-blue-600" />
                    </button>
                    {rate.isActive && (
                      <button
                        onClick={() => handleDelete(rate.id)}
                        className="p-2 hover:bg-red-100 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </button>
                    )}
                  </div>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tipo Vehiculo:</span>
                    <span className="font-semibold">{getVehicleTypeLabel(rate.vehicleType)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tipo Tarifa:</span>
                    <span className="font-semibold">{getRateTypeLabel(rate.rateType)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Monto:</span>
                    <span className="font-bold text-blue-600">{formatCurrency(rate.amount)}</span>
                  </div>
                  {rate.minTime && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tiempo Minimo:</span>
                      <span className="font-semibold">{rate.minTime}h</span>
                    </div>
                  )}
                  <div className="flex justify-between items-center pt-2 border-t">
                    <span className="text-gray-600">Estado:</span>
                    {rate.isActive ? (
                      <span className="flex items-center gap-1 text-green-600">
                        <Check className="w-4 h-4" /> Activa
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-red-600">
                        <X className="w-4 h-4" /> Inactiva
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <h2 className="text-2xl font-bold mb-6">
                {editingRate ? 'Editar Tarifa' : 'Nueva Tarifa'}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  label="Nombre"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />

                <div>
                  <label className="block text-sm font-medium mb-2">Descripcion</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows="2"
                    className="w-full rounded-lg border-2 border-gray-300 px-4 py-2"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Tipo Vehiculo</label>
                    <select
                      name="vehicleType"
                      value={formData.vehicleType}
                      onChange={handleInputChange}
                      className="w-full rounded-lg border-2 border-gray-300 px-4 py-2"
                    >
                      <option value="CARRO">Carro</option>
                      <option value="MOTO">Moto</option>
                      <option value="CAMIONETA">Camioneta</option>
                      <option value="CAMION">Camion</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Tipo Tarifa</label>
                    <select
                      name="rateType"
                      value={formData.rateType}
                      onChange={handleInputChange}
                      className="w-full rounded-lg border-2 border-gray-300 px-4 py-2"
                    >
                      <option value="POR_HORA">Por Hora</option>
                      <option value="POR_DIA">Por Dia</option>
                      <option value="FRACCION">Fraccion (15 min)</option>
                      <option value="MENSUAL">Mensual</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Monto"
                    name="amount"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.amount}
                    onChange={handleInputChange}
                    required
                  />

                  <Input
                    label="Tiempo Minimo (horas)"
                    name="minTime"
                    type="number"
                    min="0"
                    step="0.25"
                    value={formData.minTime}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Valido Desde"
                    name="validFrom"
                    type="date"
                    value={formData.validFrom}
                    onChange={handleInputChange}
                  />

                  <Input
                    label="Valido Hasta"
                    name="validUntil"
                    type="date"
                    value={formData.validUntil}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="flex gap-4 pt-4">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => {
                      setShowModal(false);
                      resetForm();
                    }}
                    className="flex-1"
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    isLoading={isLoading}
                    className="flex-1"
                  >
                    {editingRate ? 'Actualizar' : 'Crear'}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RateManagement;