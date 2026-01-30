import express from 'express';
import { db } from '../config/db.js';

// Get monthly medication request reports
export const getMonthlyMedicationReports = async (req: express.Request, res: express.Response) => {
  try {
    const { year, month } = req.query;
    
    // Get all requests
    const requestsSnapshot = await db.collection('requests').get();
    
    // Get all student registrations
    const registrationsSnapshot = await db.collection('registrations').get();
    
    // Get all inventory items with category "Medications"
    const inventorySnapshot = await db.collection('inventory')
      .where('category', '==', 'Medications')
      .get();
    
    const medications = inventorySnapshot.docs.map(doc => {
      const data = doc.data();
      return data.name;
    });

    // Process requests
    const requests = requestsSnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        requestDate: data.requestDate?.toDate ? data.requestDate.toDate() : (data.requestDate ? new Date(data.requestDate) : null),
        createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : (data.createdAt ? new Date(data.createdAt) : new Date()),
      } as any;
    });

    // Process registrations
    const registrations = registrationsSnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : (data.createdAt ? new Date(data.createdAt) : new Date()),
      } as any;
    });

    // Filter by year and month if provided
    let filteredRequests = requests;
    let filteredRegistrations = registrations;
    
    if (year && month) {
      const targetYear = parseInt(year as string);
      const targetMonth = parseInt(month as string) - 1; // JavaScript months are 0-indexed
      filteredRequests = requests.filter(req => {
        const reqDate = req.requestDate || req.createdAt;
        if (!reqDate) return false;
        const date = reqDate instanceof Date ? reqDate : new Date(reqDate);
        return date.getFullYear() === targetYear && date.getMonth() === targetMonth;
      });
      filteredRegistrations = registrations.filter(reg => {
        const regDate = reg.createdAt;
        if (!regDate) return false;
        const date = regDate instanceof Date ? regDate : new Date(regDate);
        return date.getFullYear() === targetYear && date.getMonth() === targetMonth;
      });
    } else if (year) {
      const targetYear = parseInt(year as string);
      filteredRequests = requests.filter(req => {
        const reqDate = req.requestDate || req.createdAt;
        if (!reqDate) return false;
        const date = reqDate instanceof Date ? reqDate : new Date(reqDate);
        return date.getFullYear() === targetYear;
      });
      filteredRegistrations = registrations.filter(reg => {
        const regDate = reg.createdAt;
        if (!regDate) return false;
        const date = regDate instanceof Date ? regDate : new Date(regDate);
        return date.getFullYear() === targetYear;
      });
    }

    // Extract medication information from assessment field
    const monthlyRequestData: { [key: string]: number } = {};
    const monthlyRegistrationData: { [key: string]: number } = {};
    const medicationCounts: { [key: string]: number } = {};
    const assessmentTypes: { [key: string]: number } = {};
    const departmentData: { [key: string]: number } = {};

    // Process requests
    filteredRequests.forEach(req => {
      const reqDate = req.requestDate || req.createdAt;
      if (!reqDate) return;
      const date = reqDate instanceof Date ? reqDate : new Date(reqDate);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      
      // Count requests per month
      monthlyRequestData[monthKey] = (monthlyRequestData[monthKey] || 0) + 1;

      // Count by department
      const dept = req.department || req.departmentCourse || 'Unknown';
      departmentData[dept] = (departmentData[dept] || 0) + 1;

      // Extract medication from assessment field
      const assessment = (req.assessment || '').toLowerCase();
      
      // Count assessment types
      if (assessment) {
        assessmentTypes[req.assessment || 'Unknown'] = (assessmentTypes[req.assessment || 'Unknown'] || 0) + 1;
      }
      
      // Check if assessment mentions any medication from inventory
      medications.forEach(med => {
        const medLower = med.toLowerCase();
        if (assessment.includes(medLower)) {
          medicationCounts[med] = (medicationCounts[med] || 0) + 1;
        }
      });

      // Also check for common medication keywords and patterns
      const medicationKeywords = [
        { keyword: 'paracetamol', name: 'Paracetamol' },
        { keyword: 'acetaminophen', name: 'Paracetamol' },
        { keyword: 'ibuprofen', name: 'Ibuprofen' },
        { keyword: 'aspirin', name: 'Aspirin' },
        { keyword: 'antibiotic', name: 'Antibiotic' },
        { keyword: 'antihistamine', name: 'Antihistamine' },
        { keyword: 'cough', name: 'Cough Medicine' },
        { keyword: 'fever', name: 'Fever Medicine' },
        { keyword: 'pain', name: 'Pain Reliever' },
        { keyword: 'vitamin', name: 'Vitamin' },
        { keyword: 'supplement', name: 'Supplement' },
      ];

      medicationKeywords.forEach(({ keyword, name }) => {
        if (assessment.includes(keyword)) {
          medicationCounts[name] = (medicationCounts[name] || 0) + 1;
        }
      });

      // If assessment contains medication-related terms but no specific medication found
      if (assessment.includes('medication') || assessment.includes('medicine') || assessment.includes('drug') || 
          assessment.includes('prescription') || assessment.includes('prescribed')) {
        if (Object.keys(medicationCounts).length === 0 || 
            !Object.keys(medicationCounts).some(med => assessment.includes(med.toLowerCase()))) {
          medicationCounts['General Medication'] = (medicationCounts['General Medication'] || 0) + 1;
        }
      }
    });

    // Process registrations (student records)
    filteredRegistrations.forEach(reg => {
      const regDate = reg.createdAt;
      if (!regDate) return;
      const date = regDate instanceof Date ? regDate : new Date(regDate);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      
      // Count registrations per month
      monthlyRegistrationData[monthKey] = (monthlyRegistrationData[monthKey] || 0) + 1;

      // Count by department
      const dept = reg.departmentCourse || 'Unknown';
      departmentData[dept] = (departmentData[dept] || 0) + 1;
    });

    // Get all unique months from both requests and registrations
    const allMonths = new Set([
      ...Object.keys(monthlyRequestData),
      ...Object.keys(monthlyRegistrationData)
    ]);

    // Format monthly data for chart (combine requests and registrations)
    const monthlyChartData = Array.from(allMonths)
      .map(month => ({
        month,
        requests: monthlyRequestData[month] || 0,
        registrations: monthlyRegistrationData[month] || 0,
        total: (monthlyRequestData[month] || 0) + (monthlyRegistrationData[month] || 0),
      }))
      .sort((a, b) => a.month.localeCompare(b.month));

    // Format medication data for chart
    const medicationChartData = Object.entries(medicationCounts)
      .map(([medication, count]) => ({
        medication,
        requests: count,
      }))
      .sort((a, b) => b.requests - a.requests)
      .slice(0, 10); // Top 10 medications

    // Format assessment types data
    const assessmentChartData = Object.entries(assessmentTypes)
      .map(([assessment, count]) => ({
        assessment,
        count,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10); // Top 10 assessment types

    // Format department data
    const departmentChartData = Object.entries(departmentData)
      .map(([department, count]) => ({
        department,
        count,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10); // Top 10 departments

    // Get unique students
    const uniqueRequestStudents = new Set(filteredRequests.map(r => r.schoolIdNumber).filter(Boolean));
    const uniqueRegistrationStudents = new Set(filteredRegistrations.map(r => r.schoolIdNumber).filter(Boolean));
    const allUniqueStudents = new Set([...uniqueRequestStudents, ...uniqueRegistrationStudents]);

    res.json({
      success: true,
      data: {
        monthlyData: monthlyChartData,
        medicationData: medicationChartData,
        assessmentData: assessmentChartData,
        departmentData: departmentChartData,
        totalRequests: filteredRequests.length,
        totalRegistrations: filteredRegistrations.length,
        totalStudents: allUniqueStudents.size,
        requestStudents: uniqueRequestStudents.size,
        registrationStudents: uniqueRegistrationStudents.size,
      },
    });
  } catch (error) {
    console.error('Error fetching monthly medication reports:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

