'use client';

import { useRef, useState } from 'react';
import type { FormEvent, KeyboardEvent } from 'react';
import { SiteChrome, SiteFooter } from '../components/SiteChrome';
import TrexRunner from '../components/TrexRunner';

type Entry = { command: string; result: string };
const commandMap: Record<string, string | (() => string)> = {
  help: 'Available commands:\n  help                 Show this guide\n  ls [path]            List the project workspace\n  pwd                  Print the current directory\n  whoami               Show the current user\n  projects             List public project repositories\n  cat about.txt        Read a short introduction\n  trex                 Open the Chrome T-Rex runner\n  date                 Show the local date\n  clear                Clear this terminal\n\nThis is a safe simulation. Arbitrary shell commands are not executed.',
  ls: 'ai-interview/   SDXL/   insightpilot-RAG/   RAG/   about.txt',
  'ls ./projects': 'ai-interview/   SDXL/   insightpilot-RAG/   RAG/',
  pwd: '/home/jawad',
  whoami: 'jawad',
  projects: 'ai-interview — AI interview project\nSDXL — local image generation tooling\ninsightpilot-RAG — local document-grounded RAG\nRAG — full-stack retrieval-augmented generation prototype',
  'cat about.txt': 'Software developer. Interested in useful tools, local AI, and turning experiments into working software.',
  trex: 'Chrome T-Rex runner selected. Start a run, then press Space or Up to jump. Touch players can use the Jump button.',
  date: () => new Date().toString(),
};

export default function TerminalPage() {
  const [entries, setEntries] = useState<Entry[]>([{
    command: 'help',
    result: typeof commandMap.help === 'function' ? commandMap.help() : commandMap.help,
  }]);
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  function submitCommand(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const command = input.trim().replace(/\s+/g, ' ');
    if (!command) return;
    if (command === 'clear') { setEntries([]); setInput(''); return; }
    if (command === 'trex') {
      inputRef.current?.blur();
      requestAnimationFrame(() => document.getElementById('browser-games')?.scrollIntoView({ behavior: 'smooth' }));
    }
    const result = commandMap[command] ?? (command.startsWith('ls ') ? commandMap.ls : `Command not found: ${command}\nType "help" to see the available commands.`);
    setEntries(current => [...current, { command, result: typeof result === 'function' ? result() : result }]);
    setHistory(current => [...current, command]);
    setHistoryIndex(-1);
    setInput('');
  }
  function onInputKey(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'ArrowUp') {
      event.preventDefault();
      const next = historyIndex < 0 ? history.length - 1 : Math.max(0, historyIndex - 1);
      setHistoryIndex(next); setInput(history[next] ?? '');
    } else if (event.key === 'ArrowDown') {
      event.preventDefault();
      const next = historyIndex + 1;
      setHistoryIndex(next >= history.length ? -1 : next); setInput(history[next] ?? '');
    }
  }
  return <div className="site-shell"><SiteChrome active="terminal" /><main id="main">
    <div className="page-intro"><div className="eyebrow">Interactive workspace / 02</div><h1>The terminal<br />is yours.</h1><p>A browser-native playground. Safe commands up top; a Chrome T-Rex run below. Nothing here touches a real shell.</p></div>
    <section className="terminal-page" aria-label="Safe command line">
      <div className="terminal-window">
        <div className="window-bar"><span>jawad@workspace: ~</span><span>bash — simulated / read-only</span></div>
        <div className="window-content">
          <div className="terminal-output" onClick={() => inputRef.current?.focus()} role="region" aria-label="Terminal output">
            <div className="output-entry">Jawad’s safe workspace. Type <span className="cmd">help</span> to see available commands.</div>
            {entries.map((entry, index) => <div className="output-entry" key={`${entry.command}-${index}`}><span className="cmd">$ {entry.command}</span>{'\n'}{entry.result}</div>)}
            <form className="terminal-input-row" onSubmit={submitCommand}><label className="prompt" htmlFor="terminal-command">jawad@workspace:~$</label><input ref={inputRef} id="terminal-command" className="terminal-input" value={input} onChange={event => setInput(event.target.value)} onKeyDown={onInputKey} autoComplete="off" spellCheck={false} aria-label="Enter a safe terminal command" /></form>
          </div>
          <aside className="terminal-side"><h3>Command index</h3><span className="command-chip">help</span><span className="command-chip">ls</span><span className="command-chip">pwd</span><span className="command-chip">whoami</span><span className="command-chip">projects</span><span className="command-chip">trex</span><span className="command-chip">cat about.txt</span><span className="command-chip">date</span><span className="command-chip">clear</span><br/>Commands are simulated. No arbitrary execution.</aside>
        </div>
      </div>
    </section>
    <TrexRunner />
  </main><SiteFooter /></div>;
}
