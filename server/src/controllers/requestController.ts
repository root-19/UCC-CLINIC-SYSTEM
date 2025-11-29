import express from 'express';
import { db } from '../config/db.js';
import { sendRequestStatusEmail } from '../services/emailService.js';

export const createRequest = async (req: express.Request, res: express.Response) => {
  try {
    const { fullname, yearSection, schoolIdNumber, department, assessment, email, requestDate, requestTime } = req.body;

    // Validate required fields
    if (!fullname || !yearSection || !schoolIdNumber || !department || !assessment || !email || !requestDate || !requestTime) {
      return res.status(400).json({ 
        success: false, 
        message: 'All fields are required' 
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email format',
      });
    }

    // Validate Student ID Number format: 8 digits, dash, 1 letter
    const studentIdPattern = /^[0-9]{8}-[A-Z]$/;
    if (!studentIdPattern.test(schoolIdNumber)) {
      return res.status(400).json({
        success: false,
        message: 'Student ID Number must be in format: 8 digits, dash, 1 letter (e.g., 12345678-A)',
      });
    }

    // Combine date and time into a single Date object
    let requestDateTime: Date;
    try {
      const dateTimeString = `${requestDate}T${requestTime}:00`;
      requestDateTime = new Date(dateTimeString);
      
      // Validate the date
      if (isNaN(requestDateTime.getTime())) {
        return res.status(400).json({
          success: false,
          message: 'Invalid date or time format',
        });
      }
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: 'Invalid date or time format',
      });
    }

    // Create request document
    const requestData = {
      fullname,
      yearSection,
      schoolIdNumber,
      department,
      assessment,
      email,
      requestDate: requestDateTime,
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
    
    const requests = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        requestDate: data.requestDate?.toDate ? data.requestDate.toDate() : data.requestDate,
        createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : data.createdAt,
        updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate() : data.updatedAt,
      };
    });

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

export const deleteRequest = async (req: express.Request, res: express.Response) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'Request ID is required',
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

    // Delete request
    await requestRef.delete();

    res.json({
      success: true,
      message: 'Request deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting request:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

export const updateRequestStatus = async (req: express.Request, res: express.Response) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'Request ID is required',
      });
    }
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

    const currentData = requestDoc.data();
    const studentEmail = currentData?.email;
    const studentName = currentData?.fullname;
    const assessment = currentData?.assessment || 'N/A';

    // Update status
    await requestRef.update({
      status,
      updatedAt: new Date(),
    });

    // Send email notification to student (non-blocking)
    if (studentEmail) {
      sendRequestStatusEmail(studentEmail, studentName || 'Student', status, assessment)
        .then((sent) => {
          if (sent) {
            console.log(`Email notification sent to ${studentEmail} for status: ${status}`);
          } else {
            console.log(`Email notification not sent (email not configured or failed) for ${studentEmail}`);
          }
        })
        .catch((error) => {
          console.error('Error sending email notification:', error);
          // Don't fail the request if email fails
        });
    }

    // Get updated document
    const updatedDoc = await requestRef.get();

    res.json({
      success: true,
      message: `Request ${status} successfully. Email notification sent to student.`,
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

