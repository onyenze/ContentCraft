// src/models/ContentVersion.ts
import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';
import ContentItem from './contentItem';

interface ContentVersionAttributes {
  id?: number;
  contentItemId: number;
  data: object;
  isCurrent: boolean;
}

class ContentVersion extends Model<ContentVersionAttributes> implements ContentVersionAttributes {
  public id!: number;
  public contentItemId!: number;
  public data!: object;
  public isCurrent!: boolean;
  
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

ContentVersion.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    contentItemId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: ContentItem,
        key: 'id'
      }
    },
    data: {
      type: DataTypes.JSON,
      allowNull: false
    },
    isCurrent: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      allowNull: false
    }
  },
  {
    sequelize,
    tableName: 'content_versions',
    indexes: [
      {
        fields: ['contentItemId']
      },
      {
        fields: ['isCurrent']
      }
    ]
  }
);


export default ContentVersion;