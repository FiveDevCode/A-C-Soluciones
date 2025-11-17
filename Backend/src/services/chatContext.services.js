// Memoria temporal por conversación
const context = new Map();

export const setContext = (sessionId, intentName) => {
  context.set(sessionId, intentName);
};

export const getContext = (sessionId) => {
  return context.get(sessionId);
};

export const clearContext = (sessionId) => {
  context.delete(sessionId);
};
