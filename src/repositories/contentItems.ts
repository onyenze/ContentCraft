// write your database queries here
import sequelize from '../config/database';
import { ContentItem, ContentVersion } from '../models/associations';

// Create a new content item
export const createContentItem = async (data: any) => {
  return ContentItem.create(data);
};

// Get content items by type with pagination
export const getContentItemsByType = async (
  contentTypeIdentifier: string,
  offset: number = 0,
  limit: number = 10
) => {
  return ContentItem.findAndCountAll({
    where: { contentTypeIdentifier },
    offset,
    limit,
    order: [["createdAt", "DESC"]],
  });
};

// Get a single content item by its ID
export const getContentItemById = async (id: string) => {
  return ContentItem.findByPk(id);
};

// Update a content item
export const updateContentItem = async (id: number, updateData: any) =>{
  const transaction = await sequelize.transaction();
  try {
    // 1. Get current content item
    const contentItem = await ContentItem.findByPk(id, { transaction });
    if (!contentItem) {
      throw new Error('Content item not found');
    }

    // 2. Create new version with current data
    await ContentVersion.create({
      contentItemId: id,
      data: contentItem.data,
      isCurrent: false
    }, { transaction });

    // 3. Update the content item
    const updatedItem = await contentItem.update(updateData, { transaction });

    // 4. Create new version with updated data
    await ContentVersion.create({
      contentItemId: id,
      data: updatedItem.data,
      isCurrent: true
    }, { transaction });

    await transaction.commit();
    return updatedItem;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
}

export const getContentVersions= async (contentItemId: number) =>{
  return ContentVersion.findAll({
    where: { contentItemId },
    order: [['createdAt', 'DESC']]
  });
}

export const getCurrentVersion = async (contentItemId: number) =>{
  return ContentVersion.findOne({
    where: { 
      contentItemId,
      isCurrent: true 
    }
  });
}

export const findAllContentItems = async (data: any) => {
  return  ContentItem.findAll({ where: data });
};

// Delete a content item
export const deleteContentItem = async (id: string) => {
  const contentItem = await ContentItem.findByPk(id);
  if (!contentItem) return null;
  await contentItem.destroy();
  return true;
};
