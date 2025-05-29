// src/middleware/permissionMiddleware.ts
import { Request, Response, NextFunction } from 'express';
import { User, Role, Permission } from '../models/associations';
import { log } from 'console';

/**
 * Middleware to check if user has specific permission
 * @param requiredPermission - The permission identifier required to access the route
 */
export const requirePermission = (requiredPermission: string) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
         res.status(401).json({ errors: { message: 'Authentication required' } });
         return
      }
      // Get the user with their role and permissions
      const user = await User.findByPk(req.user.id, {
        include: [{
            model: Role,
            as: 'role',  // Must match the association alias
            include: [{
              model: Permission,
              as: 'permissions'  
            }]
          }]
      });

      if (!user) {
         res.status(404).json({ errors: { message: 'User not found' } });
         return
      }
      // Check if user has the required permission
      const hasPermission = user.role?.permissions?.some(
        (permission) => permission.identifier === requiredPermission
      );

      if (!hasPermission) {
         res.status(403).json({
          errors: {
            message: `You don't have permission to perform this action. Required permission: ${requiredPermission}`,
          },
        });
        return
      }

      next();
    } catch (error) {
      console.error(error);
       res.status(500).json({ errors: { message: 'Internal server error' } });
       return
    }
  };
};

/**
 * Middleware to check if user has any of the specified permissions
 * @param allowedPermissions - Array of permission identifiers
 */
export const requireAnyPermission = (allowedPermissions: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
         res.status(401).json({ errors: { message: 'Authentication required' } });
         return
      }

      const user = await User.findByPk(req.user.id, {
        include: [
          {
            model: Role,
            include: [Permission],
          },
        ],
      });

      if (!user) {
         res.status(404).json({ errors: { message: 'User not found' } });
         return
      }

      const hasPermission = user.role?.permissions?.some((permission) =>
        allowedPermissions.includes(permission.identifier)
      );

      if (!hasPermission) {
        return res.status(403).json({
          errors: {
            message: `You don't have permission to perform this action. Required one of: ${allowedPermissions.join(
              ', '
            )}`,
          },
        });
        return
      }

      next();
    } catch (error) {
      console.error(error);
       res.status(500).json({ errors: { message: 'Internal server error' } });
       return
    }
  };
};