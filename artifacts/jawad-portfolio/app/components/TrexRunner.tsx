'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

export default function TrexRunner() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const runnerRef = useRef({ y: 0, velocity: 0, obstacle: 0, score: 0, playing: false });
  const [runnerState, setRunnerState] = useState<'ready' | 'playing' | 'over'>('ready');
  const [score, setScore] = useState(0);

  const startRunner = useCallback(() => {
    runnerRef.current = { y: 0, velocity: 0, obstacle: 260, score: 0, playing: true };
    setScore(0);
    setRunnerState('playing');
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');
    if (!canvas || !context) return;

    let frame = 0;
    let lastTime = 0;
    let scoreMark = 0;

    const render = (time: number) => {
      const dt = Math.min((time - (lastTime || time)) / 16.67, 2);
      lastTime = time;
      const state = runnerRef.current;
      const width = canvas.width;
      const height = canvas.height;
      const ground = height * 0.73;

      context.clearRect(0, 0, width, height);
      context.fillStyle = '#e4eccd';
      context.fillRect(0, 0, width, height);
      context.fillStyle = '#aec58e';
      context.fillRect(0, ground, width, height - ground);
      context.strokeStyle = '#48664b';
      context.lineWidth = 2;
      context.beginPath();
      context.moveTo(0, ground);
      context.lineTo(width, ground);
      context.stroke();

      context.fillStyle = '#839773';
      for (let index = 0; index < 14; index += 1) {
        const x = (index * 87 - (state.score * 2 % 87) + width) % width;
        context.fillRect(x, ground - 10 - (index % 3) * 9, 2, 2);
      }

      if (state.playing) {
        state.score += dt * 0.32;
        state.obstacle -= dt * (4.5 + Math.min(state.score / 180, 3));
        if (state.obstacle < -24) state.obstacle = width + 45 + Math.random() * 100;
        state.velocity += 0.56 * dt;
        state.y = Math.min(0, state.y + state.velocity * dt);
        if (state.y === 0) state.velocity = 0;
        if (state.obstacle < 72 && state.obstacle > 31 && state.y > -27) {
          state.playing = false;
          setRunnerState('over');
        }
        if (Math.floor(state.score / 5) > scoreMark) {
          scoreMark = Math.floor(state.score / 5);
          setScore(Math.floor(state.score));
        }
      }

      const playerX = 54;
      const playerY = ground - 31 + state.y;
      context.fillStyle = '#314b39';
      context.fillRect(playerX + 2, playerY + 10, 23, 18);
      context.fillRect(playerX + 16, playerY + 2, 16, 14);
      context.fillRect(playerX + 27, playerY + 8, 10, 4);
      context.fillStyle = '#e4eccd';
      context.fillRect(playerX + 27, playerY + 5, 3, 3);
      context.fillStyle = '#314b39';
      context.fillRect(playerX + 6, playerY + 27, 6, 5);
      context.fillRect(playerX + 21, playerY + 27, 6, 5);
      context.fillRect(state.obstacle, ground - 29, 13, 29);
      context.fillRect(state.obstacle - 5, ground - 21, 8, 5);
      context.fillRect(state.obstacle + 10, ground - 17, 8, 5);
      context.fillStyle = '#496a4e';
      context.font = '12px monospace';
      context.fillText(String(Math.floor(state.score)).padStart(5, '0'), width - 82, 24);

      frame = requestAnimationFrame(render);
    };

    frame = requestAnimationFrame(render);
    return () => cancelAnimationFrame(frame);
  }, [runnerState]);

  useEffect(() => {
    if (runnerState !== 'playing') return;
    const jump = (event: globalThis.KeyboardEvent) => {
      if (event.target instanceof HTMLElement && event.target.closest('input, textarea, button')) return;
      if (event.code === 'Space' || event.key === 'ArrowUp') {
        event.preventDefault();
        if (runnerRef.current.y === 0) runnerRef.current.velocity = -9.2;
      }
    };
    window.addEventListener('keydown', jump);
    return () => window.removeEventListener('keydown', jump);
  }, [runnerState]);

  return <section className="games-section" id="browser-games" aria-label="Chrome T-Rex runner">
    <div className="games-title">
      <div><div className="eyebrow">After-hours experiment / 01</div><h2>Chrome T-Rex runner.</h2></div>
      <p>Press Space or Up to jump. Tap Jump on touchscreens.</p>
    </div>
    <div className="game-board">
      <div className="game-board-inner">
        <canvas ref={canvasRef} className="trex-canvas" width={960} height={355} aria-label={`Chrome T-Rex runner, score ${score}`} />
        {runnerState !== 'playing' && <div className="game-overlay">
          <h3>{runnerState === 'ready' ? 'A small run.' : 'Run complete.'}</h3>
          <p>{runnerState === 'ready' ? 'Jump over the cacti and see how far you get.' : `Score ${score} · take another lap?`}</p>
          <button type="button" onClick={startRunner}>{runnerState === 'ready' ? 'Start T-Rex run' : 'Run again'}</button>
        </div>}
        {runnerState === 'playing' && <button
          type="button"
          className="jump-button"
          onClick={() => { if (runnerRef.current.y === 0) runnerRef.current.velocity = -9.2; }}
        >Jump</button>}
      </div>
    </div>
  </section>;
}
