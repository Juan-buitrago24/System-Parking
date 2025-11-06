import React from 'react';

const stateClasses = {
  DISPONIBLE: 'bg-green-500',
  OCUPADO: 'bg-red-500',
  RESERVADO: 'bg-yellow-400',
  MANTENIMIENTO: 'bg-gray-500'
};

export default function ParkingGrid({ spaces = [], onAssign, onRelease, onSelect }) {
  return (
    <div className="grid grid-cols-6 gap-4">
      {spaces.map((s) => (
        <div key={s.id} className={`p-4 rounded shadow text-white ${stateClasses[s.state] || 'bg-gray-200 text-black'}`}>
          <div className="font-bold">{s.number}</div>
          <div className="text-sm">{s.type}</div>
          <div className="text-xs mt-2">Estado: {s.state}</div>
          <div className="flex gap-2 mt-3">
            <button onClick={() => onSelect && onSelect(s)} className="px-2 py-1 bg-blue-600 text-white rounded text-sm">Seleccionar</button>
            {(s.state === 'DISPONIBLE' || s.state === 'RESERVADO') && (
              <button onClick={() => onAssign && onAssign(s.id)} className="px-2 py-1 bg-indigo-600 text-white rounded text-sm">Asignar</button>
            )}
            {s.state === 'OCUPADO' && (
              <button onClick={() => onRelease && onRelease(s.id)} className="px-2 py-1 bg-red-700 text-white rounded text-sm">Liberar</button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

