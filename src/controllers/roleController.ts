// src/controllers/roleController.ts
import { Request, Response } from 'express';
import RoleService from '../services/role';

class RoleController {
  async listRoles(req: Request, res: Response) {
    try {
      const result = await RoleService.listRoles();
      res.json(result);
      return
    } catch (error) {
      console.error(error);
      res.status(500).json({ errors: { message: 'Internal server error' } });
      return
    }
  }

  async getRole(req: Request, res: Response) {
    try {
      const result = await RoleService.getRole(Number(req.params.id));
      res.json(result);
      return
    } catch (error:any) {
      if (error.message === 'Role not found') {
        res.status(404).json({ errors: { message: error.message } });
        return
      } else {
        console.error(error);
        res.status(500).json({ errors: { message: 'Internal server error' } });
        return
      }
    }
  }

  async createRole(req: Request, res: Response) {
    try {
      const { name, description, permissionIds } = req.body;
      const result = await RoleService.createRole(name, description, permissionIds);
      res.status(201).json(result);
      return
    } catch (error:any) {
      if (error.message === 'Role name already exists') {
        res.status(409).json({ errors: { name: error.message } });
        return
      } else {
        console.error(error);
        res.status(500).json({ errors: { message: 'Internal server error' } });
        return
      }
    }
  }

  async updateRole(req: Request, res: Response) {
    try {
      const { name, description, permissionIds } = req.body;
      const result = await RoleService.updateRole(
        Number(req.params.id),
        name,
        description,
        permissionIds
      );
      res.json(result);
      return
    } catch (error:any) {
      if (error.message === 'Role not found') {
        res.status(404).json({ errors: { message: error.message } });
        return
      } else if (error.message === 'Role name already exists') {
        res.status(409).json({ errors: { name: error.message } });
        return
      } else {
        console.error(error);
        res.status(500).json({ errors: { message: 'Internal server error' } });
        return
      }
    }
  }

  async deleteRole(req: Request, res: Response) {
    try {
      await RoleService.deleteRole(Number(req.params.id));
      res.status(204).send();
      return
    } catch (error:any) {
      if (error.message === 'Role not found') {
        res.status(404).json({ errors: { message: error.message } });
        return
      } else {
        console.error(error);
        res.status(500).json({ errors: { message: 'Internal server error' } });
        return
      }
    }
  }
}

export default new RoleController();