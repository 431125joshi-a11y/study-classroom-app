import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { INITIAL_CHAT_MESSAGES } from '../utils/sampleData';
import { getLocalStorage, setLocalStorage } from '../utils/storage';
import { generateId, playChimeSound } from '../utils/helpers';
import { useStudyApp } from './StudyAppContext';

const ChatContext = createContext(null);

// BroadcastChannel for cross-tab multi-user sync
const BROADCAST_CHANNEL_NAME = 'edustudy_lounge_sync';

export function ChatProvider({ children }) {
  const { userProfile } = useStudyApp();

  const [activeChannel, setActiveChannel] = useState('general');
  const [messages, setMessages] = useState(() => 
    getLocalStorage('edustudy_chat_messages', INITIAL_CHAT_MESSAGES)
  );
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isBotTyping, setIsBotTyping] = useState(false);

  const broadcastRef = useRef(null);

  // Sync messages to localStorage
  useEffect(() => {
    setLocalStorage('edustudy_chat_messages', messages);
  }, [messages]);

  // Setup BroadcastChannel for real-time multi-tab/window synchronization
  useEffect(() => {
    if (typeof BroadcastChannel !== 'undefined') {
      const channel = new BroadcastChannel(BROADCAST_CHANNEL_NAME);
      broadcastRef.current = channel;

      channel.onmessage = (event) => {
        const { type, payload } = event.data;
        if (type === 'NEW_MESSAGE') {
          setMessages(prev => {
            if (prev.some(m => m.id === payload.id)) return prev;
            return [...prev, payload];
          });
          playChimeSound('message');
          setUnreadCount(prev => prev + 1);
        } else if (type === 'REACTION_UPDATE') {
          setMessages(prev =>
            prev.map(m => (m.id === payload.messageId ? { ...m, reactions: payload.reactions } : m))
          );
        }
      };

      return () => {
        channel.close();
      };
    }
  }, []);

  // Broadcast helper
  const broadcast = (type, payload) => {
    try {
      if (broadcastRef.current) {
        broadcastRef.current.postMessage({ type, payload });
      }
    } catch (e) {
      console.warn('Broadcast failed', e);
    }
  };

  // AI StudyBot response generator based on subject / topic keywords
  const generateBotResponse = (userText, channel) => {
    const textLower = userText.toLowerCase();

    let response = '';

    if (textLower.includes('ohm') || textLower.includes('resistan') || textLower.includes('current') || textLower.includes('voltage')) {
      response = `📐 **Physics Doubt Answered**:
**Ohm's Law**: At constant temperature, $V = I \\times R$.
- $V$ = Voltage in Volts (V)
- $I$ = Current in Amperes (A)
- $R$ = Resistance in Ohms (Ω)

💡 *Tip*: In series circuits, current $I$ is constant. In parallel circuits, voltage $V$ is constant!`;
    } else if (textLower.includes('reaction') || textLower.includes('acid') || textLower.includes('base') || textLower.includes('redox')) {
      response = `🧪 **Chemistry Breakdown**:
- **Oxidation**: Addition of Oxygen or Loss of Electrons ($e^-$).
- **Reduction**: Addition of Hydrogen or Gain of Electrons ($e^-$).
- **Neutralization**: $\\text{Acid} + \\text{Base} \\rightarrow \\text{Salt} + \\text{Water} + \\text{Heat}$
*(e.g., $\\text{HCl} + \\text{NaOH} \\rightarrow \\text{NaCl} + \\text{H}_2\\text{O}$)*`;
    } else if (textLower.includes('trigo') || textLower.includes('sin') || textLower.includes('cos') || textLower.includes('tan')) {
      response = `📐 **Trigonometric Super-Tips**:
1. $\\sin^2 \\theta + \\cos^2 \\theta = 1$
2. $1 + \\tan^2 \\theta = \\sec^2 \\theta \\implies \\sec^2 \\theta - \\tan^2 \\theta = 1$
3. $1 + \\cot^2 \\theta = \\csc^2 \\theta \\implies \\csc^2 \\theta - \\cot^2 \\theta = 1$
🎯 *Mnemonics for ratios*: **SOH CAH TOA** (Sin = Opposite/Hypotenuse, Cos = Adjacent/Hypotenuse, Tan = Opposite/Adjacent).`;
    } else if (textLower.includes('quadrat') || textLower.includes('root') || textLower.includes('discriminant')) {
      response = `🔢 **Quadratic Equations Master Method**:
Standard Form: $ax^2 + bx + c = 0$
Discriminant: $D = b^2 - 4ac$
- If $D > 0$: 2 real distinct roots $x = \\frac{-b \\pm \\sqrt{D}}{2a}$
- If $D = 0$: 2 real equal roots $x = -\\frac{b}{2a}$
- If $D < 0$: No real roots (imaginary roots).`;
    } else if (textLower.includes('nationalism') || textLower.includes('napoleon') || textLower.includes('treaty') || textLower.includes('history')) {
      response = `🌍 **SST History Key Points**:
- **Treaty of Vienna (1815)**: Hosted by Austrian Chancellor Duke Metternich to restore Bourbon dynasty and conservative order.
- **Napoleonic Code (1804)**: Established equality before law and removed feudal privileges.
- **Giuseppe Mazzini**: Founded 'Young Italy' & 'Young Europe' secret societies.`;
    } else if (textLower.includes('soil') || textLower.includes('geography') || textLower.includes('resource')) {
      response = `🌱 **SST Geography Highlights**:
- **Black Soil (Regur)**: Ideal for cotton cultivation; found in Deccan Trap (Maharashtra, Gujarat). Rich in calcium carbonate and magnesium.
- **Alluvial Soil**: Most widespread and fertile; deposited by Indus, Ganga, and Brahmaputra rivers.`;
    } else if (textLower.includes('help') || textLower.includes('hi') || textLower.includes('hello')) {
      response = `👋 Hello ${userProfile.name}! I am **StudyBot AI**, your 24/7 peer study companion.

You can ask me questions about:
- 🔬 **Science**: Physics laws, Chemistry formulas & equations, Biology concepts.
- 📐 **Maths**: Trigonometry tricks, Quadratic equations, Geometry theorems.
- 🌍 **Social Studies (SST)**: Important historical dates, Map pointers, Economics & Civics.

Or just tag me with \`@StudyBot\` along with any study question!`;
    } else {
      response = `💡 **Study Tip**: Great question regarding your studies! To excel in this topic, remember to:
1. Break down the core definition into 2 key bullet points.
2. Check the uploaded formula sheets and video lessons in the **${channel.toUpperCase()}** classwork section.
3. Try solving 3 practice problems to reinforce the concept!`;
    }

    return response;
  };

  // Send message
  const sendMessage = useCallback((text, attachedResource = null) => {
    if (!text?.trim() && !attachedResource) return;

    const newMessage = {
      id: generateId('msg'),
      channel: activeChannel,
      sender: userProfile.name,
      avatarGradient: userProfile.avatarGradient,
      text: text?.trim() || '',
      timestamp: new Date().toISOString(),
      reactions: {},
      attachedResource: attachedResource || null,
      isBot: false,
    };

    setMessages(prev => [...prev, newMessage]);
    broadcast('NEW_MESSAGE', newMessage);
    playChimeSound('notification');

    // If message mentions @StudyBot or is in a doubt channel, trigger AI StudyBot
    const shouldBotReply = text.toLowerCase().includes('@studybot') || 
                           text.toLowerCase().includes('bot') || 
                           text.toLowerCase().includes('how') || 
                           text.toLowerCase().includes('what') || 
                           text.toLowerCase().includes('explain') || 
                           text.toLowerCase().includes('formula') ||
                           text.includes('?');

    if (shouldBotReply) {
      setIsBotTyping(true);
      setTimeout(() => {
        const botReply = {
          id: generateId('msg_bot'),
          channel: activeChannel,
          sender: 'StudyBot AI',
          avatarGradient: 'from-cyan-500 to-blue-600',
          text: generateBotResponse(text, activeChannel),
          timestamp: new Date().toISOString(),
          reactions: { '💡': 1 },
          isBot: true,
        };
        setMessages(prev => [...prev, botReply]);
        broadcast('NEW_MESSAGE', botReply);
        playChimeSound('message');
        setIsBotTyping(false);
      }, 1000);
    }
  }, [activeChannel, userProfile]);

  // Toggle reaction on a message
  const toggleReaction = useCallback((messageId, emoji) => {
    setMessages(prev =>
      prev.map(m => {
        if (m.id !== messageId) return m;
        const currentReactions = { ...(m.reactions || {}) };
        const currentCount = currentReactions[emoji] || 0;
        if (currentCount > 0) {
          currentReactions[emoji] = currentCount + 1;
        } else {
          currentReactions[emoji] = 1;
        }
        const updated = { ...m, reactions: currentReactions };
        broadcast('REACTION_UPDATE', { messageId, reactions: currentReactions });
        return updated;
      })
    );
  }, []);

  const openChatWithChannel = (channel = 'general') => {
    setActiveChannel(channel);
    setIsChatOpen(true);
    setUnreadCount(0);
  };

  return (
    <ChatContext.Provider
      value={{
        activeChannel,
        setActiveChannel,
        messages,
        sendMessage,
        toggleReaction,
        isChatOpen,
        setIsChatOpen,
        openChatWithChannel,
        unreadCount,
        setUnreadCount,
        isBotTyping,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
}
