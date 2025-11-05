import { useState, useEffect } from "react";
import { MessageCircle, X } from "lucide-react";
import ChatWindow from "./ChatWindow";
import "./Chatbot.css"; 

export default function ChatBubble() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [sessionId, setSessionId] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem("chat_messages");
    const savedSession = localStorage.getItem("chat_sessionId");
    if (saved) setMessages(JSON.parse(saved));
    if (savedSession) setSessionId(savedSession);
  }, []);

  useEffect(() => {
    localStorage.setItem("chat_messages", JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    if (sessionId) localStorage.setItem("chat_sessionId", sessionId);
  }, [sessionId]);

  return (
    <>
      <div className="chat-bubble-container">
        <div className="chat-bubble-pointer"></div>
        <div className="chat-bubble" onClick={() => setOpen(!open)}>
          {open ? <X size={28} /> : <MessageCircle size={28} />}
        </div>
      </div>

      <div style={{ display: open ? "block" : "none" }}>
        <ChatWindow
          messages={messages}
          setMessages={setMessages}
          sessionId={sessionId}
          setSessionId={setSessionId}
          onClose={() => setOpen(false)}
        />
      </div>
    </>
  );
}
