import express from 'express';
import { createFieldDefinition, getFieldDefinitions,updateFieldDefinition ,deleteFieldDefinition} from '../controllers/fieldDefinitionController';
import { authenticate,adminAuthStub } from '../middleware/authMiddleware';

const router = express.Router();

router.post('/field-definitions',
    authenticate,
    adminAuthStub, 
    createFieldDefinition);  // Admin only in real app
router.get('/field-definitions',
    authenticate,
    adminAuthStub, 
    getFieldDefinitions);

router.put('/field-definitions/:id', 
    authenticate,
    adminAuthStub, 
    updateFieldDefinition);
router.delete('/field-definitions/:id', 
    authenticate,
    adminAuthStub, 
    deleteFieldDefinition);

export default router;
