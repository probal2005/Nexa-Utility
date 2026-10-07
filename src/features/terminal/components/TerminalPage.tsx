'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Activity,
  ArrowUpRight,
  CircleHelp,
  CornerDownLeft,
  ShieldCheck,
  Terminal as TerminalIcon,
} from 'lucide-react';

import { AVAILABLE_TOOLS } from '@/config/tools';
import { executeCommand } from '@/features/command-center/lib/executor';
import { parseCommand } from '@/features/command-center/lib/parser';

type TerminalEntry = {
  id: number;
  command: string;
  output: string[];
};

const HELP_LINES = [
  'NEXA TASKS',
  '  open <tool>             Open a Nexa utility',
  '  calc <expression>       Open Calculator with an expression',
  '  timer <duration>        Start a timer, e.g. timer 5 minutes',
  '  search <query>          Search Google in a new tab',
  '',
  'SHELL BASICS',
  '  help                    Show this help',
  '  tools  (or ls / dir)    List available Nexa utilities',
  '  date / time             Show the current date or time',
  '  echo <text>             Print text',
  '  history                 Show commands from this session',
  '  clear  (or cls)         Clear the terminal',
  '',
  'This terminal runs Nexa tasks in the app. It does not run system commands.',
];

const EXAMPLES = ['help', 'tools', 'open calculator', 'timer 5 minutes', 'search cyber security'];

export function TerminalPage() {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const [command, setCommand] = useState('');
  const [entries, setEntries] = useState<TerminalEntry[]>([]);
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [entries]);

  const appendEntry = (rawCommand: string, output: string[]) => {
    setEntries((current) => [
      ...current,
      { id: Date.now() + current.length, command: rawCommand, output },
    ]);
  };

  const runCommand = (rawCommand: string) => {
    const input = rawCommand.trim();
    if (!input) return;

    setHistory((current) => [...current, input]);
    setHistoryIndex(-1);
    setCommand('');

    const [verb, ...rest] = input.split(/\s+/);
    const argument = rest.join(' ');
    const normalizedVerb = verb.toLowerCase();

    if (['clear', 'cls'].includes(normalizedVerb)) {
      setEntries([]);
      return;
    }

    if (normalizedVerb === 'help' || normalizedVerb === '?') {
      appendEntry(input, HELP_LINES);
      return;
    }

    if (['tools', 'ls', 'dir'].includes(normalizedVerb)) {
      appendEntry(input, AVAILABLE_TOOLS.map((tool) => `${tool.name.padEnd(20)} ${tool.href}`));
      return;
    }

    if (normalizedVerb === 'pwd') {
      appendEntry(input, ['/home/nexa']);
      return;
    }

    if (normalizedVerb === 'whoami') {
      appendEntry(input, ['nexa']);
      return;
    }

    if (normalizedVerb === 'date') {
      appendEntry(input, [new Date().toLocaleDateString(undefined, { dateStyle: 'full' })]);
      return;
    }

    if (normalizedVerb === 'time') {
      appendEntry(input, [new Date().toLocaleTimeString(undefined, { timeStyle: 'medium' })]);
      return;
    }

    if (normalizedVerb === 'echo') {
      appendEntry(input, [argument]);
      return;
    }

    if (normalizedVerb === 'history') {
      appendEntry(input, history.length ? history.map((item, index) => `${String(index + 1).padStart(3)}  ${item}`) : ['No commands in this session yet.']);
      return;
    }

    const searchMatch = input.match(/^(?:search|web)\s+(.+)$/i);
    if (searchMatch) {
      const query = searchMatch[1].trim();
      const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
      window.open(searchUrl, '_blank', 'noopener,noreferrer');
      appendEntry(input, [`Opened Google results for: ${query}`]);
      return;
    }

    const parsed = parseCommand(input);
    if (parsed.action !== 'search-tool' && parsed.action !== 'unknown') {
      if (executeCommand(parsed, router)) {
        appendEntry(input, ['Running Nexa task…']);
        return;
      }
    }

    appendEntry(input, [
      `Command not found: ${input}`,
      'Type "help" to see the commands this terminal supports.',
    ]);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    runCommand(command);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'ArrowUp') {
      event.preventDefault();
      const nextIndex = Math.min(historyIndex + 1, history.length - 1);
      if (nextIndex >= 0) {
        setHistoryIndex(nextIndex);
        setCommand(history[history.length - 1 - nextIndex]);
      }
    }

    if (event.key === 'ArrowDown' && historyIndex >= 0) {
      event.preventDefault();
      const nextIndex = historyIndex - 1;
      setHistoryIndex(nextIndex);
      setCommand(nextIndex < 0 ? '' : history[history.length - 1 - nextIndex]);
    }
  };

  return (
    <main className="relative mx-auto w-full max-w-7xl overflow-hidden px-4 py-7 sm:px-6 lg:px-8 lg:py-10">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 opacity-70"
        style={{
          backgroundImage: 'radial-gradient(ellipse at 50% 0%, rgba(16,185,129,0.13), transparent 55%), linear-gradient(rgba(16,185,129,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(16,185,129,0.035) 1px, transparent 1px)',
          backgroundSize: 'auto, 32px 32px, 32px 32px',
        }}
      />

      <header className="mb-7 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="mb-4 inline-flex items-center gap-2 font-mono text-xs font-semibold uppercase tracking-[0.22em] text-emerald-300">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg border border-emerald-300/20 bg-emerald-300/[0.08] shadow-[0_0_20px_rgba(52,211,153,0.12)]">
              <TerminalIcon size={15} />
            </span>
            Nexa <span className="text-emerald-300/40">/</span> Command node
          </div>
          <h1 className="font-mono text-3xl font-bold uppercase tracking-tight text-white sm:text-4xl">
            Terminal <span className="text-emerald-300">access</span>
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-400">
            A command workspace for launching Nexa tools and running quick tasks. Enter <code className="rounded border border-emerald-300/20 bg-emerald-300/[0.08] px-1.5 py-0.5 font-mono text-emerald-200">help</code> to see available commands.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 font-mono text-[10px] uppercase tracking-[0.15em]">
          <span className="inline-flex items-center gap-2 rounded-lg border border-emerald-300/20 bg-emerald-300/[0.07] px-3 py-2 text-emerald-200">
            <Activity size={13} className="animate-pulse" /> Session active
          </span>
          <span className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-zinc-400">
            <ShieldCheck size={13} className="text-emerald-300" /> App sandbox
          </span>
        </div>
      </header>

      <section aria-label="Nexa command terminal" className="relative overflow-hidden rounded-2xl border border-emerald-400/25 bg-[#030805] shadow-[0_0_60px_rgba(16,185,129,0.08)] ring-1 ring-black">
        <div className="pointer-events-none absolute inset-0 z-10 opacity-[0.14]" style={{ backgroundImage: 'linear-gradient(transparent 50%, rgba(16,185,129,0.08) 50%)', backgroundSize: '100% 4px' }} />
        <div className="relative z-20 flex flex-wrap items-center justify-between gap-3 border-b border-emerald-300/15 bg-[#07110b] px-4 py-3 sm:px-5">
          <div className="flex items-center gap-3">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-emerald-300/20 bg-emerald-300/[0.08] text-emerald-300"><TerminalIcon size={16} /></span>
            <div>
              <p className="font-mono text-xs font-semibold tracking-wide text-emerald-100">NEXA-TERM <span className="text-emerald-300/50">v1.0.0</span></p>
              <p className="mt-0.5 font-mono text-[9px] uppercase tracking-[0.18em] text-zinc-600">local session / command interface</p>
            </div>
          </div>
          <div className="flex items-center gap-4 font-mono text-[10px] uppercase tracking-wider text-zinc-500">
            <span className="hidden sm:inline">{AVAILABLE_TOOLS.length} tools indexed</span>
            <span className="flex items-center gap-1.5 text-emerald-300"><span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-300 shadow-[0_0_8px_rgba(52,211,153,0.9)]" /> Ready</span>
          </div>
        </div>

        <div className="relative z-20 flex h-[min(58vh,560px)] min-h-80 flex-col overflow-y-auto px-4 py-5 font-mono text-[13px] leading-6 sm:px-6 sm:py-6">
          <div className="mb-6 border-l border-emerald-300/30 pl-4 text-zinc-500">
            <p className="text-emerald-300">┌─ NEXA UTILITY SHELL <span className="text-emerald-300/50">[session ready]</span></p>
            <p>│ Environment: <span className="text-zinc-300">Nexa app sandbox</span></p>
            <p>│ Type <span className="text-amber-200">help</span> for available commands.</p>
            <p className="text-emerald-300/50">└─</p>
          </div>

          {entries.map((entry) => (
            <div key={entry.id} className="mb-5">
              <p className="break-all text-emerald-200"><span className="mr-2 text-emerald-500">nexa@utility:~$</span>{entry.command}</p>
              <div className="mt-1 whitespace-pre-wrap break-words pl-1 text-zinc-300">
                {entry.output.map((line, index) => <p key={`${entry.id}-${index}`} className={line.startsWith('Command not found:') ? 'text-rose-300' : line.startsWith('Running Nexa') || line.startsWith('Opened Google') ? 'text-emerald-300' : ''}>{line || '\u00a0'}</p>)}
              </div>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>

        <form onSubmit={handleSubmit} className="relative z-20 border-t border-emerald-300/20 bg-[#07110b] px-4 py-4 sm:px-5">
          <div className="flex items-center gap-3 rounded-xl border border-emerald-300/15 bg-black/40 px-3 py-2.5 transition focus-within:border-emerald-300/45 focus-within:shadow-[0_0_24px_rgba(16,185,129,0.1)]">
            <span className="shrink-0 select-none font-mono text-xs font-semibold text-emerald-300">nexa@utility:~$</span>
            <label htmlFor="terminal-command" className="sr-only">Enter a terminal command</label>
            <input
              ref={inputRef}
              id="terminal-command"
              value={command}
              onChange={(event) => setCommand(event.target.value)}
              onKeyDown={handleKeyDown}
              autoComplete="off"
              spellCheck={false}
              placeholder="enter command..."
              className="min-w-0 flex-1 bg-transparent font-mono text-sm text-emerald-100 outline-none placeholder:text-emerald-900"
            />
            <button type="submit" disabled={!command.trim()} aria-label="Run command" className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-300 text-[#031007] shadow-[0_0_16px_rgba(52,211,153,0.18)] transition hover:bg-emerald-200 disabled:cursor-not-allowed disabled:opacity-30">
              <CornerDownLeft size={16} />
            </button>
          </div>
          <div className="mt-3 flex flex-wrap items-center justify-between gap-2 px-1 font-mono text-[9px] uppercase tracking-wider text-zinc-600">
            <span>↑ ↓ command history <span className="px-1 text-zinc-800">•</span> enter to execute</span>
            <button type="button" onClick={() => setEntries([])} className="text-emerald-500/70 transition hover:text-emerald-300">[ clear output ]</button>
          </div>
        </form>
      </section>

      <section aria-label="Example commands" className="flex flex-col gap-3 pt-1 sm:flex-row sm:items-center">
        <p className="shrink-0 font-mono text-[10px] uppercase tracking-[0.16em] text-zinc-600">Quick commands <span className="text-emerald-500">{"//"}</span></p>
        <div className="flex flex-wrap gap-2">
          {EXAMPLES.map((example) => (
            <button key={example} type="button" onClick={() => { setCommand(example); inputRef.current?.focus(); }} className="rounded-md border border-emerald-300/10 bg-emerald-300/[0.025] px-2.5 py-1.5 font-mono text-[10px] text-emerald-100/70 transition hover:border-emerald-300/30 hover:bg-emerald-300/[0.08] hover:text-emerald-100">
              {example}
            </button>
          ))}
          <button type="button" onClick={() => runCommand('help')} className="inline-flex items-center gap-1 rounded-md border border-white/[0.08] px-2.5 py-1.5 font-mono text-[10px] text-zinc-500 transition hover:border-white/20 hover:text-white">
            <CircleHelp size={12} /> guide
          </button>
        </div>
      </section>

      <div className="flex flex-col gap-3 rounded-xl border border-emerald-300/10 bg-[#06100a]/80 p-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
        <p className="font-mono text-[10px] leading-5 text-zinc-500"><span className="mr-2 text-emerald-500">[SAFE MODE]</span>This terminal runs supported Nexa tasks inside the app; it does not execute operating system commands.</p>
        <a href="/search" className="inline-flex shrink-0 items-center gap-2 font-mono text-[10px] uppercase tracking-wider text-emerald-300 transition hover:text-emerald-100">Web Search <ArrowUpRight size={13} /></a>
      </div>
    </main>
  );
}
