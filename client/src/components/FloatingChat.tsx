import { useState } from 'react';
import './FloatingChat.css';

const FloatingChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [sentMessage, setSentMessage] = useState<string | null>(null);

  const handleToggle = () => {
    setIsOpen((prev) => !prev);
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    // Temporary behavior: just store and show the last sent message locally
    setSentMessage(message.trim());
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
            <span>Temporary AI Chat</span>
            <button
              type="button"
              className="floating-chat-close"
              onClick={handleToggle}
            >
              ×
            </button>
          </div>

          <div className="floating-chat-body">
            {sentMessage ? (
              <div className="floating-chat-message">
                <strong>You:</strong> {sentMessage}
              </div>
            ) : (
              <div className="floating-chat-placeholder">
                Type a message and click Send. This is only a temporary UI.
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


