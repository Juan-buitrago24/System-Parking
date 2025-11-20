import React, { useState, useRef, useEffect } from 'react';
import { Camera, X, RotateCw } from 'lucide-react';

const CameraCapture = ({ onCapture, onClose }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [facingMode, setFacingMode] = useState('environment'); // 'user' o 'environment'
  const [error, setError] = useState(null);

  useEffect(() => {
    startCamera();
    return () => stopCamera();
  }, [facingMode]);

  const startCamera = async () => {
    try {
      setError(null);
      
      // Detener stream anterior si existe
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }

      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: facingMode,
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        }
      });

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        setStream(mediaStream);
      }
    } catch (err) {
      console.error('Error al acceder a la cámara:', err);
      setError('No se pudo acceder a la cámara. Verifica los permisos.');
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;

    setIsCapturing(true);

    const canvas = canvasRef.current;
    const video = videoRef.current;

    // Ajustar tamaño del canvas al video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Dibujar el frame actual del video en el canvas
    const context = canvas.getContext('2d');
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Convertir a blob
    canvas.toBlob(
      (blob) => {
        if (blob) {
          // Crear archivo desde blob
          const file = new File([blob], 'plate.jpg', { type: 'image/jpeg' });
          onCapture(file);
          stopCamera();
        }
        setIsCapturing(false);
      },
      'image/jpeg',
      0.95
    );
  };

  const switchCamera = () => {
    setFacingMode(prev => prev === 'user' ? 'environment' : 'user');
  };

  if (error) {
    return (
      <div className="glass rounded-2xl p-8 text-center">
        <div className="text-red-500 mb-4">
          <Camera className="w-16 h-16 mx-auto mb-2" />
          <p className="font-semibold">{error}</p>
        </div>
        <button
          onClick={onClose}
          className="px-6 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
        >
          Cerrar
        </button>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white text-xl font-bold">📸 Escanear Placa</h3>
          <button
            onClick={() => {
              stopCamera();
              onClose();
            }}
            className="text-white hover:text-red-400 transition-colors"
          >
            <X className="w-8 h-8" />
          </button>
        </div>

        {/* Video Preview */}
        <div className="relative bg-black rounded-2xl overflow-hidden">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-auto"
          />

          {/* Guía de encuadre */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="border-4 border-green-400 rounded-lg w-[600px] h-[400px] relative shadow-2xl">
              <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-green-400"></div>
              <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-green-400"></div>
              <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-green-400"></div>
              <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-green-400"></div>
              <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-lg">
                📸 Encuadra el VEHÍCULO COMPLETO (frente) aquí
              </div>
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/70 text-yellow-300 px-3 py-1 rounded text-xs">
                ⚠️ Incluir: placa + logo + carrocería
              </div>
            </div>
          </div>

          {/* Canvas oculto para captura */}
          <canvas ref={canvasRef} className="hidden" />
        </div>

        {/* Controls */}
        <div className="mt-4 flex gap-3">
          {/* Botón de cambiar cámara (solo en móviles) */}
          <button
            onClick={switchCamera}
            className="px-4 py-3 bg-gray-700 text-white rounded-xl hover:bg-gray-600 transition-colors flex items-center gap-2"
            title="Cambiar cámara"
          >
            <RotateCw className="w-5 h-5" />
          </button>

          {/* Botón de capturar */}
          <button
            onClick={capturePhoto}
            disabled={isCapturing}
            className={`flex-1 py-4 rounded-xl font-bold text-lg transition-all ${
              isCapturing
                ? 'bg-gray-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl'
            }`}
          >
            {isCapturing ? (
              <div className="flex items-center justify-center gap-2">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                Procesando...
              </div>
            ) : (
              <div className="flex items-center justify-center gap-2">
                <Camera className="w-6 h-6" />
                Capturar Foto
              </div>
            )}
          </button>

          {/* Botón de cancelar */}
          <button
            onClick={() => {
              stopCamera();
              onClose();
            }}
            className="px-6 py-4 bg-gray-700 text-white rounded-xl hover:bg-gray-600 transition-colors"
          >
            Cancelar
          </button>
        </div>

        {/* Instrucciones */}
        <div className="mt-4 space-y-3">
          <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-sm rounded-xl p-4 border border-blue-400/30">
            <p className="text-white font-semibold mb-2 text-center">💡 Tips para 95%+ de precisión:</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-xs text-gray-200">
              <div className="flex items-center gap-1">
                <span className="text-green-400">✓</span>
                <span>Distancia: 2-4 metros</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-green-400">✓</span>
                <span>Buena iluminación</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-green-400">✓</span>
                <span>Ángulo frontal</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-green-400">✓</span>
                <span>Placa visible y limpia</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-green-400">✓</span>
                <span>Evitar reflejos</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-green-400">✓</span>
                <span>Mantener estable</span>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-yellow-600/20 to-orange-600/20 backdrop-blur-sm rounded-xl p-4 border border-yellow-400/30">
            <p className="text-yellow-300 font-semibold mb-2 flex items-center justify-center gap-2">
              <span>⚠️</span>
              <span>¡IMPORTANTE para detectar Color, Marca y Modelo!</span>
            </p>
            <p className="text-gray-200 text-sm text-center">
              <span className="font-bold text-white">Captura el VEHÍCULO COMPLETO</span> (frente), no solo la placa.
              <br />
              La IA necesita ver: logo, color de carrocería, forma del vehículo.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CameraCapture;
