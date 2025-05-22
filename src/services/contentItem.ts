import * as contentItemRepo from "../repositories/contentItems";
import * as contentTypeRepo from "../repositories/contentType";
import  sequelize  from "../config/database";
import ContentVersion from "../models/contentVersion";
import ContentItem from "../models/contentItem";
// Create a new content item for a specific content type
export const createContentItem = async (contentTypeIdentifier: string, itemData: any) => {
  const contentType = await contentTypeRepo.findContentTypeByIdentifier(contentTypeIdentifier);
  if (!contentType) throw new Error("ContentType not found");

  // You could validate itemData.data here against contentType.fields if needed

  return contentItemRepo.createContentItem({
    contentTypeIdentifier,
    ...itemData
  });
};

// Get content items for a given type with pagination
export const getContentItemsByType = async (
  contentTypeIdentifier: string,
  offset = 0,
  limit = 10
) => {
  const contentType = await contentTypeRepo.findContentTypeByIdentifier(contentTypeIdentifier);
  if (!contentType) throw new Error("ContentType not found");

  const { rows, count } = await contentItemRepo.getContentItemsByType(contentTypeIdentifier, offset, limit);

  return {
    contentItems: rows,
    contentItemsCount: count
  };
};

// Get a single content item by ID
export const getContentItemById = async (contentItemId: string) => {
  return contentItemRepo.getContentItemById(contentItemId);
};

// Update a content item
export const updateContentItem = async (contentItemId: number, updateData: any) => {
  return contentItemRepo.updateContentItem(contentItemId, updateData);
};

// Delete a content item
export const deleteContentItem = async (contentItemId: string) => {
  return contentItemRepo.deleteContentItem(contentItemId);
};

export const getContentVersions = async (contentItemId: number) =>{
  const versions = await contentItemRepo.getContentVersions(contentItemId);
  return { versions };
}

export const restoreVersion = async (contentItemId: number, versionId: number) =>{
  const transaction = await sequelize.transaction();
  try {
    // 1. Get the version to restore
    const version = await ContentVersion.findOne({
      where: { id: versionId, contentItemId },
      transaction
    });
    
    if (!version) {
      throw new Error('Version not found');
    }

    // 2. Mark current version as not current
    await ContentVersion.update(
      { isCurrent: false },
      { 
        where: { 
          contentItemId,
          isCurrent: true 
        },
        transaction
      }
    );

    // 3. Update content item with version data
    const contentItem = await ContentItem.findByPk(contentItemId, { transaction });
      if (contentItem) {
        await contentItem.update({ data: version.data }, { transaction });
      } else {
        throw new Error('Content item not found');
      }
    // 4. Create new current version
    await ContentVersion.create({
      contentItemId,
      data: version.data,
      isCurrent: true
    }, { transaction });

    await transaction.commit();
    return { success: true };
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
}
