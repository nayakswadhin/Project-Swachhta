import express from 'express';
import { GreenScoreController } from '../controller/greenScore.controller.js';

const router = express.Router();

router.post('/create', GreenScoreController.create);
router.get('/:postOfficeId', GreenScoreController.getByPostOffice);

export default router;