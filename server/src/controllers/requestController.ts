import express from 'express';
import { db } from '../config/db.js';

export const createRequest = async (req: express.Request, res: express.Response) => {
  try {
    const { fullname, yearSection, schoolIdNumber, departmentCourse, assessment, referredTo } = req.body;

    // Validate required fields
    if (!fullname || !yearSection || !schoolIdNumber || !departmentCourse || !assessment || !referredTo) {
      return res.status(400).json({ 
        success: false, 
        message: 'All fields are required' 
      });
    }

    // Create request document
    const requestData = {
      fullname,
      yearSection,
      schoolIdNumber,
      departmentCourse,
      assessment,
      referredTo,
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Save to Firestore
    const docRef = await db.collection('requests').add(requestData);

    res.status(201).json({
      success: true,
      message: 'Request form submitted successfully',
      requestId: docRef.id,
      data: requestData,
    });
  } catch (error) {
    console.error('Error creating request:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
  }
};

export const getRequests = async (req: express.Request, res: express.Response) => {
  try {
    const snapshot = await db.collection('requests').orderBy('createdAt', 'desc').get();
    
    const requests = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.json({
      success: true,
      data: requests,
    });
  } catch (error) {
    console.error('Error fetching requests:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
  }
};

export const updateRequestStatus = async (req: express.Request, res: express.Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Validate status
    const validStatuses = ['pending', 'approved', 'rejected', 'processing'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Must be one of: pending, approved, rejected, processing',
      });
    }

    // Check if request exists
    const requestRef = db.collection('requests').doc(id);
    const requestDoc = await requestRef.get();

    if (!requestDoc.exists) {
      return res.status(404).json({
        success: false,
        message: 'Request not found',
      });
    }

    // Update status
    await requestRef.update({
      status,
      updatedAt: new Date(),
    });

    // Get updated document
    const updatedDoc = await requestRef.get();

    res.json({
      success: true,
      message: `Request ${status} successfully`,
      data: {
        id: updatedDoc.id,
        ...updatedDoc.data(),
      },
    });
  } catch (error) {
    console.error('Error updating request status:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

