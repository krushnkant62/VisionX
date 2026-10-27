import * as THREE from 'three';

export class RobotAnimator {
  constructor(robot, materials) {
    this.robot = robot;
    this.materials = materials;

    this.currentMode = 'idle'; // idle, wave, scan, drive, manual
    this.speed = 1.0;
    this.isPlaying = true;
    this.time = 0;

    // Eye blinking timer
    this.blinkTimer = 0;
    this.nextBlink = 3.0;
    this.isBlinking = false;
    this.blinkProgress = 0;

    // Wave animation state
    this.waveTime = 0;

    // Scan animation state
    this.scanTime = 0;

    // Drive animation state
    this.driveTime = 0;

    // Manual joint values (defaults)
    this.manualJoints = {
      headYaw: 0,
      headPitch: 0,
      torsoYaw: 0,
      shoulderRightPitch: 0,
      shoulderRightRoll: 0,
      elbowRightFlex: 0,
      shoulderLeftPitch: 0,
      shoulderLeftRoll: 0,
      elbowLeftFlex: 0,
      gripRight: 0,
      gripLeft: 0
    };
  }

  setMode(mode) {
    this.currentMode = mode;
    this.time = 0;
    this.waveTime = 0;
    this.scanTime = 0;
    this.driveTime = 0;

    // Reset eye state
    if (mode === 'scan') {
      this.materials.updateFaceDisplay(0, 0, 1.0, true);
      this.materials.updateChestDisplay('SCANNING', 96, '360° SLAM LiDAR', '[ SENSOR MATRIX SWEEPING ]');
    } else if (mode === 'wave') {
      this.materials.updateFaceDisplay(0, -0.2, 0.7, false);
      this.materials.updateChestDisplay('HELLO', 98, 'HRI INTERACTION', '[ FRIENDLY GREETING PROTOCOL ]');
    } else {
      this.materials.updateFaceDisplay(0, 0, 1.0, false);
      this.materials.updateChestDisplay('ONLINE', 98, 'AUTONOMOUS', '[ CORE OS 4.2 • IDLE STANDBY ]');
      this.resetPose();
    }
  }

  setPlaying(playing) {
    this.isPlaying = playing;
  }

  setSpeed(speed) {
    this.speed = speed;
  }

  resetPose() {
    const joints = this.robot.joints;
    if (joints.head) {
      joints.head.rotation.set(0, 0, 0);
    }
    if (joints.torso) {
      joints.torso.rotation.set(0, 0, 0);
      joints.torso.position.y = 1.10;
    }
    if (joints.shoulderRight) joints.shoulderRight.rotation.set(0, 0, 0);
    if (joints.shoulderLeft) joints.shoulderLeft.rotation.set(0, 0, 0);
    if (joints.elbowRight) joints.elbowRight.rotation.set(0, 0, 0);
    if (joints.elbowLeft) joints.elbowLeft.rotation.set(0, 0, 0);
    if (joints.wristRight) joints.wristRight.rotation.set(0, 0, 0);
    if (joints.wristLeft) joints.wristLeft.rotation.set(0, 0, 0);
    if (joints.hipLeft) joints.hipLeft.rotation.set(0, 0, 0);
    if (joints.hipRight) joints.hipRight.rotation.set(0, 0, 0);
    if (joints.kneeLeft) joints.kneeLeft.rotation.set(0, 0, 0);
    if (joints.kneeRight) joints.kneeRight.rotation.set(0, 0, 0);
  }

  update(dt) {
    if (!this.isPlaying) return;

    const scaledDt = dt * this.speed;
    this.time += scaledDt;

    // Handle Natural Eye Blinking
    this.updateBlinking(scaledDt);

    // Run active animation state machine
    switch (this.currentMode) {
      case 'idle':
        this.updateIdle(this.time, scaledDt);
        break;
      case 'wave':
        this.updateWave(this.waveTime, scaledDt);
        this.waveTime += scaledDt;
        break;
      case 'scan':
        this.updateScan(this.scanTime, scaledDt);
        this.scanTime += scaledDt;
        break;
      case 'drive':
        this.updateDrive(this.driveTime, scaledDt);
        this.driveTime += scaledDt;
        break;
      case 'manual':
        this.applyManualJoints();
        break;
    }
  }

  updateBlinking(dt) {
    if (this.currentMode === 'scan') return; // scan reticle doesn't blink

    this.blinkTimer += dt;
    if (!this.isBlinking && this.blinkTimer >= this.nextBlink) {
      this.isBlinking = true;
      this.blinkProgress = 0;
    }

    if (this.isBlinking) {
      this.blinkProgress += dt * 6.5; // Quick blink animation
      const eyeScale = Math.abs(Math.cos(this.blinkProgress * Math.PI));

      // Natural eye micro-gaze drift
      const gazeX = Math.sin(this.time * 0.4) * 0.15;
      const gazeY = Math.cos(this.time * 0.3) * 0.1;

      this.materials.updateFaceDisplay(gazeX, gazeY, Math.max(0.08, eyeScale), false);

      if (this.blinkProgress >= 1.0) {
        this.isBlinking = false;
        this.blinkTimer = 0;
        this.nextBlink = 2.5 + Math.random() * 3.5;
        this.materials.updateFaceDisplay(gazeX, gazeY, 1.0, false);
      }
    }
  }

  updateIdle(t, dt) {
    const j = this.robot.joints;

    // Torso subtle breathing cycle (2.4s period)
    const breath = Math.sin(t * 2.6);
    if (j.torso) {
      j.torso.position.y = 1.10 + breath * 0.005;
      j.torso.rotation.x = breath * 0.012;
      j.torso.rotation.y = Math.sin(t * 0.7) * 0.02;
    }

    // Natural head micro-drift
    if (j.head) {
      j.head.rotation.y = Math.sin(t * 0.8) * 0.06;
      j.head.rotation.x = Math.sin(t * 1.3) * 0.03 - 0.02;
      j.head.rotation.z = Math.cos(t * 0.9) * 0.015;
    }

    // Arms subtle rest sway
    if (j.shoulderRight) {
      j.shoulderRight.rotation.x = Math.sin(t * 2.6) * 0.03;
      j.shoulderRight.rotation.z = -0.05 + Math.sin(t * 1.3) * 0.02;
    }
    if (j.shoulderLeft) {
      j.shoulderLeft.rotation.x = -Math.sin(t * 2.6) * 0.03;
      j.shoulderLeft.rotation.z = 0.05 - Math.sin(t * 1.3) * 0.02;
    }

    if (j.elbowRight) j.elbowRight.rotation.x = 0.08 + Math.sin(t * 1.5) * 0.02;
    if (j.elbowLeft) j.elbowLeft.rotation.x = 0.08 + Math.sin(t * 1.5) * 0.02;
  }

  updateWave(t, dt) {
    const j = this.robot.joints;

    // Head looks warmly at user
    if (j.head) {
      j.head.rotation.y = THREE.MathUtils.lerp(j.head.rotation.y, 0.0, 0.08);
      j.head.rotation.x = THREE.MathUtils.lerp(j.head.rotation.x, -0.08, 0.08);
      j.head.rotation.z = THREE.MathUtils.lerp(j.head.rotation.z, 0.12, 0.08); // Cute head tilt
    }

    // Right Arm raises up
    if (j.shoulderRight) {
      // Raise arm forward and up
      j.shoulderRight.rotation.x = THREE.MathUtils.lerp(j.shoulderRight.rotation.x, -Math.PI * 0.55, 0.1);
      j.shoulderRight.rotation.z = THREE.MathUtils.lerp(j.shoulderRight.rotation.z, -0.4, 0.1);
    }

    // Elbow bends inward
    if (j.elbowRight) {
      j.elbowRight.rotation.x = THREE.MathUtils.lerp(j.elbowRight.rotation.x, -Math.PI * 0.35, 0.1);
    }

    // Forearm & Wrist wave back and forth
    const waveOsc = Math.sin(t * 7.0);
    if (j.wristRight) {
      j.wristRight.rotation.z = waveOsc * 0.45;
      j.wristRight.rotation.y = waveOsc * 0.25;
    }

    // Fingers flex warmly open
    const fingersR = j.fingersRight;
    if (fingersR && fingersR.fingers) {
      const curl = 0.15 + waveOsc * 0.1;
      fingersR.fingers.forEach(f => {
        f.root.rotation.x = curl;
        f.distal.rotation.x = curl;
      });
      if (fingersR.thumb) {
        fingersR.thumb.root.rotation.x = curl;
      }
    }

    // Left arm rests gently
    if (j.shoulderLeft) {
      j.shoulderLeft.rotation.z = 0.08;
      j.shoulderLeft.rotation.x = 0.02;
    }
  }

  updateScan(t, dt) {
    const j = this.robot.joints;

    // Head pans smoothly across 120-degree field of view
    const pan = Math.sin(t * 1.5) * (Math.PI * 0.35);
    const tilt = Math.cos(t * 3.0) * 0.12;

    if (j.head) {
      j.head.rotation.y = pan;
      j.head.rotation.x = tilt;
      j.head.rotation.z = 0;
    }

    // Torso micro-twist to assist panoramic scan
    if (j.torso) {
      j.torso.rotation.y = pan * 0.25;
    }

    // Pulse cyan ear and shoulder LEDs
    const pulseIntensity = 2.0 + Math.sin(t * 6.0) * 1.2;
    this.materials.cyanGlow.emissiveIntensity = pulseIntensity;
  }

  updateDrive(t, dt) {
    const j = this.robot.joints;

    // Robot leans forward slightly into drive motion
    if (j.torso) {
      j.torso.rotation.x = -0.06;
      j.torso.position.y = 1.10 + Math.sin(t * 12.0) * 0.003; // Floor texture micro-vibration
    }

    // Roll all tandem wheels continuously
    const driveSpeed = 6.0;
    this.robot.rollWheels(driveSpeed * dt);

    // Subtle arm stabilizing motion
    if (j.shoulderRight) j.shoulderRight.rotation.x = Math.sin(t * 6.0) * 0.08;
    if (j.shoulderLeft) j.shoulderLeft.rotation.x = -Math.sin(t * 6.0) * 0.08;
  }

  setManualJoint(key, val) {
    this.manualJoints[key] = val;
    if (this.currentMode !== 'manual') {
      this.currentMode = 'manual';
    }
    this.applyManualJoints();
  }

  applyManualJoints() {
    const j = this.robot.joints;
    const m = this.manualJoints;

    if (j.head) {
      j.head.rotation.y = m.headYaw;
      j.head.rotation.x = m.headPitch;
    }
    if (j.torso) {
      j.torso.rotation.y = m.torsoYaw;
    }
    if (j.shoulderRight) {
      j.shoulderRight.rotation.x = m.shoulderRightPitch;
      j.shoulderRight.rotation.z = m.shoulderRightRoll;
    }
    if (j.elbowRight) {
      j.elbowRight.rotation.x = m.elbowRightFlex;
    }
    if (j.shoulderLeft) {
      j.shoulderLeft.rotation.x = m.shoulderLeftPitch;
      j.shoulderLeft.rotation.z = m.shoulderLeftRoll;
    }
    if (j.elbowLeft) {
      j.elbowLeft.rotation.x = m.elbowLeftFlex;
    }

    // Grippers
    const applyGrip = (handJoint, val) => {
      if (handJoint && handJoint.fingers) {
        handJoint.fingers.forEach(f => {
          f.root.rotation.x = val * 1.2;
          f.distal.rotation.x = val * 1.4;
        });
        if (handJoint.thumb) {
          handJoint.thumb.root.rotation.x = val * 0.9;
          handJoint.thumb.distal.rotation.x = val * 1.1;
        }
      }
    };

    applyGrip(j.fingersRight, m.gripRight);
    applyGrip(j.fingersLeft, m.gripLeft);
  }
}
