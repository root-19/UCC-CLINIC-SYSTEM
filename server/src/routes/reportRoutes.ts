import express from 'express';
import { getMonthlyMedicationReports } from '../controllers/reportController.js';

const router = express.Router();

router.get('/medication', getMonthlyMedicationReports);

export default router;

