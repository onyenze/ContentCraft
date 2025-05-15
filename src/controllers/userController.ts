// src/controllers/userController.ts
import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { User, Role } from '../models/associations';

class UserController {
  async listUsers(req: Request, res: Response) {
    try {
      const users = await User.findAll({
        attributes: { exclude: ['password'] },
        include: [{
          model: Role,
          as: 'role' // Must match the alias defined in the association
        }],
      });
       res.json({ users, usersCount: users.length });
       return
    } catch (error) {
      console.error(error);
       res.status(500).json({ errors: { message: 'Internal server error' } });
       return
    }
  }

  async getUser(req: Request, res: Response) {
    try {
      const user = await User.findByPk(req.params.id, {
        include: [{
          model: Role,
          as: 'role' // Must match the alias defined in the association
        }],
      });
      if (!user) {
         res.status(404).json({ errors: { message: 'User not found' } });
         return;
      }
      const { password: _, ...userWithoutPassword } = user.get({ plain: true });

      res.status(200).json({ user: userWithoutPassword });
      return;
    } catch (error) {
      console.error(error);
       res.status(500).json({ errors: { message: 'Internal server error' } });
       return
    }
  }

  async createUser(req: Request, res: Response) {
    try {
      const { username, email, password, roleId } = req.body;

      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
         res.status(409).json({ errors: { email: 'Email already in use' } });
         return
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await User.create({
        username,
        email,
        password: hashedPassword,
        roleId,
      });

      const { password: _, ...userWithoutPassword } = user.get({ plain: true });

      res.status(201).json({ user: userWithoutPassword });
      return;
    } catch (error) {
      console.error(error);
       res.status(500).json({ errors: { message: 'Internal server error' } });
       return
    }
  }

  async updateUser(req: Request, res: Response) {
    try {
      const user = await User.findByPk(req.params.id);
      if (!user) {
         res.status(404).json({ errors: { message: 'User not found' } });
         return
      }

      const { username, email, roleId, password } = req.body;

      if (email && email !== user.email) {
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
           res.status(409).json({ errors: { email: 'Email already in use' } });
           return
        }
        user.email = email;
      }

      if (username) user.username = username;
      if (roleId) user.roleId = roleId;
      if (password) {
        user.password = await bcrypt.hash(password, 10);
      }

      await user.save();
      const { password: _, ...userWithoutPassword } = user.get({ plain: true });

      res.status(200).json({ user: userWithoutPassword });
      return;
    } catch (error) {
      console.error(error);
       res.status(500).json({ errors: { message: 'Internal server error' } });
       return
    }
  }

  async deleteUser(req: Request, res: Response) {
    try {
      const user = await User.findByPk(req.params.id);
      if (!user) {
         res.status(404).json({ errors: { message: 'User not found' } });
         return
      }

      await user.destroy();
       res.status(204).send();
       return
    } catch (error) {
      console.error(error);
       res.status(500).json({ errors: { message: 'Internal server error' } });
       return
    }
  }
}

export default new UserController();