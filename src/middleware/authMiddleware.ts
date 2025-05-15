import { Request, Response, NextFunction } from "express";
import jwt from 'jsonwebtoken';
// import { JWT_SECRET } from '../config/config';
import { User } from '../models/associations';
import { JwtPayload } from '../interfaces.ts/auth.interfaces';
import  dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '../.env' });

// Extend the Request interface to include a user property
// declare global {
//   namespace Express {
//     interface Request {
//       user?: {
//         email: string;
//         token: string;
//         username: string;
//       };
//     }
//   }
// }
// Define your JWT payload interface
interface JwtAdminPayload {
  id: number;
  email: string;
  username: string;
  // Add other required admin claims
}

export const adminAuthStub = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;

  // 1. Check for Authorization header
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
     res.status(401).json({ message: "Authorization header missing or invalid" });
     return
  }

  const token = authHeader.split(" ")[1];

  try {
    // 2. Verify and decode the JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "JWT_SECRET") as JwtAdminPayload;

    // 3. Verify admin credentials
    if (decoded.email !== "admin@cms.com" && decoded.username !== "cmsAdmin") {
       res.status(403).json({ message: "Admin access required" });
       return
    }

    // 4. Attach user to request
    req.user = {
      id : decoded.id,
      email: decoded.email,
      username: decoded.username,
    };

    next();
  } catch (error) {
    // Handle different JWT errors
    if (error instanceof jwt.TokenExpiredError) {
       res.status(401).json({ message: "Token expired" });
       return
    }
    if (error instanceof jwt.JsonWebTokenError) {
       res.status(401).json({ message: "Invalid token" });
       return
    }
     res.status(500).json({ message: "Authentication failed" });
     return
  }
};




declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;  // Use the JwtPayload interface
    }
  }
}

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ errors: { message: 'Authentication token required' } });
      return;
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, "JWT_SECRET") as JwtPayload;
    

    const user = await User.findByPk(decoded.id);
    if (!user) {
      res.status(401).json({ errors: { message: 'Invalid token - user not found' } });
      return;
    }
    
// console.log(user);
console.log(decoded.id);

    req.user = decoded;
    next();
  } catch (error) {
    console.error(error);
    res.status(401).json({ errors: { message: 'Invalid or expired token' } });
    return
  }
};