// src/services/auth.service.ts
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import UserRepository from '../repositories/auth';
import { JwtPayload } from '../interfaces.ts/auth.interfaces';

class AuthService {
  async login(email: string, password: string) {
    if (!email || !password) {
      throw new Error('Email and password are required');
    }

    const user = await UserRepository.findByEmail(email, true);
    if (!user) {
      throw new Error('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error('Invalid credentials');
    }

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        roleId: user.roleId
      } as JwtPayload,
      "JWT_SECRET",
      { expiresIn: '24h' }
    );

    return {
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        roleId: user.roleId,
        token
      }
    };
  }

  async getCurrentUser(userId: any) {
    if (!userId) {
      throw new Error('User ID is required');
    }

    const user = await UserRepository.findById(userId, true);
    if (!user) {
      throw new Error('User not found');
    }

    return { user };
  }
}

export default new AuthService();