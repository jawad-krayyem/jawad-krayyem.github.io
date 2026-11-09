import assert from 'node:assert/strict';
import { DEFAULT_PROCESSOR_ORBIT, getProcessorTargetAngles, rotateProcessorOrbit } from '../app/lib/processor-orbit.mjs';

const afterKeyboardInput = rotateProcessorOrbit(DEFAULT_PROCESSOR_ORBIT, 0.2, 0.12);
const settled = getProcessorTargetAngles(afterKeyboardInput, 0, 0, false);
assert.ok(Math.abs(settled.x - 0.19) < 1e-9, 'vertical input remains in the settled pitch');
assert.ok(Math.abs(settled.y - 0.02) < 1e-9, 'horizontal input remains in the settled yaw');

const pointerParallax = getProcessorTargetAngles(afterKeyboardInput, 0.5, -0.5, false);
const pointerReturned = getProcessorTargetAngles(afterKeyboardInput, 0, 0, false);
assert.notDeepEqual(pointerParallax, pointerReturned, 'pointer parallax is temporary');
assert.deepEqual(pointerReturned, settled, 'returning the pointer preserves the user orbit');

const reducedMotion = getProcessorTargetAngles(afterKeyboardInput, 1, 1, true);
assert.deepEqual(reducedMotion, settled, 'reduced motion suppresses pointer parallax');
assert.deepEqual(rotateProcessorOrbit(DEFAULT_PROCESSOR_ORBIT, 0, 0), DEFAULT_PROCESSOR_ORBIT, 'reset begins at the default orbit');
console.log('PASS processor orbit offsets persist independently of pointer parallax');
