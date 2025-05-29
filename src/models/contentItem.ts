// src/models/ContentItem.ts
import {
    Model, DataTypes, Optional
  } from 'sequelize';
  import sequelize from '../config/database';
  import ContentType from './contentType';
  
  interface ContentItemAttributes {
    id: number;
    contentTypeIdentifier: string;
    title: string;
    slug: string;
    publishedAt?: Date | null;
    status: 'DRAFT' | 'REVIEW' | 'PUBLISHED';
    data: object;
    createdAt?: Date;
    updatedAt?: Date;
  }
  
  type ContentItemCreationAttributes = Optional<ContentItemAttributes, 'id' | 'publishedAt' | 'createdAt' | 'updatedAt'>;
  
  class ContentItem extends Model<ContentItemAttributes, ContentItemCreationAttributes>
    implements ContentItemAttributes {
    public id!: number;
    public contentTypeIdentifier!: string;
    public title!: string;
    public slug!: string;
    public publishedAt!: Date | null;
    public status!: 'DRAFT' | 'REVIEW' | 'PUBLISHED';
    public data!: object;
  
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }
  
  ContentItem.init(
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      contentTypeIdentifier: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      title: DataTypes.STRING,
      slug: DataTypes.STRING,
      publishedAt: DataTypes.DATE,
      status: {
        type: DataTypes.ENUM('DRAFT', 'REVIEW', 'PUBLISHED'),
        allowNull: false,
        defaultValue: "DRAFT"
      },
      data: {
        type: DataTypes.JSON,
        allowNull: true,
      },
    },
    {
      sequelize,
      tableName: 'content_items',
    }
  );
  
//   // Define association
//   ContentItem.belongsTo(ContentType, { foreignKey: 'contentTypeId' });
//   ContentType.hasMany(ContentItem, { foreignKey: 'contentTypeId' });
  
  export default ContentItem;
  