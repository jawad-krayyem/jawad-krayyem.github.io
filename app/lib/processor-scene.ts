import { Scene, PerspectiveCamera, WebGLRenderer, Group, Mesh, MeshStandardMaterial, MeshPhysicalMaterial, MeshBasicMaterial, BoxGeometry, CylinderGeometry, PlaneGeometry, CanvasTexture, SRGBColorSpace, InstancedMesh, Object3D, HemisphereLight, DirectionalLight, PointLight, GridHelper, Timer, ACESFilmicToneMapping, PMREMGenerator, ShadowMaterial, PCFSoftShadowMap, DoubleSide } from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

export type ProcessorScene = { setExpanded(value: boolean): void; setPointer(x: number, y: number): void; dispose(): void };

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
  renderer.shadowMap.type = PCFSoftShadowMap;
  renderer.setClearColor(0x000000, 0);
  canvas.setAttribute('aria-hidden', 'true');
  host.appendChild(canvas);
  const scene = new Scene();
  const camera = new PerspectiveCamera(38, 1, .1, 100);
  camera.position.set(5.6, 6, 7.2); camera.lookAt(0, .05, 0);
  const processor = new Group(); scene.add(processor);
  const resources: { dispose(): void }[] = [];
  const own = <T extends { dispose(): void }>(resource: T): T => { resources.push(resource); return resource; };
  const studio = new RoomEnvironment();
  const environmentGenerator = new PMREMGenerator(renderer);
  const environment = own(environmentGenerator.fromScene(studio, .04));
  scene.environment = environment.texture; scene.environmentIntensity = .8;
  studio.dispose(); environmentGenerator.dispose();
  const pcb = own(new MeshStandardMaterial({ color: 0x164237, metalness: .08, roughness: .78 }));
  const ceramic = own(new MeshStandardMaterial({ color: 0x111c20, metalness: .3, roughness: .45 }));
  const gold = own(new MeshStandardMaterial({ color: 0xc8a462, metalness: .65, roughness: .27 }));
  const metal = own(new MeshStandardMaterial({ color: 0xaeb7bc, metalness: .95, roughness: .28 }));
  const silicon = own(new MeshPhysicalMaterial({ color: 0x304761, metalness: .7, roughness: .2, clearcoat: 1, clearcoatRoughness: .1, iridescence: .7, iridescenceIOR: 1.4, iridescenceThicknessRange: [100, 260] }));
  const box = (x: number, y: number, z: number, material: MeshStandardMaterial | MeshBasicMaterial, px = 0, py = 0, pz = 0, parent: Group = processor) => {
    const mesh = new Mesh(own(new BoxGeometry(x, y, z)), material); mesh.position.set(px, py, pz); mesh.castShadow = true; mesh.receiveShadow = true; parent.add(mesh); return mesh;
  };
  const resin = own(new MeshStandardMaterial({ color: 0x30352d, metalness: .1, roughness: .8 }));
  box(3.64, .1, 3.64, resin, 0, -.22);
  box(3.68, .035, 3.68, pcb, 0, -.15);
  box(3.62, .022, 3.62, ceramic, 0, -.097);
  box(3.56, .02, 3.56, pcb, 0, -.078);
  box(2.78, .055, 2.78, ceramic, 0, -.03);
  box(1.5, .065, 1.75, silicon, 0, .04);
  const dieLines = own(new MeshStandardMaterial({ color: 0x768c9b, metalness: .8, roughness: .3 }));
  for (let i = -3; i <= 3; i++) { box(.008, .002, 1.65, dieLines, i * .2, .074); box(1.4, .002, .008, dieLines, 0, .074, i * .23); }
  const contacts = new InstancedMesh(own(new CylinderGeometry(.045, .045, .012, 8)), gold, 256);
  const dummy = new Object3D();
  for (let row = 0; row < 16; row++) for (let column = 0; column < 16; column++) {
    dummy.position.set(-1.57 + row * 3.14 / 15, -.278, -1.57 + column * 3.14 / 15);
    dummy.updateMatrix(); contacts.setMatrixAt(row * 16 + column, dummy.matrix);
  }
  processor.add(contacts);
  const capacitorMaterial = own(new MeshStandardMaterial({ color: 0x292c2c, metalness: .1, roughness: .7 }));
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
  processor.add(components, solder);
  const lid = new Group(); processor.add(lid);
  const textureCanvas = document.createElement('canvas'); textureCanvas.width = 1024; textureCanvas.height = 1024;
  const label = textureCanvas.getContext('2d')!;
  label.fillStyle = '#bfc5c6'; label.fillRect(0, 0, 1024, 1024);
  for (let i = 0; i < 1024; i++) { const shade = 186 + (i * 17 % 19); label.fillStyle = `rgba(${shade},${shade + 4},${shade + 5},.25)`; label.fillRect(0, i, 1024, 1); }
  label.fillStyle = '#3c4649'; label.font = '600 104px monospace'; label.textAlign = 'left'; label.fillText('JK', 175, 335);
  label.font = '38px monospace'; label.fillText('CREATIVE CORE 04', 175, 420); label.font = '24px monospace'; label.fillText('AI / SOFTWARE / SYSTEMS', 175, 477); label.font = '19px monospace'; label.fillText('JK-PORTFOLIO-2026', 175, 590);
  label.font = '17px monospace'; label.fillText('FOUR PROJECTS. ONE WORKBENCH.', 175, 640);
  for (let row = 0; row < 19; row++) for (let column = 0; column < 19; column++) if ((row * 13 + column * 7 + row * column) % 5 < 3) label.fillRect(730 + row * 6, 560 + column * 6, 5, 5);
  const texture = own(new CanvasTexture(textureCanvas)); texture.colorSpace = SRGBColorSpace;
  const top = own(new MeshPhysicalMaterial({ map: texture, metalness: .9, roughness: .35, anisotropy: .55, anisotropyRotation: Math.PI / 2, clearcoat: .08 }));
  const cap = new Mesh(own(new RoundedBoxGeometry(2.85, .17, 2.85, 3, .055)), metal); cap.castShadow = true; cap.receiveShadow = true; lid.add(cap);
  const lettering = new Mesh(own(new PlaneGeometry(2.72, 2.72)), top); lettering.rotation.x = -Math.PI / 2; lettering.position.y = .087; lettering.receiveShadow = true; lid.add(lettering);
  const lip = new Mesh(own(new RoundedBoxGeometry(3.02, .055, 3.02, 2, .025)), metal); lip.position.y = -.073; lip.castShadow = true; lid.add(lip);
  const underside = own(new MeshStandardMaterial({ color: 0x5b6466, metalness: .55, roughness: .4 })); box(1.6, .008, 1.8, underside, 0, -.108, 0, lid); lid.position.y = .17;
  const alignment = new Mesh(own(new CylinderGeometry(.09, .09, .003, 3)), gold); alignment.position.set(-1.66, -.064, 1.66); alignment.rotation.y = Math.PI / 4; processor.add(alignment);
  const shadow = new Mesh(own(new PlaneGeometry(14, 14)), own(new ShadowMaterial({ color: 0x000000, opacity: .3, side: DoubleSide }))); shadow.rotation.x = -Math.PI / 2; shadow.position.y = -.56; shadow.receiveShadow = true; scene.add(shadow);
  const grid = new GridHelper(10, 28, 0x2b7560, 0x173f38); grid.position.y = -.58; scene.add(grid);
  own(grid.geometry); const gridMaterials = Array.isArray(grid.material) ? grid.material : [grid.material]; gridMaterials.forEach(material => { material.transparent = true; material.opacity = .14; own(material); });
  scene.add(new HemisphereLight(0xf1f7ff, 0x2b3437, 1.4));
  const key = new DirectionalLight(0xfff7ea, 2.8); key.position.set(3, 7, 4); key.castShadow = true; key.shadow.mapSize.set(1024, 1024); key.shadow.camera.left = -5; key.shadow.camera.right = 5; key.shadow.camera.top = 5; key.shadow.camera.bottom = -5; key.shadow.normalBias = .025; own(key.shadow); scene.add(key);
  const rim = new DirectionalLight(0x9bddd1, 1.4); rim.position.set(-5, 2, -3); scene.add(rim);
  const coreLight = new PointLight(0xa3d8ee, .4, 4); coreLight.position.set(0, .8, 0); scene.add(coreLight);
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const timer = new Timer(); timer.connect(document);
  let expanded = false, pointerX = 0, pointerY = 0, progress = 0, angleX = .07, angleY = -.18;
  let frame = 0, visible = true, disposed = false, lost = false;
  function schedule() { if (!frame && !disposed && !lost && visible && !document.hidden) frame = requestAnimationFrame(render); }
  function render(timestamp: number) {
    frame = 0; if (disposed || lost || !visible || document.hidden) return;
    timer.update(timestamp); const delta = Math.min(timer.getDelta(), .05); const ease = motion.matches ? 1 : 1 - Math.exp(-Math.max(delta, 1 / 120) * 9);
    const target = expanded ? 1 : 0, targetX = .07 + (motion.matches ? 0 : pointerY * .12), targetY = -.18 + (motion.matches ? 0 : pointerX * .22);
    progress += (target - progress) * ease; angleX += (targetX - angleX) * ease; angleY += (targetY - angleY) * ease;
    processor.rotation.set(angleX, angleY, 0); processor.scale.setScalar(1 - progress * .14);
    lid.position.y = .17 + progress * 1.15; lid.rotation.z = progress * -.12; lid.position.x = progress * -.18;
    coreLight.intensity = .4 + progress * .8; renderer.render(scene, camera);
    if (Math.abs(target - progress) > .001 || Math.abs(targetX - angleX) > .001 || Math.abs(targetY - angleY) > .001) schedule();
  }
  const resize = new ResizeObserver(() => { const rect = host.getBoundingClientRect(); if (!rect.width || !rect.height) return; renderer.setSize(rect.width, rect.height, false); camera.aspect = rect.width / rect.height; camera.updateProjectionMatrix(); schedule(); }); resize.observe(host);
  const intersection = new IntersectionObserver(entries => { visible = entries[0].isIntersecting; if (visible) schedule(); else { cancelAnimationFrame(frame); frame = 0; } }); intersection.observe(host);
  const changed = () => schedule(); motion.addEventListener('change', changed); document.addEventListener('visibilitychange', changed);
  const contextLost = () => { lost = true; cancelAnimationFrame(frame); frame = 0; onLost(); }; canvas.addEventListener('webglcontextlost', contextLost);
  schedule();
  return {
    setExpanded(value) { expanded = value; schedule(); },
    setPointer(x, y) { pointerX = x; pointerY = y; schedule(); },
    dispose() { disposed = true; cancelAnimationFrame(frame); resize.disconnect(); intersection.disconnect(); motion.removeEventListener('change', changed); document.removeEventListener('visibilitychange', changed); canvas.removeEventListener('webglcontextlost', contextLost); timer.dispose(); resources.forEach(resource => resource.dispose()); renderer.dispose(); renderer.forceContextLoss(); canvas.remove(); },
  };
}
