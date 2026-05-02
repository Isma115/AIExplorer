/* #region Logica Pagina Inicio: dependencias */
import { useEffect, useMemo, useState } from "react";
/* #endregion Logica Pagina Inicio: dependencias */

/* #region Logica Pagina Inicio: constantes del almacenamiento local */
const conversationsStorageKey = "aiexplorer-home-conversations";
const activeConversationStorageKey = "aiexplorer-home-active-conversation";
/* #endregion Logica Pagina Inicio: constantes del almacenamiento local */

/* #region Logica Pagina Inicio: respuestas simuladas */
const keywordReplies = [
  {
    test: /(hola|buenas|hey)/i,
    reply: "Hola. Esta experiencia funciona en modo local y el backend queda reservado para persistencia futura.",
  },
  {
    test: /(react|frontend|vite)/i,
    reply: "El frontend usa React con Vite y organiza la pagina por componentes, estilos y logica.",
  },
  {
    test: /(backend|orm|base de datos|database|node)/i,
    reply: "El backend no gestiona comportamiento de interfaz. Queda preparado para usar ORM cuando llegue la base de datos.",
  },
  {
    test: /(diseno|diseño|css|estilo)/i,
    reply: "La identidad visual sigue centralizada en estilos globales y en la pagina de inicio.",
  },
];

const fallbackReplies = [
  "La interfaz puede seguir creciendo desde React sin depender todavia de una API.",
  "Este flujo local es suficiente hasta que exista persistencia real en el proyecto.",
  "La separacion actual evita mezclar logica de interfaz con responsabilidades de datos.",
];
/* #endregion Logica Pagina Inicio: respuestas simuladas */

/* #region Logica Pagina Inicio: utilidades del chat */
function createConversationTitle(messageCount, firstUserMessage) {
  if (firstUserMessage) {
    return firstUserMessage.length > 34
      ? `${firstUserMessage.slice(0, 34).trim()}...`
      : firstUserMessage;
  }

  return messageCount === 0 ? "Nueva conversacion" : "Conversacion sin titulo";
}

function createMessage(author, content, side) {
  return {
    id: `${Date.now()}-${Math.random().toString(16).slice(2, 8)}`,
    author,
    content,
    side,
  };
}

function getAssistantReply(message) {
  const matchedReply = keywordReplies.find(({ test }) => test.test(message));

  if (matchedReply) {
    return matchedReply.reply;
  }

  const randomIndex = Math.floor(Math.random() * fallbackReplies.length);
  return fallbackReplies[randomIndex];
}

function createConversation(messages = []) {
  const firstUserMessage = messages.find((message) => message.author === "Tu")?.content ?? "";

  return {
    id: `conversation-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`,
    title: createConversationTitle(messages.length, firstUserMessage),
    messages,
    updatedAt: Date.now(),
  };
}

function updateConversationSnapshot(conversation, messages) {
  const firstUserMessage = messages.find((message) => message.author === "Tu")?.content ?? "";

  return {
    ...conversation,
    title: createConversationTitle(messages.length, firstUserMessage),
    messages,
    updatedAt: Date.now(),
  };
}

function loadStoredConversations() {
  if (typeof window === "undefined") {
    return [createConversation()];
  }

  const rawConversations = window.localStorage.getItem(conversationsStorageKey);

  if (!rawConversations) {
    return [createConversation()];
  }

  try {
    const parsedConversations = JSON.parse(rawConversations);

    if (!Array.isArray(parsedConversations) || parsedConversations.length === 0) {
      return [createConversation()];
    }

    return parsedConversations;
  } catch (_error) {
    return [createConversation()];
  }
}

function loadStoredActiveConversationId(conversations) {
  if (typeof window === "undefined") {
    return conversations[0]?.id ?? "";
  }

  const storedId = window.localStorage.getItem(activeConversationStorageKey);
  const matchedConversation = conversations.find((conversation) => conversation.id === storedId);

  return matchedConversation?.id ?? conversations[0]?.id ?? "";
}

function loadInitialChatState() {
  const initialConversations = loadStoredConversations();

  return {
    initialConversations,
    initialActiveConversationId: loadStoredActiveConversationId(initialConversations),
  };
}
/* #endregion Logica Pagina Inicio: utilidades del chat */

/* #region Logica Pagina Inicio: hook de chat */
export function useHomeChat() {
  const [initialChatState] = useState(() => loadInitialChatState());
  const [draft, setDraft] = useState("");
  const [conversations, setConversations] = useState(initialChatState.initialConversations);
  const [activeConversationId, setActiveConversationId] = useState(
    initialChatState.initialActiveConversationId,
  );
  const [isSending, setIsSending] = useState(false);
  const activeConversation = useMemo(
    () =>
      conversations.find((conversation) => conversation.id === activeConversationId) ??
      conversations[0] ??
      null,
    [activeConversationId, conversations],
  );
  const messages = activeConversation?.messages ?? [];

  useEffect(() => {
    if (!conversations.length) {
      const fallbackConversation = createConversation();
      setConversations([fallbackConversation]);
      setActiveConversationId(fallbackConversation.id);
      return;
    }

    const activeConversationExists = conversations.some(
      (conversation) => conversation.id === activeConversationId,
    );

    if (!activeConversationExists) {
      setActiveConversationId(conversations[0].id);
    }
  }, [activeConversationId, conversations]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    window.localStorage.setItem(conversationsStorageKey, JSON.stringify(conversations));
    window.localStorage.setItem(activeConversationStorageKey, activeConversationId);
  }, [activeConversationId, conversations]);

  function updateActiveConversationMessages(nextMessages) {
    setConversations((currentConversations) =>
      currentConversations.map((conversation) =>
        conversation.id === activeConversationId
          ? updateConversationSnapshot(conversation, nextMessages)
          : conversation,
      ),
    );
  }

  async function sendMessage() {
    const trimmedDraft = draft.trim();
    const targetConversationId = activeConversationId;

    if (!trimmedDraft || isSending || !targetConversationId) {
      return;
    }

    const userMessage = createMessage("Tu", trimmedDraft, "sent");
    const messagesAfterUserTurn = [...messages, userMessage];
    updateActiveConversationMessages(messagesAfterUserTurn);
    setDraft("");
    setIsSending(true);

    await new Promise((resolve) => {
      window.setTimeout(resolve, 350);
    });

    const assistantMessage = createMessage(
      "Asistente",
      getAssistantReply(trimmedDraft),
      "received",
    );

    setConversations((currentConversations) =>
      currentConversations.map((conversation) => {
        if (conversation.id !== targetConversationId) {
          return conversation;
        }

        return updateConversationSnapshot(conversation, [
          ...messagesAfterUserTurn,
          assistantMessage,
        ]);
      }),
    );
    setIsSending(false);
  }

  function clearMessages() {
    updateActiveConversationMessages([]);
  }

  function createNewConversation() {
    const newConversation = createConversation();

    setConversations((currentConversations) => [newConversation, ...currentConversations]);
    setActiveConversationId(newConversation.id);
    setDraft("");
  }

  function selectConversation(conversationId) {
    setActiveConversationId(conversationId);
    setDraft("");
  }

  return {
    draft,
    messages,
    conversations: conversations
      .slice()
      .sort((leftConversation, rightConversation) => rightConversation.updatedAt - leftConversation.updatedAt)
      .map((conversation) => ({
        id: conversation.id,
        title: conversation.title,
        preview:
          conversation.messages[conversation.messages.length - 1]?.content ??
          "Sin mensajes todavia.",
        messageCount: conversation.messages.length,
        updatedAt: conversation.updatedAt,
      })),
    activeConversationId,
    isSending,
    setDraft,
    sendMessage,
    clearMessages,
    createConversation: createNewConversation,
    selectConversation,
  };
}
/* #endregion Logica Pagina Inicio: hook de chat */
