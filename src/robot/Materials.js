import * as THREE from 'three';

export class RobotMaterials {
  constructor() {
    this.mode = 'realistic'; // realistic, clay, wireframe, xray
    this.initTextures();
    this.initMaterials();
  }

  initTextures() {
    // Generate dynamic chest display canvas texture
    this.chestCanvas = document.createElement('canvas');
    this.chestCanvas.width = 1024;
    this.chestCanvas.height = 512;
    this.chestCtx = this.chestCanvas.getContext('2d');
    this.chestTexture = new THREE.CanvasTexture(this.chestCanvas);
    this.chestTexture.colorSpace = THREE.SRGBColorSpace;
    this.updateChestDisplay('ONLINE', 98, 'AUTONOMOUS');

    // Generate dynamic face screen canvas texture (emissive eye animations)
    this.faceCanvas = document.createElement('canvas');
    this.faceCanvas.width = 1024;
    this.faceCanvas.height = 512;
    this.faceCtx = this.faceCanvas.getContext('2d');
    this.faceTexture = new THREE.CanvasTexture(this.faceCanvas);
    this.faceTexture.colorSpace = THREE.SRGBColorSpace;
    this.eyeExpression = 'neutral'; // neutral, blink, happy, scan, curious
    this.updateFaceDisplay(0, 0, 1.0);
  }

  updateChestDisplay(status = 'ONLINE', battery = 98, mode = 'AUTONOMOUS', subtext = '') {
    const ctx = this.chestCtx;
    const w = this.chestCanvas.width;
    const h = this.chestCanvas.height;

    // Deep gloss black background with subtle gradient
    const bgGrad = ctx.createRadialGradient(w / 2, h / 2, 20, w / 2, h / 2, w / 1.5);
    bgGrad.addColorStop(0, '#0a1626');
    bgGrad.addColorStop(0.5, '#040810');
    bgGrad.addColorStop(1, '#020306');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, w, h);

    // Subtle technical grid / scanlines
    ctx.strokeStyle = 'rgba(0, 229, 255, 0.05)';
    ctx.lineWidth = 1;
    for (let y = 0; y < h; y += 16) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }

    // Glowing cyan horizontal horizon flare behind logo
    const flareGrad = ctx.createLinearGradient(0, h / 2, w, h / 2);
    flareGrad.addColorStop(0, 'rgba(0, 229, 255, 0)');
    flareGrad.addColorStop(0.5, 'rgba(0, 229, 255, 0.28)');
    flareGrad.addColorStop(1, 'rgba(0, 229, 255, 0)');
    ctx.fillStyle = flareGrad;
    ctx.fillRect(80, h / 2 - 40, w - 160, 80);

    // Glowing "VISIONX" Logo typography
    ctx.save();
    ctx.shadowColor = '#00e5ff';
    ctx.shadowBlur = 32;
    ctx.fillStyle = '#ffffff';
    ctx.font = '900 88px "Rajdhani", "Outfit", "Segoe UI", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.letterSpacing = '8px';
    ctx.fillText('VISIONX', w / 2, h / 2 - 15);

    // Overdrawn cyan glow pass
    ctx.shadowBlur = 12;
    ctx.fillStyle = '#bdf4ff';
    ctx.fillText('VISIONX', w / 2, h / 2 - 15);
    ctx.restore();

    // Top status telemetry bar
    ctx.font = '600 24px "JetBrains Mono", monospace';
    ctx.fillStyle = 'rgba(0, 229, 255, 0.75)';
    ctx.textAlign = 'left';
    ctx.fillText(`SYS: ${status}`, 90, 70);

    ctx.textAlign = 'right';
    ctx.fillText(`PWR: ${battery}%`, w - 90, 70);

    // Bottom telemetry mode info
    ctx.textAlign = 'center';
    ctx.font = '500 22px "Rajdhani", sans-serif';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.letterSpacing = '3px';
    ctx.fillText(subtext || `[ CORE OS 4.2 • ${mode} ]`, w / 2, h - 75);

    // Small lower bezel brand label inside display
    ctx.font = '700 16px "JetBrains Mono", monospace';
    ctx.fillStyle = 'rgba(0, 229, 255, 0.5)';
    ctx.fillText('VISIONX CORE HUD', w / 2, h - 35);

    this.chestTexture.needsUpdate = true;
  }

  updateFaceDisplay(lookX = 0, lookY = 0, eyeScaleY = 1.0, isScanning = false) {
    const ctx = this.faceCtx;
    const w = this.faceCanvas.width;
    const h = this.faceCanvas.height;

    // Pitch black glossy screen background
    ctx.fillStyle = '#030508';
    ctx.fillRect(0, 0, w, h);

    // Eye centers
    const eyeSpacing = 190;
    const centerY = h / 2 + 10;
    const leftEyeX = w / 2 - eyeSpacing + lookX * 40;
    const rightEyeX = w / 2 + eyeSpacing + lookX * 40;
    const eyeY = centerY + lookY * 30;

    const eyeRadius = 64;

    const drawEye = (x, y) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.scale(1.0, Math.max(0.05, eyeScaleY));

      if (isScanning) {
        // Scanning laser line / reticle
        ctx.shadowColor = '#00e5ff';
        ctx.shadowBlur = 24;
        ctx.strokeStyle = '#00f0ff';
        ctx.lineWidth = 12;
        ctx.beginPath();
        ctx.arc(0, 0, eyeRadius, 0, Math.PI * 2);
        ctx.stroke();

        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 6;
        ctx.beginPath();
        ctx.arc(0, 0, eyeRadius * 0.5, 0, Math.PI * 2);
        ctx.stroke();
      } else {
        // Circular luminous glowing cyan eyes matching reference
        // Multi-tier cyan glow
        const glow = ctx.createRadialGradient(0, 0, 5, 0, 0, eyeRadius * 1.5);
        glow.addColorStop(0, 'rgba(255, 255, 255, 1.0)');
        glow.addColorStop(0.25, 'rgba(128, 240, 255, 0.95)');
        glow.addColorStop(0.6, 'rgba(0, 210, 255, 0.8)');
        glow.addColorStop(0.9, 'rgba(0, 150, 255, 0.25)');
        glow.addColorStop(1, 'rgba(0, 100, 255, 0)');

        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(0, 0, eyeRadius * 1.35, 0, Math.PI * 2);
        ctx.fill();

        // Solid inner luminous core
        ctx.shadowColor = '#00e5ff';
        ctx.shadowBlur = 30;
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(0, 0, eyeRadius * 0.72, 0, Math.PI * 2);
        ctx.fill();

        // Soft digital iris ring
        ctx.strokeStyle = 'rgba(0, 240, 255, 0.9)';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.arc(0, 0, eyeRadius * 0.95, 0, Math.PI * 2);
        ctx.stroke();
      }

      ctx.restore();
    };

    drawEye(leftEyeX, eyeY);
    drawEye(rightEyeX, eyeY);

    this.faceTexture.needsUpdate = true;
  }

  initMaterials() {
    // 1. Sleek pearl-white automotive-grade armor
    this.armorWhite = new THREE.MeshPhysicalMaterial({
      color: 0xf4f7fa,
      roughness: 0.24,
      metalness: 0.08,
      clearcoat: 0.65,
      clearcoatRoughness: 0.15,
      reflectivity: 0.85
    });

    // 2. High-strength dark graphite structural chassis & joints
    this.chassisDark = new THREE.MeshStandardMaterial({
      color: 0x1a1e24,
      roughness: 0.46,
      metalness: 0.82
    });

    // 3. Satin metallic grey for mechanical pivot pins, hinges, and fasteners
    this.jointMetal = new THREE.MeshStandardMaterial({
      color: 0x363e48,
      roughness: 0.32,
      metalness: 0.88
    });

    // 4. Polished chrome/steel details
    this.chrome = new THREE.MeshStandardMaterial({
      color: 0xe6ecf2,
      roughness: 0.12,
      metalness: 0.95
    });

    // 5. Glossy dark screen glass faceplate
    this.faceScreen = new THREE.MeshStandardMaterial({
      map: this.faceTexture,
      roughness: 0.08,
      metalness: 0.1,
      emissive: 0xffffff,
      emissiveMap: this.faceTexture,
      emissiveIntensity: 1.0
    });

    // 6. Chest display screen
    this.chestScreen = new THREE.MeshStandardMaterial({
      map: this.chestTexture,
      roughness: 0.1,
      metalness: 0.15,
      emissive: 0xffffff,
      emissiveMap: this.chestTexture,
      emissiveIntensity: 1.1
    });

    // 7. Luminous Cyan Emissive for sensors, side ears, rings
    this.cyanGlow = new THREE.MeshStandardMaterial({
      color: 0x00f0ff,
      emissive: 0x00e5ff,
      emissiveIntensity: 2.8,
      roughness: 0.1,
      metalness: 0.1
    });

    // 8. Soft Cyan Emissive for subtle accent strips
    this.cyanGlowSoft = new THREE.MeshStandardMaterial({
      color: 0x00c8e6,
      emissive: 0x00b4d8,
      emissiveIntensity: 1.6,
      roughness: 0.2
    });

    // 9. Precision High-Tech Orange Accents (matching engineering markings)
    this.accentOrange = new THREE.MeshStandardMaterial({
      color: 0xff6600,
      roughness: 0.35,
      metalness: 0.3
    });

    // 10. Vulcanized Dark Rubber for wheel rims / treads
    this.rubberTread = new THREE.MeshStandardMaterial({
      color: 0x121417,
      roughness: 0.86,
      metalness: 0.04
    });

    // 11. Deep metallic wheel hub
    this.wheelRim = new THREE.MeshStandardMaterial({
      color: 0x222830,
      roughness: 0.3,
      metalness: 0.9
    });

    // 12. Wireframe mode material
    this.wireframeMat = new THREE.MeshBasicMaterial({
      color: 0x00e5ff,
      wireframe: true,
      transparent: true,
      opacity: 0.65
    });

    // 13. Clay / CAD Studio material
    this.clayMat = new THREE.MeshStandardMaterial({
      color: 0xd8dde4,
      roughness: 0.68,
      metalness: 0.05
    });

    // 14. Hologram / X-Ray material
    this.xrayMat = new THREE.MeshPhysicalMaterial({
      color: 0x0077b6,
      emissive: 0x002845,
      emissiveIntensity: 0.4,
      transparent: true,
      opacity: 0.38,
      roughness: 0.2,
      metalness: 0.3,
      transmission: 0.8
    });

    // Component highlight materials for hover / selection
    this.hoverOutlineMat = new THREE.MeshBasicMaterial({
      color: 0x00ffff,
      wireframe: true
    });

    this.selectedGlowMat = new THREE.MeshStandardMaterial({
      color: 0x00e5ff,
      emissive: 0x00b4d8,
      emissiveIntensity: 0.8,
      roughness: 0.3
    });
  }

  setMode(mode) {
    this.mode = mode;
  }
}
