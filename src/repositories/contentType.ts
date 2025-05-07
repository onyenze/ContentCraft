import ContentType from '../models/contentType';
import FieldDefinition from '../models/fieldDefinition';

export const createContentType = async (identifier: string, name: string, description?: string) => {
  return ContentType.create({ identifier, name, description });
};

export const getAllContentTypes = async () => {
  return ContentType.findAll({
    include: [{ model: FieldDefinition, as: 'fields' }],
  });
};

export const getContentTypeByIdentifier = async (identifier: string) => {
  return ContentType.findOne({
    where: { identifier },
    include: [{ model: FieldDefinition, as: 'fields' }],
  });
};

export const findContentTypeByIdentifier = async (identifier: string) => {
  return ContentType.findOne({ where: { identifier } });
};

export const updateContentType = async (
  identifier: string,
  updates: { name?: string; description?: string }
) => {
  return ContentType.update(updates, { where: { identifier } });
};

export const deleteContentType = async (contentType: ContentType) => {
  return contentType.destroy();
};
