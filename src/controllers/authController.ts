// src/controllers/authController.ts
import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User } from '../models/associations';
// import { JWT_SECRET } from '../config/config';
import { JwtPayload } from '../interfaces.ts/auth.interfaces';
import{Role,Permission} from '../models/associations';
import  dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '../.env' });


class AuthController {
  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
         res.status(400).json({ errors: { message: 'Email and password are required' } });
         return;
      }

      const user = await User.scope('withPassword').findOne({ where: { email } });
      if (!user) {
         res.status(401).json({ errors: { message: 'Invalid credentials' } });
         return
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
         res.status(401).json({ errors: { message: 'Invalid credentials' } });
         return
      }

      const token = jwt.sign(
        {
          id: user.id,
          email: user.email,
          roleId: user.roleId
        } as JwtPayload,  // Explicitly type the payload
        "JWT_SECRET",
        { expiresIn: '24h' }
      );

       res.json({
        user: {
          id: user.id,       // Include ID in response
          email: user.email,
          token,
          username: user.username,
          roleId: user.roleId // Include if needed
        }
      });
      return
    } catch (error) {
      console.error(error);
       res.status(500).json({ errors: { message: 'Internal server error' } });
       return
    }
  }

  async getCurrentUser(req: Request, res: Response) {
    try {
      if (!req.user) {
         res.status(401).json({ errors: { message: 'Authentication required' } });
         return;
      }
  
      const user = await User.findByPk(req.user.id, {
        include: [{
          model: Role,
          as: 'role', // Use the alias
          include: [{
            model: Permission,
            as: 'permissions' // Use the alias
          }]
        }],
        attributes: { exclude: ['password'] }
      });
  
      if (!user) {
         res.status(404).json({ errors: { message: 'User not found' } });
         return;
      }
  
       res.json({ user });
       return;
    } catch (error) {
      console.error('Error fetching current user:', error);
       res.status(500).json({ errors: { message: 'Internal server error' } });
       return;
    }
  }
}

export default new AuthController();