import { useState, useEffect } from 'react';
import Modal from './Modal';
import MedicalRecordModal from './MedicalRecordModal';
import { env } from '../config/env';

interface ViewRecordsModalProps {
  isOpen: boolean;
  onClose: () => void;
  studentId: string;
  studentData: {
    firstName?: string;
    middleName?: string;
    lastName?: string;
    fullname?: string;
    schoolIdNumber: string;
    department?: string;
    yearSection?: string;
  };
}

interface MedicalRecord {
  id: string;
  fullname: string;
  visitDate: Date | string;
  reasonForVisit: string;
  visitType: string;
  diagnosis?: string;
  attendingPersonnelName: string;
  [key: string]: any;
}

const ViewRecordsModal = ({ isOpen, onClose, studentId, studentData }: ViewRecordsModalProps) => {
  const [records, setRecords] = useState<MedicalRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showAddRecord, setShowAddRecord] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<MedicalRecord | null>(null);

  useEffect(() => {
    if (isOpen) {
      fetchRecords();
    }
  }, [isOpen, studentId]);

  const fetchRecords = async () => {
    try {
      setLoading(true);
      setError('');
      // Query by both studentId and schoolIdNumber to catch all records
      const params = new URLSearchParams();
      if (studentId) params.append('studentId', studentId);
      if (studentData.schoolIdNumber) params.append('schoolIdNumber', studentData.schoolIdNumber);
      
      const response = await fetch(`${env.API_URL}/api/medical-records?${params.toString()}`);
      const data = await response.json();

      if (data.success) {
        setRecords(data.data);
      } else {
        setError(data.message || 'Failed to fetch medical records');
      }
    } catch (err) {
      setError('Network error. Please try again.');
      console.error('Error fetching medical records:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date: Date | string) => {
    if (!date) return 'N/A';
    const d = date instanceof Date ? date : new Date(date);
    return d.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleAddRecord = () => {
    setShowAddRecord(true);
  };

  const handleCloseAddRecord = () => {
    setShowAddRecord(false);
    fetchRecords();
  };

  const handleViewRecord = (record: MedicalRecord) => {
    setSelectedRecord(record);
  };

  return (
    <>
      <Modal isOpen={isOpen && !showAddRecord && !selectedRecord} onClose={onClose}>
        <div className="max-w-6xl w-full">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-3xl font-bold text-clinic-green">
                Medical Records
              </h2>
              <p className="text-gray-600 mt-1">
                {studentData.fullname || `${studentData.firstName || ''} ${studentData.lastName || ''}`.trim()} - {studentData.schoolIdNumber}
              </p>
            </div>
            <button
              onClick={handleAddRecord}
              className="px-6 py-2.5 bg-clinic-green text-white rounded-lg hover:bg-clinic-green-hover transition-colors font-semibold"
            >
              Add New Record
            </button>
          </div>

          {loading && (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-clinic-green"></div>
              <p className="mt-4 text-gray-600">Loading records...</p>
            </div>
          )}

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          {!loading && !error && records.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">No medical records found for this student.</p>
              <button
                onClick={handleAddRecord}
                className="mt-4 px-6 py-2 bg-clinic-green text-white rounded-lg hover:bg-clinic-green-hover transition-colors"
              >
                Add First Record
              </button>
            </div>
          )}

          {!loading && !error && records.length > 0 && (
            <div className="space-y-4 max-h-[60vh] overflow-y-auto">
              {records.map((record) => (
                <div
                  key={record.id}
                  className="bg-gradient-to-br from-white to-gray-50 rounded-xl p-6 border border-gray-200 shadow-md hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => handleViewRecord(record)}
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-semibold text-lg text-gray-900">
                        {formatDate(record.visitDate)}
                      </h3>
                      <p className="text-sm text-gray-600">
                        Type: <span className="font-medium">{record.visitType}</span>
                      </p>
                    </div>
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-semibold">
                      {record.visitType}
                    </span>
                  </div>
                  <div className="space-y-2 text-sm">
                    <p>
                      <span className="font-medium">Reason:</span> {record.reasonForVisit}
                    </p>
                    {record.diagnosis && (
                      <p>
                        <span className="font-medium">Diagnosis:</span> {record.diagnosis}
                      </p>
                    )}
                    <p>
                      <span className="font-medium">Attended by:</span> {record.attendingPersonnelName}
                    </p>
                  </div>
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleViewRecord(record);
                      }}
                      className="text-sm text-clinic-green hover:text-clinic-green-hover font-medium"
                    >
                      View Full Details →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </Modal>

      {showAddRecord && (
        <MedicalRecordModal
          isOpen={showAddRecord}
          onClose={handleCloseAddRecord}
          studentId={studentId}
          studentData={studentData}
        />
      )}

      {selectedRecord && (
        <Modal isOpen={!!selectedRecord} onClose={() => setSelectedRecord(null)}>
          <div className="max-w-4xl w-full">
            <h2 className="text-2xl font-bold text-clinic-green mb-4">Record Details</h2>
            <div className="space-y-4 max-h-[70vh] overflow-y-auto">
              {/* Student Information */}
              <div className="border-b border-gray-200 pb-4">
                <h3 className="text-lg font-semibold text-clinic-green mb-3">Student Information</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Name:</span> {selectedRecord.fullname}
                  </div>
                  <div>
                    <span className="font-medium">School ID:</span> {selectedRecord.schoolIdNumber}
                  </div>
                  <div>
                    <span className="font-medium">Department:</span> {selectedRecord.department}
                  </div>
                  <div>
                    <span className="font-medium">Year & Section:</span> {selectedRecord.yearSection}
                  </div>
                </div>
              </div>

              {/* Visit Details */}
              <div className="border-b border-gray-200 pb-4">
                <h3 className="text-lg font-semibold text-clinic-green mb-3">Visit Details</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Date & Time:</span> {formatDate(selectedRecord.visitDate)}
                  </div>
                  <div>
                    <span className="font-medium">Visit Type:</span> {selectedRecord.visitType}
                  </div>
                  <div className="col-span-2">
                    <span className="font-medium">Reason:</span> {selectedRecord.reasonForVisit}
                  </div>
                </div>
              </div>

              {/* Vital Signs */}
              <div className="border-b border-gray-200 pb-4">
                <h3 className="text-lg font-semibold text-clinic-green mb-3">Vital Signs</h3>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Temperature:</span> {selectedRecord.temperature ? `${selectedRecord.temperature}°C` : 'N/A'}
                  </div>
                  <div>
                    <span className="font-medium">Blood Pressure:</span> {selectedRecord.bloodPressure || 'N/A'}
                  </div>
                  <div>
                    <span className="font-medium">Heart Rate:</span> {selectedRecord.heartRate ? `${selectedRecord.heartRate} bpm` : 'N/A'}
                  </div>
                  <div>
                    <span className="font-medium">Respiratory Rate:</span> {selectedRecord.respiratoryRate || 'N/A'}
                  </div>
                  <div>
                    <span className="font-medium">Weight:</span> {selectedRecord.weight ? `${selectedRecord.weight} kg` : 'N/A'}
                  </div>
                  <div>
                    <span className="font-medium">Height:</span> {selectedRecord.height ? `${selectedRecord.height} cm` : 'N/A'}
                  </div>
                </div>
              </div>

              {/* Medical Assessment */}
              <div className="border-b border-gray-200 pb-4">
                <h3 className="text-lg font-semibold text-clinic-green mb-3">Medical Assessment</h3>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="font-medium">Initial Assessment:</span>
                    <p className="mt-1 text-gray-700">{selectedRecord.initialAssessment || 'N/A'}</p>
                  </div>
                  <div>
                    <span className="font-medium">Diagnosis:</span> {selectedRecord.diagnosis || 'N/A'}
                  </div>
                  <div>
                    <span className="font-medium">Symptoms Observed:</span>
                    <p className="mt-1 text-gray-700">{selectedRecord.symptomsObserved || 'N/A'}</p>
                  </div>
                  <div>
                    <span className="font-medium">Allergies:</span> {selectedRecord.allergies || 'N/A'}
                  </div>
                  <div>
                    <span className="font-medium">Existing Medical Conditions:</span> {selectedRecord.existingMedicalConditions || 'N/A'}
                  </div>
                </div>
              </div>

              {/* Treatment */}
              <div className="border-b border-gray-200 pb-4">
                <h3 className="text-lg font-semibold text-clinic-green mb-3">Treatment / Action Taken</h3>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="font-medium">Medication Given:</span>
                    <p className="mt-1 text-gray-700">{selectedRecord.medicationGiven || 'N/A'}</p>
                  </div>
                  <div>
                    <span className="font-medium">First Aid Provided:</span>
                    <p className="mt-1 text-gray-700">{selectedRecord.firstAidProvided || 'N/A'}</p>
                  </div>
                  <div>
                    <span className="font-medium">Procedures Done:</span>
                    <p className="mt-1 text-gray-700">{selectedRecord.proceduresDone || 'N/A'}</p>
                  </div>
                  <div>
                    <span className="font-medium">Advice Given:</span>
                    <p className="mt-1 text-gray-700">{selectedRecord.adviceGiven || 'N/A'}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mt-2">
                    <div>
                      <span className="font-medium">Sent Home:</span> {selectedRecord.sentHome || 'N/A'}
                    </div>
                    <div>
                      <span className="font-medium">Parent Notified:</span> {selectedRecord.parentNotified || 'N/A'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Referral */}
              <div className="border-b border-gray-200 pb-4">
                <h3 className="text-lg font-semibold text-clinic-green mb-3">Referral Information</h3>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="font-medium">Referred to:</span> {selectedRecord.referredTo || 'N/A'}
                  </div>
                  <div>
                    <span className="font-medium">Reason for Referral:</span>
                    <p className="mt-1 text-gray-700">{selectedRecord.referralReason || 'N/A'}</p>
                  </div>
                  <div>
                    <span className="font-medium">Time Referred:</span> {selectedRecord.referralTime || 'N/A'}
                  </div>
                  <div>
                    <span className="font-medium">Transport Assistance:</span> {selectedRecord.transportAssistance || 'N/A'}
                  </div>
                </div>
              </div>

              {/* Attending Personnel */}
              <div className="pb-4">
                <h3 className="text-lg font-semibold text-clinic-green mb-3">Attending Personnel</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Name:</span> {selectedRecord.attendingPersonnelName}
                  </div>
                  <div>
                    <span className="font-medium">ID:</span> {selectedRecord.attendingPersonnelId}
                  </div>
                  {selectedRecord.additionalRemarks && (
                    <div className="col-span-2">
                      <span className="font-medium">Remarks:</span>
                      <p className="mt-1 text-gray-700">{selectedRecord.additionalRemarks}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setSelectedRecord(null)}
                className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
};

export default ViewRecordsModal;

