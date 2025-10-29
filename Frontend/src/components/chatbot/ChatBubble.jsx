import { useState } from "react";
import { MessageCircle } from "lucide-react";
import ChatWindow from "./ChatWindow";
import "./Chatbot.css";

export default function ChatBubble() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="chat-bubble" onClick={() => setOpen(!open)}>
        <MessageCircle size={28} />
      </div>

      {open && <ChatWindow onClose={() => setOpen(false)} />}
    </>
  );
}
