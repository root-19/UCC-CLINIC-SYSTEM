import { useEffect, useState } from 'react';
import { env } from '../config/env';
import bgClinic from '../assets/images/bg-clinic.png';

interface Announcement {
  id: string;
  title: string;
  description: string;
  createdAt: Date | string;
  updatedAt: Date | string;
}

const AnnouncementsSection = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await fetch(`${env.API_URL}/api/announcement`);
      const data = await response.json();

      if (data.success) {
        // Get only the latest 5 announcements
        const sortedAnnouncements = data.data
          .sort((a: Announcement, b: Announcement) => {
            const dateA = typeof a.createdAt === 'string' ? new Date(a.createdAt) : a.createdAt;
            const dateB = typeof b.createdAt === 'string' ? new Date(b.createdAt) : b.createdAt;
            return dateB.getTime() - dateA.getTime();
          })
          .slice(0, 5);
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
    <section className="relative w-full py-12 md:py-16 lg:py-20 overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
        style={{ backgroundImage: `url(${bgClinic})` }}
      />
      <div className="absolute inset-0 bg-white/40 backdrop-blur-sm" />

      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 md:px-8">
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-clinic-green mb-4">
            Announcements
          </h2>
          <p className="text-gray-600 text-sm md:text-base max-w-2xl mx-auto">
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
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 text-center">
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
                className="border border-gray-200 rounded-lg p-5 md:p-6 hover:shadow-md transition-shadow bg-white"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2 flex-wrap">
                      <span className="px-3 py-1 bg-clinic-green text-white text-xs font-semibold rounded-full">
                        Announcement
                      </span>
                      <span className="text-xs text-gray-500">
                        {formatDate(announcement.createdAt)}
                      </span>
                    </div>
                    <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2">
                      {announcement.title}
                    </h3>
                    <p className="text-sm md:text-base text-gray-600 mb-3 leading-relaxed whitespace-pre-wrap">
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
    </section>
  );
};

export default AnnouncementsSection;

