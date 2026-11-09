import { Scene, PerspectiveCamera, WebGLRenderer, Group, Mesh, Material, MeshStandardMaterial, MeshPhysicalMaterial, BoxGeometry, CylinderGeometry, PlaneGeometry, TorusGeometry, CanvasTexture, SRGBColorSpace, InstancedMesh, Object3D, HemisphereLight, DirectionalLight, PointLight, Timer, ACESFilmicToneMapping, PMREMGenerator, ShadowMaterial, PCFShadowMap, DoubleSide } from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

export type ProcessorScene = { setExpanded(value: boolean): void; setExploded(value: boolean): void; setPointer(x: number, y: number): void; rotateBy(x: number, y: number): void; setFocus(index: number): void; resetView(): void; dispose(): void };

export function mountProcessor(host: HTMLElement, onLost: () => void): ProcessorScene {
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('webgl2', { alpha: true, antialias: true, powerPreference: 'low-power' });
  if (!context) throw new Error('WebGL is unavailable');
  const renderer = new WebGLRenderer({ canvas, context, alpha: true, antialias: true, powerPreference: 'low-power' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.6));
  renderer.outputColorSpace = SRGBColorSpace;
  renderer.toneMapping = ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = PCFShadowMap;
  renderer.setClearColor(0x000000, 0);
  canvas.setAttribute('aria-hidden', 'true');
  host.appendChild(canvas);
  const scene = new Scene();
  const camera = new PerspectiveCamera(48, 1, .1, 100);
  camera.position.set(4.5, 5.1, 6.2); camera.lookAt(0, .05, 0);
  const processor = new Group(); scene.add(processor);
  const resources: { dispose(): void }[] = [];
  const own = <T extends { dispose(): void }>(resource: T): T => { resources.push(resource); return resource; };
  const studio = new RoomEnvironment();
  const environmentGenerator = new PMREMGenerator(renderer);
  const environment = own(environmentGenerator.fromScene(studio, .04));
  scene.environment = environment.texture; scene.environmentIntensity = .8;
  studio.dispose(); environmentGenerator.dispose();
  const pcb = own(new MeshPhysicalMaterial({ color: 0x17463a, metalness: .12, roughness: .55, clearcoat: .25, clearcoatRoughness: .34 }));
  const ceramic = own(new MeshStandardMaterial({ color: 0x111923, metalness: .06, roughness: .68 }));
  const gold = own(new MeshPhysicalMaterial({ color: 0xc8a462, metalness: .82, roughness: .24, clearcoat: .15 }));
  const copper = own(new MeshStandardMaterial({ color: 0x987149, metalness: .72, roughness: .32 }));
  const metal = own(new MeshPhysicalMaterial({ color: 0xb7c2c8, metalness: .94, roughness: .24, clearcoat: .18, clearcoatRoughness: .26, anisotropy: .68, anisotropyRotation: Math.PI / 2 }));
  const silicon = own(new MeshPhysicalMaterial({ color: 0x748596, metalness: .035, roughness: .31, clearcoat: .62, clearcoatRoughness: .17, iridescence: .16, iridescenceIOR: 1.4, iridescenceThicknessRange: [110, 210], emissive: 0x092535, emissiveIntensity: 0 }));
  const ioSilicon = own(new MeshPhysicalMaterial({ color: 0x9aabb2, metalness: .035, roughness: .38, clearcoat: .42, clearcoatRoughness: .2, emissive: 0x092535, emissiveIntensity: 0 }));
  const roundedBox = (x: number, y: number, z: number, material: Material, px = 0, py = 0, pz = 0, radius = .025, parent: Group = processor) => {
    const bevel = Math.max(.001, Math.min(radius, x * .48, y * .48, z * .48));
    const mesh = new Mesh(own(new RoundedBoxGeometry(x, y, z, 3, bevel)), material); mesh.position.set(px, py, pz); mesh.castShadow = true; mesh.receiveShadow = true; parent.add(mesh); return mesh;
  };
  const resin = own(new MeshStandardMaterial({ color: 0x30352d, metalness: .1, roughness: .8 }));
  const interposer = own(new MeshStandardMaterial({ color: 0x17232d, metalness: .08, roughness: .4 }));
  const capacitorMaterial = own(new MeshPhysicalMaterial({ color: 0x232b31, metalness: .12, roughness: .38, clearcoat: .42, clearcoatRoughness: .22 }));
  roundedBox(3.64, .1, 3.64, resin, 0, -.22, 0, .075);
  roundedBox(3.68, .035, 3.68, pcb, 0, -.15, 0, .065);
  roundedBox(3.62, .022, 3.62, ceramic, 0, -.097, 0, .055);
  roundedBox(3.56, .02, 3.56, pcb, 0, -.078, 0, .05);
  roundedBox(2.78, .055, 2.78, ceramic, 0, -.03, 0, .045);

  // Copper routes and plated vias add a fine board-level scale without hundreds of draw calls.
  const traceGeometry = own(new BoxGeometry(1, .003, .014));
  const traces = new InstancedMesh(traceGeometry, copper, 96);
  const viaGeometry = own(new CylinderGeometry(.023, .023, .006, 12));
  const vias = new InstancedMesh(viaGeometry, gold, 48);
  const detail = new Object3D(); let traceIndex = 0, viaIndex = 0;
  for (let side = 0; side < 4; side++) for (let index = 0; index < 12; index++) {
    const along = -1.22 + index * .222;
    const horizontal = side < 2;
    const sign = side % 2 === 0 ? -1 : 1;
    detail.position.set(horizontal ? along : sign * 1.04, -.001, horizontal ? sign * 1.04 : along);
    detail.rotation.set(0, horizontal ? 0 : Math.PI / 2, 0); detail.scale.set(.24, 1, 1); detail.updateMatrix(); traces.setMatrixAt(traceIndex++, detail.matrix);
    detail.position.set(horizontal ? along : sign * .9, -.001, horizontal ? sign * .9 : along);
    detail.rotation.set(0, horizontal ? Math.PI / 2 : 0, 0); detail.scale.set(.14, 1, 1); detail.updateMatrix(); traces.setMatrixAt(traceIndex++, detail.matrix);
    detail.position.set(horizontal ? along : sign * 1.18, -.001, horizontal ? sign * 1.18 : along); detail.rotation.set(0, 0, 0); detail.scale.set(1, 1, 1); detail.updateMatrix(); vias.setMatrixAt(viaIndex++, detail.matrix);
  }
  traces.instanceMatrix.needsUpdate = true; vias.instanceMatrix.needsUpdate = true;
  processor.add(traces, vias);

  // A chiplet-style silicon package sits on a dark interposer below the heat spreader.
  roundedBox(1.78, .018, 1.96, interposer, 0, -.003, 0, .035);
  const dieCanvas = document.createElement('canvas'); dieCanvas.width = 512; dieCanvas.height = 512;
  const dieLabel = dieCanvas.getContext('2d')!;
  const dieGradient = dieLabel.createLinearGradient(0, 0, 512, 512); dieGradient.addColorStop(0, '#182630'); dieGradient.addColorStop(.48, '#0d171e'); dieGradient.addColorStop(1, '#19242b');
  dieLabel.fillStyle = dieGradient; dieLabel.fillRect(0, 0, 512, 512);
  for (let row = 0; row < 17; row++) for (let column = 0; column < 17; column++) {
    const x = 12 + column * 29, y = 12 + row * 29, tint = 46 + ((row * 17 + column * 29) % 28), inset = 4 + ((row + column * 3) % 4);
    dieLabel.strokeStyle = `rgba(${tint + 24},${tint + 45},${tint + 57},.45)`; dieLabel.lineWidth = .8;
    dieLabel.strokeRect(x, y, 20, 20); dieLabel.beginPath(); dieLabel.moveTo(x + 3, y + 10); dieLabel.lineTo(x + 9, y + 10); dieLabel.lineTo(x + 12, y + inset); dieLabel.lineTo(x + 17, y + inset); dieLabel.stroke();
    if ((row * 7 + column * 11) % 5 === 0) { dieLabel.fillStyle = 'rgba(112,174,185,.5)'; dieLabel.fillRect(x + 15, y + 15, 2, 2); }
  }
  dieLabel.strokeStyle = 'rgba(82,157,170,.46)'; dieLabel.lineWidth = 1.2;
  for (let i = 0; i < 11; i++) { const y = 22 + i * 45; dieLabel.beginPath(); dieLabel.moveTo(0, y); dieLabel.lineTo(40 + (i % 3) * 9, y); dieLabel.lineTo(62 + i * 3, y + 24); dieLabel.lineTo(420, y + 24); dieLabel.stroke(); }
  dieLabel.fillStyle = 'rgba(180,205,213,.72)'; dieLabel.font = '600 17px monospace'; dieLabel.fillText('JK / COMPUTE', 18, 490);
  const dieTexture = own(new CanvasTexture(dieCanvas)); dieTexture.colorSpace = SRGBColorSpace;
  silicon.map = dieTexture; ioSilicon.map = dieTexture; silicon.needsUpdate = true; ioSilicon.needsUpdate = true;
  const computeSurface = own(new MeshPhysicalMaterial({ map: dieTexture, color: 0xe0e8eb, metalness: .04, roughness: .34, clearcoat: .55, clearcoatRoughness: .18, emissive: 0x072434, emissiveIntensity: 0 }));
  const ioSurface = own(new MeshPhysicalMaterial({ map: dieTexture, color: 0xc5d3d7, metalness: .04, roughness: .4, clearcoat: .38, emissive: 0x072434, emissiveIntensity: 0 }));
  const chipletGroups: Group[] = [];
  for (const [x, z] of [[-.38, -.38], [.38, -.38], [-.38, .38], [.38, .38]]) {
    const chiplet = new Group(); chiplet.position.set(x, 0, z); processor.add(chiplet); chipletGroups.push(chiplet);
    roundedBox(.54, .042, .62, silicon, 0, .027, 0, .022, chiplet);
    const surface = new Mesh(own(new PlaneGeometry(.5, .58)), computeSurface); surface.rotation.x = -Math.PI / 2; surface.position.set(0, .049, 0); surface.receiveShadow = true; chiplet.add(surface);
  }
  roundedBox(.24, .04, 1.52, interposer, 0, .026, 0, .018);
  const ioFace = new Mesh(own(new PlaneGeometry(.21, 1.48)), ioSurface); ioFace.rotation.x = -Math.PI / 2; ioFace.position.set(0, .048, 0); processor.add(ioFace);
  // Fine substrate bond fingers make the chiplet edges read as a real package.
  const dummy = new Object3D();
  const bondPads = new InstancedMesh(own(new BoxGeometry(.034, .008, .014)), gold, 80); let bondIndex = 0;
  for (let edge = 0; edge < 4; edge++) for (let index = 0; index < 20; index++) {
    const along = -.76 + index * 1.52 / 19;
    dummy.position.set(edge < 2 ? along : (edge === 2 ? -.85 : .85), .011, edge < 2 ? (edge === 0 ? -.85 : .85) : along);
    dummy.rotation.y = edge < 2 ? 0 : Math.PI / 2; dummy.updateMatrix(); bondPads.setMatrixAt(bondIndex++, dummy.matrix);
  }
  bondPads.instanceMatrix.needsUpdate = true;
  processor.add(bondPads);
  const contacts = new InstancedMesh(own(new CylinderGeometry(.045, .045, .012, 8)), gold, 256);
  for (let row = 0; row < 16; row++) for (let column = 0; column < 16; column++) {
    dummy.position.set(-1.57 + row * 3.14 / 15, -.278, -1.57 + column * 3.14 / 15);
    dummy.updateMatrix(); contacts.setMatrixAt(row * 16 + column, dummy.matrix);
  }
  contacts.instanceMatrix.needsUpdate = true;
  processor.add(contacts);
  const components = new InstancedMesh(own(new RoundedBoxGeometry(.105, .035, .065, 1, .009)), capacitorMaterial, 48);
  const solder = new InstancedMesh(own(new BoxGeometry(.02, .036, .067)), metal, 96);
  for (let side = 0; side < 4; side++) for (let index = 0; index < 12; index++) {
    const position = -1.38 + index * 2.76 / 11;
    dummy.position.set(side < 2 ? position : side === 2 ? -1.62 : 1.62, -.046, side < 2 ? side === 0 ? -1.62 : 1.62 : position);
    dummy.rotation.y = side < 2 ? 0 : Math.PI / 2; dummy.updateMatrix(); components.setMatrixAt(side * 12 + index, dummy.matrix);
    for (const [terminal, direction] of [-1, 1].entries()) {
      const capPosition = dummy.position.clone(); const offset = direction * .046;
      if (side < 2) dummy.position.x += offset; else dummy.position.z += offset;
      dummy.updateMatrix(); solder.setMatrixAt((side * 12 + index) * 2 + terminal, dummy.matrix); dummy.position.copy(capPosition);
    }
  }
  components.instanceMatrix.needsUpdate = true; solder.instanceMatrix.needsUpdate = true;
  processor.add(components, solder);
  const lid = new Group(); processor.add(lid);
  const textureCanvas = document.createElement('canvas'); textureCanvas.width = 1024; textureCanvas.height = 1024;
  const label = textureCanvas.getContext('2d')!;
  const brushed = label.createLinearGradient(0, 0, 0, 1024); brushed.addColorStop(0, '#e0e3e2'); brushed.addColorStop(.45, '#b8c0c2'); brushed.addColorStop(.52, '#d6dad9'); brushed.addColorStop(1, '#aeb8bb');
  label.fillStyle = brushed; label.fillRect(0, 0, 1024, 1024);
  for (let i = 0; i < 1024; i++) { const shade = 206 + (i * 17 % 24); label.fillStyle = `rgba(${shade},${shade + 3},${shade + 4},.13)`; label.fillRect(0, i, 1024, 1); }
  label.strokeStyle = 'rgba(255,255,255,.22)'; label.lineWidth = 1;
  for (let i = 0; i < 52; i++) { const y = i * 21; label.beginPath(); label.moveTo(0, y); label.lineTo(1024, y + 9); label.stroke(); }
  label.fillStyle = 'rgba(43,55,59,.12)'; label.fillRect(122, 191, 2, 502);
  label.fillStyle = '#344044'; label.textAlign = 'left'; label.font = '600 104px monospace'; label.fillText('JK', 175, 335);
  label.font = '600 38px monospace'; label.fillText('CREATIVE CORE 04', 175, 420); label.font = '24px monospace'; label.fillText('AI / SOFTWARE / SYSTEMS', 175, 477); label.font = '19px monospace'; label.fillText('JK-PORTFOLIO-2026', 175, 590);
  label.font = '17px monospace'; label.fillText('FOUR PROJECTS. ONE WORKBENCH.', 175, 640);
  label.fillStyle = 'rgba(49,62,66,.66)'; label.font = '15px monospace'; label.fillText('TDP  |  095 W', 175, 700); label.fillText('DESIGNED IN BEIRUT', 175, 731);
  label.strokeStyle = 'rgba(52,75,81,.28)'; label.lineWidth = 2; label.strokeRect(152, 258, 700, 511);
  for (let row = 0; row < 19; row++) for (let column = 0; column < 19; column++) if ((row * 13 + column * 7 + row * column) % 5 < 3) label.fillRect(730 + row * 6, 560 + column * 6, 5, 5);
  const texture = own(new CanvasTexture(textureCanvas)); texture.colorSpace = SRGBColorSpace;
  const brushedCanvas = document.createElement('canvas'); brushedCanvas.width = 512; brushedCanvas.height = 512;
  const brushedContext = brushedCanvas.getContext('2d')!; brushedContext.fillStyle = '#b5b5b5'; brushedContext.fillRect(0, 0, 512, 512);
  for (let i = 0; i < 512; i++) { const shade = 100 + ((i * 37) % 90); brushedContext.fillStyle = `rgb(${shade},${shade},${shade})`; brushedContext.fillRect(0, i, 512, 1); }
  const brushedTexture = own(new CanvasTexture(brushedCanvas));
  const top = own(new MeshPhysicalMaterial({ map: texture, roughnessMap: brushedTexture, bumpMap: brushedTexture, bumpScale: .003, metalness: .86, roughness: .34, anisotropy: .72, anisotropyRotation: Math.PI / 2, clearcoat: .12, clearcoatRoughness: .3 }));
  const cap = new Mesh(own(new RoundedBoxGeometry(2.85, .17, 2.85, 3, .055)), metal); cap.castShadow = true; cap.receiveShadow = true; lid.add(cap);
  const lettering = new Mesh(own(new PlaneGeometry(2.72, 2.72)), top); lettering.rotation.x = -Math.PI / 2; lettering.position.y = .087; lettering.receiveShadow = true; lid.add(lettering);
  const lip = new Mesh(own(new RoundedBoxGeometry(3.02, .055, 3.02, 2, .025)), metal); lip.position.y = -.073; lip.castShadow = true; lid.add(lip);
  const underside = own(new MeshPhysicalMaterial({ color: 0x252b2d, metalness: .36, roughness: .48, clearcoat: .12 }));
  const gasket = own(new MeshStandardMaterial({ color: 0x131a1d, metalness: .06, roughness: .82 }));
  roundedBox(2.08, .025, 2.24, gasket, 0, -.1, 0, .045, lid);
  roundedBox(1.66, .018, 1.86, underside, 0, -.119, 0, .035, lid);
  const thermalPad = own(new MeshStandardMaterial({ color: 0x667577, metalness: .18, roughness: .62 }));
  roundedBox(1.52, .008, 1.72, thermalPad, 0, -.132, 0, .025, lid);
  const seal = new Mesh(own(new TorusGeometry(.86, .012, 6, 48)), gold); seal.rotation.x = Math.PI / 2; seal.position.y = -.13; lid.add(seal);
  lid.position.y = .17;
  const alignment = new Mesh(own(new CylinderGeometry(.09, .09, .003, 3)), gold); alignment.position.set(-1.66, -.064, 1.66); alignment.rotation.y = Math.PI / 4; processor.add(alignment);
  const plinth = own(new MeshPhysicalMaterial({ color: 0x101719, metalness: .62, roughness: .3, clearcoat: .42, clearcoatRoughness: .22 }));
  const plinthBody = new Mesh(own(new CylinderGeometry(2.72, 2.68, .09, 96, 1, false)), plinth); plinthBody.position.y = -.335; plinthBody.castShadow = true; plinthBody.receiveShadow = true; scene.add(plinthBody);
  const trim = own(new MeshPhysicalMaterial({ color: 0x7fa797, metalness: .82, roughness: .25, emissive: 0x0b281d, emissiveIntensity: .2 }));
  const plinthTrim = new Mesh(own(new TorusGeometry(2.7, .012, 8, 128)), trim); plinthTrim.rotation.x = Math.PI / 2; plinthTrim.position.y = -.285; scene.add(plinthTrim);
  const shadow = new Mesh(own(new PlaneGeometry(14, 14)), own(new ShadowMaterial({ color: 0x000000, opacity: .34, side: DoubleSide }))); shadow.rotation.x = -Math.PI / 2; shadow.position.y = -.395; shadow.receiveShadow = true; scene.add(shadow);
  scene.add(new HemisphereLight(0xf1f7ff, 0x2b3437, 1.4));
  const key = new DirectionalLight(0xfff7ea, 2.8); key.position.set(3, 7, 4); key.castShadow = true; key.shadow.mapSize.set(1024, 1024); key.shadow.camera.left = -5; key.shadow.camera.right = 5; key.shadow.camera.top = 5; key.shadow.camera.bottom = -5; key.shadow.normalBias = .025; own(key.shadow); scene.add(key);
  const rim = new DirectionalLight(0x9bddd1, 1.4); rim.position.set(-5, 2, -3); scene.add(rim);
  const coreLight = new PointLight(0xa3d8ee, .4, 4); coreLight.position.set(0, .8, 0); scene.add(coreLight);
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const timer = new Timer(); timer.connect(document);
  let expanded = false, exploded = false, focusedChiplet = -1, pointerX = 0, pointerY = 0, progress = 0, explosionProgress = 0, angleX = .07, angleY = -.18;
  let frame = 0, visible = true, disposed = false, lost = false;
  function schedule() { if (!frame && !disposed && !lost && visible && !document.hidden) frame = requestAnimationFrame(render); }
  function render(timestamp: number) {
    frame = 0; if (disposed || lost || !visible || document.hidden) return;
    timer.update(timestamp); const delta = Math.min(timer.getDelta(), .05); const ease = motion.matches ? 1 : 1 - Math.exp(-Math.max(delta, 1 / 120) * 9);
    const target = expanded ? 1 : 0, targetX = .07 + (motion.matches ? 0 : pointerY * .12), targetY = -.18 + (motion.matches ? 0 : pointerX * .22);
    progress += (target - progress) * ease; angleX += (targetX - angleX) * ease; angleY += (targetY - angleY) * ease;
    const explosionTarget = exploded ? 1 : 0; explosionProgress += (explosionTarget - explosionProgress) * ease;
    for (const [index, chiplet] of chipletGroups.entries()) {
      const directionX = index % 2 === 0 ? -1 : 1, directionZ = index < 2 ? -1 : 1;
      chiplet.position.set(directionX * (.38 + explosionProgress * .34), explosionProgress * (.28 + index * .025), directionZ * (.38 + explosionProgress * .34));
      const emphasis = focusedChiplet < 0 ? 1 : focusedChiplet === index ? 1.08 : .92;
      chiplet.scale.setScalar(emphasis);
    }
    processor.rotation.set(angleX, angleY, 0); processor.scale.setScalar(1 - progress * .14);
    lid.position.y = .17 + progress * 1.15; lid.rotation.z = progress * -.12; lid.position.x = progress * -.18;
    const glow = progress * progress;
    silicon.emissiveIntensity = .025 + glow * .11; ioSilicon.emissiveIntensity = .02 + glow * .07;
    computeSurface.emissiveIntensity = glow * .18; ioSurface.emissiveIntensity = glow * .12;
    coreLight.intensity = .16 + glow * .72; renderer.render(scene, camera);
    if (Math.abs(target - progress) > .001 || Math.abs(explosionTarget - explosionProgress) > .001 || Math.abs(targetX - angleX) > .001 || Math.abs(targetY - angleY) > .001) schedule();
  }
  const resize = new ResizeObserver(() => { const rect = host.getBoundingClientRect(); if (!rect.width || !rect.height) return; renderer.setSize(rect.width, rect.height, false); camera.aspect = rect.width / rect.height; camera.updateProjectionMatrix(); schedule(); }); resize.observe(host);
  const intersection = new IntersectionObserver(entries => { visible = entries[0].isIntersecting; if (visible) schedule(); else { cancelAnimationFrame(frame); frame = 0; } }); intersection.observe(host);
  const changed = () => schedule(); motion.addEventListener('change', changed); document.addEventListener('visibilitychange', changed);
  const contextLost = () => { lost = true; cancelAnimationFrame(frame); frame = 0; onLost(); }; canvas.addEventListener('webglcontextlost', contextLost);
  schedule();
  return {
    setExpanded(value) { expanded = value; schedule(); },
    setExploded(value) { exploded = value; schedule(); },
    setPointer(x, y) { pointerX = x; pointerY = y; schedule(); },
    rotateBy(x, y) { angleX = Math.max(-.42, Math.min(.42, angleX + y)); angleY += x; schedule(); },
    setFocus(index) { focusedChiplet = index; schedule(); },
    resetView() { exploded = false; expanded = false; focusedChiplet = -1; pointerX = 0; pointerY = 0; angleX = .07; angleY = -.18; schedule(); },
    dispose() { disposed = true; cancelAnimationFrame(frame); resize.disconnect(); intersection.disconnect(); motion.removeEventListener('change', changed); document.removeEventListener('visibilitychange', changed); canvas.removeEventListener('webglcontextlost', contextLost); timer.dispose(); resources.forEach(resource => resource.dispose()); renderer.dispose(); renderer.forceContextLoss(); canvas.remove(); },
  };
}
