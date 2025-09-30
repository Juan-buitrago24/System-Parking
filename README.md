# System-Parking
Plataforma de administración de parqueaderos con autenticación, control de ocupación, facturación y reportes de ingresos diarios. Backend en Node.js/Express y frontend en React.

Descripción

Sistema de gestión de parqueadero (MVP) que permite administrar la entrada y salida de vehículos, asignación de espacios, cálculo de tarifas y generación de reportes básicos. El proyecto está desarrollado con Node.js, Express, PostgreSQL en el backend y React en el frontend.

Objetivo

Optimizar el control y la administración de un parqueadero mediante una aplicación web que facilite el registro de vehículos, el cálculo automático de tarifas y la consulta de reportes de ingresos diarios.

Tecnologías utilizadas

Backend: Node.js, Express

Base de datos: PostgreSQL

Frontend: React (Vite)

Control de versiones: Git y GitHub

Funcionalidades del MVP

Autenticación de usuarios (administrador y empleados).

Registro de entradas y salidas de vehículos.

Asignación automática de espacios y visualización de ocupación.

Cálculo automático de tarifas y emisión de recibo básico.

Reporte de ingresos diarios.

Instalación y ejecución

Clonar el repositorio:

git clone https://github.com/tu-usuario/system-parking.git
cd system-parking


Configurar el backend:

cd backend
npm install
cp .env.example .env


Configurar la base de datos PostgreSQL (crear tablas y seed inicial).

Ejecutar el backend:

npm run dev


Configurar y ejecutar el frontend:

cd ../frontend
npm install
npm run dev

Estado del proyecto

Actualmente en desarrollo. El objetivo inicial es construir un MVP funcional con las funcionalidades principales de autenticación, registro de vehículos, cálculo de tarifas y reportes diarios.
