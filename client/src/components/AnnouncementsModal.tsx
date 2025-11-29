import { useEffect, useState } from 'react';
import Modal from './Modal';
import { env } from '../config/env';

interface AnnouncementsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Announcement {
  id: string;
  title: string;
  description: string;
  image?: string;
  createdAt: Date | string;
  updatedAt: Date | string;
}

const AnnouncementsModal = ({ isOpen, onClose }: AnnouncementsModalProps) => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      fetchAnnouncements();
    }
  }, [isOpen]);

  const fetchAnnouncements = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await fetch(`${env.API_URL}/api/announcement`);
      const data = await response.json();

      if (data.success) {
        // Sort by date (newest first)
        const sortedAnnouncements = data.data.sort((a: Announcement, b: Announcement) => {
          const dateA = typeof a.createdAt === 'string' ? new Date(a.createdAt) : a.createdAt;
          const dateB = typeof b.createdAt === 'string' ? new Date(b.createdAt) : b.createdAt;
          return dateB.getTime() - dateA.getTime();
        });
        setAnnouncements(sortedAnnouncements);
      } else {
        setError(data.message || 'Failed to fetch announcements');
      }
    } catch (err) {
      setError('Network error. Please try again.');
      console.error('Error fetching announcements:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date: Date | string) => {
    if (!date) return 'N/A';
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };
 
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Announcements">
      <div className="space-y-6">
        <div className="mb-6">
          <p className="text-gray-600 text-sm">
            Stay updated with the latest news and important information from the clinic.
          </p>
        </div>

        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-clinic-green"></div>
            <p className="mt-4 text-gray-600">Loading announcements...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {!loading && !error && announcements.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">No announcements available at the moment.</p>
            <p className="text-gray-500 text-sm mt-2">Please check back later for updates.</p>
          </div>
        )}

        {!loading && !error && announcements.length > 0 && (
          <div className="space-y-6">
            {announcements.map((announcement) => (
              <article
                key={announcement.id}
                className="border border-gray-200 rounded-xl p-5 hover:shadow-professional-lg transition-all duration-300 bg-gradient-to-br from-white to-gray-50 card-hover animate-fade-in-up"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="px-3 py-1 bg-clinic-green text-white text-xs font-semibold rounded-full">
                        Announcement
                      </span>
                      <span className="text-xs text-gray-500">
                        {formatDate(announcement.createdAt)}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">{announcement.title}</h3>
                    {announcement.image && (
                      <div className="mb-3">
                        <img
                          src={`${env.API_URL}${announcement.image}`}
                          alt={announcement.title}
                          className="w-full h-48 object-cover rounded-lg"
                        />
                      </div>
                    )}
                    <p className="text-sm text-gray-600 mb-3 leading-relaxed whitespace-pre-wrap">
                      {announcement.description}
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        {!loading && !error && announcements.length > 0 && (
          <div className="mt-8 pt-6 border-t border-gray-200 text-center">
            <p className="text-sm text-gray-600">
              For more information or inquiries, please visit our clinic or contact us.
            </p>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default AnnouncementsModal;

