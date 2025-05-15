// src/models/permission.ts
import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';

class Permission extends Model {
  public id!: number;
  public name!: string;
  public identifier!: string;
  public description!: string | null;
}

Permission.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    identifier: {
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
    modelName: 'Permission',
    tableName: 'permissions',
  }
);

export default Permission;