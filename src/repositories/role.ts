// src/repositories/role.repository.ts
import { Role, Permission } from '../models/associations';
import { WhereOptions } from 'sequelize';

class RoleRepository {
  async findAllWithPermissions() {
    return Role.findAll({
      include: [{
        model: Permission,
        as: 'permissions'
      }]
    });
  }

  async findByIdWithPermissions(id: number) {
    return Role.findByPk(id, {
      include: [{
        model: Permission,
        as: 'permissions'
      }]
    });
  }

  async findByName(name: string) {
    return Role.findOne({ where: { name } });
  }

  async createRole(roleData: { name: string; description?: string }) {
    return Role.create(roleData);
  }

  async updateRole(id: number, updateData: { name?: string; description?: string }) {
    const role = await Role.findByPk(id);
    if (!role) return null;

    return role.update(updateData);
  }

  async deleteRole(id: number) {
    const role = await Role.findByPk(id);
    if (!role) return false;

    await role.destroy();
    return true;
  }

  async setRolePermissions(roleId: number, permissionIds: number[]) {
    const role = await Role.findByPk(roleId);
    if (!role) return null;

    await role.setPermissions(permissionIds);
    return this.findByIdWithPermissions(roleId);
  }
}

export default new RoleRepository();