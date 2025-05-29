// src/controllers/authController.ts
import { Request, Response } from 'express';
import AuthService from '../services/auth';

class AuthController {
  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      const result = await AuthService.login(email, password);
      res.status(200).json(result);
      return
    } catch (error) {
      console.error(error);
      res.status(400).json({ errors: { message: "Invalid credentials" } });
      return
    }
  }

  async getCurrentUser(req: Request, res: Response) {
    try {
      if (!req.user) {
         res.status(401).json({ errors: { message: 'Authentication required' } });
         return
      }
      
      const result = await AuthService.getCurrentUser(req.user.id);
      res.json(result);
      return
    } catch (error) {
      console.error(error);
      res.status(404).json({ errors: { message: "User not found" } });
    }
  }
}

export default new AuthController();