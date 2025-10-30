import React, { useState, useEffect } from 'react';
import { Car, RefreshCcw, Search } from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import Button from '../components/common/Button';
import Spinner from '../components/common/Spinner';
import Alert from '../components/common/Alert';
import vehicleService from '../services/vehicleService';

const ActiveVehicles = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const loadVehicles = async () => {
    setLoading(true);
    try {
      const response = await vehicleService.listActiveVehicles();
      if (response.success) {
        setVehicles(response.data);
      }
    } catch (error) {
      setAlert({ type: 'error', message: 'Error al cargar vehículos' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadVehicles();
  }, []);

  const filteredVehicles = vehicles.filter(v => 
    v.plate.toLowerCase().includes(searchTerm.toLowerCase()) ||
    v.ownerName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gradient">Vehículos Activos</h1>
            <p className="text-gray-600">
              {vehicles.length} vehículo{vehicles.length !== 1 ? 's' : ''} en el parqueadero
            </p>
          </div>
          <Button onClick={loadVehicles} icon={RefreshCcw}>Actualizar</Button>
        </div>

        {alert && <Alert type={alert.type} message={alert.message} className="mb-6" onClose={() => setAlert(null)} />}

        <div className="glass rounded-2xl p-6 mb-6">
          <input
            type="text"
            placeholder="Buscar por placa o propietario..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-lg border-2 border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <Spinner size="xl" />
          </div>
        ) : filteredVehicles.length === 0 ? (
          <div className="glass rounded-2xl p-12 text-center">
            <Car className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 text-lg">
              {searchTerm ? 'No se encontraron vehículos' : 'No hay vehículos en el parqueadero'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredVehicles.map((vehicle) => (
              <div key={vehicle.id} className="glass rounded-xl p-6 hover:shadow-2xl transition-all">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-primary-600">{vehicle.plate}</h3>
                    <p className="text-gray-600">{vehicle.type}</p>
                  </div>
                  {vehicle.parkingSpace && (
                    <div className="bg-primary-100 text-primary-700 px-3 py-1 rounded-lg font-semibold">
                      {vehicle.parkingSpace}
                    </div>
                  )}
                </div>

                <div className="space-y-2 text-sm">
                  <div><span className="font-semibold">Propietario:</span> {vehicle.ownerName}</div>
                  {vehicle.color && <div><span className="font-semibold">Color:</span> {vehicle.color}</div>}
                  {vehicle.brand && <div><span className="font-semibold">Marca:</span> {vehicle.brand}</div>}
                  <div><span className="font-semibold">Entrada:</span> {new Date(vehicle.entryTime).toLocaleString()}</div>
                  <div className="pt-2 border-t">
                    <span className="font-semibold text-primary-600">
                      Tiempo: {vehicle.duration.hours} horas
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ActiveVehicles;
