import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { StudioEnvironment } from './Environment.js';

export class StudioScene {
  constructor(container) {
    this.container = container;

    // 1. Scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x090c12);
    this.scene.fog = new THREE.FogExp2(0x090c12, 0.08);

    // 2. Camera (Focal length suited for realistic product visualization)
    const w = container.clientWidth > 0 ? container.clientWidth : window.innerWidth;
    const h = container.clientHeight > 0 ? container.clientHeight : window.innerHeight;

    this.camera = new THREE.PerspectiveCamera(42, w / h, 0.1, 50);
    // Initial 3/4 Isometric beauty angle
    this.camera.position.set(2.2, 1.65, 2.6);

    // 3. Renderer with PBR color management & soft shadows
    this.renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
    this.renderer.setSize(w, h);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.15;
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(this.renderer.domElement);

    // 4. OrbitControls
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;
    this.controls.target.set(0, 1.05, 0); // Focus on chest / center of mass
    this.controls.maxPolarAngle = Math.PI / 2 + 0.05; // Don't dip far below ground
    this.controls.minDistance = 0.6;
    this.controls.maxDistance = 7.0;

    // 5. Lighting Setup
    this.setupLighting();

    // 6. Platform & Ground
    this.environment = new StudioEnvironment(this.scene);

    // 7. Raycasting & Interaction
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2(-999, -999);
    this.onComponentHover = null;
    this.onComponentSelect = null;
    this.setupInteraction();

    // 8. Smooth Camera Transitions
    this.camTargetPos = null;
    this.camTargetLookAt = null;
    this.camLerpProgress = 1.0;

    // Handle Window Resize
    window.addEventListener('resize', () => this.onResize());
  }

  setupLighting() {
    this.lights = {};

    // Ambient / Hemisphere Sky-Ground bounce
    this.lights.hemi = new THREE.HemisphereLight(0xffffff, 0x111622, 0.65);
    this.scene.add(this.lights.hemi);

    // Key Light (Main soft directional warm light)
    this.lights.key = new THREE.DirectionalLight(0xffffff, 2.2);
    this.lights.key.position.set(3.5, 4.5, 3.5);
    this.lights.key.castShadow = true;
    this.lights.key.shadow.mapSize.width = 2048;
    this.lights.key.shadow.mapSize.height = 2048;
    this.lights.key.shadow.camera.near = 0.5;
    this.lights.key.shadow.camera.far = 12;
    this.lights.key.shadow.camera.left = -1.8;
    this.lights.key.shadow.camera.right = 1.8;
    this.lights.key.shadow.camera.top = 2.2;
    this.lights.key.shadow.camera.bottom = -0.5;
    this.lights.key.shadow.bias = -0.0004;
    this.lights.key.shadow.radius = 2.5;
    this.scene.add(this.lights.key);

    // Fill Light (Soft cool bluish directional light)
    this.lights.fill = new THREE.DirectionalLight(0xaed6f1, 1.1);
    this.lights.fill.position.set(-3.5, 3.0, 2.0);
    this.scene.add(this.lights.fill);

    // Rim / Backlight (Crisp cyan kicker light for edge highlights on white armor!)
    this.lights.rim = new THREE.DirectionalLight(0x38bdf8, 2.6);
    this.lights.rim.position.set(0.5, 3.5, -3.5);
    this.scene.add(this.lights.rim);

    // Bottom Subtle Cyan Bounce Light (Soft illumination on lower chassis)
    this.lights.bounce = new THREE.DirectionalLight(0x00e5ff, 0.4);
    this.lights.bounce.position.set(0, -1.0, 1.5);
    this.scene.add(this.lights.bounce);
  }

  setLightingPreset(preset) {
    if (preset === 'cleanLab') {
      this.scene.background.set(0x181c24);
      this.scene.fog.color.set(0x181c24);
      this.lights.hemi.intensity = 1.2;
      this.lights.key.intensity = 2.5;
      this.lights.key.color.set(0xffffff);
      this.lights.fill.intensity = 1.6;
      this.lights.rim.intensity = 1.2;
      this.lights.rim.color.set(0xffffff);
    } else if (preset === 'cyber') {
      this.scene.background.set(0x05060a);
      this.scene.fog.color.set(0x05060a);
      this.lights.hemi.intensity = 0.3;
      this.lights.key.intensity = 1.4;
      this.lights.key.color.set(0x80d8ff);
      this.lights.fill.intensity = 0.7;
      this.lights.rim.intensity = 4.2;
      this.lights.rim.color.set(0x00e5ff);
    } else {
      // High-Tech Studio (Default)
      this.scene.background.set(0x090c12);
      this.scene.fog.color.set(0x090c12);
      this.lights.hemi.intensity = 0.65;
      this.lights.key.intensity = 2.2;
      this.lights.key.color.set(0xffffff);
      this.lights.fill.intensity = 1.1;
      this.lights.rim.intensity = 2.6;
      this.lights.rim.color.set(0x38bdf8);
    }
  }

  setupInteraction() {
    const el = this.renderer.domElement;

    el.addEventListener('mousemove', (e) => {
      const rect = el.getBoundingClientRect();
      this.mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      this.mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    });

    el.addEventListener('click', (e) => {
      const rect = el.getBoundingClientRect();
      const clickMouse = new THREE.Vector2(
        ((e.clientX - rect.left) / rect.width) * 2 - 1,
        -((e.clientY - rect.top) / rect.height) * 2 + 1
      );
      this.raycaster.setFromCamera(clickMouse, this.camera);
      if (this.robot && this.robot.interactiveMeshes) {
        const hits = this.raycaster.intersectObjects(this.robot.interactiveMeshes, false);
        if (hits.length > 0) {
          const compKey = hits[0].object.userData.componentKey;
          if (this.onComponentSelect) {
            this.onComponentSelect(compKey);
          }
        } else {
          if (this.onComponentSelect) {
            this.onComponentSelect(null);
          }
        }
      }
    });
  }

  setRobot(robot) {
    this.robot = robot;
    this.scene.add(robot.group);
  }

  setViewPreset(viewName) {
    const presets = {
      isometric: { pos: new THREE.Vector3(2.2, 1.65, 2.6), target: new THREE.Vector3(0, 1.05, 0) },
      front: { pos: new THREE.Vector3(0, 1.15, 3.2), target: new THREE.Vector3(0, 1.10, 0) },
      rear: { pos: new THREE.Vector3(0, 1.15, -3.2), target: new THREE.Vector3(0, 1.10, 0) },
      left: { pos: new THREE.Vector3(-3.2, 1.15, 0), target: new THREE.Vector3(0, 1.10, 0) },
      right: { pos: new THREE.Vector3(3.2, 1.15, 0), target: new THREE.Vector3(0, 1.10, 0) },
      top: { pos: new THREE.Vector3(0, 4.2, 0.05), target: new THREE.Vector3(0, 0.9, 0) },
      head: { pos: new THREE.Vector3(0, 1.58, 1.15), target: new THREE.Vector3(0, 1.52, 0.1) },
      feet: { pos: new THREE.Vector3(0.5, 0.45, 0.95), target: new THREE.Vector3(0.18, 0.12, 0) }
    };

    const targetView = presets[viewName] || presets.isometric;
    this.camTargetPos = targetView.pos.clone();
    this.camTargetLookAt = targetView.target.clone();
    this.camLerpProgress = 0.0;
  }

  resetCamera() {
    this.setViewPreset('isometric');
  }

  setAutoRotate(enabled) {
    this.controls.autoRotate = enabled;
    this.controls.autoRotateSpeed = 1.2;
  }

  onResize() {
    const w = this.container.clientWidth > 0 ? this.container.clientWidth : window.innerWidth;
    const h = this.container.clientHeight > 0 ? this.container.clientHeight : window.innerHeight;
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(w, h);
  }

  update(dt) {
    // Smooth camera transition if in progress
    if (this.camLerpProgress < 1.0 && this.camTargetPos) {
      this.camLerpProgress += dt * 2.5;
      const t = Math.min(1.0, this.camLerpProgress);
      // Smooth step easing
      const ease = t * t * (3 - 2 * t);
      this.camera.position.lerp(this.camTargetPos, 0.14);
      this.controls.target.lerp(this.camTargetLookAt, 0.14);
      if (t >= 0.99) {
        this.camera.position.copy(this.camTargetPos);
        this.controls.target.copy(this.camTargetLookAt);
        this.camTargetPos = null;
      }
    }

    this.controls.update();

    // Raycast on hover
    if (this.robot && this.robot.interactiveMeshes && this.mouse.x !== -999) {
      this.raycaster.setFromCamera(this.mouse, this.camera);
      const hits = this.raycaster.intersectObjects(this.robot.interactiveMeshes, false);
      if (hits.length > 0) {
        const hoveredKey = hits[0].object.userData.componentKey;
        if (this.onComponentHover) {
          this.onComponentHover(hoveredKey);
        }
      } else {
        if (this.onComponentHover) {
          this.onComponentHover(null);
        }
      }
    }

    this.renderer.render(this.scene, this.camera);
  }
}
