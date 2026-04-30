require('dotenv').config();

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const { errorHandler } = require('./middlewares/errorHandler');

// ── Rutas ────────────────────────────────────────────────────────────────
const sedeRoutes = require('./routes/sedeRoutes');
const eventoRoutes = require('./routes/eventoRoutes');
const asistenteRoutes = require('./routes/asistenteRoutes');
const patrocinadorRoutes = require('./routes/patrocinadorRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// ── Middlewares Globales ─────────────────────────────────────────────────
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// ── Health Check ─────────────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: '🎉 API de Gestión de Eventos funcionando correctamente',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
  });
});

// ── Montar Rutas ─────────────────────────────────────────────────────────
app.use('/api/sedes', sedeRoutes);
app.use('/api/eventos', eventoRoutes);
app.use('/api/asistentes', asistenteRoutes);
app.use('/api/patrocinadores', patrocinadorRoutes);

// ── Ruta raíz ────────────────────────────────────────────────────────────
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'API de Gestión de Eventos v1.0.0',
    docs: {
      endpoints: {
        sedes: '/api/sedes',
        eventos: '/api/eventos',
        asistentes: '/api/asistentes',
        patrocinadores: '/api/patrocinadores',
        health: '/api/health',
      },
    },
  });
});

// ── 404 ──────────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: {
      message: `Ruta ${req.method} ${req.originalUrl} no encontrada`,
    },
  });
});

// ── Manejo global de errores ─────────────────────────────────────────────
app.use(errorHandler);

// ── Iniciar servidor ─────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`
╔══════════════════════════════════════════════════════╗
║                                                      ║
║   🎉  API de Gestión de Eventos                      ║
║                                                      ║
║   🚀  Servidor corriendo en: http://localhost:${PORT}   ║
║   📋  Entorno: ${(process.env.NODE_ENV || 'development').padEnd(37)}║
║                                                      ║
║   Endpoints disponibles:                             ║
║   ├── GET  /api/health                               ║
║   ├── CRUD /api/sedes                                ║
║   ├── CRUD /api/eventos                              ║
║   ├── CRUD /api/asistentes                           ║
║   └── CRUD /api/patrocinadores                       ║
║                                                      ║
╚══════════════════════════════════════════════════════╝
  `);
});

module.exports = app;
