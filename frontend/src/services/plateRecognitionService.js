import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

/**
 * Reconocer placa desde una imagen
 * @param {File} imageFile - Archivo de imagen
 * @returns {Promise} - Datos de la placa reconocida
 */
export const recognizePlate = async (imageFile) => {
  const formData = new FormData();
  formData.append('photo', imageFile);

  const token = localStorage.getItem('token');

  const response = await axios.post(
    `${API_URL}/plate-recognition/scan`,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${token}`
      }
    }
  );

  return response.data;
};

/**
 * Validar salida de vehículo (verificar pago)
 * @param {File} imageFile - Imagen de la placa
 * @returns {Promise} - Resultado de validación
 */
export const validateExit = async (imageFile) => {
  const formData = new FormData();
  formData.append('photo', imageFile);

  const token = localStorage.getItem('token');

  const response = await axios.post(
    `${API_URL}/plate-recognition/validate-exit`,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${token}`
      }
    }
  );

  return response.data;
};

export default {
  recognizePlate,
  validateExit
};
