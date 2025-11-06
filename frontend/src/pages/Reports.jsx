import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, Download, Calendar, DollarSign, Car, CreditCard } from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import Button from '../components/common/Button';
import Alert from '../components/common/Alert';
import reportService from '../services/reportService';

const Reports = () => {
  const [summary, setSummary] = useState(null);
  const [dailyIncome, setDailyIncome] = useState([]);
  const [byVehicleType, setByVehicleType] = useState([]);
  const [byPaymentMethod, setByPaymentMethod] = useState([]);
  const [topVehicles, setTopVehicles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [alert, setAlert] = useState(null);
  
  // Filtros
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    // Establecer fecha por defecto (últimos 30 días)
    const today = new Date();
    const thirtyDaysAgo = new Date(today);
    thirtyDaysAgo.setDate(today.getDate() - 30);
    
    setEndDate(today.toISOString().split('T')[0]);
    setStartDate(thirtyDaysAgo.toISOString().split('T')[0]);
  }, []);

  useEffect(() => {
    if (startDate && endDate) {
      fetchReports();
    }
  }, [startDate, endDate]);

  const fetchReports = async () => {
    setIsLoading(true);
    try {
      const [summaryRes, dailyRes, vehicleRes, methodRes, topRes] = await Promise.all([
        reportService.getSummary(startDate, endDate),
        reportService.getDailyIncome(startDate, endDate),
        reportService.getByVehicleType(startDate, endDate),
        reportService.getByPaymentMethod(startDate, endDate),
        reportService.getTopVehicles(startDate, endDate)
      ]);

      if (summaryRes.success) setSummary(summaryRes.data);
      if (dailyRes.success) setDailyIncome(dailyRes.data);
      if (vehicleRes.success) setByVehicleType(vehicleRes.data);
      if (methodRes.success) setByPaymentMethod(methodRes.data);
      if (topRes.success) setTopVehicles(topRes.data);
    } catch (error) {
      setAlert({
        type: 'error',
        message: 'Error al cargar reportes'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const exportToCSV = async () => {
    try {
      const response = await reportService.getPaymentsList({
        startDate,
        endDate
      });

      if (response.success) {
        // Crear CSV
        const headers = ['Fecha', 'Recibo', 'Placa', 'Tipo', 'Propietario', 'Monto', 'Metodo', 'Duracion'];
        const rows = response.data.map(payment => [
          new Date(payment.paidAt).toLocaleDateString(),
          payment.receiptNumber,
          payment.vehicle.plate,
          payment.vehicle.type,
          payment.vehicle.ownerName,
          payment.amount,
          payment.method,
          `${payment.duration.toFixed(2)}h`
        ]);

        const csvContent = [
          headers.join(','),
          ...rows.map(row => row.join(','))
        ].join('\n');

        // Descargar archivo
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `reporte_${startDate}_${endDate}.csv`;
        link.click();

        setAlert({
          type: 'success',
          message: 'Reporte exportado exitosamente'
        });
      }
    } catch (error) {
      setAlert({
        type: 'error',
        message: 'Error al exportar reporte'
      });
    }
  };

  const getVehicleTypeLabel = (type) => {
    const labels = {
      CARRO: 'Carros',
      MOTO: 'Motos',
      CAMIONETA: 'Camionetas',
      CAMION: 'Camiones'
    };
    return labels[type] || type;
  };

  const getPaymentMethodLabel = (method) => {
    const labels = {
      EFECTIVO: 'Efectivo',
      TARJETA: 'Tarjeta',
      TRANSFERENCIA: 'Transferencia',
      OTRO: 'Otro'
    };
    return labels[method] || method;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gradient mb-2">Reportes y Analytics</h1>
            <p className="text-gray-600">Analisis detallado de ingresos y operaciones</p>
          </div>
          <Button icon={Download} onClick={exportToCSV}>
            Exportar CSV
          </Button>
        </div>

        {alert && (
          <Alert type={alert.type} message={alert.message} className="mb-6" onClose={() => setAlert(null)} />
        )}

        {/* Filtros de fecha */}
        <div className="glass rounded-xl p-6 mb-6">
          <div className="flex items-center gap-4">
            <Calendar className="w-5 h-5 text-gray-600" />
            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Fecha Inicio</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full rounded-lg border-2 border-gray-300 px-4 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Fecha Fin</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full rounded-lg border-2 border-gray-300 px-4 py-2"
                />
              </div>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="text-center py-12">Cargando reportes...</div>
        ) : (
          <>
            {/* Resumen general */}
            {summary && (
              <div className="grid md:grid-cols-3 gap-6 mb-8">
                <div className="glass rounded-xl p-6">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-medium text-gray-600">Ingresos Totales</h3>
                    <DollarSign className="w-5 h-5 text-green-600" />
                  </div>
                  <p className="text-3xl font-bold text-green-600">{formatCurrency(summary.totalIncome)}</p>
                  <p className="text-sm text-gray-500 mt-1">{summary.totalPayments} pagos</p>
                </div>

                <div className="glass rounded-xl p-6">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-medium text-gray-600">Ticket Promedio</h3>
                    <TrendingUp className="w-5 h-5 text-blue-600" />
                  </div>
                  <p className="text-3xl font-bold text-blue-600">{formatCurrency(summary.averageTicket)}</p>
                  <p className="text-sm text-gray-500 mt-1">Por vehiculo</p>
                </div>

                <div className="glass rounded-xl p-6">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-medium text-gray-600">Tipo mas Comun</h3>
                    <Car className="w-5 h-5 text-purple-600" />
                  </div>
                  {summary.byVehicleType.length > 0 && (
                    <>
                      <p className="text-3xl font-bold text-purple-600">
                        {getVehicleTypeLabel(summary.byVehicleType[0].type)}
                      </p>
                      <p className="text-sm text-gray-500 mt-1">{summary.byVehicleType[0].count} vehiculos</p>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* Ingresos diarios */}
            <div className="glass rounded-xl p-6 mb-6">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <BarChart3 className="w-6 h-6" />
                Ingresos Diarios
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4">Fecha</th>
                      <th className="text-right py-3 px-4">Pagos</th>
                      <th className="text-right py-3 px-4">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dailyIncome.map((day) => (
                      <tr key={day.date} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4">{new Date(day.date).toLocaleDateString()}</td>
                        <td className="text-right py-3 px-4">{day.count}</td>
                        <td className="text-right py-3 px-4 font-semibold">{formatCurrency(day.total)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-6">
              {/* Por tipo de vehículo */}
              <div className="glass rounded-xl p-6">
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <Car className="w-6 h-6" />
                  Por Tipo de Vehiculo
                </h2>
                <div className="space-y-3">
                  {byVehicleType.map((item) => (
                    <div key={item.type} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-semibold">{getVehicleTypeLabel(item.type)}</p>
                        <p className="text-sm text-gray-600">{item.count} vehiculos</p>
                      </div>
                      <p className="text-lg font-bold text-blue-600">{formatCurrency(item.total)}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Por método de pago */}
              <div className="glass rounded-xl p-6">
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <CreditCard className="w-6 h-6" />
                  Por Metodo de Pago
                </h2>
                <div className="space-y-3">
                  {byPaymentMethod.map((item) => (
                    <div key={item.method} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-semibold">{getPaymentMethodLabel(item.method)}</p>
                        <p className="text-sm text-gray-600">{item.count} pagos</p>
                      </div>
                      <p className="text-lg font-bold text-green-600">{formatCurrency(item.total)}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Top vehículos */}
            <div className="glass rounded-xl p-6">
              <h2 className="text-2xl font-bold mb-4">Top 10 Vehiculos Frecuentes</h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4">#</th>
                      <th className="text-left py-3 px-4">Placa</th>
                      <th className="text-left py-3 px-4">Tipo</th>
                      <th className="text-left py-3 px-4">Propietario</th>
                      <th className="text-right py-3 px-4">Visitas</th>
                    </tr>
                  </thead>
                  <tbody>
                    {topVehicles.map((vehicle, index) => (
                      <tr key={vehicle.plate} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4 font-bold">{index + 1}</td>
                        <td className="py-3 px-4">{vehicle.plate}</td>
                        <td className="py-3 px-4">{getVehicleTypeLabel(vehicle.type)}</td>
                        <td className="py-3 px-4">{vehicle.ownerName}</td>
                        <td className="text-right py-3 px-4 font-semibold">{vehicle.visits}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Reports;
