import { useState } from "react";
import { chatbotReply } from "../../services/chatbot-service.js";

export default function ChatWindow({ onClose }) {
  const [mensaje, setMensaje] = useState("");
  const [historial, setHistorial] = useState([]);
  const [sessionId, setSessionId] = useState(null);

  const handleSend = async () => {
    if (!mensaje.trim()) return;

    const userMsg = { from: "user", text: mensaje };
    setHistorial((prev) => [...prev, userMsg]);

    const res = await chatbotReply(mensaje, sessionId);
    const botMsg = { from: "bot", text: res.respuesta };

    setHistorial((prev) => [...prev, botMsg]);
    setSessionId(res.sessionId);
    setMensaje("");
  };

  return (
    <div className="chat-window">
      <div className="chat-header">
        <h4>A&C Chatbot</h4>
        <button onClick={onClose}>✕</button>
      </div>

      <div className="chat-body">
        {historial.map((msg, i) => (
          <div key={i} className={`msg ${msg.from}`}>
            {msg.text}
            <h4> Bienvenido </h4>
          </div>
        ))}
      </div>

      <div className="chat-footer">
        <input
          type="text"
          placeholder="Escribe tu mensaje..."
          value={mensaje}
          onChange={(e) => setMensaje(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        <button onClick={handleSend}>Enviar</button>
      </div>
    </div>
  );
}
