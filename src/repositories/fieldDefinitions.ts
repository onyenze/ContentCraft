import {FieldDefinition} from '../models/associations';

export const createFieldDefinition = async (data: any) => {
  return await FieldDefinition.create(data);
};

export const getAllFieldDefinitions = async () => {
  return await FieldDefinition.findAll();
};

export const getFieldDefinitionById = async (id: number) => {
  return await FieldDefinition.findByPk(id);
};

export const updateFieldDefinition = async (id: number, updates: any) => {
  const field = await FieldDefinition.findByPk(id);
  if (!field) return null;
  return await field.update(updates);
};

export const deleteFieldDefinition = async (id: number) => {
  const field = await FieldDefinition.findByPk(id);
  if (!field) return null;
  await field.destroy();
  return field;
};
