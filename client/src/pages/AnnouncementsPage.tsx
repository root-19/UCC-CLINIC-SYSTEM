import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { env } from '../config/env';

interface Announcement {
  id: string;
  title: string;
  description: string;
  image?: string;
  createdAt: Date | string;
  updatedAt: Date | string;
}

const AnnouncementsPage = () => {
  const navigate = useNavigate();
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

  const handleSearchClick = () => {
    console.log('Search clicked');
  };

  const handleAboutUsClick = () => {
    navigate('/');
  };

  const handleLoginClick = () => {
    navigate('/');
  };

  const handleRequestFormClick = () => {
    navigate('/');
  };

  const handleAnnouncementsClick = () => {
    // Already on announcements page
  };

  return (
    <div className="w-full min-h-screen flex flex-col">
      <Header 
        onSearchClick={handleSearchClick}
        onAboutUsClick={handleAboutUsClick}
        onLoginClick={handleLoginClick}
        onRequestFormClick={handleRequestFormClick}
        onAnnouncementsClick={handleAnnouncementsClick}
      />
      
      <main className="flex-1 mt-20">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-12">
          {/* Page Header */}
          <div className="text-center mb-12 animate-fade-in-up animate-delay-100">
            <h1 className="text-4xl md:text-5xl font-bold text-clinic-green mb-4">
              Announcements
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Stay updated with the latest news and important information from the clinic.
            </p>
          </div>

          {loading && (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-clinic-green"></div>
              <p className="mt-4 text-gray-600">Loading announcements...</p>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border-l-4 border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6">
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {announcements.map((announcement, index) => (
                <article
                  key={announcement.id}
                  className="bg-white rounded-xl shadow-professional-lg overflow-hidden hover:shadow-professional-lg hover:-translate-y-1 transition-all duration-300 card-hover animate-fade-in-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {announcement.image && (
                    <div className="w-full h-48 overflow-hidden bg-gray-200">
                      <img
                        src={`${env.API_URL}${announcement.image}`}
                        alt={announcement.title}
                        className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                      />
                    </div>
                  )}
                  <div className="p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="px-3 py-1 bg-clinic-green text-white text-xs font-semibold rounded-full">
                        Announcement
                      </span>
                      <span className="text-xs text-gray-500">
                        {formatDate(announcement.createdAt)}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-clinic-green mb-3 line-clamp-2">
                      {announcement.title}
                    </h3>
                    <p className="text-sm text-gray-600 leading-relaxed line-clamp-4 whitespace-pre-wrap">
                      {announcement.description}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default AnnouncementsPage;

