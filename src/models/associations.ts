// src/models/associations.ts
import User from './user';
import Role from './role';
import Permission from './permission';
import RolePermission from './rolePermission';

// Setup associations
// User-Role association
User.belongsTo(Role, {
  foreignKey: 'roleId',
  as: 'role'  // This is the alias you MUST use in queries
});

Role.hasMany(User, {
  foreignKey: 'roleId',
  as: 'users'
});

// Role-Permission many-to-many association
Role.belongsToMany(Permission, {
  through: 'role_permissions',
  as: 'permissions',
  foreignKey: 'roleId'
});

Permission.belongsToMany(Role, {
  through: 'role_permissions',
  as: 'roles',
  foreignKey: 'permissionId'
});

export { User, Role, Permission, RolePermission };




