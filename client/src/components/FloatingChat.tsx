import { useState, useEffect, useRef } from 'react';
import './FloatingChat.css';

interface Message {
  text: string;
  sender: 'user' | 'bot';
}

// Manual data/knowledge base for the chatbot
const clinicData = [
  {
    keywords: ['hours', 'hour', 'open', 'time', 'schedule', 'when'],
    question: 'What are the hours?',
    answer: 'The UCC Clinic is open from 8:00 AM to 5:00 PM, Monday to Saturday, during class days.',
  },
  {
    keywords: ['location', 'where', 'located', 'address', 'place'],
    question: 'Where is the clinic located?',
    answer: 'The clinic is located on the Ground Floor of the Student Affairs Building, UCC South Campus.',
  },
  {
    keywords: ['who', 'visit', 'eligible', 'can', 'student', 'faculty', 'staff'],
    question: 'Who can visit?',
    answer: 'All enrolled students, faculty, and staff may visit the clinic for health concerns or emergencies.',
  },
  {
    keywords: ['appointment', 'appointments', 'need', 'required', 'book', 'schedule'],
    question: 'Do I need to make an appointment?',
    answer: 'No appointment needed. You may walk in during clinic hours for first aid or consultation.',
  },
  {
    keywords: ['staff', 'staffed', 'nurse', 'physician', 'doctor', 'medical'],
    question: 'Is there a staff?',
    answer: 'Yes. The UCC Clinic is staffed by a registered nurse and a school physician during scheduled hours.',
  },
];

const getBotResponse = (userMessage: string): string => {
  const lowerMessage = userMessage.toLowerCase().trim();

  // Try to find a matching answer based on keywords
  for (const data of clinicData) {
    if (data.keywords.some((keyword) => lowerMessage.includes(keyword))) {
      return data.answer;
    }
  }

  // Default response if no match found
  return "I'm sorry, I don't have information about that. You can ask me about clinic hours, location, who can visit, appointments, or staff. How can I help you?";
};

const FloatingChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: 'bot',
      text: "Hello! I'm the UCC Clinic assistant. How can I help you today?",
    },
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleToggle = () => {
    setIsOpen((prev) => !prev);
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    const userMessage = message.trim();

    // Add user message
    setMessages((prev) => [...prev, { sender: 'user', text: userMessage }]);

    // Get bot response
    const botResponse = getBotResponse(userMessage);

    // Add bot response after a short delay for better UX
    setTimeout(() => {
      setMessages((prev) => [...prev, { sender: 'bot', text: botResponse }]);
    }, 300);

    setMessage('');
  };

  return (
    <>
      {/* Floating icon button */}
      <button className="floating-chat-button" onClick={handleToggle}>
        AI
      </button>

      {/* Simple popup box */}
      {isOpen && (
        <div className="floating-chat-box">
          <div className="floating-chat-header">
            <span>UCC Clinic Assistant</span>
            <button
              type="button"
              className="floating-chat-close"
              onClick={handleToggle}
            >
              ×
            </button>
          </div>

          <div className="floating-chat-body">
            {messages.length > 0 ? (
              <div className="floating-chat-messages">
                {messages.map((msg, index) => (
                  <div
                    key={index}
                    className={`floating-chat-message ${
                      msg.sender === 'user' ? 'user-message' : 'bot-message'
                    }`}
                  >
                    <div className="message-content">{msg.text}</div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            ) : (
              <div className="floating-chat-placeholder">
                Type a message to get started...
              </div>
            )}
          </div>

          <form className="floating-chat-form" onSubmit={handleSend}>
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message..."
            />
            <button type="submit">Send</button>
          </form>
        </div>
      )}
    </>
  );
};

export default FloatingChat;


