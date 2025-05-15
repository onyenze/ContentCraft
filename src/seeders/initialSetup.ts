import 'dotenv/config'; // Load environment variables first
import sequelize from '../config/database';
import { User, Role, Permission } from '../models/associations';
import bcrypt from 'bcrypt';

async function seedInitialData() {
  console.log('Starting database seeding...');
  console.log('Using database config:', {
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    host: process.env.DB_HOST
  });

  try {
    // Test connection
    await sequelize.authenticate();
    console.log('✅ Database connection established');

    // Sync models
    await sequelize.sync({ force: true });
    console.log('🔄 Database tables created');

    // Create permissions
    console.log('⏳ Creating permissions...');
    const permissions = await Permission.bulkCreate([
      { name: 'Create Content Types', identifier: 'create_content_type' },
      { name: 'Edit Content', identifier: 'edit_content' },
      { name: 'Publish Content', identifier: 'publish_content' },
      { name: 'Manage Users', identifier: 'manage_users' },
      { name: 'Manage Roles', identifier: 'manage_roles' },
    ]);

    // Create roles
    console.log('⏳ Creating roles...');
    const adminRole = await Role.create({
      name: 'Admin',
      description: 'Administrator with full access',
    });
    await adminRole.setPermissions(permissions);

    const editorRole = await Role.create({
      name: 'Editor',
      description: 'Can edit and publish content',
    });
    await editorRole.setPermissions(
      permissions.filter(p => 
        p.identifier === 'edit_content' || 
        p.identifier === 'publish_content'
      )
    );

    // Create admin user
    console.log('⏳ Creating admin user...');
    await User.create({
      username: 'admin',
      email: 'admin@cms.com',
      password: await bcrypt.hash('adminPassword', 10),
      roleId: adminRole.id,
    });

    console.log('✅ Database seeded successfully');
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  } finally {
    await sequelize.close();
  }
}

seedInitialData();