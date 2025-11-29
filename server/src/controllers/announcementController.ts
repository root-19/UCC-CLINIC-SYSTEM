import express from 'express';
import { db } from '../config/db.js';

// Create announcement
export const createAnnouncement = async (req: express.Request, res: express.Response) => {
  try {
    const { title, description } = req.body;
    const imagePath = req.file ? `/uploads/${req.file.filename}` : null;

    // Validate required fields
    if (!title || !description) {
      return res.status(400).json({ 
        success: false, 
        message: 'Required: fill all fields' 
      });
    }

    // Create announcement document
    const announcementData: any = {
      title,
      description,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    if (imagePath) {
      announcementData.image = imagePath;
    }

    // Save to Firestore
    const docRef = await db.collection('announcement').add(announcementData);
    res.status(201).json({
      success: true,
      message: 'Announcement added successfully',
      announcementId: docRef.id,
      data: announcementData,
    });
  } catch (error) {
    console.error('Error creating announcement:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
  }
};

// Get all announcements
export const getAnnouncement = async (req: express.Request, res: express.Response) => {
  try {
    const snapshot = await db.collection('announcement').orderBy('createdAt', 'desc').get();
    
    const items = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : data.createdAt,
        updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate() : data.updatedAt,
      };
    });

    res.json({
      success: true,
      data: items,
    });
  } catch (error) {
    console.error('Error fetching announcements:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
  }
};

// Get announcements by category
export const getAnnouncementByCategory = async (req: express.Request, res: express.Response) => {
  try {
    const { category } = req.params;
    if (!category) {
      return res.status(400).json({
        success: false,
        message: 'Category is required',
      });
    }

    const snapshot = await db.collection('announcement')
      .where('category', '==', category)
      .orderBy('createdAt', 'desc')
      .get();
    
    const items = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : data.createdAt,
        updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate() : data.updatedAt,
      };
    });

    res.json({
      success: true,
      data: items,
    });
  } catch (error) {
    console.error('Error fetching announcements by category:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
  }
};

// Update announcement
export const updateAnnouncement = async (req: express.Request, res: express.Response) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'Announcement ID is required',
      });
    }
    const { title, description } = req.body;
    const imagePath = req.file ? `/uploads/${req.file.filename}` : null;

    // Validate required fields
    if (!title && !description && !imagePath) {
      return res.status(400).json({ 
        success: false, 
        message: 'At least one field (title, description, or image) is required' 
      });
    }

    // Check if announcement exists
    const itemRef = db.collection('announcement').doc(id);
    const itemDoc = await itemRef.get();

    if (!itemDoc.exists) {
      return res.status(404).json({
        success: false,
        message: 'Announcement not found',
      });
    }

    // Build update object
    const updateData: any = {
      updatedAt: new Date(),
    };

    if (title) updateData.title = title;
    if (description) updateData.description = description;
    if (imagePath) updateData.image = imagePath;

    // Update announcement
    await itemRef.update(updateData);

    // Get updated document
    const updatedDoc = await itemRef.get();

    res.json({
      success: true,
      message: 'Announcement updated successfully',
      data: {
        id: updatedDoc.id,
        ...updatedDoc.data(),
        createdAt: updatedDoc.data()?.createdAt?.toDate ? updatedDoc.data()?.createdAt.toDate() : updatedDoc.data()?.createdAt,
        updatedAt: updatedDoc.data()?.updatedAt?.toDate ? updatedDoc.data()?.updatedAt.toDate() : updatedDoc.data()?.updatedAt,
      },
    });
  } catch (error) {
    console.error('Error updating announcement:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

// Delete announcement
export const deleteAnnouncement = async (req: express.Request, res: express.Response) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'Announcement ID is required',
      });
    }

    // Check if announcement exists
    const itemRef = db.collection('announcement').doc(id);
    const itemDoc = await itemRef.get();

    if (!itemDoc.exists) {
      return res.status(404).json({
        success: false,
        message: 'Announcement not found',
      });
    }

    // Delete announcement
    await itemRef.delete();

    res.json({
      success: true,
      message: 'Announcement deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting announcement:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};
