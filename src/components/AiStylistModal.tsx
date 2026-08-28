import React, { useState } from 'react';
import { Sparkles, Send, X, ExternalLink, RefreshCw, Shirt, UserCheck, Bot } from 'lucide-react';
import { api } from '../services/api';
import { Product } from '../types';
import { useUserAuth } from '../context/UserAuthContext';
import { handleImageFallback, DEFAULT_PRODUCT_IMAGE } from '../utils/imageFallback';

interface AiStylistModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedProduct?: Product | null;
  onNavigateProduct?: (productId: string) => void;
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
  groundingChunks?: any[];
  webSearchQueries?: string[];
  timestamp: string;
}

export function AiStylistModal({ isOpen, onClose, selectedProduct, onNavigateProduct }: AiStylistModalProps) {
  const { currentUser, customerProfile } = useUserAuth();
  const [inputQuery, setInputQuery] = useState('');
  const [occasion, setOccasion] = useState<string>('Casual Hangout / Cafe in Banani');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: selectedProduct
        ? `Hello! I see you're checking out the **${selectedProduct.name}**. I can recommend matching trousers, footwear, layering combinations, and accessory pairings tailored for the Bangladesh climate and your upcoming events.`
        : `Welcome to **Favy Cravy AI Stylist** (powered by Google Search & Gemini 2.5). Ask me anything about outfit matching, monsoon & summer fabric choices, dress codes for events in Dhaka/Chittagong, or current menswear styling trends.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  if (!isOpen) return null;

  const handleSend = async (queryText?: string) => {
    const textToSend = queryText || inputQuery.trim();
    if (!textToSend || loading) return;

    const userMsg: Message = {
      role: 'user',
      content: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuery('');
    setLoading(true);

    try {
      const res = await api.getAiStylistAdvice({
        userQuery: textToSend,
        selectedProduct: selectedProduct || undefined,
        userOccasion: occasion
      });

      const aiMsg: Message = {
        role: 'assistant',
        content: res.text,
        groundingChunks: res.groundingChunks,
        webSearchQueries: res.webSearchQueries,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: 'For an effortless and sophisticated look, pair structured Oxford or linen shirts with our tailored ankle-crop pleated trousers or selvedge denim. Minimalist white leather sneakers or suede penny loafers complete the fit.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const samplePrompts = [
    'How should I style this for a summer evening in Dhaka?',
    'What trousers and shoes pair best with this shirt?',
    'Suggest a minimalist smart-casual office look.',
    'Best breathable fabrics for Bangladesh humid monsoon?'
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-2xl bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl flex flex-col max-h-[85vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800 bg-neutral-950/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white tracking-wide">FCF Personal AI Stylist</h3>
                <span className="px-2 py-0.5 text-[10px] uppercase font-semibold tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Search Grounded
                </span>
              </div>
              <p className="text-xs text-neutral-400">
                {currentUser ? `Styling for ${currentUser.displayName || 'Distinguished Gentleman'}` : 'Google Gemini 2.5 with live Search fashion insights'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Selected Garment Ribbon */}
        {selectedProduct && (
          <div className="px-6 py-2.5 bg-neutral-950/80 border-b border-neutral-800 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <img
                src={selectedProduct.thumbnail || selectedProduct.images[0] || DEFAULT_PRODUCT_IMAGE}
                alt={selectedProduct.name}
                className="w-8 h-10 object-cover rounded bg-neutral-800 shrink-0 border border-neutral-700"
                referrerPolicy="no-referrer"
                onError={(e) => handleImageFallback(e, DEFAULT_PRODUCT_IMAGE)}
              />
              <div className="min-w-0">
                <p className="text-xs font-semibold text-white truncate">{selectedProduct.name}</p>
                <p className="text-[11px] text-amber-400 font-mono">৳{selectedProduct.salePrice || selectedProduct.price} BDT • {selectedProduct.category}</p>
              </div>
            </div>
            <span className="text-[11px] font-medium text-neutral-400 flex items-center gap-1 shrink-0">
              <Shirt className="w-3.5 h-3.5 text-neutral-500" /> Focus Garment
            </span>
          </div>
        )}

        {/* Occasion Selector */}
        <div className="px-6 py-2 bg-neutral-900 border-b border-neutral-800/80 flex items-center gap-2 overflow-x-auto text-xs scrollbar-none">
          <span className="text-neutral-500 text-[11px] font-medium shrink-0">Context:</span>
          {['Casual Cafe / Hangout', 'Smart Office', 'Dinner & Evening', 'Beach / Resort', 'Traditional / Wedding Guest'].map((occ) => (
            <button
              key={occ}
              type="button"
              onClick={() => setOccasion(occ)}
              className={`px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                occasion === occ
                  ? 'bg-amber-400 text-neutral-950 font-semibold'
                  : 'bg-neutral-800/80 text-neutral-400 hover:text-neutral-200'
              }`}
            >
              {occ}
            </button>
          ))}
        </div>

        {/* Messages Container */}
        <div className="flex-1 p-6 overflow-y-auto space-y-4 max-h-[48vh]">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.role === 'assistant' && (
                <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
                  <Bot className="w-4 h-4" />
                </div>
              )}
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-amber-400 text-neutral-950 font-medium rounded-tr-none'
                    : 'bg-neutral-800/90 text-neutral-200 border border-neutral-700/60 rounded-tl-none space-y-2'
                }`}
              >
                <div className="whitespace-pre-wrap">{msg.content}</div>

                {/* Grounding Source Citations from Google Search */}
                {msg.groundingChunks && msg.groundingChunks.length > 0 && (
                  <div className="pt-2 mt-2 border-t border-neutral-700/60 text-xs">
                    <p className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                      <ExternalLink className="w-3 h-3 text-amber-400" /> Google Search Sources:
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {msg.groundingChunks.slice(0, 3).map((chunk: any, cIdx: number) => {
                        const web = chunk.web;
                        if (!web) return null;
                        return (
                          <a
                            key={cIdx}
                            href={web.uri}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-[11px] text-amber-400/90 bg-neutral-900 px-2 py-0.5 rounded border border-neutral-700 hover:border-amber-400 transition-colors truncate max-w-xs"
                          >
                            {web.title || 'Fashion Reference'}
                          </a>
                        );
                      })}
                    </div>
                  </div>
                )}

                <span className={`block text-[10px] mt-1 ${msg.role === 'user' ? 'text-neutral-800/70' : 'text-neutral-500'} text-right`}>
                  {msg.timestamp}
                </span>
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex gap-3 justify-start">
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
                <Sparkles className="w-4 h-4 animate-spin" />
              </div>
              <div className="bg-neutral-800/90 border border-neutral-700/60 rounded-2xl rounded-tl-none px-4 py-3 text-sm text-neutral-400 flex items-center gap-2">
                <RefreshCw className="w-4 h-4 animate-spin text-amber-400" />
                <span>Consulting live Google Search & style intelligence...</span>
              </div>
            </div>
          )}
        </div>

        {/* Quick Prompts (if only 1-2 messages) */}
        {messages.length <= 2 && (
          <div className="px-6 pb-2 flex gap-2 overflow-x-auto text-xs scrollbar-none">
            {samplePrompts.map((p, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSend(p)}
                className="px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 rounded-lg text-xs whitespace-nowrap transition-colors border border-neutral-700/60"
              >
                {p}
              </button>
            ))}
          </div>
        )}

        {/* Input Bar */}
        <div className="p-4 border-t border-neutral-800 bg-neutral-950/60">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              placeholder={selectedProduct ? `Ask how to style the ${selectedProduct.name}...` : 'Ask your AI Stylist for outfit advice or Bangladesh trend tips...'}
              className="flex-1 bg-neutral-800/90 border border-neutral-700 text-white placeholder-neutral-500 px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:border-amber-400 transition-colors"
            />
            <button
              type="submit"
              disabled={!inputQuery.trim() || loading}
              className="px-4 py-2.5 bg-amber-400 hover:bg-amber-300 disabled:opacity-50 text-neutral-950 font-semibold rounded-xl text-sm flex items-center gap-2 transition-colors shrink-0"
            >
              <Send className="w-4 h-4" />
              <span className="hidden sm:inline">Ask Stylist</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
