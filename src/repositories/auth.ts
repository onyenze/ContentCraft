// src/repositories/user.repository.ts
import { User, Role, Permission } from '../models/associations';
import { WhereOptions } from 'sequelize';

class UserRepository {
  async findByEmail(email: string, includePassword = false) {
    const options: any = {
      where: { email }
    };

    if (includePassword) {
      options.scope = 'withPassword';
    }

    return User.findOne(options);
  }

  async findById(id: number, includeRoleAndPermissions = false) {
    const options: any = {
      where: { id },
      attributes: { exclude: ['password'] }
    };

    if (includeRoleAndPermissions) {
      options.include = [{
        model: Role,
        as: 'role',
        include: [{
          model: Permission,
          as: 'permissions'
        }]
      }];
    }

    return User.findOne(options);
  }
}

export default new UserRepository();