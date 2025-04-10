import { Request, Response, NextFunction } from "express";

export const validateContentTypeUpdate = (req: Request, res: Response, next: NextFunction): void  => {
    const { name, identifier } = req.body;
  
    if (name !== undefined && typeof name !== "string") {
     res.status(400).json({ error: "Name must be a string" });
     return;
    }
  
    if (identifier !== undefined && typeof identifier !== "string") {
    res.status(400).json({ error: "Identifier must be a string" });
    return;
    }
  
    next();
  };
  