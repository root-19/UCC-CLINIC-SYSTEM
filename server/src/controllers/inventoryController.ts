import express from 'express';
import { db } from '../config/db.js';

// Create inventory item
export const createInventoryItem = async (req: express.Request, res: express.Response) => {
  try {
    const { name, category, quantity, expirationDate, deliveryDate, unit } = req.body;

    // Validate required fields
    if (!name || !category || !quantity || !expirationDate || !deliveryDate) {
      return res.status(400).json({ 
        success: false, 
        message: 'Name, category, quantity, delivery date, and expiration date are required' 
      });
    }

    // Validate quantity is a positive number
    const qty = Number(quantity);
    if (isNaN(qty) || qty <= 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Quantity must be a positive number' 
      });
    }

    // Validate expiration date
    const expDate = new Date(expirationDate);
    if (isNaN(expDate.getTime())) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid expiration date' 
      });
    }

    // Validate delivery date
    const delDate = new Date(deliveryDate);
    if (isNaN(delDate.getTime())) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid delivery date' 
      });
    }

    // Create inventory item document
    const inventoryData = {
      name,
      category,
      quantity: qty,
      expirationDate: expDate,
      deliveryDate: delDate,
      unit: unit || 'pcs',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Save to Firestore
    const docRef = await db.collection('inventory').add(inventoryData);

    res.status(201).json({
      success: true,
      message: 'Inventory item added successfully',
      inventoryId: docRef.id,
      data: inventoryData,
    });
  } catch (error) {
    console.error('Error creating inventory item:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
  }
};

// Get all inventory items
export const getInventoryItems = async (req: express.Request, res: express.Response) => {
  try {
    const snapshot = await db.collection('inventory').orderBy('createdAt', 'desc').get();
    
    const items = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        expirationDate: data.expirationDate?.toDate ? data.expirationDate.toDate() : data.expirationDate,
        deliveryDate: data.deliveryDate?.toDate ? data.deliveryDate.toDate() : data.deliveryDate,
        createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : data.createdAt,
        updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate() : data.updatedAt,
      };
    });

    res.json({
      success: true,
      data: items,
    });
  } catch (error) {
    console.error('Error fetching inventory items:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
  }
};

// Get inventory items by category
export const getInventoryByCategory = async (req: express.Request, res: express.Response) => {
  try {
    const { category } = req.params;

    const snapshot = await db.collection('inventory')
      .where('category', '==', category)
      .orderBy('createdAt', 'desc')
      .get();
    
    const items = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        expirationDate: data.expirationDate?.toDate ? data.expirationDate.toDate() : data.expirationDate,
        deliveryDate: data.deliveryDate?.toDate ? data.deliveryDate.toDate() : data.deliveryDate,
        createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : data.createdAt,
        updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate() : data.updatedAt,
      };
    });

    res.json({
      success: true,
      data: items,
    });
  } catch (error) {
    console.error('Error fetching inventory by category:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
  }
};

// Update inventory item quantity (reduce) - LIFO (Last In First Out)
export const updateInventoryQuantity = async (req: express.Request, res: express.Response) => {
  try {
    const { id } = req.params;
    const itemId = Array.isArray(id) ? id[0] : id;
    if (!itemId) {
      return res.status(400).json({
        success: false,
        message: 'Item ID is required',
      });
    }
    const { quantity } = req.body;

    // Validate quantity
    const qty = Number(quantity);
    if (isNaN(qty) || qty <= 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Quantity must be a positive number' 
      });
    }

    // Check if item exists
    const itemRef = db.collection('inventory').doc(itemId);
    const itemDoc = await itemRef.get();

    if (!itemDoc.exists) {
      return res.status(404).json({
        success: false,
        message: 'Inventory item not found',
      });
    }

    const currentData = itemDoc.data();
    const itemName = currentData?.name;
    const currentQuantity = currentData?.quantity || 0;

    if (!itemName) {
      return res.status(400).json({
        success: false,
        message: 'Item name not found',
      });
    }

    // Check total available quantity across all items with the same name (LIFO)
    const allItemsSnapshot = await db.collection('inventory')
      .where('name', '==', itemName)
      .get();

    // Calculate total available quantity and prepare items for LIFO
    let totalAvailable = 0;
    const itemsWithQuantity = allItemsSnapshot.docs.map(doc => {
      const data = doc.data();
      const qty = data.quantity || 0;
      totalAvailable += qty;
      return {
        id: doc.id,
        ref: doc.ref,
        quantity: qty,
        createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : new Date(data.createdAt),
      };
    });

    // Check if we have enough quantity
    if (totalAvailable < qty) {
      return res.status(400).json({
        success: false,
        message: `Insufficient quantity. Available: ${totalAvailable}`,
      });
    }

    // Sort by createdAt descending (newest first) for LIFO
    itemsWithQuantity.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

    // Reduce quantity using LIFO (Last In First Out)
    let remainingToReduce = qty;
    const batch = db.batch();

    for (const item of itemsWithQuantity) {
      if (remainingToReduce <= 0) break;

      const itemQty = item.quantity;

      if (itemQty > 0) {
        if (itemQty >= remainingToReduce) {
          // This item has enough quantity, reduce and we're done
          batch.update(item.ref, {
            quantity: itemQty - remainingToReduce,
            updatedAt: new Date(),
          });
          remainingToReduce = 0;
        } else {
          // This item doesn't have enough, use all of it and continue
          batch.update(item.ref, {
            quantity: 0,
            updatedAt: new Date(),
          });
          remainingToReduce -= itemQty;
        }
      }
    }

    // Commit all updates
    await batch.commit();

    // Get updated document
    const updatedDoc = await itemRef.get();

    res.json({
      success: true,
      message: 'Inventory quantity updated successfully (LIFO)',
      data: {
        id: updatedDoc.id,
        ...updatedDoc.data(),
        expirationDate: updatedDoc.data()?.expirationDate?.toDate ? updatedDoc.data()?.expirationDate.toDate() : updatedDoc.data()?.expirationDate,
        createdAt: updatedDoc.data()?.createdAt?.toDate ? updatedDoc.data()?.createdAt.toDate() : updatedDoc.data()?.createdAt,
        updatedAt: updatedDoc.data()?.updatedAt?.toDate ? updatedDoc.data()?.updatedAt.toDate() : updatedDoc.data()?.updatedAt,
      },
    });
  } catch (error) {
    console.error('Error updating inventory quantity:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

// Update inventory item
export const updateInventoryItem = async (req: express.Request, res: express.Response) => {
  try {
    const { id } = req.params;
    const itemId = Array.isArray(id) ? id[0] : id;
    if (!itemId) {
      return res.status(400).json({
        success: false,
        message: 'Item ID is required',
      });
    }
    const { name, category, quantity, expirationDate, deliveryDate, unit } = req.body;

    // Check if item exists
    const itemRef = db.collection('inventory').doc(itemId);
    const itemDoc = await itemRef.get();

    if (!itemDoc.exists) {
      return res.status(404).json({
        success: false,
        message: 'Inventory item not found',
      });
    }

    // Build update object
    const updateData: any = {
      updatedAt: new Date(),
    };

    if (name) updateData.name = name;
    if (category) updateData.category = category;
    if (quantity !== undefined) {
      const qty = Number(quantity);
      if (isNaN(qty) || qty < 0) {
        return res.status(400).json({ 
          success: false, 
          message: 'Quantity must be a non-negative number' 
        });
      }
      updateData.quantity = qty;
    }
    if (expirationDate) {
      const expDate = new Date(expirationDate);
      if (isNaN(expDate.getTime())) {
        return res.status(400).json({ 
          success: false, 
          message: 'Invalid expiration date' 
        });
      }
      updateData.expirationDate = expDate;
    }
    if (deliveryDate) {
      const delDate = new Date(deliveryDate);
      if (isNaN(delDate.getTime())) {
        return res.status(400).json({ 
          success: false, 
          message: 'Invalid delivery date' 
        });
      }
      updateData.deliveryDate = delDate;
    }
    if (unit) updateData.unit = unit;

    // Update item
    await itemRef.update(updateData);

    // Get updated document
    const updatedDoc = await itemRef.get();

    res.json({
      success: true,
      message: 'Inventory item updated successfully',
      data: {
        id: updatedDoc.id,
        ...updatedDoc.data(),
        expirationDate: updatedDoc.data()?.expirationDate?.toDate ? updatedDoc.data()?.expirationDate.toDate() : updatedDoc.data()?.expirationDate,
        createdAt: updatedDoc.data()?.createdAt?.toDate ? updatedDoc.data()?.createdAt.toDate() : updatedDoc.data()?.createdAt,
        updatedAt: updatedDoc.data()?.updatedAt?.toDate ? updatedDoc.data()?.updatedAt.toDate() : updatedDoc.data()?.updatedAt,
      },
    });
  } catch (error) {
    console.error('Error updating inventory item:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

// Delete inventory item
export const deleteInventoryItem = async (req: express.Request, res: express.Response) => {
  try {
    const { id } = req.params;
    const itemId = Array.isArray(id) ? id[0] : id;
    if (!itemId) {
      return res.status(400).json({
        success: false,
        message: 'Item ID is required',
      });
    }

    // Check if item exists
    const itemRef = db.collection('inventory').doc(itemId);
    const itemDoc = await itemRef.get();

    if (!itemDoc.exists) {
      return res.status(404).json({
        success: false,
        message: 'Inventory item not found',
      });
    }

    // Delete item
    await itemRef.delete();

    res.json({
      success: true,
      message: 'Inventory item deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting inventory item:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

