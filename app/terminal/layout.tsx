import type { Metadata } from 'next';
import type { ReactNode } from 'react';
export const metadata: Metadata = { title: 'Terminal lab — Jawad Krayyem', description: 'A safe simulated terminal and browser runner game.', alternates: { canonical: '/terminal/' } };
export default function TerminalLayout({ children }: { children: ReactNode }) { return children; }
