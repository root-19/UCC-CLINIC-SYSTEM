import express from 'express';
import { db } from '../config/db.js';

// Create inventory item
export const createInventoryItem = async (req: express.Request, res: express.Response) => {
  try {
    const { name, category, quantity, expirationDate, unit } = req.body;

    // Validate required fields
    if (!name || !category || !quantity || !expirationDate) {
      return res.status(400).json({ 
        success: false, 
        message: 'Name, category, quantity, and expiration date are required' 
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

    // Create inventory item document
    const inventoryData = {
      name,
      category,
      quantity: qty,
      expirationDate: expDate,
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

// Update inventory item quantity (reduce)
export const updateInventoryQuantity = async (req: express.Request, res: express.Response) => {
  try {
    const { id } = req.params;
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
    const itemRef = db.collection('inventory').doc(id);
    const itemDoc = await itemRef.get();

    if (!itemDoc.exists) {
      return res.status(404).json({
        success: false,
        message: 'Inventory item not found',
      });
    }

    const currentData = itemDoc.data();
    const currentQuantity = currentData?.quantity || 0;

    // Check if reducing quantity would go below zero
    const newQuantity = currentQuantity - qty;
    if (newQuantity < 0) {
      return res.status(400).json({
        success: false,
        message: `Insufficient quantity. Available: ${currentQuantity}`,
      });
    }

    // Update quantity
    await itemRef.update({
      quantity: newQuantity,
      updatedAt: new Date(),
    });

    // Get updated document
    const updatedDoc = await itemRef.get();

    res.json({
      success: true,
      message: 'Inventory quantity updated successfully',
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
    const { name, category, quantity, expirationDate, unit } = req.body;

    // Check if item exists
    const itemRef = db.collection('inventory').doc(id);
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

    // Check if item exists
    const itemRef = db.collection('inventory').doc(id);
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

