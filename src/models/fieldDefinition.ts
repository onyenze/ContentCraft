import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';
import ContentType from '../models/contentType';

// Define attributes for the FieldDefinition model
interface FieldDefinitionAttributes {
  id: number;
  name: string;
  identifier: string;
  dataType: string; 
  contentTypeId: number; // Foreign key for ContentType
}

// Attributes that can be added later on
interface FieldDefinitionCreationAttributes extends Optional<FieldDefinitionAttributes, 'id'> {}

// FieldDefinition model
class FieldDefinition extends Model<FieldDefinitionAttributes, FieldDefinitionCreationAttributes> implements FieldDefinitionAttributes {
  public id!: number;
  public name!: string;
  public identifier!: string;
  public dataType!: string;
  public contentTypeId!: number;
}

FieldDefinition.init({
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
  dataType: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  contentTypeId: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
    references: {
      model: ContentType,
      key: 'id',
    },
    // onDelete: 'CASCADE',
  },
}, {
  sequelize,
  modelName: 'FieldDefinition',
  tableName:'field_definitions'
});


export default FieldDefinition;
