// src/services/role.service.ts
import RoleRepository from '../repositories/role';

class RoleService {
  async listRoles() {
    const roles = await RoleRepository.findAllWithPermissions();
    return { roles, rolesCount: roles.length };
  }

  async getRole(id: number) {
    const role = await RoleRepository.findByIdWithPermissions(id);
    if (!role) throw new Error('Role not found');
    return { role };
  }

  async createRole(name: string, description?: string, permissionIds?: number[]) {
    const existingRole = await RoleRepository.findByName(name);
    if (existingRole) throw new Error('Role name already exists');

    const role = await RoleRepository.createRole({ name, description });
    
    if (permissionIds?.length) {
      return RoleRepository.setRolePermissions(role.id, permissionIds);
    }
    
    return { role };
  }

  async updateRole(id: number, name?: string, description?: string, permissionIds?: number[]) {
    if (name) {
      const existingRole = await RoleRepository.findByName(name);
      if (existingRole && existingRole.id !== id) {
        throw new Error('Role name already exists');
      }
    }

    const updatedRole = await RoleRepository.updateRole(id, { name, description });
    if (!updatedRole) throw new Error('Role not found');

    if (permissionIds) {
      return RoleRepository.setRolePermissions(id, permissionIds);
    }

    return { role: await RoleRepository.findByIdWithPermissions(id) };
  }

  async deleteRole(id: number) {
    const success = await RoleRepository.deleteRole(id);
    if (!success) throw new Error('Role not found');
    return { success: true };
  }
}

export default new RoleService();