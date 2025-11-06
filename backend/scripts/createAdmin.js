const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function createAdmin() {
  try {
    // Verificar si ya existe un admin
    const existingAdmin = await prisma.user.findFirst({
      where: { role: 'ADMIN' }
    });

    if (existingAdmin) {
      console.log('\n✅ Usuario administrador ya existe:');
      console.log('📧 Email:', existingAdmin.email);
      console.log('👤 Nombre:', existingAdmin.firstName, existingAdmin.lastName);
      console.log('🔑 Rol:', existingAdmin.role);
      console.log('\n⚠️ Si olvidaste la contraseña, puedes restablecerla desde el login.');
      return;
    }

    // Crear usuario administrador
    const hashedPassword = await bcrypt.hash('Admin123!', 10);
    
    const admin = await prisma.user.create({
      data: {
        email: 'admin@parking.com',
        password: hashedPassword,
        firstName: 'Admin',
        lastName: 'Sistema',
        role: 'ADMIN',
        isVerified: true
      }
    });

    console.log('\n✅ Usuario administrador creado exitosamente!');
    console.log('\n📝 CREDENCIALES DE ACCESO:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📧 Email:     admin@parking.com');
    console.log('🔒 Password:  Admin123!');
    console.log('🔑 Rol:       ADMIN');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    console.log('⚠️  IMPORTANTE: Cambia la contraseña después del primer login\n');

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

createAdmin();
