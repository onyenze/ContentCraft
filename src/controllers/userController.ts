// src/controllers/userController.ts
import { Request, Response } from 'express';
import UserService from '../services/user';

class UserController {
  async listUsers(req: Request, res: Response) {
    try {
      const result = await UserService.listUsers();
      res.json(result);
      return
    } catch (error:any) {
      console.error(error);
      res.status(500).json({ 
        errors: { 
          message: 'Internal server error',
          details: error.message 
        }
      });
      return
    }
  }
  

  async getUser(req: Request, res: Response) {
    try {
      const result = await UserService.getUser(Number(req.params.id));
      res.json(result);
    } catch (error:any) {
      if (error.message === 'User not found') {
        res.status(404).json({ errors: { message: error.message } });
      } else {
        console.error(error);
        res.status(500).json({ errors: { message: 'Internal server error' } });
      }
    }
  }

  async createUser(req: Request, res: Response) {
    try {
      const { username, email, password, roleId } = req.body;
      const result = await UserService.createUser({ username, email, password, roleId });
      res.status(201).json(result);
    } catch (error:any) {
      if (error.message === 'Email already in use') {
        res.status(409).json({ errors: { email: error.message } });
      } else {
        console.error(error);
        res.status(500).json({ errors: { message: 'Internal server error' } });
      }
    }
  }

  async updateUser(req: Request, res: Response) {
    try {
      const { username, email, password, roleId } = req.body;
      const result = await UserService.updateUser(Number(req.params.id), { 
        username, 
        email, 
        password, 
        roleId 
      });
      res.json(result);
    } catch (error:any) {
      if (error.message === 'User not found') {
        res.status(404).json({ errors: { message: error.message } });
      } else if (error.message === 'Email already in use') {
        res.status(409).json({ errors: { email: error.message } });
      } else {
        console.error(error);
        res.status(500).json({ errors: { message: 'Internal server error' } });
      }
    }
  }

  async deleteUser(req: Request, res: Response) {
    try {
      await UserService.deleteUser(Number(req.params.id));
      res.status(204).send();
    } catch (error:any) {
      if (error.message === 'User not found') {
        res.status(404).json({ errors: { message: error.message } });
      } else {
        console.error(error);
        res.status(500).json({ errors: { message: 'Internal server error' } });
      }
    }
  }
}

export default new UserController();