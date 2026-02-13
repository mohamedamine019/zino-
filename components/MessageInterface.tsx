import React, { useState, useEffect, useRef } from 'react';
import { Send, ArrowLeft, MoreVertical, Phone, Paperclip, Shield, Check } from 'lucide-react';
import { Listing, ChatMessage } from '../types';
import { generateChatReply } from '../services/geminiService';

interface MessageInterfaceProps {
  listing: Listing;
  onBack: () => void;
}

export const MessageInterface: React.FC<MessageInterfaceProps> = ({ listing, onBack }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          id: 'init-1',
          sender: 'me',
          text: `Bonjour, votre annonce "${listing.title}" est-elle toujours disponible ?`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
      
      setTimeout(() => handleAutoReply(`Bonjour, votre annonce "${listing.title}" est-elle toujours disponible ?`), 1500);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAutoReply = async (userText: string) => {
    setIsTyping(true);
    const replyText = await generateChatReply(listing, userText);
    setIsTyping(false);
    
    setMessages(prev => [...prev, {
      id: `them-${Date.now()}`,
      sender: 'them',
      text: replyText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }]);
  };

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim()) return;

    const userMsg: ChatMessage = {
      id: `me-${Date.now()}`,
      sender: 'me',
      text: inputText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    const textToSend = inputText;
    setInputText('');

    setTimeout(() => {
        handleAutoReply(textToSend);
    }, 1000);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] bg-gray-50 md:bg-white">
      <div className="flex-1 max-w-7xl w-full mx-auto md:grid md:grid-cols-3 md:gap-8 md:p-6 overflow-hidden">
        
        {/* Chat Column */}
        <div className="md:col-span-2 flex flex-col bg-white md:border md:border-gray-200 md:rounded-xl shadow-sm h-full overflow-hidden relative">
            
            {/* Mobile Header */}
            <div className="md:hidden bg-white border-b border-gray-200 p-4 flex items-center gap-3 sticky top-0 z-10">
                <button onClick={onBack} className="text-gray-600">
                    <ArrowLeft size={24} />
                </button>
                <div className="flex-1">
                    <div className="font-bold text-gray-900">{listing.sellerName}</div>
                    <div className="text-xs text-gray-500">{listing.title}</div>
                </div>
                <MoreVertical size={24} className="text-gray-400" />
            </div>

            {/* Desktop Chat Header */}
            <div className="hidden md:flex items-center justify-between p-4 border-b border-gray-100 bg-white">
                <div className="flex items-center gap-3">
                   <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center font-bold text-gray-600">
                      {listing.sellerName.charAt(0)}
                   </div>
                   <div>
                       <div className="font-bold text-gray-900">{listing.sellerName}</div>
                       <div className="text-sm text-green-600 flex items-center gap-1">
                           <div className="w-2 h-2 rounded-full bg-green-600"></div>
                           En ligne
                       </div>
                   </div>
                </div>
                <div className="flex gap-2">
                    <button className="p-2 hover:bg-gray-100 rounded-full text-gray-500">
                        <Phone size={20} />
                    </button>
                    <button className="p-2 hover:bg-gray-100 rounded-full text-gray-500">
                        <MoreVertical size={20} />
                    </button>
                </div>
            </div>

            {/* Listing Summary (Mobile sticky under header) */}
            <div className="md:hidden flex items-center gap-3 p-3 bg-gray-50 border-b border-gray-100">
                <img src={listing.imageUrl} className="w-12 h-12 rounded object-cover" />
                <div className="flex-1 min-w-0">
                    <div className="font-bold truncate text-sm">{listing.title}</div>
                    <div className="text-lbc-orange font-bold text-sm">{listing.price} €</div>
                </div>
                <button className="bg-lbc-orange text-white text-xs font-bold px-3 py-2 rounded-lg">
                    Acheter
                </button>
            </div>

            {/* Messages Scroll Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-6 bg-white">
                
                {/* Safety Banner */}
                <div className="bg-blue-50 p-4 rounded-xl flex gap-3 text-sm text-blue-900 mx-auto max-w-2xl">
                    <Shield size={24} className="flex-shrink-0 text-blue-600" />
                    <div>
                        <p className="font-bold mb-1">Paiement sécurisé</p>
                        <p className="text-blue-700">
                            Pour éviter les arnaques, ne payez jamais via Western Union ou MoneyGram. 
                            Privilégiez le paiement sécurisé via l'application.
                        </p>
                    </div>
                </div>

                <div className="flex justify-center">
                    <span className="text-xs font-medium text-gray-400 bg-gray-100 px-3 py-1 rounded-full">
                        {messages[0]?.timestamp?.split(' ')[0] || 'Aujourd\'hui'}
                    </span>
                </div>

                {messages.map((msg) => (
                    <div 
                        key={msg.id} 
                        className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}
                    >
                        <div className={`flex flex-col max-w-[85%] md:max-w-[70%] ${msg.sender === 'me' ? 'items-end' : 'items-start'}`}>
                            <div 
                                className={`px-4 py-3 rounded-2xl text-[15px] leading-relaxed shadow-sm
                                    ${msg.sender === 'me' 
                                        ? 'bg-lbc-orange text-white rounded-tr-sm' 
                                        : 'bg-gray-100 text-gray-800 rounded-tl-sm'
                                    }`}
                            >
                                {msg.text}
                            </div>
                            <div className="flex items-center gap-1 mt-1 px-1">
                                <span className="text-[11px] text-gray-400">
                                    {msg.timestamp}
                                </span>
                                {msg.sender === 'me' && (
                                    <Check size={12} className="text-lbc-orange" />
                                )}
                            </div>
                        </div>
                    </div>
                ))}
                
                {isTyping && (
                   <div className="flex justify-start">
                     <div className="bg-gray-100 px-4 py-3 rounded-2xl rounded-tl-sm flex items-center gap-1">
                       <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                       <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                       <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                     </div>
                   </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 border-t border-gray-100 bg-white">
                <form 
                    onSubmit={handleSend}
                    className="flex items-end gap-2 max-w-4xl mx-auto"
                >
                    <button type="button" className="p-3 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-full transition-colors hidden sm:block">
                        <Paperclip size={20} />
                    </button>
                    
                    <div className="flex-1 bg-gray-100 rounded-2xl flex items-center border border-transparent focus-within:border-gray-300 focus-within:bg-white transition-all">
                        <textarea
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    handleSend();
                                }
                            }}
                            placeholder="Écrivez votre message..."
                            className="w-full bg-transparent border-none focus:ring-0 text-gray-800 placeholder-gray-500 py-3 px-4 max-h-32 resize-none"
                            rows={1}
                        />
                    </div>
                    
                    <button 
                        type="submit"
                        disabled={!inputText.trim()}
                        className="p-3 bg-lbc-orange text-white rounded-full shadow-md hover:bg-lbc-orangeHover transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
                    >
                        <Send size={20} className={inputText.trim() ? "ml-0.5" : ""} />
                    </button>
                </form>
            </div>
        </div>

        {/* Right Column: Listing Details (Desktop) */}
        <div className="hidden md:block col-span-1 h-full">
             <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm sticky top-6">
                 <div className="flex items-start justify-between mb-4">
                     <h2 className="text-xl font-bold text-gray-900 line-clamp-2">{listing.title}</h2>
                 </div>
                 
                 <div className="aspect-[4/3] w-full bg-gray-100 rounded-lg overflow-hidden mb-4 border border-gray-100">
                    <img src={listing.imageUrl} className="w-full h-full object-cover" />
                 </div>
                 
                 <div className="flex items-baseline gap-1 mb-6">
                    <span className="text-2xl font-bold text-lbc-orange">{listing.price} €</span>
                 </div>
                 
                 <div className="space-y-3">
                     <button className="w-full bg-lbc-orange hover:bg-lbc-orangeHover text-white font-bold py-3 rounded-xl transition shadow-sm">
                        Acheter
                     </button>
                     <button className="w-full bg-white border-2 border-lbc-orange text-lbc-orange hover:bg-orange-50 font-bold py-3 rounded-xl transition">
                        Faire une offre
                     </button>
                 </div>

                 <div className="mt-6 pt-6 border-t border-gray-100">
                     <h3 className="font-bold text-sm text-gray-900 mb-2">Transaction sécurisée</h3>
                     <p className="text-xs text-gray-500">
                         Votre argent est bloqué jusqu'à ce que vous ayez reçu et vérifié l'article.
                     </p>
                 </div>
             </div>
        </div>

      </div>
    </div>
  );
};