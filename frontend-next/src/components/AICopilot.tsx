'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, Send, Sparkles, X } from 'lucide-react';

type Message = {
  sender: 'ai' | 'user';
  text: string;
};

const starterMessage: Message = {
  sender: 'ai',
  text: 'Ask for a demo script, phantom-cascade explanation, dilution summary, or carousel-trade walkthrough.',
};

const suggestedPrompts = [
  'How should I pitch the phantom cascade demo?',
  'Explain dilution risk in lender language.',
  'What makes this better than invoice-by-invoice checks?',
];

function getResponse(input: string) {
  const prompt = input.toLowerCase();

  if (prompt.includes('phantom') || prompt.includes('cascade')) {
    return 'Lead with the Phantom Cascade scenario, then open the SCF tab. Show that each invoice looks plausible alone, but cascade correlation, ERP gaps, and lender overlap reveal multiplied exposure before disbursement.';
  }

  if (prompt.includes('dilution')) {
    return 'Frame dilution as repayment quality erosion. Show the collection gap, overdue days, returns, and credit notes to explain why a financed receivable may not convert cleanly into cash.';
  }

  if (prompt.includes('carousel') || prompt.includes('graph') || prompt.includes('network')) {
    return 'Explain that graph analytics catch fraud that document checks miss. Trade rings, directed triangles, and suspicious hubs surface carousel patterns across counterparties and tiers.';
  }

  if (prompt.includes('judge') || prompt.includes('pitch') || prompt.includes('demo')) {
    return 'Position IntelliTrace as a prevention product, not just a score. It validates evidence, correlates multi-tier exposure, explains business impact, and produces a lender-ready action playbook.';
  }

  return 'Use the executive brief first, then drill into SCF Control for ERP, dilution, and cascade evidence. That gives both a business story and technical credibility in one flow.';
}

export default function AICopilot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([starterMessage]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const sendMessage = (text: string) => {
    if (!text.trim()) return;

    setMessages((prev) => [...prev, { sender: 'user', text }]);
    setInput('');
    setIsTyping(true);

    window.setTimeout(() => {
      setIsTyping(false);
      setMessages((prev) => [...prev, { sender: 'ai', text: getResponse(text) }]);
    }, 600);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col items-end">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            className="surface mb-4 flex h-[520px] w-[360px] flex-col overflow-hidden sm:w-[400px]"
          >
            <div className="flex items-center justify-between border-b border-white/8 px-4 py-4">
              <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-[rgba(78,203,255,0.12)] p-2">
                  <Bot className="h-5 w-5 text-[var(--accent-cyan)]" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Analyst Copilot</h3>
                  <p className="text-xs text-[var(--text-secondary)]">Demo support and pitch guidance</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="rounded-xl p-2 text-[var(--text-secondary)] transition hover:bg-white/[0.05] hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="border-b border-white/8 px-4 py-3">
              <div className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--text-muted)]">Quick prompts</div>
              <div className="flex flex-wrap gap-2">
                {suggestedPrompts.map((prompt) => (
                  <button
                    key={prompt}
                    type="button"
                    onClick={() => sendMessage(prompt)}
                    className="rounded-full border border-white/10 px-3 py-2 text-left text-xs text-[var(--text-secondary)] transition hover:border-white/20 hover:bg-white/[0.05] hover:text-white"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex-1 space-y-4 overflow-y-auto p-4 custom-scrollbar">
              {messages.map((message, index) => (
                <motion.div
                  key={`${message.sender}-${index}`}
                  initial={{ opacity: 0, x: message.sender === 'user' ? 10 : -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[86%] rounded-2xl px-4 py-3 text-sm leading-6 ${
                      message.sender === 'user'
                        ? 'bg-[rgba(78,203,255,0.12)] text-white'
                        : 'border border-white/8 bg-black/15 text-[var(--text-secondary)]'
                    }`}
                  >
                    {message.text}
                  </div>
                </motion.div>
              ))}

              {isTyping && (
                <div className="flex justify-start">
                  <div className="rounded-2xl border border-white/8 bg-black/15 px-4 py-3">
                    <div className="flex gap-1.5">
                      <div className="h-2 w-2 animate-bounce rounded-full bg-[var(--accent-cyan)]" />
                      <div className="h-2 w-2 animate-bounce rounded-full bg-[var(--accent-cyan)]" style={{ animationDelay: '120ms' }} />
                      <div className="h-2 w-2 animate-bounce rounded-full bg-[var(--accent-cyan)]" style={{ animationDelay: '240ms' }} />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSubmit} className="border-t border-white/8 p-4">
              <div className="relative">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask for pitch help or product framing"
                  className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 pr-12 text-sm text-white outline-none transition placeholder:text-[var(--text-muted)] focus:border-[var(--accent-cyan)]"
                />
                <button
                  type="submit"
                  disabled={!input.trim()}
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded-xl bg-[rgba(78,203,255,0.12)] p-2 text-[var(--accent-cyan)] transition disabled:opacity-50"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        onClick={() => setIsOpen((prev) => !prev)}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        className="flex h-14 w-14 items-center justify-center rounded-full bg-[linear-gradient(135deg,#4ecbff,#4d7cff)] shadow-[0_16px_36px_rgba(77,124,255,0.3)]"
      >
        {isOpen ? <X className="h-6 w-6 text-white" /> : <Sparkles className="h-6 w-6 text-white" />}
      </motion.button>
    </div>
  );
}
