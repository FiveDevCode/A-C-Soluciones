const API_URL = "http://localhost:8000/api/chat"; // Ajusta tu backend aquí

export const chatbotReply = async (mensaje, sessionId) => {
  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mensaje, sessionId }),
    });

    if (!res.ok) throw new Error("Error al contactar el chatbot");

    return await res.json();
  } catch (err) {
    console.error("Error chatbot:", err);
    return { respuesta: "Error de conexión con el servidor." };
  }
};
