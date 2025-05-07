import * as contentItemRepo from "../repositories/contentItems";
import * as contentTypeRepo from "../repositories/contentType";

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
export const updateContentItem = async (contentItemId: string, updateData: any) => {
  return contentItemRepo.updateContentItem(contentItemId, updateData);
};

// Delete a content item
export const deleteContentItem = async (contentItemId: string) => {
  return contentItemRepo.deleteContentItem(contentItemId);
};
