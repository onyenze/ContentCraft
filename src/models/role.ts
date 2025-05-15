// src/models/role.ts
import { DataTypes, Model, NonAttribute } from 'sequelize';
import sequelize from '../config/database';
import  Permission  from './permission';

class Role extends Model {
  declare id: number;
  declare name: string;
  declare description: string | null;
  
  // Association methods
  declare getPermissions: () => Promise<Permission[]>;
  declare setPermissions: (permissions: Permission[] | number[]) => Promise<void>;
  declare addPermissions: (permissions: Permission[] | number[]) => Promise<void>;
  declare removePermissions: (permissions: Permission[] | number[]) => Promise<void>;
  declare hasPermission: (permission: Permission | number) => Promise<boolean>;
  
  declare permissions?: NonAttribute<Permission[]>;
}

Role.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: 'Role',
    tableName: 'roles',
  }
);

export default Role;