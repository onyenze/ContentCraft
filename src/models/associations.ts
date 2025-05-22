// src/models/associations.ts
import User from './user';
import Role from './role';
import Permission from './permission';
import RolePermission from './rolePermission';
import  ContentItem  from './contentItem';
import ContentType from './contentType';
import ContentVersion from './contentVersion';

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


// ContentType - ContentItem relationship
ContentType.hasMany(ContentItem, {
  foreignKey: 'contentTypeIdentifier',
  sourceKey: 'identifier',
  as: 'contentItems'
});

ContentItem.belongsTo(ContentType, {
  foreignKey: 'contentTypeIdentifier',
  targetKey: 'identifier',
  as: 'contentType'
});

// Set up associations
ContentItem.hasMany(ContentVersion, {
  foreignKey: 'contentItemId',
  as: 'versions'
});

ContentVersion.belongsTo(ContentItem, {
  foreignKey: 'contentItemId',
  as: 'contentItem'
});

export { User, Role, Permission, RolePermission ,ContentItem,ContentType,ContentVersion};




