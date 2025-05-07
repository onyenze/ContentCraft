import * as contentTypeRepo from "../repositories/contentType";

interface ContentTypeInput {
  identifier: string;
  name: string;
  description?: string;
}

export const createContentType = async (data: ContentTypeInput) => {
  const { identifier, name, description } = data;

  if (!identifier || !name) {
    throw new Error("Identifier and name are required");
  }

  const existing = await contentTypeRepo.findContentTypeByIdentifier(identifier);
  if (existing) {
    throw new Error("Content type with this identifier already exists");
  }

  return contentTypeRepo.createContentType(identifier, name, description);
};

export const getAllContentTypes = async () => {
  return contentTypeRepo.getAllContentTypes();
};

export const getContentTypeByIdentifier = async (identifier: string) => {
  const contentType = await contentTypeRepo.getContentTypeByIdentifier(identifier);
  if (!contentType) {
    throw new Error("Content type not found");
  }
  return contentType;
};

export const updateContentType = async (
  identifier: string,
  updates: { name?: string; description?: string }
) => {
  const existing = await contentTypeRepo.findContentTypeByIdentifier(identifier);
  if (!existing) {
    throw new Error("Content type not found");
  }

  await contentTypeRepo.updateContentType(identifier, updates);
  return contentTypeRepo.getContentTypeByIdentifier(identifier); // Return updated version
};

export const deleteContentType = async (identifier: string) => {
  const contentType = await contentTypeRepo.findContentTypeByIdentifier(identifier);
  if (!contentType) {
    throw new Error("Content type not found");
  }

  await contentTypeRepo.deleteContentType(contentType);
  return;
};
