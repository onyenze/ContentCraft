import * as repo from '../repositories/fieldDefinitions';

export const createFieldDefinition = async (data: any) => {
  return await repo.createFieldDefinition(data);
};

export const getFieldDefinitions = async () => {
  return await repo.getAllFieldDefinitions();
};

export const updateFieldDefinition = async (id: number, updates: any) => {
  return await repo.updateFieldDefinition(id, updates);
};

export const deleteFieldDefinition = async (id: number) => {
  return await repo.deleteFieldDefinition(id);
};
