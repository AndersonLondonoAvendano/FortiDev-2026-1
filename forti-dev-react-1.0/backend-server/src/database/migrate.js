import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import pool from '../config/database.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const sql = readFileSync(join(__dirname, 'schema.sql'), 'utf8');

pool.query(sql)
  .then(() => { console.log('Migration complete'); process.exit(0); })
  .catch((e) => { console.error('Migration failed:', e); process.exit(1); });
