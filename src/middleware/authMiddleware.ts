import { Request, Response, NextFunction } from "express";

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
  const expectedToken = "jwt.token.here";

  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
   res.status(401).json({ message: "Authorization header missing or invalid" });
   return
  }

  const token = authHeader.split(" ")[1];

  if (token !== expectedToken) {
   res.status(401).json({ message: "You are not authorized" });
   return
  }

  req.user = {
    email: "admin@cms.com",
    token: token,
    username: "cmsAdmin",
  };

  next();
};
