import Modal from './Modal';

interface BlogModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Article {
  id: number;
  title: string;
  category: string;
  date: string;
  content: string;
  author: string;
}

const BlogModal = ({ isOpen, onClose }: BlogModalProps) => {
  const articles: Article[] = [
    {
      id: 1,
      title: 'Understanding Common Cold: Prevention and Treatment',
      category: 'Respiratory Health',
      date: 'January 15, 2024',
      author: 'Dr. Maria Santos',
      content: 'The common cold is a viral infection of the upper respiratory tract. Symptoms include runny nose, sneezing, coughing, and mild fever. Prevention includes frequent handwashing, avoiding close contact with sick individuals, and maintaining a healthy immune system through proper nutrition and rest. Treatment focuses on symptom relief with rest, hydration, and over-the-counter medications.',
    },
    {
      id: 2,
      title: 'Dengue Fever: Symptoms, Prevention, and Early Detection',
      category: 'Infectious Diseases',
      date: 'January 10, 2024',
      author: 'Dr. John Cruz',
      content: 'Dengue fever is a mosquito-borne viral disease that can cause severe flu-like symptoms. Early symptoms include high fever, severe headache, pain behind the eyes, joint and muscle pain, and rash. Prevention is key: eliminate standing water, use mosquito repellent, and wear protective clothing. Early detection and proper medical care are crucial for recovery.',
    },
    {
      id: 3,
      title: 'Managing Stress and Mental Health in Students',
      category: 'Mental Health',
      date: 'January 5, 2024',
      author: 'Dr. Anna Reyes',
      content: 'Student stress is a common concern affecting academic performance and overall well-being. Common stressors include academic pressure, social relationships, and future uncertainty. Effective management includes time management, regular exercise, adequate sleep, and seeking support from counselors or mental health professionals when needed.',
    },
    {
      id: 4,
      title: 'Food Safety: Preventing Foodborne Illnesses',
      category: 'Public Health',
      date: 'December 28, 2023',
      author: 'Dr. Carlos Mendoza',
      content: 'Foodborne illnesses can be prevented through proper food handling and preparation. Key practices include washing hands before handling food, cooking foods to proper temperatures, avoiding cross-contamination, and storing foods at correct temperatures. Symptoms of foodborne illness include nausea, vomiting, diarrhea, and abdominal pain.',
    },
    {
      id: 5,
      title: 'Influenza: Seasonal Flu Prevention and Vaccination',
      category: 'Infectious Diseases',
      date: 'December 20, 2023',
      author: 'Dr. Lisa Tan',
      content: 'Influenza, or the flu, is a contagious respiratory illness caused by influenza viruses. Annual vaccination is the best way to prevent the flu. Other preventive measures include frequent handwashing, avoiding touching your face, and staying away from sick individuals. Symptoms include fever, chills, muscle aches, cough, and fatigue. Seek medical attention if symptoms are severe.',
    },
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Health & Wellness Articles">
      <div className="space-y-6">
        <div className="mb-6">
          <p className="text-gray-600 text-sm">
            Stay informed about health topics, disease prevention, and wellness tips from our clinic experts.
          </p>
        </div>

        <div className="space-y-6">
          {articles.map((article, index) => (
            <article
              key={article.id}
              className="border border-gray-200 rounded-xl p-5 hover:shadow-professional-lg transition-all duration-300 bg-gradient-to-br from-white to-gray-50 card-hover animate-fade-in-up"
              style={{ animationDelay: `${index * 0.1}s`, opacity: 0 }}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="px-3 py-1 bg-clinic-green/10 text-clinic-green text-xs font-semibold rounded-full border border-clinic-green/20">
                      {article.category}
                    </span>
                    <span className="text-xs text-gray-500">{article.date}</span>
                  </div>
                  <h3 className="text-lg font-bold text-clinic-green mb-2 transition-colors duration-300 hover:text-clinic-green-hover">{article.title}</h3>
                  <p className="text-sm text-gray-600 mb-3 leading-relaxed">{article.content}</p>
                  <p className="text-xs text-gray-500 italic">By {article.author}</p>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-8 pt-6 border-t border-gray-200 text-center">
          <p className="text-sm text-gray-600">
            For more health information or medical concerns, please visit our clinic or contact us.
          </p>
        </div>
      </div>
    </Modal>
  );
};

export default BlogModal;

