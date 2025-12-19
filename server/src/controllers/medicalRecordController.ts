import express from 'express';
import { db } from '../config/db.js';

export const createMedicalRecord = async (req: express.Request, res: express.Response) => {
  try {
    const {
      fullname,
      firstName,
      middleName,
      lastName,
      schoolIdNumber,
      department,
      yearSection,
      visitDate,
      visitTime,
      reasonForVisit,
      visitType,
      temperature,
      bloodPressure,
      heartRate,
      respiratoryRate,
      weight,
      height,
      initialAssessment,
      diagnosis,
      symptomsObserved,
      allergies,
      existingMedicalConditions,
      medicationGiven,
      firstAidProvided,
      proceduresDone,
      adviceGiven,
      sentHome,
      parentNotified,
      referredTo,
      referralReason,
      referralTime,
      transportAssistance,
      attendingPersonnelName,
      attendingPersonnelId,
      additionalRemarks,
      studentId,
    } = req.body;

    // Validate required fields
    if (!fullname || !schoolIdNumber || !department || !yearSection || !visitDate || !visitTime || !reasonForVisit || !visitType || !sentHome || !parentNotified || !attendingPersonnelName || !attendingPersonnelId) {
      return res.status(400).json({
        success: false,
        message: 'Required fields are missing',
      });
    }

    // Combine date and time into a single Date object
    let visitDateTime: Date;
    try {
      const dateTimeString = `${visitDate}T${visitTime}:00`;
      visitDateTime = new Date(dateTimeString);

      if (isNaN(visitDateTime.getTime())) {
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

    // Create medical record document
    const medicalRecordData = {
      // Student Information
      fullname,
      firstName: firstName || '',
      middleName: middleName || '',
      lastName: lastName || '',
      schoolIdNumber,
      department,
      yearSection,
      studentId: studentId || schoolIdNumber,
      
      // Visit Details
      visitDate: visitDateTime,
      visitTime,
      reasonForVisit,
      visitType,
      
      // Vital Signs
      temperature: temperature || '',
      bloodPressure: bloodPressure || '',
      heartRate: heartRate || '',
      respiratoryRate: respiratoryRate || '',
      weight: weight || '',
      height: height || '',
      
      // Medical Assessment
      initialAssessment: initialAssessment || '',
      diagnosis: diagnosis || '',
      symptomsObserved: symptomsObserved || '',
      allergies: allergies || '',
      existingMedicalConditions: existingMedicalConditions || '',
      
      // Treatment / Action Taken
      medicationGiven: medicationGiven || '',
      firstAidProvided: firstAidProvided || '',
      proceduresDone: proceduresDone || '',
      adviceGiven: adviceGiven || '',
      sentHome,
      parentNotified,
      
      // Referral Information
      referredTo: referredTo || '',
      referralReason: referralReason || '',
      referralTime: referralTime || '',
      transportAssistance: transportAssistance || '',
      
      // Attending Personnel
      attendingPersonnelName,
      attendingPersonnelId,
      additionalRemarks: additionalRemarks || '',
      
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Save to Firestore
    const docRef = await db.collection('medicalRecords').add(medicalRecordData);

    res.status(201).json({
      success: true,
      message: 'Medical record created successfully',
      recordId: docRef.id,
      data: medicalRecordData,
    });
  } catch (error) {
    console.error('Error creating medical record:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

export const getMedicalRecords = async (req: express.Request, res: express.Response) => {
  try {
    const { studentId, schoolIdNumber } = req.query;
    
    let allRecords: any[] = [];
    
    // Query by studentId if provided
    if (studentId) {
      const query1 = db.collection('medicalRecords').where('studentId', '==', studentId);
      const snapshot1 = await query1.get();
      const records1 = snapshot1.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          visitDate: data.visitDate?.toDate ? data.visitDate.toDate() : data.visitDate,
          createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : data.createdAt,
          updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate() : data.updatedAt,
        };
      });
      allRecords = [...allRecords, ...records1];
    }
    
    // Also query by schoolIdNumber if provided (to catch records that might use schoolIdNumber as studentId)
    if (schoolIdNumber) {
      const query2 = db.collection('medicalRecords').where('schoolIdNumber', '==', schoolIdNumber);
      const snapshot2 = await query2.get();
      const records2 = snapshot2.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          visitDate: data.visitDate?.toDate ? data.visitDate.toDate() : data.visitDate,
          createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : data.createdAt,
          updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate() : data.updatedAt,
        };
      });
      allRecords = [...allRecords, ...records2];
    }
    
    // Remove duplicates based on record ID
    const uniqueRecords = Array.from(
      new Map(allRecords.map(record => [record.id, record])).values()
    );

    // Sort by visitDate in memory (descending) to avoid needing a composite index
    uniqueRecords.sort((a, b) => {
      const dateA = a.visitDate ? new Date(a.visitDate).getTime() : 0;
      const dateB = b.visitDate ? new Date(b.visitDate).getTime() : 0;
      return dateB - dateA; // Descending order
    });

    res.json({
      success: true,
      data: uniqueRecords,
    });
  } catch (error) {
    console.error('Error fetching medical records:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

export const getMedicalRecordById = async (req: express.Request, res: express.Response) => {
  try {
    const { id } = req.params;
    
    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'Record ID is required',
      });
    }

    const docRef = db.collection('medicalRecords').doc(id);
    const doc = await docRef.get();

    if (!doc.exists) {
      return res.status(404).json({
        success: false,
        message: 'Medical record not found',
      });
    }

    const data = doc.data();
    const record = {
      id: doc.id,
      ...data,
      visitDate: data?.visitDate?.toDate ? data.visitDate.toDate() : data?.visitDate,
      createdAt: data?.createdAt?.toDate ? data.createdAt.toDate() : data?.createdAt,
      updatedAt: data?.updatedAt?.toDate ? data.updatedAt.toDate() : data?.updatedAt,
    };

    res.json({
      success: true,
      data: record,
    });
  } catch (error) {
    console.error('Error fetching medical record:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

export const deleteMedicalRecord = async (req: express.Request, res: express.Response) => {
  try {
    const { id } = req.params;
    
    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'Record ID is required',
      });
    }

    const recordRef = db.collection('medicalRecords').doc(id);
    const recordDoc = await recordRef.get();

    if (!recordDoc.exists) {
      return res.status(404).json({
        success: false,
        message: 'Medical record not found',
      });
    }

    await recordRef.delete();

    res.json({
      success: true,
      message: 'Medical record deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting medical record:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

