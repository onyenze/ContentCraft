// src/models/associations.ts
import User from './user';
import Role from './role';
import Permission from './permission';
import RolePermission from './rolePermission';

// Setup associations
Role.belongsToMany(Permission, {
  through: RolePermission,
  foreignKey: 'roleId',
  otherKey: 'permissionId',
  as: 'permissions' // This adds the typed methods
});

Permission.belongsToMany(Role, {
  through: RolePermission,
  foreignKey: 'permissionId',
  otherKey: 'roleId',
  as: 'roles' // Explicit alias
});

User.belongsTo(Role, { foreignKey: 'roleId', as: 'role' });
Role.hasMany(User, { foreignKey: 'roleId', as: 'users' });

export { User, Role, Permission, RolePermission };




