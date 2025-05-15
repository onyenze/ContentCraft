// src/repositories/user.repository.ts
import { User, Role,Permission } from '../models/associations';
import bcrypt from 'bcrypt';
import { WhereOptions } from 'sequelize';

class UserRepository {
    async findAll() {
        return User.findAll({
          attributes: { exclude: ['password'] },
          include: [{
            model: Role,
            as: 'role',  // Must match the association alias
            include: [{
              model: Permission,
              as: 'permissions'  
            }]
          }]
        });
      }
      
      async findById(id: number) {
        return User.findByPk(id, {
          attributes: { exclude: ['password'] },
          include: [{
            model: Role,
            as: 'role',
            include: [{
              model: Permission,
              as: 'permissions'
            }]
          }]
        });
      }

  async findByEmail(email: string, includePassword = false) {
    const options: any = {
      where: { email }
    };

    if (includePassword) {
      options.attributes = { include: ['password'] };
    }

    return User.findOne(options);
  }

  async create(userData: { 
    username: string; 
    email: string; 
    password: string; 
    roleId: number 
  }) {
    return User.create(userData, {
    });
  }

  async update(id: number, updateData: { 
    username?: string; 
    email?: string; 
    password?: string; 
    roleId?: number 
  }) {
    const user = await User.findByPk(id);
    if (!user) return null;

    if (updateData.password) {
      updateData.password = await bcrypt.hash(updateData.password, 10);
    }

    return user.update(updateData, {
    });
  }

  async delete(id: number) {
    const user = await User.findByPk(id);
    if (!user) return false;

    await user.destroy();
    return true;
  }
}

export default new UserRepository();