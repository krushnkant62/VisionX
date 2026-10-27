import * as THREE from 'three';
import { StudioScene } from './scene/StudioScene.js';
import { HouseholdScene } from './scene/HouseholdScene.js';
import { RobotMaterials } from './robot/Materials.js';
import { VisionXRobot } from './robot/VisionXRobot.js';
import { RobotAnimator } from './robot/Animations.js';
import { SabjiMission } from './simulation/SabjiMission.js';
import { COMPONENT_METADATA } from './robot/ComponentMetadata.js';

class VisionXApp {
  constructor() {
    this.container = document.getElementById('viewport-container');

    // 1. Core Systems
    this.materials = new RobotMaterials();
    this.sceneManager = new StudioScene(this.container);
    this.robot = new VisionXRobot(this.materials);
    this.sceneManager.setRobot(this.robot);

    this.animator = new RobotAnimator(this.robot, this.materials);
    this.householdScene = new HouseholdScene(this.sceneManager.scene);
    this.mission = new SabjiMission(this.robot, this.householdScene, this.materials);

    // App state
    this.currentMode = 'studio'; // 'studio' or 'household'
    this.clock = new THREE.Clock();

    // 2. Setup UI bindings
    this.initUI();

    // 3. Setup Raycasting callbacks
    this.initInteraction();

    // 4. Start Render Loop
    this.animate();
  }

  initInteraction() {
    // Hover highlight
    this.sceneManager.onComponentHover = (compKey) => {
      this.robot.highlightComponent(compKey, true);
    };

    // Click select
    this.sceneManager.onComponentSelect = (compKey) => {
      this.robot.selectComponent(compKey);
      this.updateInspector(compKey || 'head');
    };

    // Initialize with head selected
    this.updateInspector('head');
  }

  updateInspector(compKey) {
    const data = COMPONENT_METADATA[compKey] || COMPONENT_METADATA.head;
    document.getElementById('comp-name').textContent = data.name;
    document.getElementById('comp-status').textContent = data.status;
    document.getElementById('comp-category').textContent = data.category;
    document.getElementById('comp-dof').textContent = data.dof;
    document.getElementById('comp-specs').textContent = data.specs;
    document.getElementById('comp-material').textContent = data.material;
    document.getElementById('comp-function').textContent = data.function;
  }

  initUI() {
    // Mode Switcher: Studio vs Household
    const btnStudio = document.getElementById('btn-mode-studio');
    const btnHousehold = document.getElementById('btn-mode-household');
    const missionBar = document.getElementById('mission-bar');
    const telemetryState = document.getElementById('telemetry-state');

    btnStudio.addEventListener('click', () => {
      this.currentMode = 'studio';
      btnStudio.classList.add('active');
      btnHousehold.classList.remove('active');
      missionBar.classList.remove('active');

      this.sceneManager.environment.setVisible(true);
      this.householdScene.setVisible(false);
      this.mission.pauseMission();
      this.robot.group.position.set(0, 0, 0);
      this.robot.group.rotation.set(0, 0, 0);
      this.mission.resetBowlToFridge();
      this.sceneManager.setViewPreset('isometric');
      telemetryState.textContent = 'AUTONOMOUS IDLE';
      this.animator.setMode('idle');
    });

    btnHousehold.addEventListener('click', () => {
      this.currentMode = 'household';
      btnHousehold.classList.add('active');
      btnStudio.classList.remove('active');
      missionBar.classList.add('active');

      this.sceneManager.environment.setVisible(false);
      this.householdScene.setVisible(true);
      this.mission.startMission();
      this.sceneManager.camera.position.set(3.5, 3.2, 4.5);
      this.sceneManager.controls.target.set(2.0, 1.0, -1.0);
      telemetryState.textContent = 'MISSION: FETCH_SABJI';
    });

    // Fullscreen Toggle
    document.getElementById('btn-fullscreen').addEventListener('click', () => {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(() => {});
      } else {
        document.exitFullscreen().catch(() => {});
      }
    });

    // Camera View Presets
    document.querySelectorAll('[data-view]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        document.querySelectorAll('[data-view]').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const viewName = btn.getAttribute('data-view');
        this.sceneManager.setViewPreset(viewName);
      });
    });

    // Reset Camera
    document.getElementById('btn-reset-cam').addEventListener('click', () => {
      this.sceneManager.resetCamera();
      document.querySelectorAll('[data-view]').forEach(b => b.classList.remove('active'));
      const isoBtn = document.querySelector('[data-view="isometric"]');
      if (isoBtn) isoBtn.classList.add('active');
    });

    // Auto-Rotate
    const btnAutoRotate = document.getElementById('btn-toggle-autorotate');
    let autoRotateActive = false;
    btnAutoRotate.addEventListener('click', () => {
      autoRotateActive = !autoRotateActive;
      this.sceneManager.setAutoRotate(autoRotateActive);
      btnAutoRotate.classList.toggle('active', autoRotateActive);
    });

    // Exploded View Slider
    const sliderExplode = document.getElementById('slider-explode');
    const explodedVal = document.getElementById('exploded-val');
    sliderExplode.addEventListener('input', (e) => {
      const val = parseFloat(e.target.value) / 100.0;
      explodedVal.textContent = `${Math.round(val * 100)}%`;
      this.robot.setExplodedProgress(val);
    });

    // Material Modes (realistic, clay, wireframe, xray)
    document.querySelectorAll('[data-material]').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('[data-material]').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const matMode = btn.getAttribute('data-material');
        this.robot.setMaterialMode(matMode);
      });
    });

    // Lighting Presets (studio, cleanLab, cyber)
    document.querySelectorAll('[data-light]').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('[data-light]').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const lightMode = btn.getAttribute('data-light');
        this.sceneManager.setLightingPreset(lightMode);
      });
    });

    // Kinematics / Animations Modes
    document.querySelectorAll('[data-anim]').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('[data-anim]').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const animMode = btn.getAttribute('data-anim');
        this.animator.setMode(animMode);
      });
    });

    // Animation Play / Pause
    const btnAnimPlay = document.getElementById('btn-anim-play');
    let isPlaying = true;
    btnAnimPlay.addEventListener('click', () => {
      isPlaying = !isPlaying;
      this.animator.setPlaying(isPlaying);
      btnAnimPlay.textContent = isPlaying ? 'Pause' : 'Play';
      btnAnimPlay.classList.toggle('secondary', !isPlaying);
    });

    // Animation Speed (0.5x, 1x, 2x)
    const btnAnimSpeed = document.getElementById('btn-anim-speed');
    const speeds = [1.0, 1.5, 2.0, 0.5];
    let speedIdx = 0;
    btnAnimSpeed.addEventListener('click', () => {
      speedIdx = (speedIdx + 1) % speeds.length;
      const spd = speeds[speedIdx];
      this.animator.setSpeed(spd);
      btnAnimSpeed.textContent = `Speed: ${spd}x`;
    });

    // Manual Joint Sliders
    const setupJointSlider = (sliderId, labelId, jointKey, unit = '°', scale = Math.PI / 180) => {
      const slider = document.getElementById(sliderId);
      const label = document.getElementById(labelId);
      if (!slider || !label) return;

      slider.addEventListener('input', (e) => {
        const val = parseFloat(e.target.value);
        label.textContent = `${val}${unit}`;
        this.animator.setManualJoint(jointKey, val * scale);
        // Switch animation button to manual
        document.querySelectorAll('[data-anim]').forEach(b => b.classList.remove('active'));
      });
    };

    setupJointSlider('joint-head-yaw', 'val-head-yaw', 'headYaw');
    setupJointSlider('joint-head-pitch', 'val-head-pitch', 'headPitch');
    setupJointSlider('joint-shoulder-r', 'val-shoulder-r', 'shoulderRightPitch');
    setupJointSlider('joint-elbow-r', 'val-elbow-r', 'elbowRightFlex');
    setupJointSlider('joint-grip', 'val-grip', 'gripRight', '%', 1 / 100);

    // Household Mission Timeline
    const stepChips = document.querySelectorAll('.step-chip');
    const missionPill = document.getElementById('mission-status-pill');
    const missionDetails = document.getElementById('mission-details');

    this.mission.onStepChange = (stepData, stepIdx) => {
      stepChips.forEach((chip, i) => {
        chip.classList.toggle('active', i === stepIdx);
        chip.classList.toggle('completed', i < stepIdx);
      });
      missionPill.textContent = `STEP ${stepIdx + 1}/7: ${stepData.title.toUpperCase()}`;
      missionDetails.innerHTML = `<strong>${stepData.sub}:</strong> ${stepData.details}`;
    };

    stepChips.forEach(chip => {
      chip.addEventListener('click', () => {
        const step = parseInt(chip.getAttribute('data-step'), 10);
        this.mission.setStep(step);
      });
    });

    document.getElementById('btn-mission-prev').addEventListener('click', () => {
      this.mission.prevStep();
    });

    document.getElementById('btn-mission-next').addEventListener('click', () => {
      this.mission.nextStep();
    });

    const btnMissionPlay = document.getElementById('btn-mission-play');
    btnMissionPlay.addEventListener('click', () => {
      if (this.mission.isPlaying) {
        this.mission.pauseMission();
        btnMissionPlay.textContent = '▶ Auto Play';
      } else {
        this.mission.resumeMission();
        btnMissionPlay.textContent = '⏸ Pause';
      }
    });

    document.getElementById('btn-mission-reset').addEventListener('click', () => {
      this.mission.resetMission();
      btnMissionPlay.textContent = '▶ Auto Play';
    });
  }

  animate() {
    requestAnimationFrame(() => this.animate());

    const dt = Math.min(this.clock.getDelta(), 0.1);

    // Update Kinematics & Animations
    if (this.currentMode === 'studio') {
      this.animator.update(dt);
    } else {
      this.mission.update(dt);
    }

    // Render Scene & Camera
    this.sceneManager.update(dt);
  }
}

// Robust App Bootstrap supporting both DOM readyState conditions
function startVisionX() {
  try {
    console.log('[VISIONX] Initializing 3D Robot Engineering System...');
    window.__visionxApp = new VisionXApp();
    console.log('[VISIONX] System initialized successfully. 3D Viewport active.');
  } catch (err) {
    console.error('[VISIONX Initialization Error]', err);
    const errBanner = document.createElement('div');
    errBanner.style.position = 'fixed';
    errBanner.style.top = '12px';
    errBanner.style.left = '50%';
    errBanner.style.transform = 'translateX(-50%)';
    errBanner.style.background = 'rgba(220, 38, 38, 0.95)';
    errBanner.style.color = '#ffffff';
    errBanner.style.padding = '12px 24px';
    errBanner.style.borderRadius = '8px';
    errBanner.style.fontFamily = 'monospace';
    errBanner.style.fontSize = '13px';
    errBanner.style.zIndex = '99999';
    errBanner.style.boxShadow = '0 8px 24px rgba(0,0,0,0.5)';
    errBanner.textContent = 'VisionX Init Error: ' + err.message;
    document.body.appendChild(errBanner);
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', startVisionX);
} else {
  startVisionX();
}
