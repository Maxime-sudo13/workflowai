// frontend/src/store/chatStore.ts
import { create } from 'zustand';

// Définition du type pour un message
export type Message = {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
};

// Fonction pour générer un ID unique simple
// Important : Cette fonction doit être définie avant d'être utilisée dans `create`
const generateUniqueId = () => Date.now().toString(36) + Math.random().toString(36).substring(2);

// Définition du type pour l'état global du chat
type ChatState = {
  messages: Message[];
  inputText: string;
  isAiTyping: boolean;
  setInputText: (text: string) => void;
  addMessage: (messageContent: Omit<Message, 'id' | 'timestamp'>) => void;
  setAiTyping: (isTyping: boolean) => void;
};

// Création du store Zustand
export const useChatStore = create<ChatState>((set, get) => ({
  // État initial du store
  messages: [
    { 
      id: generateUniqueId(), // Utilisation de la fonction définie ci-dessus
      text: 'Bonjour ! Comment puis-je vous aider à automatiser aujourd\'hui ?', 
      sender: 'ai', 
      timestamp: new Date() 
    },
  ],
  inputText: '',
  isAiTyping: false,

  // Action pour mettre à jour le texte d'entrée
  setInputText: (text) => set({ inputText: text }),

  // Action pour ajouter un nouveau message
  addMessage: (messageContent) => {
    const newMessage: Message = {
      ...messageContent,
      id: generateUniqueId(), // Utilisation de la fonction définie ci-dessus
      timestamp: new Date(),
    };
    
    set((state) => ({
      messages: [...state.messages, newMessage],
    }));

    // Si le message vient de l'utilisateur, simuler une réponse de l'IA
    if (messageContent.sender === 'user') {
      get().setAiTyping(true); // Indiquer que l'IA "écrit"

      // Simuler un délai pour la réponse de l'IA
      // TODO: Remplacer cette simulation par un appel API réel au backend
      setTimeout(() => {
        const aiResponseContent: Omit<Message, 'id' | 'timestamp'> = {
          text: `J'ai bien noté votre demande concernant : "${messageContent.text}". Je suis en train de traiter cela.`,
          sender: 'ai',
        };
        // Ajouter la réponse de l'IA au store
        get().addMessage(aiResponseContent);
        get().setAiTyping(false); // Indiquer que l'IA a fini d'écrire
      }, 1500);
    }
  },

  // Action pour définir si l'IA est en train d'écrire
  setAiTyping: (isTyping) => set({ isAiTyping: isTyping }),
}));