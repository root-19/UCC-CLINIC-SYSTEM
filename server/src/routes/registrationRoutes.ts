import express from 'express';
import {
  createRegistration,
  getRegistrations,
  getRegistrationById,
  updateRegistration,
  deleteRegistration,
} from '../controllers/registrationController.js';

const router = express.Router();

router.post('/', createRegistration);
router.get('/', getRegistrations);
router.get('/:id', getRegistrationById);
router.put('/:id', updateRegistration);
router.delete('/:id', deleteRegistration);

export default router;

