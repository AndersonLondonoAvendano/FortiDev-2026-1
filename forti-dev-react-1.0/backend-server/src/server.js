const express = require('express');
const cors = require('cors');

const userRoutes = require('./routes/userRoutes');
const pool = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());

// Rutas
app.use('/api/auth', userRoutes);

// Ruta de prueba
app.get('/', (req, res) => {
  res.send('API de FortiDev funcionando!');
});

// Conectar a la base de datos
pool.connect((err) => {
  if (err) {
    console.error('Error conectando a PostgreSQL:', err);
  } else {
    console.log('Conectado a PostgreSQL');
  }
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});