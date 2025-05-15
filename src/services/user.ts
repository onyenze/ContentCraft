// src/services/user.service.ts
import bcrypt from 'bcrypt';
import UserRepository from '../repositories/user';

class UserService {
    async listUsers() {
        const users = await UserRepository.findAll();
        return { 
          users,
          usersCount: users.length
        };
      }
      
      async getUser(id: number) {
        const user = await UserRepository.findById(id);
        if (!user) throw new Error('User not found');
        return { user };
      }
      

  async createUser(userData: { 
    username: string; 
    email: string; 
    password: string; 
    roleId: number 
  }) {
    const existingUser = await UserRepository.findByEmail(userData.email);
    if (existingUser) throw new Error('Email already in use');

    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const user = await UserRepository.create({
      ...userData,
      password: hashedPassword
    });

    return { user };
  }

  async updateUser(id: number, updateData: { 
    username?: string; 
    email?: string; 
    password?: string; 
    roleId?: number 
  }) {
    if (updateData.email) {
      const existingUser = await UserRepository.findByEmail(updateData.email);
      if (existingUser && existingUser.id !== id) {
        throw new Error('Email already in use');
      }
    }

    const updatedUser = await UserRepository.update(id, updateData);
    if (!updatedUser) throw new Error('User not found');

    return { user: updatedUser };
  }

  async deleteUser(id: number) {
    const success = await UserRepository.delete(id);
    if (!success) throw new Error('User not found');
    return { success: true };
  }
}

export default new UserService();