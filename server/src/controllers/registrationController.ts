import express from 'express';
import { db } from '../config/db.js';

// Create student registration
export const createRegistration = async (req: express.Request, res: express.Response) => {
  try {
    const { 
      fullname, 
      firstName,
      middleName,
      lastName,
      studentIdLrn,
      age,
      dateOfBirth,
      sex,
      courseYear,
      yearSection, 
      schoolIdNumber, 
      departmentCourse, 
      contactNumber,
      address,
      parentGuardianName,
      parentGuardianContact,
      immunizationRecords,
      previousCheckupRecords,
      previousInjuriesHospitalizations,
      chronicIllnesses
    } = req.body;

    // Validate required fields
    if (!fullname || !yearSection || !schoolIdNumber || !departmentCourse || !studentIdLrn || !age || !dateOfBirth || !sex || !courseYear || !contactNumber || !address || !parentGuardianName || !parentGuardianContact) {
      return res.status(400).json({ 
        success: false, 
        message: 'All required fields must be provided' 
      });
    }

    // Create registration document
    const registrationData: any = {
      fullname,
      yearSection,
      schoolIdNumber,
      departmentCourse,
      studentIdLrn,
      age,
      dateOfBirth,
      sex,
      courseYear,
      contactNumber,
      address,
      parentGuardianName,
      parentGuardianContact,
      status: 'active',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Add optional fields if provided
    if (firstName) registrationData.firstName = firstName;
    if (middleName) registrationData.middleName = middleName;
    if (lastName) registrationData.lastName = lastName;
    
    // Add Health History fields
    if (immunizationRecords) registrationData.immunizationRecords = immunizationRecords;
    if (previousCheckupRecords) registrationData.previousCheckupRecords = previousCheckupRecords;
    if (previousInjuriesHospitalizations) registrationData.previousInjuriesHospitalizations = previousInjuriesHospitalizations;
    if (chronicIllnesses) registrationData.chronicIllnesses = chronicIllnesses;

    // Save to Firestore
    const docRef = await db.collection('registrations').add(registrationData);

    res.status(201).json({
      success: true,
      message: 'Student registration created successfully',
      registrationId: docRef.id,
      data: registrationData,
    });
  } catch (error) {
    console.error('Error creating registration:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
  }
};

// Get all registrations
export const getRegistrations = async (req: express.Request, res: express.Response) => {
  try {
    const snapshot = await db.collection('registrations').orderBy('createdAt', 'desc').get();
    
    const registrations = snapshot.docs.map(doc => {
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
      data: registrations,
    });
  } catch (error) {
    console.error('Error fetching registrations:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
  }
};

// Get registration by ID
export const getRegistrationById = async (req: express.Request, res: express.Response) => {
  try {
    const { id } = req.params;
    const registrationId = Array.isArray(id) ? id[0] : id;

    if (!registrationId) {
      return res.status(400).json({
        success: false,
        message: 'Registration ID is required',
      });
    }

    const registrationDoc = await db.collection('registrations').doc(registrationId).get();

    if (!registrationDoc.exists) {
      return res.status(404).json({
        success: false,
        message: 'Registration not found',
      });
    }

    const data = registrationDoc.data();
    res.json({
      success: true,
      data: {
        id: registrationDoc.id,
        ...data,
        createdAt: data?.createdAt?.toDate ? data.createdAt.toDate() : data?.createdAt,
        updatedAt: data?.updatedAt?.toDate ? data.updatedAt.toDate() : data?.updatedAt,
      },
    });
  } catch (error) {
    console.error('Error fetching registration:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

// Update registration
export const updateRegistration = async (req: express.Request, res: express.Response) => {
  try {
    const { id } = req.params;
    const registrationId = Array.isArray(id) ? id[0] : id;
    if (!registrationId) {
      return res.status(400).json({
        success: false,
        message: 'Registration ID is required',
      });
    }
    const { 
      fullname, 
      firstName,
      middleName,
      lastName,
      studentIdLrn,
      age,
      dateOfBirth,
      sex,
      courseYear,
      yearSection, 
      schoolIdNumber, 
      departmentCourse, 
      contactNumber,
      address,
      parentGuardianName,
      parentGuardianContact,
      immunizationRecords,
      previousCheckupRecords,
      previousInjuriesHospitalizations,
      chronicIllnesses,
      status 
    } = req.body;

    // Check if registration exists
    const registrationRef = db.collection('registrations').doc(registrationId);
    const registrationDoc = await registrationRef.get();

    if (!registrationDoc.exists) {
      return res.status(404).json({
        success: false,
        message: 'Registration not found',
      });
    }

    // Build update object
    const updateData: any = {
      updatedAt: new Date(),
    };

    if (fullname) updateData.fullname = fullname;
    if (firstName !== undefined) updateData.firstName = firstName;
    if (middleName !== undefined) updateData.middleName = middleName;
    if (lastName !== undefined) updateData.lastName = lastName;
    if (studentIdLrn) updateData.studentIdLrn = studentIdLrn;
    if (age) updateData.age = age;
    if (dateOfBirth) updateData.dateOfBirth = dateOfBirth;
    if (sex) updateData.sex = sex;
    if (courseYear) updateData.courseYear = courseYear;
    if (yearSection) updateData.yearSection = yearSection;
    if (schoolIdNumber) updateData.schoolIdNumber = schoolIdNumber;
    if (departmentCourse) updateData.departmentCourse = departmentCourse;
    if (contactNumber) updateData.contactNumber = contactNumber;
    if (address) updateData.address = address;
    if (parentGuardianName) updateData.parentGuardianName = parentGuardianName;
    if (parentGuardianContact) updateData.parentGuardianContact = parentGuardianContact;
    if (immunizationRecords !== undefined) updateData.immunizationRecords = immunizationRecords;
    if (previousCheckupRecords !== undefined) updateData.previousCheckupRecords = previousCheckupRecords;
    if (previousInjuriesHospitalizations !== undefined) updateData.previousInjuriesHospitalizations = previousInjuriesHospitalizations;
    if (chronicIllnesses !== undefined) updateData.chronicIllnesses = chronicIllnesses;
    if (status) {
      // Validate status
      if (status !== 'active' && status !== 'inactive') {
        return res.status(400).json({
          success: false,
          message: 'Status must be either "active" or "inactive"',
        });
      }
      updateData.status = status;
    }

    // Update registration
    await registrationRef.update(updateData);

    // Get updated document
    const updatedDoc = await registrationRef.get();

    res.json({
      success: true,
      message: 'Registration updated successfully',
      data: {
        id: updatedDoc.id,
        ...updatedDoc.data(),
        createdAt: updatedDoc.data()?.createdAt?.toDate ? updatedDoc.data()?.createdAt.toDate() : updatedDoc.data()?.createdAt,
        updatedAt: updatedDoc.data()?.updatedAt?.toDate ? updatedDoc.data()?.updatedAt.toDate() : updatedDoc.data()?.updatedAt,
      },
    });
  } catch (error) {
    console.error('Error updating registration:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

// Delete registration
export const deleteRegistration = async (req: express.Request, res: express.Response) => {
  try {
    const { id } = req.params;
    const registrationId = Array.isArray(id) ? id[0] : id;
    if (!registrationId) {
      return res.status(400).json({
        success: false,
        message: 'Registration ID is required',
      });
    }

    // Check if registration exists
    const registrationRef = db.collection('registrations').doc(registrationId);
    const registrationDoc = await registrationRef.get();

    if (!registrationDoc.exists) {
      return res.status(404).json({
        success: false,
        message: 'Registration not found',
      });
    }

    // Delete registration
    await registrationRef.delete();

    res.json({
      success: true,
      message: 'Registration deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting registration:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

