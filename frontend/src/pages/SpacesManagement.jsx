import React, { useEffect, useState } from 'react';
import Navbar from '../components/layout/Navbar';
import ParkingGrid from '../components/ParkingGrid';
import parkingService from '../services/parkingService';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Alert from '../components/common/Alert';

export default function SpacesManagement() {
  const [spaces, setSpaces] = useState([]);
  const [vehicleId, setVehicleId] = useState('');
  const [selected, setSelected] = useState(null);
  const [alert, setAlert] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const load = async () => {
    try {
      const res = await parkingService.getSpaces();
      if (res?.success) setSpaces(res.data);
    } catch (error) {
      setAlert({ type: 'error', title: 'Error', message: 'No se pudieron cargar los espacios' });
    }
  };

  useEffect(() => { load(); }, []);

  const handleAutoAssign = async () => {
    if (!vehicleId) return setAlert({ type: 'error', title: 'Falta', message: 'Ingresa vehicleId' });
    setIsLoading(true);
    try {
      await parkingService.autoAssign({ vehicleId });
      setVehicleId('');
      await load();
      setAlert({ type: 'success', title: 'Asignado', message: 'Auto-asignación exitosa' });
    } catch (err) {
      setAlert({ type: 'error', title: 'Error', message: err.response?.data?.message || err.message });
    } finally { setIsLoading(false); }
  };

  const handleAssign = async (spaceId) => {
    if (!vehicleId) return setAlert({ type: 'error', title: 'Falta', message: 'Ingresa vehicleId' });
    setIsLoading(true);
    try {
      await parkingService.assignSpace(spaceId, { vehicleId });
      setVehicleId('');
      await load();
      setAlert({ type: 'success', title: 'Asignado', message: 'Asignación manual exitosa' });
    } catch (err) {
      setAlert({ type: 'error', title: 'Error', message: err.response?.data?.message || err.message });
    } finally { setIsLoading(false); }
  };

  const handleRelease = async (spaceId) => {
    setIsLoading(true);
    try {
      await parkingService.releaseSpace(spaceId);
      await load();
      setAlert({ type: 'success', title: 'Liberado', message: 'Espacio liberado' });
    } catch (err) {
      setAlert({ type: 'error', title: 'Error', message: err.response?.data?.message || err.message });
    } finally { setIsLoading(false); }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-4">Gestión de Espacios</h1>

        {alert && (
          <Alert type={alert.type} title={alert.title} message={alert.message} onClose={() => setAlert(null)} className="mb-4" />
        )}

        <div className="flex gap-2 items-center mb-6">
          <Input placeholder="vehicleId (id numérico)" value={vehicleId} onChange={e => setVehicleId(e.target.value)} />
          <Button onClick={handleAutoAssign} isLoading={isLoading} variant="primary">Auto-asignar</Button>
          {selected && <div className="ml-4">Seleccionado: {selected.number}</div>}
        </div>

        <ParkingGrid spaces={spaces} onAssign={handleAssign} onRelease={handleRelease} onSelect={(s) => setSelected(s)} />
      </div>
    </div>
  );
}

