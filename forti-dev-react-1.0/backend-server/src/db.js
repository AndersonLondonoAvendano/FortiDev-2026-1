const { Pool } = require('pg');

const pool = new Pool({
  host: '127.0.0.1',
  port: 5432,
  database: 'fortidev_db', // Cambia esto al nombre de tu base de datos
  user: 'estudiante', // Cambia al usuario de tu PostgreSQL
  password: 'estudiante123', // Cambia a tu contraseña
});

module.exports = pool;