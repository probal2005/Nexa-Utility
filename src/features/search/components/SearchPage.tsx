'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowRight,
  ArrowUpRight,
  Command,
  Globe2,
  Mic,
  MicOff,
  Search as SearchIcon,
  Sparkles,
} from 'lucide-react';

import { parseCommand } from '@/features/command-center/lib/parser';
import { executeCommand } from '@/features/command-center/lib/executor';

type SpeechAlternativeLike = { transcript: string };
type SpeechResultLike = ArrayLike<SpeechAlternativeLike> & { isFinal: boolean };
type SpeechResultEventLike = { results: ArrayLike<SpeechResultLike> };
type SpeechErrorEventLike = { error: string };

type SpeechRecognitionLike = {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  onstart: (() => void) | null;
  onend: (() => void) | null;
  onerror: ((event: SpeechErrorEventLike) => void) | null;
  onresult: ((event: SpeechResultEventLike) => void) | null;
  start: () => void;
  stop: () => void;
};

type SpeechRecognitionConstructor = new () => SpeechRecognitionLike;

const quickPrompts = [
  { label: 'Open calculator', icon: Command },
  { label: 'Set timer for 10 minutes', icon: Command },
  { label: 'Calculate 24 × 18', icon: Command },
];

export function SearchPage() {
  const router = useRouter();
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const [query, setQuery] = useState('');
  const [listening, setListening] = useState(false);
  const [voiceMessage, setVoiceMessage] = useState('');

  useEffect(() => () => {
    const recognition = recognitionRef.current;
    if (recognition) {
      recognition.onresult = null;
      recognition.onend = null;
      recognition.onerror = null;
      recognition.onstart = null;
      recognition.stop();
    }
  }, []);

  const submitSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const cleanedQuery = query.trim();

    if (!cleanedQuery) {
      return;
    }

    const command = parseCommand(cleanedQuery);
    if (command.action !== 'search-tool' && command.action !== 'unknown') {
      if (executeCommand(command, router)) {
        return;
      }
    }

    const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(cleanedQuery)}`;
    window.open(searchUrl, '_blank', 'noopener,noreferrer');
  };

  const startVoiceSearch = () => {
    if (listening) {
      recognitionRef.current?.stop();
      return;
    }

    const speechWindow = window as Window & {
      SpeechRecognition?: SpeechRecognitionConstructor;
      webkitSpeechRecognition?: SpeechRecognitionConstructor;
    };
    const Recognition = speechWindow.SpeechRecognition ?? speechWindow.webkitSpeechRecognition;

    if (!Recognition) {
      setVoiceMessage('Voice search is not available in this browser. Type your search instead.');
      return;
    }

    const recognition = new Recognition();
    recognition.lang = navigator.language || 'en-US';
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.onstart = () => {
      setListening(true);
      setVoiceMessage('Listening… say a search or a Nexa command.');
    };
    recognition.onend = () => setListening(false);
    recognition.onerror = (event) => {
      setListening(false);
      setVoiceMessage(event.error === 'not-allowed'
        ? 'Microphone access was blocked. Allow it in your browser settings, or type your search.'
        : 'We couldn’t hear that. Try again or type your search.');
    };
    recognition.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map((result) => result[0]?.transcript ?? '')
        .join(' ')
        .trim();
      if (transcript) {
        setQuery(transcript);
        setVoiceMessage('Search text captured. Review it, then press Search.');
      }
    };

    recognitionRef.current = recognition;
    setVoiceMessage('Connecting to your microphone…');
    try {
      recognition.start();
    } catch {
      setListening(false);
      setVoiceMessage('Could not start voice search. Check microphone access or type your search.');
    }
  };

  return (
    <main className="mx-auto w-full max-w-6xl space-y-8 px-4 py-6 sm:px-6 lg:px-8 lg:py-10">
      <header className="relative isolate overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-br from-white/[0.09] via-white/[0.04] to-transparent px-6 py-8 sm:px-10 sm:py-11">
        <div className="pointer-events-none absolute -right-16 -top-28 -z-10 h-80 w-80 rounded-full bg-cyan-400/[0.1] blur-3xl" />
        <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/20 px-3 py-1.5 text-xs font-medium text-cyan-200">
          <Sparkles size={14} /> Nexa Search
        </div>
        <h1 className="max-w-2xl text-3xl font-semibold tracking-tight text-white sm:text-4xl">
          What can I help you find?
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-400 sm:text-base">
          Search the web with your words or voice, or ask Nexa to open a tool, set a timer, or do a quick calculation.
        </p>
      </header>

      <section className="mx-auto max-w-4xl">
        <form onSubmit={submitSearch} className="rounded-[1.75rem] border border-white/10 bg-[#111216] p-3 shadow-2xl shadow-black/20 sm:p-4">
          <label htmlFor="nexa-search" className="sr-only">Search the web or enter a Nexa command</label>
          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="relative min-w-0 flex-1">
              <SearchIcon size={19} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
              <input
                id="nexa-search"
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search the web or try ‘open calculator’"
                className="h-14 w-full rounded-2xl border border-white/[0.07] bg-white/[0.035] pl-12 pr-4 text-base text-white outline-none transition placeholder:text-zinc-600 focus:border-cyan-200/40 focus:bg-white/[0.05]"
                autoComplete="off"
              />
            </div>
            <button
              type="button"
              onClick={startVoiceSearch}
              aria-label={listening ? 'Stop voice search' : 'Start voice search'}
              aria-pressed={listening}
              className={`inline-flex h-14 items-center justify-center gap-2 rounded-2xl border px-5 text-sm font-medium transition sm:min-w-36 ${listening ? 'border-rose-300/30 bg-rose-300/10 text-rose-200' : 'border-white/10 bg-white/[0.05] text-zinc-200 hover:bg-white/[0.09]'}`}
            >
              {listening ? <MicOff size={17} /> : <Mic size={17} />}
              {listening ? 'Stop listening' : 'Voice search'}
            </button>
            <button
              type="submit"
              disabled={!query.trim()}
              className="inline-flex h-14 items-center justify-center gap-2 rounded-2xl bg-cyan-200 px-6 text-sm font-semibold text-slate-950 transition hover:bg-cyan-100 disabled:cursor-not-allowed disabled:opacity-40 sm:min-w-36"
            >
              <SearchIcon size={17} /> Search
            </button>
          </div>
          <div className="flex min-h-8 flex-wrap items-center justify-between gap-2 px-2 pt-2">
            <p aria-live="polite" className="text-xs text-zinc-500">{voiceMessage || 'Web searches open in a new tab. Nexa commands run here.'}</p>
            {query && <button type="button" onClick={() => { setQuery(''); setVoiceMessage(''); }} className="text-xs text-zinc-500 transition hover:text-white">Clear</button>}
          </div>
        </form>

        <div className="mt-6">
          <p className="mb-3 text-xs font-medium uppercase tracking-[0.15em] text-zinc-500">Try a quick task</p>
          <div className="flex flex-wrap gap-2">
            {quickPrompts.map(({ label, icon: Icon }) => (
              <button
                key={label}
                type="button"
                onClick={() => { setQuery(label); setVoiceMessage('Press Search to run this Nexa task.'); }}
                className="inline-flex items-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.025] px-3.5 py-2.5 text-xs text-zinc-300 transition hover:border-white/[0.16] hover:bg-white/[0.06] hover:text-white"
              >
                <Icon size={14} className="text-cyan-200" /> {label} <ArrowRight size={13} className="text-zinc-600" />
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-white/[0.08] bg-white/[0.025] p-5 sm:p-6">
          <div className="mb-3 flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-300/10 text-cyan-200"><Globe2 size={19} /></span>
            <div><h2 className="text-sm font-semibold text-white">Search the web</h2><p className="mt-1 text-xs text-zinc-500">Google results in a new tab</p></div>
          </div>
          <p className="text-sm leading-6 text-zinc-400">Type any question or phrase, or use the microphone and review the recognized words before searching.</p>
          <a href="https://www.google.com" target="_blank" rel="noreferrer" className="mt-4 inline-flex items-center gap-2 text-xs font-medium text-zinc-300 transition hover:text-white">Google Search <ArrowUpRight size={14} /></a>
        </div>
        <div className="rounded-2xl border border-white/[0.08] bg-white/[0.025] p-5 sm:p-6">
          <div className="mb-3 flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-300/10 text-violet-200"><Command size={19} /></span>
            <div><h2 className="text-sm font-semibold text-white">Ask Nexa to do a task</h2><p className="mt-1 text-xs text-zinc-500">Voice or text commands</p></div>
          </div>
          <p className="text-sm leading-6 text-zinc-400">Try “open notes”, “set timer for 5 minutes”, or “calculate 120 / 8”. Matching commands open the right utility.</p>
        </div>
      </section>
    </main>
  );
}
