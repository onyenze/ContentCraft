import { Request, Response, NextFunction } from "express";
import { log } from "node:console";
import { console } from "node:inspector";

// Extend the Request interface to include a user property
declare global {
  namespace Express {
    interface Request {
      user?: {
        email: string;
        token: string;
        username: string;
      };
    }
  }
}

export const adminAuthStub = (req: Request, res: Response, next: NextFunction): void => {
  const user = {
    email: "admin@cms.com",
    token: "jwt.token.here",
    username: "cmsAdmin",
  };
  // Log the request body to inspect it
  console.log(req.body);

  // Check if user object matches (by comparing properties)
  if (
    req.body.user?.email !== user.email ||
    req.body.user?.token !== user.token ||
    req.body.user?.username !== user.username
  ) {
     res.status(401).json({ message: "You are not authorized" });
  } else{
    next();
  }
  
};
