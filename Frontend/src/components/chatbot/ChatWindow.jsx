// src/components/Chatbot/ChatWindow.jsx
import { useState, useEffect, useRef } from "react";
import { Send } from "lucide-react"; // Importar Send
import { chatbotReply } from "../../services/chatbot-service.js";

export default function ChatWindow({ messages, setMessages, sessionId, setSessionId, onClose }) {
  const [mensaje, setMensaje] = useState("");
  const [isSending, setIsSending] = useState(false);
  const chatBodyRef = useRef(null);

  // Scroll hacia el último mensaje
  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!mensaje.trim()) return;
    setIsSending(true);

    const userMsg = { from: "user", text: mensaje };
    setMessages((prev) => [...prev, userMsg]);

    try {
      const res = await chatbotReply(mensaje, sessionId);
      const botMsg = { from: "bot", text: res.respuesta };

      setMessages((prev) => [...prev, botMsg]);
      if (res.sessionId) setSessionId(res.sessionId);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { from: "bot", text: "Hubo un error al conectar con el servidor." },
      ]);
    } finally {
      setMensaje("");
      setIsSending(false);
    }
  };

  return (
    <div className="chat-window">
      <div className="chat-header">
        <h4>Asistente Virtual A&C</h4>
        <button onClick={onClose}>✕</button>
      </div>

      <div className="chat-body" ref={chatBodyRef}>
        {messages.map((msg, i) => (
          <div key={i} className={`msg ${msg.from}`}>
            {msg.text}
          </div>
        ))}
      </div>

      <div className="chat-footer">
        <input
          type="text"
          placeholder="Escribe un mensaje..."
          value={mensaje}
          onChange={(e) => setMensaje(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        <button onClick={handleSend} disabled={isSending}>
          {isSending ? "..." : <Send size={20} />}
        </button>
      </div>
    </div>
  );
}
