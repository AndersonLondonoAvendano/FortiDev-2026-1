import '../config/env.js';
import bcrypt from 'bcryptjs';
import { query } from '../config/database.js';

async function seed() {
  const existing = await query(
    "SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1"
  );
  if (existing.rows.length > 0) {
    console.log('Admin already exists, skipping.');
    process.exit(0);
  }

  const email = process.env.ADMIN_EMAIL || 'admin@fortidev.local';
  const password = process.env.ADMIN_PASSWORD || 'Admin123!';
  const hashed = await bcrypt.hash(password, 12);

  const result = await query(
    `INSERT INTO users (email, password, name, role)
     VALUES ($1, $2, $3, 'ADMIN')
     RETURNING id, email, name, role`,
    [email, hashed, 'FortiDev Admin']
  );

  const admin = result.rows[0];
  console.log('Admin user created:', admin.email);
  console.log('Password:', password);
  console.log('IMPORTANT: Change this password immediately after first login!');
  process.exit(0);
}

seed().catch((e) => { console.error(e); process.exit(1); });
