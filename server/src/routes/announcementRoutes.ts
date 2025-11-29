import express from 'express';
import {
  createAnnouncement,
  getAnnouncement,
  getAnnouncementByCategory,
  updateAnnouncement,
  deleteAnnouncement,
} from '../controllers/announcementController.js';
import { upload } from '../middleware/upload.js';

const router = express.Router();

router.post('/', upload.single('image'), createAnnouncement);
router.get('/', getAnnouncement);
router.get('/category/:category', getAnnouncementByCategory);
router.put('/:id', upload.single('image'), updateAnnouncement);
router.delete('/:id', deleteAnnouncement);

export default router;
