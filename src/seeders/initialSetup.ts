import 'dotenv/config'; // Load environment variables first
import sequelize from '../config/database';
import { User, Role, Permission } from '../models/associations';
import bcrypt from 'bcrypt';
import { PERMISSIONS } from '../constants/permissions';

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
const permissionData = Object.entries(PERMISSIONS).map(([key, identifier]) => ({
  name: key
    .replace(/_/g, ' ')
    .toLowerCase()
    .replace(/\b\w/g, c => c.toUpperCase()),
  identifier,
}));
const permissions = await Permission.bulkCreate(permissionData);

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
    [
      PERMISSIONS.EDIT_CONTENT,
      PERMISSIONS.PUBLISH_CONTENT,
      PERMISSIONS.VIEW_CONTENT,
    ].includes(p.identifier)
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



