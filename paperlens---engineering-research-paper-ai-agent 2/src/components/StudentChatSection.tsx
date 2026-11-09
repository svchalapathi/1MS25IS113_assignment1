import React, { useState } from 'react';
import { PaperAnalysisResult, ChatMessage } from '../types/paper';
import { Send, Bot, User, Sparkles, HelpCircle } from 'lucide-react';

interface StudentChatSectionProps {
  paper: PaperAnalysisResult;
}

export const StudentChatSection: React.FC<StudentChatSectionProps> = ({ paper }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: `Hello! I'm your AI Research Advisor for "${paper.metadata.title}". Ask me anything about the math, architecture, training details, hardware requirements, or how to replicate this for your engineering course!`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [input, setInput] = useState<string>('');
  const [isAsking, setIsAsking] = useState<boolean>(false);

  const suggestedQuestions = [
    'What hardware/GPU is realistically needed to fine-tune this?',
    'What is the key mathematical intuition behind this method?',
    'How could I write a minimal PyTorch implementation for my class?',
    'What are the biggest edge cases or failure modes mentioned?',
  ];

  const handleSend = async (questionText?: string) => {
    const q = (questionText || input).trim();
    if (!q || isAsking) return;

    const userMsg: ChatMessage = {
      id: 'u-' + Date.now(),
      role: 'user',
      content: q,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsAsking(true);

    try {
      const response = await fetch('/api/ask-paper', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          paperContext: paper,
          question: q,
        }),
      });

      const data = await response.json();
      const assistantMsg: ChatMessage = {
        id: 'a-' + Date.now(),
        role: 'assistant',
        content: data.answer || 'Could not generate an answer at this time.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          id: 'err-' + Date.now(),
          role: 'assistant',
          content: 'Sorry, I encountered an issue connecting to the research server. Please try again.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsAsking(false);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xs flex flex-col h-[650px]">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center">
            <HelpCircle className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Student Paper Advisor
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Ask deep engineering questions on equations, hardware, or implementation tricks
            </p>
          </div>
        </div>
      </div>

      {/* Suggested Questions */}
      <div className="py-3 border-b border-slate-100 dark:border-slate-800">
        <span className="text-xs text-slate-400 block mb-2 font-medium">Quick student queries:</span>
        <div className="flex flex-wrap gap-1.5">
          {suggestedQuestions.map((sq, i) => (
            <button
              key={i}
              onClick={() => handleSend(sq)}
              disabled={isAsking}
              className="text-left px-2.5 py-1 text-xs bg-slate-50 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 hover:text-indigo-600 dark:hover:text-indigo-400 text-slate-600 dark:text-slate-300 rounded-lg border border-slate-200 dark:border-slate-700 transition-colors"
            >
              {sq}
            </button>
          ))}
        </div>
      </div>

      {/* Messages list */}
      <div className="flex-1 overflow-y-auto py-4 space-y-4 pr-1">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex items-start gap-3 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {m.role === 'assistant' && (
              <div className="w-7 h-7 rounded-lg bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-400 flex items-center justify-center shrink-0 mt-0.5">
                <Bot className="w-4 h-4" />
              </div>
            )}
            <div
              className={`max-w-[82%] rounded-xl px-4 py-3 text-xs sm:text-sm leading-relaxed ${
                m.role === 'user'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-50 dark:bg-slate-800/80 text-slate-850 dark:text-slate-200 border border-slate-200 dark:border-slate-700'
              }`}
            >
              <div className="whitespace-pre-wrap">{m.content}</div>
              <div
                className={`text-[10px] mt-1.5 tabular-nums ${
                  m.role === 'user' ? 'text-indigo-200 text-right' : 'text-slate-400'
                }`}
              >
                {m.timestamp}
              </div>
            </div>
            {m.role === 'user' && (
              <div className="w-7 h-7 rounded-lg bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 flex items-center justify-center shrink-0 mt-0.5">
                <User className="w-4 h-4" />
              </div>
            )}
          </div>
        ))}

        {isAsking && (
          <div className="flex items-start gap-3">
            <div className="w-7 h-7 rounded-lg bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-400 flex items-center justify-center shrink-0">
              <Bot className="w-4 h-4" />
            </div>
            <div className="bg-slate-50 dark:bg-slate-800/80 rounded-xl px-4 py-3 border border-slate-200 dark:border-slate-700 text-xs flex items-center gap-2 text-slate-500">
              <div className="w-3.5 h-3.5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
              <span>Analyzing paper literature and engineering implications...</span>
            </div>
          </div>
        )}
      </div>

      {/* Input row */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={`Ask about equations, hyperparameters, or implementation in ${paper.metadata.title.slice(0, 30)}...`}
          className="flex-1 px-4 py-2.5 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-white placeholder-slate-400"
        />
        <button
          type="submit"
          disabled={!input.trim() || isAsking}
          className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
        >
          <span>Ask</span>
          <Send className="w-3.5 h-3.5" />
        </button>
      </form>
    </div>
  );
};
