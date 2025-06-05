import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';
import FieldDefinition from './fieldDefinition';

// Define attributes for the ContentType model
interface ContentTypeAttributes {
  id: number;
  name: string;
  identifier: string;
  description?: string; // Optional field
}

// Optional attributes to be addeed later on
interface ContentTypeCreationAttributes extends Optional<ContentTypeAttributes, 'id'> {}

// ContentType model
class ContentType extends Model<ContentTypeAttributes, ContentTypeCreationAttributes> implements ContentTypeAttributes {
  public id!: number;
  public name!: string;
  public identifier!: string;
  public description?: string;
  public fields?: FieldDefinition[];
}

ContentType.init({
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
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
  },
}, {
  sequelize,
  modelName: 'ContentType',
  tableName:'content_types'
});

export default ContentType;
