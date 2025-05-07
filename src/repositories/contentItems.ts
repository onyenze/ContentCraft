// write your database queries here
import ContentItem from "../models/contentItem";

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
export const updateContentItem = async (id: string, updateData: any) => {
  const contentItem = await ContentItem.findByPk(id);
  if (!contentItem) return null;
  return contentItem.update(updateData);
};

// Delete a content item
export const deleteContentItem = async (id: string) => {
  const contentItem = await ContentItem.findByPk(id);
  if (!contentItem) return null;
  await contentItem.destroy();
  return true;
};
