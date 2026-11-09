export type ProcessorOrbit = Readonly<{ x: number; y: number }>;
export const DEFAULT_PROCESSOR_ORBIT: ProcessorOrbit;
export function rotateProcessorOrbit(current: ProcessorOrbit, horizontal: number, vertical: number): ProcessorOrbit;
export function getProcessorTargetAngles(orbit: ProcessorOrbit, pointerX: number, pointerY: number, reducedMotion: boolean): ProcessorOrbit;
