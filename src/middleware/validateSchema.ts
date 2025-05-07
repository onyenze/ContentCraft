// src/middleware/validateSchema.ts
import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';

export const validateSchema = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      schema.parse(req.body);
      next();
    } catch (err) {
      if (err instanceof ZodError) {
         res.status(400).json({
          error: "Validation failed",
          details: err.errors.map(e => ({
            path: e.path.join('.'),
            message: e.message
          }))
        })
        return;
      }

       res.status(500).json({ error: "Unexpected validation error" })
       return;
    }
  };
};
