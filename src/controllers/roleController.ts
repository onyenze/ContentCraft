// src/controllers/roleController.ts
import { Request, Response } from 'express';
import { Role, Permission } from '../models/associations';

class RoleController {
  async listRoles(req: Request, res: Response) {
    try {
      const roles = await Role.findAll({
        include: [{
          model: Permission,
          as: 'permissions' // Must match the alias defined in the association
        }],
      });
       res.json({ roles, rolesCount: roles.length });
       return
    } catch (error) {
      console.error(error);
       res.status(500).json({ errors: { message: 'Internal server error' } });
       return
    }
  }

  async getRole(req: Request, res: Response) {
    try {
      const role = await Role.findByPk(req.params.id, {
        include: [{
          model: Permission,
          as: 'permissions' // Must match the alias defined in the association
        }],
      });
      if (!role) {
         res.status(404).json({ errors: { message: 'Role not found' } });
         return
      }
       res.json({ role });
       return
    } catch (error) {
      console.error(error);
       res.status(500).json({ errors: { message: 'Internal server error' } });
       return
    }
  }

  async createRole(req: Request, res: Response) {
    try {
      const { name, description, permissionIds } = req.body;

      const existingRole = await Role.findOne({ where: { name } });
      if (existingRole) {
         res.status(409).json({ errors: { name: 'Role name already exists' } });
         return
      }

      const role = await Role.create({
        name,
        description,
      });

      if (permissionIds && permissionIds.length > 0) {
        await role.addPermissions(permissionIds);
      }

      const roleWithPermissions = await Role.findByPk(role.id, {
        include: [{
          model: Permission,
          as: 'permissions' // Must match the alias defined in the association
        }],
      });

       res.status(201).json({ role: roleWithPermissions });
       return
    } catch (error) {
      console.error(error);
       res.status(500).json({ errors: { message: 'Internal server error' } });
       return
    }
  }

  async updateRole(req: Request, res: Response) {
    try {
      const role = await Role.findByPk(req.params.id);
      if (!role) {
         res.status(404).json({ errors: { message: 'Role not found' } });
         return
      }

      const { name, description, permissionIds } = req.body;

      if (name && name !== role.name) {
        const existingRole = await Role.findOne({ where: { name } });
        if (existingRole) {
           res.status(409).json({ errors: { name: 'Role name already exists' } });
           return
        }
        role.name = name;
      }

      if (description) role.description = description;
      await role.save();

      if (permissionIds) {
        await role.setPermissions(permissionIds);
      }

      const roleWithPermissions = await Role.findByPk(role.id, {
        include: [{
          model: Permission,
          as: 'permissions' // Must match the alias defined in the association
        }],
      });

       res.json({ role: roleWithPermissions });
       return
    } catch (error) {
      console.error(error);
       res.status(500).json({ errors: { message: 'Internal server error' } });
       return
    }
  }

  async deleteRole(req: Request, res: Response) {
    try {
      const role = await Role.findByPk(req.params.id);
      if (!role) {
         res.status(404).json({ errors: { message: 'Role not found' } });
         return
      }

      await role.destroy();
       res.status(204).send();
       return
    } catch (error) {
      console.error(error);
       res.status(500).json({ errors: { message: 'Internal server error' } });
       return
    }
  }
}

export default new RoleController();