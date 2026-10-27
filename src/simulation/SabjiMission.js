import * as THREE from 'three';

export class SabjiMission {
  constructor(robot, householdScene, materials) {
    this.robot = robot;
    this.household = householdScene;
    this.materials = materials;

    this.currentStep = 0; // 0 to 6 (7 steps total)
    this.isPlaying = false;
    this.stepTimer = 0;
    this.stepDuration = 5.0; // seconds per step in auto-play

    // Original bowl home transform
    this.bowlHomePos = new THREE.Vector3(5.1, 1.37, -3.75);

    // Initial robot transform
    this.robotStartPos = new THREE.Vector3(0, 0, 1.8);
    this.robotStartRot = 0;

    // Steps definition
    this.steps = [
      {
        id: 1,
        title: 'Receive Instruction',
        sub: 'User Voice Command Decoded',
        instruction: '“Bring the bowl of sabji from the refrigerator.”',
        status: 'INTENT_PARSED',
        details: 'Natural Language Processing (NLP) extracted Intent: FETCH_ITEM, Target: SABJI_BOWL, Source: REFRIGERATOR, Recipient: USER.',
        hudMessage: 'INSTRUCTION RECEIVED: FETCH SABJI'
      },
      {
        id: 2,
        title: 'Perception & Object Identification',
        sub: '3D Spatial SLAM & Visual Detection',
        instruction: 'Identifying refrigerator coordinates and shelf contents...',
        status: 'TARGET_ACQUIRED',
        details: 'Stereo RGB-D cameras triangulate Refrigerator at (X: 5.1m, Z: -3.8m, Conf: 99.4%) and Sabji Bowl on Shelf #2 (Conf: 98.7%).',
        hudMessage: 'TARGET IDENTIFIED [CONF: 99%]'
      },
      {
        id: 3,
        title: 'Route Planning & Costmap',
        sub: 'A* Pathfinding & Dynamic Obstacle Avoidance',
        instruction: 'Evaluating indoor topology and safety margins...',
        status: 'TRAJECTORY_CALCULATED',
        details: 'Computed 5.8m collision-free Catmull-Rom spline path with 0.45m clearance around the dining stool obstacle.',
        hudMessage: 'ROUTE PLANNED • CLEARANCE: 0.45m'
      },
      {
        id: 4,
        title: 'Navigate Around Obstacle',
        sub: 'Tandem Wheel Mobility & Trajectory Tracking',
        instruction: 'Navigating hallway and safely clearing dining stool obstacle...',
        status: 'NAVIGATING_OBSTACLE',
        details: 'Robot drives along planned path. Dual-wheel pods roll smoothly, ultrasonic cliff and proximity sensors maintain active clearance.',
        hudMessage: 'OBSTACLE CLEARED • SPEED: 0.8 m/s'
      },
      {
        id: 5,
        title: 'Refrigerator Approach & Door Access',
        sub: 'Precise Alignment & Smart Door Trigger',
        instruction: 'Arriving at refrigerator dock and opening door...',
        status: 'APPLIANCE_ACCESSED',
        details: 'Robot stops precisely 0.5m in front of refrigerator. Magnetic latch disengages and door swings open to 90 degrees.',
        hudMessage: 'FRIDGE OPENED • ALIGNING'
      },
      {
        id: 6,
        title: 'Grasp & Retrieval of Sabji Bowl',
        sub: 'Dexterous Manipulation & Tactile Gripping',
        instruction: 'Extending robotic arm and securing the warm bowl of sabji...',
        status: 'PAYLOAD_SECURED',
        details: 'Right arm articulates forward, tactile fingertips close around the ceramic bowl rim with 14N calibrated grip force.',
        hudMessage: 'PAYLOAD RETRIEVED • BOWL SECURED'
      },
      {
        id: 7,
        title: 'Return & Delivery to User',
        sub: 'Final Autonomous Transit & HRI Presentation',
        instruction: 'Gliding back to user and presenting the bowl of sabji...',
        status: 'MISSION_COMPLETE',
        details: 'Robot glides back safely to user origin with bowl held level. Friendly eye expression displayed on face screen.',
        hudMessage: 'MISSION COMPLETE: ENJOY YOUR SABJI!'
      }
    ];

    this.onStepChange = null;
  }

  startMission() {
    this.setStep(0);
    this.isPlaying = true;
  }

  pauseMission() {
    this.isPlaying = false;
  }

  resumeMission() {
    this.isPlaying = true;
  }

  resetMission() {
    this.isPlaying = false;
    this.setStep(0);
  }

  nextStep() {
    if (this.currentStep < this.steps.length - 1) {
      this.setStep(this.currentStep + 1);
    }
  }

  prevStep() {
    if (this.currentStep > 0) {
      this.setStep(this.currentStep - 1);
    }
  }

  setStep(index) {
    this.currentStep = Math.max(0, Math.min(this.steps.length - 1, index));
    this.stepTimer = 0;
    const stepData = this.steps[this.currentStep];

    // Update displays
    this.materials.updateChestDisplay(
      stepData.status,
      97,
      `STEP ${this.currentStep + 1}/7`,
      `[ ${stepData.hudMessage} ]`
    );

    // Update Household Visual Elements based on step
    switch (this.currentStep) {
      case 0: // Receive Instruction
        this.household.setBBoxesVisible(false);
        this.household.setPathVisible(false);
        this.household.setDoorOpen(0);
        this.resetRobotToStart();
        this.resetBowlToFridge();
        this.materials.updateFaceDisplay(0, 0, 1.0, false);
        break;

      case 1: // Identify Targets
        this.household.setBBoxesVisible(true);
        this.household.setPathVisible(false);
        this.household.setDoorOpen(0);
        this.resetRobotToStart();
        this.resetBowlToFridge();
        this.materials.updateFaceDisplay(0, 0, 1.0, true);
        break;

      case 2: // Route Planning
        this.household.setBBoxesVisible(true);
        this.household.setPathVisible(true);
        this.household.setDoorOpen(0);
        this.resetRobotToStart();
        this.resetBowlToFridge();
        this.materials.updateFaceDisplay(0, -0.1, 1.0, false);
        break;

      case 3: // Navigate Obstacle
        this.household.setBBoxesVisible(false);
        this.household.setPathVisible(true);
        this.household.setDoorOpen(0);
        // Position robot mid-curve avoiding obstacle
        this.robot.group.position.set(1.4, 0, -1.4);
        this.robot.group.rotation.y = -Math.PI * 0.4;
        this.resetBowlToFridge();
        break;

      case 4: // Refrigerator Access
        this.household.setBBoxesVisible(false);
        this.household.setPathVisible(false);
        this.household.setDoorOpen(Math.PI * 0.55); // Open fridge door
        this.robot.group.position.set(4.2, 0, -3.4);
        this.robot.group.rotation.y = -Math.PI * 0.45;
        this.resetBowlToFridge();
        break;

      case 5: // Grasp & Retrieve
        this.household.setBBoxesVisible(false);
        this.household.setPathVisible(false);
        this.household.setDoorOpen(Math.PI * 0.55);
        this.robot.group.position.set(4.3, 0, -3.5);
        this.robot.group.rotation.y = -Math.PI * 0.45;
        // Attach bowl to robot's right hand!
        this.attachBowlToHand();
        break;

      case 6: // Return & Deliver
        this.household.setBBoxesVisible(false);
        this.household.setPathVisible(false);
        this.household.setDoorOpen(0); // Fridge closed
        this.robot.group.position.set(0, 0, 1.8);
        this.robot.group.rotation.y = 0; // Facing user
        this.attachBowlToHand();
        this.materials.updateFaceDisplay(0, -0.2, 0.7, false); // Happy smile / squint
        break;
    }

    if (this.onStepChange) {
      this.onStepChange(stepData, this.currentStep);
    }
  }

  resetRobotToStart() {
    this.robot.group.position.copy(this.robotStartPos);
    this.robot.group.rotation.set(0, this.robotStartRot, 0);
    // Reset arm poses
    const j = this.robot.joints;
    if (j.shoulderRight) j.shoulderRight.rotation.set(0, 0, 0);
    if (j.elbowRight) j.elbowRight.rotation.set(0, 0, 0);
    if (j.wristRight) j.wristRight.rotation.set(0, 0, 0);
  }

  resetBowlToFridge() {
    // Detach from robot hand if attached and put back on fridge shelf
    if (this.household.bowlGroup.parent !== this.household.group) {
      this.household.group.add(this.household.bowlGroup);
    }
    this.household.bowlGroup.position.copy(this.bowlHomePos);
    this.household.bowlGroup.rotation.set(0, 0, 0);
  }

  attachBowlToHand() {
    const j = this.robot.joints;
    // Articulate right arm forward as a carrying tray
    if (j.shoulderRight) {
      j.shoulderRight.rotation.x = -Math.PI * 0.42;
      j.shoulderRight.rotation.z = -0.15;
    }
    if (j.elbowRight) {
      j.elbowRight.rotation.x = -Math.PI * 0.45;
    }
    if (j.wristRight) {
      j.wristRight.rotation.x = 0.2;
    }

    // Attach bowl to right hand
    if (j.handRight) {
      j.handRight.add(this.household.bowlGroup);
      this.household.bowlGroup.position.set(0, -0.06, 0.12);
      this.household.bowlGroup.rotation.set(0, 0, 0);
    }
  }

  update(dt) {
    if (!this.isPlaying) return;

    this.stepTimer += dt;

    // Continuous motion during navigation (Step 3: Navigate Obstacle)
    if (this.currentStep === 3) {
      const tNorm = (this.stepTimer % this.stepDuration) / this.stepDuration;
      const point = this.household.navCurve.getPointAt(tNorm);
      const tangent = this.household.navCurve.getTangentAt(tNorm);

      this.robot.group.position.set(point.x, 0, point.z);
      const angle = Math.atan2(-tangent.x, -tangent.z);
      this.robot.group.rotation.y = angle;

      // Spin wheels
      this.robot.rollWheels(7.0 * dt);
    }

    // Auto-advance to next step
    if (this.stepTimer >= this.stepDuration) {
      if (this.currentStep < this.steps.length - 1) {
        this.nextStep();
      } else {
        this.isPlaying = false; // Finished sequence
      }
    }
  }
}
