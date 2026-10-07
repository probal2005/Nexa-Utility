'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowUpRight,
  AudioLines,
  Bot,
  Clock3,
  Command,
  Mic,
  Search,
  Send,
  Sparkles,
  Volume2,
} from 'lucide-react';

import { executeCommand } from '@/features/command-center/lib/executor';
import { parseCommand } from '@/features/command-center/lib/parser';
import { parseAssistantInput } from '@/features/assistant/lib/assistantIntent';
import { getStoredReminders, saveReminders } from '@/features/reminders/lib/reminders';
import type { Reminder } from '@/features/reminders/types';
import { emit } from '@/lib/events/bus';

type RecognitionAlternative = { transcript: string };
type RecognitionResult = ArrayLike<RecognitionAlternative> & { isFinal: boolean };
type RecognitionEvent = { results: ArrayLike<RecognitionResult> };
type RecognitionError = { error: string };
type RecognitionLike = {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  onstart: (() => void) | null;
  onend: (() => void) | null;
  onerror: ((event: RecognitionError) => void) | null;
  onresult: ((event: RecognitionEvent) => void) | null;
  start: () => void;
  stop: () => void;
};
type RecognitionConstructor = new () => RecognitionLike;
type ConversationTurn = {
  id: number;
  role: 'user' | 'assistant';
  text: string;
  searchUrl?: string;
};

const suggestions = [
  { label: 'Open calculator', icon: Command },
  { label: 'Set a timer for 5 minutes', icon: Clock3 },
  { label: 'Search for space news', icon: Search },
  { label: 'Remind me to stretch in 10 minutes', icon: Clock3 },
  { label: 'What is 24 times 6?', icon: Command },
];

export function AssistantPage() {
  const router = useRouter();
  const recognitionRef = useRef<RecognitionLike | null>(null);
  const [listening, setListening] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [supported, setSupported] = useState(true);
  const [statusMessage, setStatusMessage] = useState('Tap the microphone and tell me what you need.');
  const [input, setInput] = useState('');
  const [conversation, setConversation] = useState<ConversationTurn[]>([]);

  useEffect(() => () => {
    const recognition = recognitionRef.current;
    if (recognition) {
      recognition.onresult = null;
      recognition.onend = null;
      recognition.onerror = null;
      recognition.onstart = null;
      recognition.stop();
    }
    window.speechSynthesis?.cancel();
  }, []);

  const addTurn = (role: ConversationTurn['role'], text: string, searchUrl?: string) => {
    setConversation((current) => [...current, {
      id: Date.now() + current.length,
      role,
      text,
      searchUrl,
    }]);
  };

  const speak = (text: string, afterSpeech?: () => void) => {
    if (!('speechSynthesis' in window)) {
      setSpeaking(false);
      afterSpeech?.();
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = navigator.language || 'en-US';
    utterance.rate = 1;
    utterance.pitch = 1;
    utterance.onstart = () => setSpeaking(true);
    utterance.onend = () => {
      setSpeaking(false);
      afterSpeech?.();
    };
    utterance.onerror = () => {
      setSpeaking(false);
      afterSpeech?.();
    };
    window.speechSynthesis.speak(utterance);
  };

  const respond = (text: string, afterSpeech?: () => void, searchUrl?: string) => {
    addTurn('assistant', text, searchUrl);
    setStatusMessage(text);
    speak(text, afterSpeech);
  };

  const processRequest = (rawText: string) => {
    const request = rawText.trim();
    if (!request) return;

    addTurn('user', request);
    setInput('');
    setStatusMessage('Thinking…');

    const intent = parseAssistantInput(request);

    if (intent.kind === 'greeting') {
      respond('Hi! I’m Nexa. I can open your tools, set timers, calculate, create reminders, or search the web. What would you like?');
      return;
    }

    if (intent.kind === 'help') {
      respond('I can open any Nexa tool, set a timer, calculate an expression, save a reminder, tell you the time or date, and search the web. Try: open my camera, set a timer for five minutes, remind me to stretch in ten minutes, or what is twenty four times six.');
      return;
    }

    if (intent.kind === 'time') {
      respond(`It’s ${new Date().toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' })}.`);
      return;
    }

    if (intent.kind === 'date') {
      respond(`Today is ${new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}.`);
      return;
    }

    if (intent.kind === 'reminder') {
      const now = Date.now();
      const reminder: Reminder = {
        id: crypto.randomUUID(),
        title: intent.title,
        dueDate: intent.dueDate,
        dueTime: intent.dueTime,
        priority: 'medium',
        completed: false,
        createdAt: now,
        updatedAt: now,
        source: 'manual',
      };
      saveReminders([...getStoredReminders(), reminder]);
      emit('reminders:changed');
      const when = intent.dueDate
        ? ` for ${new Date(`${intent.dueDate}T${intent.dueTime ?? '23:59'}`).toLocaleString(undefined, { dateStyle: 'medium', ...(intent.dueTime ? { timeStyle: 'short' as const } : {}) })}`
        : '';
      respond(`Reminder saved: ${intent.title}${when}.`);
      return;
    }

    if (intent.kind === 'command') {
      const parsed = parseCommand(intent.command);
      if (parsed.action !== 'search-tool' && parsed.action !== 'unknown') {
        const taskLabel = parsed.action === 'open-tool'
          ? parsed.tool?.name ?? 'that tool'
          : parsed.action === 'timer'
            ? 'your timer'
            : 'Calculator';
        respond(`On it. Opening ${taskLabel}.`, () => executeCommand(parsed, router));
        return;
      }
    }

    const query = intent.kind === 'search' ? intent.query : request;
    const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
    respond(`I’ve prepared a web search for ${query}. Tap the link to view the results.`, undefined, searchUrl);
  };

  const startListening = () => {
    if (listening) {
      recognitionRef.current?.stop();
      return;
    }

    const speechWindow = window as Window & {
      SpeechRecognition?: RecognitionConstructor;
      webkitSpeechRecognition?: RecognitionConstructor;
    };
    const Recognition = speechWindow.SpeechRecognition ?? speechWindow.webkitSpeechRecognition;

    if (!Recognition) {
      setSupported(false);
      setStatusMessage('Voice recognition is unavailable in this browser. You can still type a request below.');
      return;
    }

    const recognition = new Recognition();
    recognition.lang = navigator.language || 'en-US';
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.onstart = () => {
      setListening(true);
      setStatusMessage('Listening… I’m ready.');
    };
    recognition.onend = () => setListening(false);
    recognition.onerror = (event) => {
      setListening(false);
      setStatusMessage(event.error === 'not-allowed'
        ? 'Microphone access is blocked. Allow it in your browser settings or type a request.'
        : 'I didn’t catch that. Try again or type your request.');
    };
    recognition.onresult = (event) => {
      const finalResult = Array.from(event.results).find((result) => result.isFinal);
      const transcript = finalResult?.[0]?.transcript?.trim();
      if (transcript) processRequest(transcript);
    };

    recognitionRef.current = recognition;
    setSupported(true);
    try {
      recognition.start();
    } catch {
      setListening(false);
      setStatusMessage('Could not start the microphone. Check its permission or type a request.');
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    processRequest(input);
  };

  return (
    <main className="mx-auto w-full max-w-7xl space-y-7 px-4 py-6 sm:px-6 lg:px-8 lg:py-10">
      <header className="relative isolate overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-br from-violet-400/[0.10] via-white/[0.04] to-transparent px-6 py-7 sm:px-9 sm:py-9">
        <div className="pointer-events-none absolute -right-16 -top-28 -z-10 h-80 w-80 rounded-full bg-violet-500/[0.13] blur-3xl" />
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-violet-200/15 bg-violet-200/[0.06] px-3 py-1.5 text-xs font-medium text-violet-200">
              <Sparkles size={14} /> Nexa voice assistant
            </div>
            <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">I’m listening.</h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-400 sm:text-base">
              Talk naturally to open Nexa tools, set timers, calculate, or search the web.
            </p>
          </div>
          <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/20 px-4 py-3">
            <span className={`flex h-10 w-10 items-center justify-center rounded-xl ${listening ? 'bg-violet-300/15 text-violet-200' : speaking ? 'bg-cyan-300/10 text-cyan-200' : 'bg-white/[0.06] text-zinc-400'}`}>
              {listening ? <AudioLines size={19} className="animate-pulse" /> : speaking ? <Volume2 size={19} /> : <Bot size={19} />}
            </span>
            <div>
              <p className="text-sm font-medium text-white">{listening ? 'Listening now' : speaking ? 'Speaking' : 'Assistant ready'}</p>
              <p className="mt-1 max-w-56 text-xs text-zinc-500">Voice recognition and spoken replies</p>
            </div>
          </div>
        </div>
      </header>

      <section className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
        <div className="overflow-hidden rounded-[1.75rem] border border-white/10 bg-[#101116] shadow-2xl shadow-black/20">
          <div className="flex items-center justify-between gap-3 border-b border-white/[0.07] px-5 py-4 sm:px-6">
            <div>
              <h2 className="text-sm font-semibold text-white">Voice console</h2>
              <p className="mt-1 text-xs text-zinc-500">Your requests stay in this session</p>
            </div>
            <span className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-[11px] font-medium ${listening ? 'border-violet-300/20 bg-violet-300/[0.08] text-violet-200' : 'border-white/10 bg-white/[0.04] text-zinc-400'}`}>
              <span className={`h-1.5 w-1.5 rounded-full ${listening ? 'animate-pulse bg-violet-300' : 'bg-zinc-500'}`} />
              {listening ? 'MIC ACTIVE' : 'STANDBY'}
            </span>
          </div>

          <div className="flex min-h-64 flex-col items-center justify-center px-5 py-8 text-center sm:min-h-72">
            <button
              type="button"
              onClick={startListening}
              aria-label={listening ? 'Stop listening' : 'Start voice assistant'}
              aria-pressed={listening}
              className={`group relative mb-6 flex h-28 w-28 items-center justify-center rounded-full border transition duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-200 focus-visible:ring-offset-4 focus-visible:ring-offset-[#101116] sm:h-32 sm:w-32 ${listening ? 'border-violet-200/60 bg-violet-300/15 shadow-[0_0_70px_rgba(167,139,250,0.32)]' : 'border-violet-200/20 bg-gradient-to-br from-violet-300/15 to-cyan-300/[0.06] shadow-[0_0_50px_rgba(139,92,246,0.12)] hover:border-violet-200/40 hover:shadow-[0_0_65px_rgba(139,92,246,0.2)]'}`}
            >
              <span className={`absolute inset-[-12px] rounded-full border border-violet-200/10 ${listening ? 'animate-ping' : ''}`} />
              <span className="absolute inset-2 rounded-full border border-white/[0.06]" />
              {listening ? <AudioLines size={34} className="text-violet-100" /> : <Mic size={32} className="text-violet-100 transition group-hover:scale-110" />}
            </button>
            <p className="text-lg font-medium text-white">{listening ? 'Go ahead, I’m listening' : speaking ? 'One moment…' : 'Tap to speak'}</p>
            <p aria-live="polite" className="mt-2 max-w-lg text-sm leading-6 text-zinc-500">{statusMessage}</p>
            {!supported && <p className="mt-3 text-xs text-amber-200/80">Text requests still work below.</p>}
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-2 border-t border-white/[0.07] bg-white/[0.02] p-4 sm:flex-row sm:p-5">
            <label htmlFor="assistant-request" className="sr-only">Type a request for Nexa</label>
            <input
              id="assistant-request"
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Or type a request…"
              className="h-12 min-w-0 flex-1 rounded-xl border border-white/[0.08] bg-black/20 px-4 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-violet-200/35"
            />
            <button type="submit" disabled={!input.trim()} className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-violet-200 px-5 text-sm font-semibold text-slate-950 transition hover:bg-violet-100 disabled:cursor-not-allowed disabled:opacity-40">
              <Send size={16} /> Send
            </button>
          </form>
        </div>

        <aside className="space-y-4">
          <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.035] p-5 sm:p-6">
            <div className="mb-4 flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-300/10 text-cyan-200"><Volume2 size={18} /></span>
              <div><h2 className="text-sm font-semibold text-white">What I can do</h2><p className="mt-1 text-xs text-zinc-500">Try a natural request</p></div>
            </div>
            <ul className="space-y-3 text-sm text-zinc-400">
              <li className="flex gap-2"><span className="text-violet-300">›</span> Open a Nexa tool</li>
              <li className="flex gap-2"><span className="text-violet-300">›</span> Set a timer or calculate</li>
              <li className="flex gap-2"><span className="text-violet-300">›</span> Create reminders by voice</li>
              <li className="flex gap-2"><span className="text-violet-300">›</span> Search the web</li>
              <li className="flex gap-2"><span className="text-violet-300">›</span> Tell the time or date</li>
            </ul>
          </div>
          <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.035] p-5 sm:p-6">
            <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-white"><Sparkles size={16} className="text-violet-200" /> Try saying</div>
            <div className="space-y-2">
              {suggestions.map(({ label, icon: Icon }) => (
                <button key={label} type="button" onClick={() => setInput(label)} className="flex w-full items-center gap-3 rounded-xl border border-white/[0.06] bg-black/10 px-3 py-2.5 text-left text-xs text-zinc-400 transition hover:border-violet-200/20 hover:bg-violet-200/[0.04] hover:text-white">
                  <Icon size={14} className="shrink-0 text-violet-200" /> {label}
                </button>
              ))}
            </div>
          </div>
        </aside>
      </section>

      {conversation.length > 0 && (
        <section aria-labelledby="conversation-heading" className="space-y-4">
          <div className="flex items-end justify-between gap-4">
            <div><p className="text-xs font-medium uppercase tracking-[0.15em] text-zinc-500">This session</p><h2 id="conversation-heading" className="mt-1 text-lg font-semibold text-white">Conversation</h2></div>
            <button type="button" onClick={() => { setConversation([]); setStatusMessage('Tap the microphone and tell me what you need.'); window.speechSynthesis?.cancel(); setSpeaking(false); }} className="text-xs text-zinc-500 transition hover:text-white">Clear conversation</button>
          </div>
          <div className="space-y-3">
            {conversation.map((turn) => (
              <div key={turn.id} className={`flex ${turn.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-2xl rounded-2xl border px-4 py-3 ${turn.role === 'user' ? 'border-violet-200/15 bg-violet-200/[0.07] text-violet-50' : 'border-white/[0.08] bg-white/[0.03] text-zinc-200'}`}>
                  <p className="mb-1 text-[10px] font-medium uppercase tracking-wider text-zinc-500">{turn.role === 'user' ? 'You' : 'Nexa'}</p>
                  <p className="text-sm leading-6">{turn.text}</p>
                  {turn.searchUrl && <a href={turn.searchUrl} target="_blank" rel="noreferrer" className="mt-3 inline-flex items-center gap-2 rounded-lg border border-cyan-200/15 bg-cyan-200/[0.06] px-3 py-2 text-xs font-medium text-cyan-100 transition hover:bg-cyan-200/[0.12]">Open Google results <ArrowUpRight size={14} /></a>}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      <p className="text-center text-xs leading-5 text-zinc-600">
        Voice recognition depends on your browser and microphone permission. Search results open on Google.
      </p>
    </main>
  );
}
