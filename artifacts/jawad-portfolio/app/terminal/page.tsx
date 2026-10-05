'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import type { FormEvent, KeyboardEvent } from 'react';
import { SiteChrome, SiteFooter } from '../components/SiteChrome';

type Entry = { command: string; result: string };
const commandMap: Record<string, string | (() => string)> = {
  help: 'Available commands:\n  help                 Show this guide\n  ls [path]            List the project workspace\n  pwd                  Print the current directory\n  whoami               Show the current user\n  projects             List public project repositories\n  cat about.txt        Read a short introduction\n  pokemon              Open the 2D Pokémon field adventure\n  trex                 Open the Chrome T-Rex runner\n  date                 Show the local date\n  clear                Clear this terminal\n\nThis is a safe simulation. Arbitrary shell commands are not executed.',
  ls: 'ai-interview/   SDXL/   insightpilot-RAG/   RAG/   about.txt',
  'ls ./projects': 'ai-interview/   SDXL/   insightpilot-RAG/   RAG/',
  pwd: '/home/jawad',
  whoami: 'jawad',
  projects: 'ai-interview — AI interview project\nSDXL — local image generation tooling\ninsightpilot-RAG — local document-grounded RAG\nRAG — full-stack retrieval-augmented generation prototype',
  'cat about.txt': 'Software developer. Interested in useful tools, local AI, and turning experiments into working software.',
  pokemon: 'Pokémon field adventure selected. Move with the arrow keys or on-screen controls, then throw a Poké Ball when you meet Sproutling.',
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
  const [game, setGame] = useState<'adventure' | 'runner'>('adventure');
  const [position, setPosition] = useState({ x: 15, y: 57 });
  const [encountered, setEncountered] = useState(false);
  const [caught, setCaught] = useState(false);
  const [message, setMessage] = useState('');
  const [runnerState, setRunnerState] = useState<'ready' | 'playing' | 'over'>('ready');
  const [score, setScore] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const runnerRef = useRef({ y: 0, velocity: 0, obstacle: 0, score: 0, playing: false });

  function submitCommand(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const command = input.trim().replace(/\s+/g, ' ');
    if (!command) return;
    if (command === 'clear') { setEntries([]); setInput(''); return; }
    if (command === 'pokemon' || command === 'trex') {
      setGame(command === 'pokemon' ? 'adventure' : 'runner');
      requestAnimationFrame(() => document.getElementById('browser-games')?.scrollIntoView({ behavior: 'smooth' }));
    }
    const result = commandMap[command] ?? (command.startsWith('ls ') ? commandMap.ls : `Command not found: ${command}\nType "help" to see the available commands.`);
    setEntries(current => [...current, { command, result: typeof result === 'function' ? result() : result }]);
    setHistory(current => [...current, command]);
    setHistoryIndex(-1);
    setInput('');
  }
  const catchPokemon = useCallback(() => {
    if (!encountered || caught) return;
    setCaught(true);
    setMessage('Sproutling caught! It is now in your Pokédex.');
  }, [encountered, caught]);
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
  const movePlayer = useCallback((direction: string) => {
    setPosition(current => {
      const step = 5;
      const next = {
        x: Math.max(2, Math.min(90, current.x + (direction === 'right' ? step : direction === 'left' ? -step : 0))),
        y: Math.max(13, Math.min(73, current.y + (direction === 'down' ? step : direction === 'up' ? -step : 0))),
      };
      if (next.x > 65 && next.x < 84 && next.y < 55 && !encountered && !caught) {
        setEncountered(true);
        setMessage('A wild Sproutling appeared! Throw a Poké Ball to catch it.');
      }
      return next;
    });
  }, [encountered, caught]);
  useEffect(() => {
    if (game !== 'adventure') return;
    const keyHandler = (event: globalThis.KeyboardEvent) => {
      if (event.target instanceof HTMLElement && event.target.closest('input, textarea, button')) return;
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.key)) {
        event.preventDefault();
        movePlayer(({ ArrowUp: 'up', ArrowDown: 'down', ArrowLeft: 'left', ArrowRight: 'right' } as Record<string, string>)[event.key]);
      }
      if (event.key === 'Enter' && encountered && !caught) {
        event.preventDefault();
        catchPokemon();
      }
    };
    window.addEventListener('keydown', keyHandler);
    return () => window.removeEventListener('keydown', keyHandler);
  }, [game, movePlayer, encountered, caught, catchPokemon]);

  const startRunner = useCallback(() => {
    runnerRef.current = { y: 0, velocity: 0, obstacle: 260, score: 0, playing: true };
    setScore(0);
    setRunnerState('playing');
  }, []);
  useEffect(() => {
    if (game !== 'runner') return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;
    let frame = 0;
    let lastTime = 0;
    let scoreMark = 0;
    const render = (time: number) => {
      const dt = Math.min((time - (lastTime || time)) / 16.67, 2);
      lastTime = time;
      const state = runnerRef.current;
      const w = canvas.width, h = canvas.height, ground = h * .73;
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = '#e4eccd'; ctx.fillRect(0, 0, w, h);
      ctx.fillStyle = '#aec58e'; ctx.fillRect(0, ground, w, h - ground);
      ctx.strokeStyle = '#48664b'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(0, ground); ctx.lineTo(w, ground); ctx.stroke();
      ctx.fillStyle = '#839773';
      for (let i = 0; i < 14; i++) {
        const x = (i * 87 - (state.score * 2 % 87) + w) % w;
        ctx.fillRect(x, ground - 10 - (i % 3) * 9, 2, 2);
      }
      if (state.playing) {
        state.score += dt * .32;
        state.obstacle -= dt * (4.5 + Math.min(state.score / 180, 3));
        if (state.obstacle < -24) state.obstacle = w + 45 + Math.random() * 100;
        state.velocity += .56 * dt; state.y = Math.min(0, state.y + state.velocity * dt);
        if (state.y === 0) state.velocity = 0;
        const cactusX = state.obstacle;
        if (cactusX < 72 && cactusX > 31 && state.y > -27) {
          state.playing = false; setRunnerState('over');
        }
        if (Math.floor(state.score / 5) > scoreMark) { scoreMark = Math.floor(state.score / 5); setScore(Math.floor(state.score)); }
      }
      const px = 54, py = ground - 31 + state.y;
      ctx.fillStyle = '#314b39'; ctx.fillRect(px + 2, py + 10, 23, 18);
      ctx.fillRect(px + 16, py + 2, 16, 14); ctx.fillRect(px + 27, py + 8, 10, 4);
      ctx.fillStyle = '#e4eccd'; ctx.fillRect(px + 27, py + 5, 3, 3);
      ctx.fillStyle = '#314b39'; ctx.fillRect(px + 6, py + 27, 6, 5); ctx.fillRect(px + 21, py + 27, 6, 5);
      ctx.fillRect(state.obstacle, ground - 29, 13, 29); ctx.fillRect(state.obstacle - 5, ground - 21, 8, 5); ctx.fillRect(state.obstacle + 10, ground - 17, 8, 5);
      ctx.fillStyle = '#496a4e'; ctx.font = '12px monospace'; ctx.fillText(String(Math.floor(state.score)).padStart(5, '0'), w - 82, 24);
      frame = requestAnimationFrame(render);
    };
    frame = requestAnimationFrame(render);
    return () => cancelAnimationFrame(frame);
  }, [game, runnerState]);
  useEffect(() => {
    if (game !== 'runner' || runnerState !== 'playing') return;
    const jump = (event: globalThis.KeyboardEvent) => {
      if (event.target instanceof HTMLElement && event.target.closest('input, textarea, button')) return;
      if (event.code === 'Space' || event.key === 'ArrowUp') {
        event.preventDefault();
        if (runnerRef.current.y === 0) runnerRef.current.velocity = -9.2;
      }
    };
    window.addEventListener('keydown', jump);
    return () => window.removeEventListener('keydown', jump);
  }, [game, runnerState]);

  return <div className="site-shell"><SiteChrome active="terminal" /><main id="main">
    <div className="page-intro"><div className="eyebrow">Interactive workspace / 02</div><h1>The terminal<br />is yours.</h1><p>A browser-native playground. Safe commands up top; two tiny games down below. Nothing here touches a real shell.</p></div>
    <section className="terminal-page" aria-label="Safe command line">
      <div className="terminal-window">
        <div className="window-bar"><span>jawad@workspace: ~</span><span>bash — simulated / read-only</span></div>
        <div className="window-content">
          <div className="terminal-output" onClick={() => inputRef.current?.focus()} role="region" aria-label="Terminal output">
            <div className="output-entry">Jawad’s safe workspace. Type <span className="cmd">help</span> to see available commands.</div>
            {entries.map((entry, index) => <div className="output-entry" key={`${entry.command}-${index}`}><span className="cmd">$ {entry.command}</span>{'\n'}{entry.result}</div>)}
            <form className="terminal-input-row" onSubmit={submitCommand}><label className="prompt" htmlFor="terminal-command">jawad@workspace:~$</label><input ref={inputRef} id="terminal-command" className="terminal-input" value={input} onChange={event => setInput(event.target.value)} onKeyDown={onInputKey} autoComplete="off" spellCheck={false} aria-label="Enter a safe terminal command" /></form>
          </div>
          <aside className="terminal-side"><h3>Command index</h3><span className="command-chip">help</span><span className="command-chip">ls</span><span className="command-chip">pwd</span><span className="command-chip">whoami</span><span className="command-chip">projects</span><span className="command-chip">pokemon</span><span className="command-chip">trex</span><span className="command-chip">cat about.txt</span><span className="command-chip">date</span><span className="command-chip">clear</span><br/>Commands are simulated. No arbitrary execution.</aside>
        </div>
      </div>
    </section>
    <section className="games-section" id="browser-games" aria-label="Browser games">
      <div className="games-title"><div><div className="eyebrow">After-hours experiments</div><h2>Pick a little world.</h2></div><p>Keyboard or touch. No downloads, no scoreboards.</p></div>
      <div className="game-switcher" role="group" aria-label="Choose a game">
        <button type="button" className="game-tab" aria-pressed={game === 'adventure'} onClick={() => setGame('adventure')}>2D Pokémon adventure</button>
        <button type="button" className="game-tab" aria-pressed={game === 'runner'} onClick={() => setGame('runner')}>Chrome T-Rex runner</button>
      </div>
      <div className="game-board">
        {game === 'adventure' ? <div className="game-board-inner">
          <div className="pokemon-scene" aria-label="Top-down pixel adventure">
            <div className="scene-label">MEADOW ROUTE &nbsp; / &nbsp; POKÉMON FIELD QUEST</div><div className="game-hud">POKÉDEX: {caught ? '01' : '00'} / 01</div>
            <div className="grass-patch" />
            {!caught && <><div className="pokemon-name">WILD · SPROUTLING</div><div className="poke-creature" role="img" aria-label="Wild Pokémon, Sproutling" /></>}
            <div className="game-player" style={{ left: `${position.x}%`, top: `${position.y}%` }} aria-label="Your character"><div className="player-head" /><div className="player-body" /></div>
            {message && <div className="game-message" role="status" aria-live="polite">{message}</div>}
            <div className="game-controls">MOVE WITH ARROWS · THROW A POKÉ BALL TO CATCH</div>
          </div>
          <div className="touch-controls" aria-label="Adventure movement controls">
            <button type="button" className="small-button" onClick={() => movePlayer('left')} aria-label="Move left">←</button><button type="button" className="small-button" onClick={() => movePlayer('up')} aria-label="Move up">↑</button><button type="button" className="small-button" onClick={() => movePlayer('down')} aria-label="Move down">↓</button><button type="button" className="small-button" onClick={() => movePlayer('right')} aria-label="Move right">→</button>
          </div>
          <button type="button" className="capture-button" disabled={!encountered || caught} onClick={catchPokemon}>{caught ? 'Pokémon caught' : encountered ? 'Throw Poké Ball' : 'Approach Pokémon'}</button>
        </div> : <div className="game-board-inner">
          <canvas ref={canvasRef} className="trex-canvas" width={960} height={355} aria-label={`Chrome T-Rex runner 2D game, score ${score}`} />
          {runnerState !== 'playing' && <div className="game-overlay"><h3>{runnerState === 'ready' ? 'Chrome T-Rex run.' : 'Run complete.'}</h3><p>{runnerState === 'ready' ? 'SPACE / UP or tap Jump to clear the cacti.' : `Score ${score} · take another lap?`}</p><button type="button" onClick={startRunner}>{runnerState === 'ready' ? 'Start T-Rex run' : 'Run again'}</button></div>}
          {runnerState === 'playing' && <button type="button" className="jump-button" onClick={() => { if (runnerRef.current.y === 0) runnerRef.current.velocity = -9.2; }}>Jump</button>}
        </div>}
      </div>
    </section>
  </main><SiteFooter /></div>;
}
