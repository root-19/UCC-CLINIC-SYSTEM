import express from 'express';
import {
  createInventoryItem,
  getInventoryItems,
  getInventoryByCategory,
  updateInventoryQuantity,
  updateInventoryItem,
  deleteInventoryItem,
} from '../controllers/inventoryController.js';

const router = express.Router();

router.post('/', createInventoryItem);
router.get('/', getInventoryItems);
router.get('/category/:category', getInventoryByCategory);
router.patch('/:id/quantity', updateInventoryQuantity);
router.put('/:id', updateInventoryItem);
router.delete('/:id', deleteInventoryItem);

export default router;

