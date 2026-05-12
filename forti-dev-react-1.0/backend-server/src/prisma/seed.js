import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const existing = await prisma.user.findFirst({ where: { role: 'ADMIN' } });
  if (existing) {
    console.log('Admin user already exists:', existing.email);
    return;
  }

  const password = process.env.ADMIN_PASSWORD || 'ChangeMe123!';
  const hashed = await bcrypt.hash(password, 12);

  const admin = await prisma.user.create({
    data: {
      email: process.env.ADMIN_EMAIL || 'admin@fortidev.local',
      password: hashed,
      name: 'FortiDev Admin',
      role: 'ADMIN',
    },
    select: { id: true, email: true, name: true, role: true },
  });

  console.log('✅ Admin user created:', admin.email);
  console.log('   Password:', password);
  console.log('   IMPORTANT: Change this password immediately after first login!');
}

main()
  .catch((err) => { console.error(err); process.exit(1); })
  .finally(() => prisma.$disconnect());
