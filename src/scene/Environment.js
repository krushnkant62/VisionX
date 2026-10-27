import * as THREE from 'three';

export class StudioEnvironment {
  constructor(scene) {
    this.scene = scene;
    this.group = new THREE.Group();
    this.group.name = 'Studio_Environment';
    this.scene.add(this.group);

    this.buildPlatform();
    this.buildGroundShadow();
  }

  buildPlatform() {
    // 1. High-Tech Circular Engineering Pedestal Platform
    const platformGeom = new THREE.CylinderGeometry(2.4, 2.5, 0.04, 64);
    const platformMat = new THREE.MeshStandardMaterial({
      color: 0x0f131a,
      roughness: 0.7,
      metalness: 0.3
    });
    const platform = new THREE.Mesh(platformGeom, platformMat);
    platform.position.y = -0.02;
    platform.receiveShadow = true;
    this.group.add(platform);

    // 2. Glowing Concentric Technical Rings
    [0.9, 1.5, 2.1, 2.45].forEach((radius, idx) => {
      const ringGeom = new THREE.RingGeometry(radius, radius + 0.012, 64);
      ringGeom.rotateX(-Math.PI / 2);
      const ringMat = new THREE.MeshBasicMaterial({
        color: idx === 3 ? 0x00e5ff : 0x005577,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: idx === 3 ? 0.75 : 0.35
      });
      const ring = new THREE.Mesh(ringGeom, ringMat);
      ring.position.y = 0.002;
      this.group.add(ring);
    });

    // 3. Technical Angle Ticks & Measurement Markers around platform
    const numTicks = 36;
    for (let i = 0; i < numTicks; i++) {
      const angle = (i / numTicks) * Math.PI * 2;
      const isMajor = i % 9 === 0;
      const tickLength = isMajor ? 0.12 : 0.05;
      const rInner = 2.30 - tickLength;
      const rOuter = 2.30;

      const p1 = new THREE.Vector3(Math.cos(angle) * rInner, 0.003, Math.sin(angle) * rInner);
      const p2 = new THREE.Vector3(Math.cos(angle) * rOuter, 0.003, Math.sin(angle) * rOuter);

      const geom = new THREE.BufferGeometry().setFromPoints([p1, p2]);
      const mat = new THREE.LineBasicMaterial({
        color: isMajor ? 0x00e5ff : 0x004466,
        transparent: true,
        opacity: isMajor ? 0.8 : 0.4
      });
      const line = new THREE.Line(geom, mat);
      this.group.add(line);
    }

    // 4. Subtle Outer Infinite Floor Grid
    const grid = new THREE.GridHelper(16, 32, 0x005577, 0x111e2e);
    grid.position.y = -0.022;
    this.group.add(grid);
  }

  buildGroundShadow() {
    // High-quality fake contact shadow disk directly under wheels
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');

    const grad = ctx.createRadialGradient(256, 256, 10, 256, 256, 250);
    grad.addColorStop(0, 'rgba(0, 0, 0, 0.85)');
    grad.addColorStop(0.35, 'rgba(0, 0, 0, 0.55)');
    grad.addColorStop(0.7, 'rgba(0, 0, 0, 0.15)');
    grad.addColorStop(1, 'rgba(0, 0, 0, 0.0)');

    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 512, 512);

    const texture = new THREE.CanvasTexture(canvas);
    const shadowGeom = new THREE.PlaneGeometry(1.6, 1.6);
    shadowGeom.rotateX(-Math.PI / 2);
    const shadowMat = new THREE.MeshBasicMaterial({
      map: texture,
      transparent: true,
      depthWrite: false
    });
    const shadowPlane = new THREE.Mesh(shadowGeom, shadowMat);
    shadowPlane.position.y = 0.004;
    this.group.add(shadowPlane);
  }

  setVisible(visible) {
    this.group.visible = visible;
  }
}
