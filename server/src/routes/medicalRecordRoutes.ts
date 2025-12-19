import express from 'express';
import {
  createMedicalRecord,
  getMedicalRecords,
  getMedicalRecordById,
  deleteMedicalRecord,
} from '../controllers/medicalRecordController.js';

const router = express.Router();

router.post('/', createMedicalRecord);
router.get('/', getMedicalRecords);
router.get('/:id', getMedicalRecordById);
router.delete('/:id', deleteMedicalRecord);

export default router;

