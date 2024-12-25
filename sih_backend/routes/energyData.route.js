import express from 'express';
import { EnergyDataController } from '../controller/energyDataController.js';

const router = express.Router();

router.post('/', EnergyDataController.create);
router.get('/post-office/:postOfficeId', EnergyDataController.getByPostOffice);

export default router;