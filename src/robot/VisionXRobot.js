import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { COMPONENT_METADATA } from './ComponentMetadata.js';

export class VisionXRobot {
  constructor(materials) {
    this.materials = materials;
    this.group = new THREE.Group();
    this.group.name = 'VisionX_Root';

    // Interactive components map
    this.components = new Map();
    this.interactiveMeshes = [];

    // Joint references for animation & kinematics
    this.joints = {};

    // Wheel references for driving animation
    this.wheels = [];

    // Exploded view tracking
    this.explodedParts = [];

    // Build the complete robot assembly
    this.buildRobot();
  }

  registerPart(mesh, componentKey, explodeOffset = new THREE.Vector3(0, 0, 0)) {
    mesh.userData.componentKey = componentKey;
    mesh.userData.originalPosition = mesh.position.clone();
    mesh.userData.explodeOffset = explodeOffset.clone();
    mesh.castShadow = true;
    mesh.receiveShadow = true;

    this.interactiveMeshes.push(mesh);
    if (!this.components.has(componentKey)) {
      this.components.set(componentKey, []);
    }
    this.components.get(componentKey).push(mesh);
    this.explodedParts.push(mesh);
    return mesh;
  }

  buildRobot() {
    // 1. Lower Mobility & Wheels Base
    this.buildPelvisAndLegs();

    // 2. Main Torso & Chest Display
    this.buildTorso();

    // 3. Neck & Head with Face Screen, Eyes, and Ears
    this.buildHead();

    // 4. Arms & Dexterous Hands
    this.buildArms();
  }

  buildPelvisAndLegs() {
    // Pelvis Hub (Waist Turntable)
    this.pelvisGroup = new THREE.Group();
    this.pelvisGroup.position.set(0, 0.72, 0);
    this.group.add(this.pelvisGroup);

    // Central Pelvis Core Housing
    const pelvisGeom = new RoundedBoxGeometry(0.32, 0.16, 0.28, 4, 0.04);
    const pelvisMesh = new THREE.Mesh(pelvisGeom, this.materials.chassisDark);
    this.registerPart(pelvisMesh, 'pelvis', new THREE.Vector3(0, -0.15, 0));
    this.pelvisGroup.add(pelvisMesh);

    // Waist Turntable Ring
    const waistRingGeom = new THREE.CylinderGeometry(0.18, 0.19, 0.05, 32);
    const waistRingMesh = new THREE.Mesh(waistRingGeom, this.materials.jointMetal);
    waistRingMesh.position.set(0, 0.08, 0);
    this.registerPart(waistRingMesh, 'pelvis', new THREE.Vector3(0, -0.08, 0));
    this.pelvisGroup.add(waistRingMesh);

    // Front Pelvis Accent Plate
    const pelvisFrontPlateGeom = new RoundedBoxGeometry(0.22, 0.09, 0.04, 3, 0.015);
    const pelvisFrontPlate = new THREE.Mesh(pelvisFrontPlateGeom, this.materials.armorWhite);
    pelvisFrontPlate.position.set(0, -0.01, 0.14);
    this.registerPart(pelvisFrontPlate, 'pelvis', new THREE.Vector3(0, -0.15, 0.08));
    this.pelvisGroup.add(pelvisFrontPlate);

    // Left and Right Legs
    this.buildLeg(true);  // Left
    this.buildLeg(false); // Right
  }

  buildLeg(isLeft) {
    const side = isLeft ? 1 : -1;
    const legKey = isLeft ? 'Left' : 'Right';
    const posX = side * 0.18;

    // Hip Joint Pivot
    const hipPivot = new THREE.Group();
    hipPivot.position.set(posX, 0.70, 0);
    this.group.add(hipPivot);
    this.joints[`hip${legKey}`] = hipPivot;

    // Hip Hub Cylinder
    const hipHubGeom = new THREE.CylinderGeometry(0.065, 0.065, 0.08, 24);
    hipHubGeom.rotateZ(Math.PI / 2);
    const hipHub = new THREE.Mesh(hipHubGeom, this.materials.jointMetal);
    this.registerPart(hipHub, `thigh${legKey}`, new THREE.Vector3(side * 0.12, 0, 0));
    hipPivot.add(hipHub);

    // Thigh Group
    const thighGroup = new THREE.Group();
    thighGroup.position.set(0, -0.14, 0);
    hipPivot.add(thighGroup);
    this.joints[`thigh${legKey}`] = thighGroup;

    // Outer White Thigh Armor (Curved, matching reference)
    const thighArmorGeom = new RoundedBoxGeometry(0.12, 0.24, 0.18, 5, 0.04);
    const thighArmor = new THREE.Mesh(thighArmorGeom, this.materials.armorWhite);
    this.registerPart(thighArmor, `thigh${legKey}`, new THREE.Vector3(side * 0.14, -0.05, 0));
    thighGroup.add(thighArmor);

    // Distinctive Curving Cyan Accent Line on Thigh (as visible in reference image!)
    const thighGlowGeom = new THREE.TorusGeometry(0.06, 0.007, 12, 24, Math.PI * 0.9);
    thighGlowGeom.rotateY(side * Math.PI / 2);
    const thighGlow = new THREE.Mesh(thighGlowGeom, this.materials.cyanGlowSoft);
    thighGlow.position.set(side * 0.062, 0.02, 0);
    this.registerPart(thighGlow, `thigh${legKey}`, new THREE.Vector3(side * 0.18, -0.05, 0));
    thighGroup.add(thighGlow);

    // Internal Graphite Strut
    const thighStrutGeom = new THREE.CylinderGeometry(0.035, 0.035, 0.22, 16);
    const thighStrut = new THREE.Mesh(thighStrutGeom, this.materials.chassisDark);
    this.registerPart(thighStrut, `thigh${legKey}`, new THREE.Vector3(side * 0.08, -0.05, 0));
    thighGroup.add(thighStrut);

    // Knee Pivot Joint
    const kneePivot = new THREE.Group();
    kneePivot.position.set(0, -0.16, 0);
    thighGroup.add(kneePivot);
    this.joints[`knee${legKey}`] = kneePivot;

    const kneeHubGeom = new THREE.CylinderGeometry(0.055, 0.055, 0.10, 24);
    kneeHubGeom.rotateZ(Math.PI / 2);
    const kneeHub = new THREE.Mesh(kneeHubGeom, this.materials.jointMetal);
    this.registerPart(kneeHub, `knee${legKey}`, new THREE.Vector3(side * 0.10, -0.10, 0));
    kneePivot.add(kneeHub);

    // Lower Leg (Shin) Group
    const shinGroup = new THREE.Group();
    shinGroup.position.set(0, -0.14, 0);
    kneePivot.add(shinGroup);
    this.joints[`shin${legKey}`] = shinGroup;

    // Sculpted White Shin Armor
    const shinArmorGeom = new RoundedBoxGeometry(0.13, 0.20, 0.17, 5, 0.035);
    const shinArmor = new THREE.Mesh(shinArmorGeom, this.materials.armorWhite);
    this.registerPart(shinArmor, `lowerLeg${legKey}`, new THREE.Vector3(side * 0.14, -0.15, 0));
    shinGroup.add(shinArmor);

    // Shin Front Accent Recess
    const shinRecessGeom = new RoundedBoxGeometry(0.05, 0.12, 0.03, 3, 0.01);
    const shinRecess = new THREE.Mesh(shinRecessGeom, this.materials.chassisDark);
    shinRecess.position.set(0, -0.02, 0.08);
    this.registerPart(shinRecess, `lowerLeg${legKey}`, new THREE.Vector3(side * 0.14, -0.15, 0.05));
    shinGroup.add(shinRecess);

    // Dual-Wheel Mobility Foot Assembly (Front and Rear wheels per foot, matching reference!)
    const footAssembly = new THREE.Group();
    footAssembly.position.set(0, -0.18, 0);
    shinGroup.add(footAssembly);

    // Foot Carriage Bracket linking both wheels
    const carriageGeom = new RoundedBoxGeometry(0.14, 0.065, 0.28, 4, 0.02);
    const carriage = new THREE.Mesh(carriageGeom, this.materials.chassisDark);
    carriage.position.set(0, 0.04, 0);
    this.registerPart(carriage, `wheel${legKey}`, new THREE.Vector3(side * 0.12, -0.20, 0));
    footAssembly.add(carriage);

    // Carriage White Protective Top Cowling
    const cowlGeom = new RoundedBoxGeometry(0.15, 0.04, 0.24, 3, 0.015);
    const cowl = new THREE.Mesh(cowlGeom, this.materials.armorWhite);
    cowl.position.set(0, 0.08, 0);
    this.registerPart(cowl, `wheel${legKey}`, new THREE.Vector3(side * 0.15, -0.18, 0));
    footAssembly.add(cowl);

    // Build the Two Tandem Wheels per foot (Front Wheel and Rear Wheel)
    const wheelZOffsets = [0.085, -0.085];
    const wheelLabels = ['Front', 'Rear'];

    wheelZOffsets.forEach((zOffset, index) => {
      const wheelHub = new THREE.Group();
      wheelHub.position.set(0, 0, zOffset);
      footAssembly.add(wheelHub);

      // Track wheel for rolling animation
      this.wheels.push(wheelHub);

      // Wheel Tire (Dark Vulcanized Rubber)
      const wheelGeom = new THREE.CylinderGeometry(0.068, 0.068, 0.052, 32);
      wheelGeom.rotateZ(Math.PI / 2);
      const wheelTire = new THREE.Mesh(wheelGeom, this.materials.rubberTread);
      this.registerPart(wheelTire, `wheel${legKey}`, new THREE.Vector3(side * 0.18, -0.22, (index === 0 ? 0.08 : -0.08)));
      wheelHub.add(wheelTire);

      // Wheel Metallic Rim
      const rimGeom = new THREE.CylinderGeometry(0.052, 0.052, 0.054, 24);
      rimGeom.rotateZ(Math.PI / 2);
      const rim = new THREE.Mesh(rimGeom, this.materials.wheelRim);
      this.registerPart(rim, `wheel${legKey}`, new THREE.Vector3(side * 0.20, -0.22, (index === 0 ? 0.08 : -0.08)));
      wheelHub.add(rim);

      // Iconic Glowing Cyan Inner Rim Halo Ring (Visible in reference image!)
      const haloGeom = new THREE.TorusGeometry(0.046, 0.005, 12, 32);
      haloGeom.rotateY(Math.PI / 2);
      const halo = new THREE.Mesh(haloGeom, this.materials.cyanGlow);
      halo.position.set(side * 0.028, 0, 0);
      this.registerPart(halo, `wheel${legKey}`, new THREE.Vector3(side * 0.22, -0.22, (index === 0 ? 0.08 : -0.08)));
      wheelHub.add(halo);

      // Chrome Center Axle Cap with Hex Nut
      const capGeom = new THREE.CylinderGeometry(0.022, 0.022, 0.06, 16);
      capGeom.rotateZ(Math.PI / 2);
      const cap = new THREE.Mesh(capGeom, this.materials.chrome);
      this.registerPart(cap, `wheel${legKey}`, new THREE.Vector3(side * 0.23, -0.22, (index === 0 ? 0.08 : -0.08)));
      wheelHub.add(cap);
    });
  }

  buildTorso() {
    this.torsoGroup = new THREE.Group();
    this.torsoGroup.position.set(0, 1.10, 0);
    this.group.add(this.torsoGroup);
    this.joints.torso = this.torsoGroup;

    // Main Torso Armor Shell (Squircle / Rounded Box matching reference)
    // Width: 0.46, Height: 0.44, Depth: 0.36
    const torsoGeom = new RoundedBoxGeometry(0.46, 0.44, 0.36, 6, 0.08);
    const torsoMesh = new THREE.Mesh(torsoGeom, this.materials.armorWhite);
    this.registerPart(torsoMesh, 'torso', new THREE.Vector3(0, 0, 0));
    this.torsoGroup.add(torsoMesh);

    // Front Chest Display Screen Assembly (Prominent feature in reference image!)
    // Screen Frame / Bezel (Dark graphite beveled frame)
    const bezelGeom = new RoundedBoxGeometry(0.34, 0.24, 0.04, 5, 0.035);
    const bezelMesh = new THREE.Mesh(bezelGeom, this.materials.chassisDark);
    bezelMesh.position.set(0, 0.03, 0.17);
    this.registerPart(bezelMesh, 'chestScreen', new THREE.Vector3(0, 0, 0.12));
    this.torsoGroup.add(bezelMesh);

    // 4 Corner Hex Mounting Screws on Bezel
    const screwPositions = [
      [-0.15, 0.10], [0.15, 0.10],
      [-0.15, -0.04], [0.15, -0.04]
    ];
    screwPositions.forEach(([sx, sy]) => {
      const screwGeom = new THREE.CylinderGeometry(0.007, 0.007, 0.01, 8);
      screwGeom.rotateX(Math.PI / 2);
      const screw = new THREE.Mesh(screwGeom, this.materials.chrome);
      screw.position.set(sx, sy, 0.192);
      this.registerPart(screw, 'chestScreen', new THREE.Vector3(0, 0, 0.14));
      this.torsoGroup.add(screw);
    });

    // The Active Display Panel with Glowing "VISIONX" Canvas Texture
    const displayGeom = new RoundedBoxGeometry(0.30, 0.18, 0.02, 4, 0.02);
    const displayMesh = new THREE.Mesh(displayGeom, this.materials.chestScreen);
    displayMesh.position.set(0, 0.03, 0.185);
    this.registerPart(displayMesh, 'chestScreen', new THREE.Vector3(0, 0, 0.16));
    this.torsoGroup.add(displayMesh);

    // Lower Torso Horizontal Vent / Speaker Grille Slit
    const ventGeom = new RoundedBoxGeometry(0.18, 0.022, 0.03, 3, 0.008);
    const ventMesh = new THREE.Mesh(ventGeom, this.materials.chassisDark);
    ventMesh.position.set(0, -0.13, 0.17);
    this.registerPart(ventMesh, 'torso', new THREE.Vector3(0, -0.05, 0.10));
    this.torsoGroup.add(ventMesh);

    // Lower Front Sensor Line / Orange Accent Marker (as seen on robot)
    const orangeAccentGeom = new RoundedBoxGeometry(0.04, 0.008, 0.015, 2, 0.003);
    const orangeAccent = new THREE.Mesh(orangeAccentGeom, this.materials.accentOrange);
    orangeAccent.position.set(-0.10, -0.13, 0.178);
    this.registerPart(orangeAccent, 'torso', new THREE.Vector3(-0.06, -0.05, 0.10));
    this.torsoGroup.add(orangeAccent);

    // Top Shoulder Socket Insets (Lined with dark graphite and glowing cyan halo arc)
    [-1, 1].forEach((side) => {
      const socketGeom = new THREE.CylinderGeometry(0.09, 0.09, 0.06, 24);
      socketGeom.rotateZ(Math.PI / 2);
      const socketMesh = new THREE.Mesh(socketGeom, this.materials.chassisDark);
      socketMesh.position.set(side * 0.22, 0.12, 0);
      this.registerPart(socketMesh, 'torso', new THREE.Vector3(side * 0.08, 0, 0));
      this.torsoGroup.add(socketMesh);

      // Glowing Cyan Shoulder Socket Arc (Matching reference image glow!)
      const arcGeom = new THREE.TorusGeometry(0.078, 0.008, 12, 24, Math.PI * 1.2);
      arcGeom.rotateY(side * Math.PI / 2);
      arcGeom.rotateZ(Math.PI * 0.4);
      const arcMesh = new THREE.Mesh(arcGeom, this.materials.cyanGlow);
      arcMesh.position.set(side * 0.235, 0.13, 0.02);
      this.registerPart(arcMesh, 'torso', new THREE.Vector3(side * 0.12, 0, 0));
      this.torsoGroup.add(arcMesh);
    });

    // Rear Backpack (Integrated NPU Heat Sink, Cooling Fins & Auxiliary Battery)
    const packGeom = new RoundedBoxGeometry(0.32, 0.36, 0.10, 4, 0.03);
    const packMesh = new THREE.Mesh(packGeom, this.materials.chassisDark);
    packMesh.position.set(0, 0, -0.19);
    this.registerPart(packMesh, 'torso', new THREE.Vector3(0, 0, -0.15));
    this.torsoGroup.add(packMesh);

    // Rear Cooling Fins
    for (let i = 0; i < 5; i++) {
      const finGeom = new THREE.BoxGeometry(0.24, 0.012, 0.04);
      const fin = new THREE.Mesh(finGeom, this.materials.jointMetal);
      fin.position.set(0, 0.10 - i * 0.045, -0.24);
      this.registerPart(fin, 'torso', new THREE.Vector3(0, 0, -0.18));
      this.torsoGroup.add(fin);
    }

    // Rear High-Tech Status LED Bar (Cyan/Green status indicator)
    const statusLedGeom = new RoundedBoxGeometry(0.18, 0.015, 0.02, 2, 0.005);
    const statusLed = new THREE.Mesh(statusLedGeom, this.materials.cyanGlowSoft);
    statusLed.position.set(0, 0.15, -0.24);
    this.registerPart(statusLed, 'torso', new THREE.Vector3(0, 0, -0.19));
    this.torsoGroup.add(statusLed);
  }

  buildHead() {
    // Neck Gimbal (Connecting Torso to Head)
    this.neckGroup = new THREE.Group();
    this.neckGroup.position.set(0, 1.34, 0);
    this.group.add(this.neckGroup);
    this.joints.neck = this.neckGroup;

    // Dark graphite cylindrical neck joint
    const neckBaseGeom = new THREE.CylinderGeometry(0.10, 0.11, 0.05, 32);
    const neckBase = new THREE.Mesh(neckBaseGeom, this.materials.jointMetal);
    this.registerPart(neckBase, 'neck', new THREE.Vector3(0, 0.02, 0));
    this.neckGroup.add(neckBase);

    const neckPillarGeom = new THREE.CylinderGeometry(0.075, 0.075, 0.08, 24);
    const neckPillar = new THREE.Mesh(neckPillarGeom, this.materials.chassisDark);
    neckPillar.position.set(0, 0.04, 0);
    this.registerPart(neckPillar, 'neck', new THREE.Vector3(0, 0.04, 0));
    this.neckGroup.add(neckPillar);

    // Head Group (Pan / Tilt)
    this.headGroup = new THREE.Group();
    this.headGroup.position.set(0, 0.07, 0);
    this.neckGroup.add(this.headGroup);
    this.joints.head = this.headGroup;

    // Main Head Helmet Shell (White pearl squircle / rounded box matching reference)
    // Width: 0.44, Height: 0.36, Depth: 0.34
    const headGeom = new RoundedBoxGeometry(0.44, 0.36, 0.34, 6, 0.075);
    const headMesh = new THREE.Mesh(headGeom, this.materials.armorWhite);
    headMesh.position.set(0, 0.14, 0);
    this.registerPart(headMesh, 'head', new THREE.Vector3(0, 0.20, 0));
    this.headGroup.add(headMesh);

    // Recessed Black Face Visor Frame (Bezel with 4 corner mounting screws)
    const visorBezelGeom = new RoundedBoxGeometry(0.36, 0.27, 0.04, 5, 0.04);
    const visorBezel = new THREE.Mesh(visorBezelGeom, this.materials.chassisDark);
    visorBezel.position.set(0, 0.14, 0.16);
    this.registerPart(visorBezel, 'faceScreen', new THREE.Vector3(0, 0.20, 0.12));
    this.headGroup.add(visorBezel);

    // 4 Corner Screws on Head Faceplate (Visible in reference image!)
    const faceScrewPositions = [
      [-0.16, 0.24], [0.16, 0.24],
      [-0.16, 0.04], [0.16, 0.04]
    ];
    faceScrewPositions.forEach(([fx, fy]) => {
      const screwGeom = new THREE.CylinderGeometry(0.006, 0.006, 0.01, 8);
      screwGeom.rotateX(Math.PI / 2);
      const screw = new THREE.Mesh(screwGeom, this.materials.chrome);
      screw.position.set(fx, fy, 0.182);
      this.registerPart(screw, 'faceScreen', new THREE.Vector3(0, 0.20, 0.14));
      this.headGroup.add(screw);
    });

    // Glossy Face Screen with Dynamic Animated Glowing Cyan Eyes!
    const screenGeom = new RoundedBoxGeometry(0.32, 0.23, 0.02, 4, 0.025);
    const screenMesh = new THREE.Mesh(screenGeom, this.materials.faceScreen);
    screenMesh.position.set(0, 0.14, 0.176);
    this.registerPart(screenMesh, 'faceScreen', new THREE.Vector3(0, 0.20, 0.16));
    this.headGroup.add(screenMesh);
    this.faceScreenMesh = screenMesh;

    // Physical Emissive 3D Eye Lenses (Positioned right over screen for maximum 3D depth and specular highlights!)
    [-0.082, 0.082].forEach((eyeX, index) => {
      const eyeLensGeom = new THREE.CylinderGeometry(0.038, 0.042, 0.012, 32);
      eyeLensGeom.rotateX(Math.PI / 2);
      const eyeLens = new THREE.Mesh(eyeLensGeom, this.materials.cyanGlow);
      eyeLens.position.set(eyeX, 0.145, 0.187);
      this.registerPart(eyeLens, 'eyes', new THREE.Vector3(0, 0.20, 0.20));
      this.headGroup.add(eyeLens);

      // Eye outer bezel ring
      const eyeRingGeom = new THREE.TorusGeometry(0.043, 0.004, 12, 32);
      const eyeRing = new THREE.Mesh(eyeRingGeom, this.materials.jointMetal);
      eyeRing.position.set(eyeX, 0.145, 0.188);
      this.registerPart(eyeRing, 'eyes', new THREE.Vector3(0, 0.20, 0.20));
      this.headGroup.add(eyeRing);
    });

    // Pill-Shaped Lateral Ear Sensor Pods (Both left and right sides, matching reference image!)
    [-1, 1].forEach((side) => {
      const earGroup = new THREE.Group();
      earGroup.position.set(side * 0.222, 0.14, 0);
      this.headGroup.add(earGroup);

      // Dark recessed ear cavity
      const earCavityGeom = new RoundedBoxGeometry(0.02, 0.18, 0.09, 3, 0.02);
      const earCavity = new THREE.Mesh(earCavityGeom, this.materials.chassisDark);
      this.registerPart(earCavity, 'ears', new THREE.Vector3(side * 0.15, 0.20, 0));
      earGroup.add(earCavity);

      // Glowing Cyan Ear Slot Light (The vertical capsule light seen clearly in reference image!)
      const earSlotGeom = new RoundedBoxGeometry(0.015, 0.14, 0.05, 3, 0.015);
      const earSlot = new THREE.Mesh(earSlotGeom, this.materials.cyanGlow);
      earSlot.position.set(side * 0.006, 0, 0);
      this.registerPart(earSlot, 'ears', new THREE.Vector3(side * 0.18, 0.20, 0));
      earGroup.add(earSlot);
    });

    // Top Sensor Dome & Spatial Mic Port
    const topSensorGeom = new THREE.CylinderGeometry(0.035, 0.045, 0.02, 24);
    const topSensor = new THREE.Mesh(topSensorGeom, this.materials.jointMetal);
    topSensor.position.set(0, 0.325, 0.02);
    this.registerPart(topSensor, 'head', new THREE.Vector3(0, 0.28, 0));
    this.headGroup.add(topSensor);

    const topLensGeom = new THREE.SphereGeometry(0.018, 16, 16);
    const topLens = new THREE.Mesh(topLensGeom, this.materials.cyanGlowSoft);
    topLens.position.set(0, 0.336, 0.02);
    this.registerPart(topLens, 'head', new THREE.Vector3(0, 0.30, 0));
    this.headGroup.add(topLens);
  }

  buildArms() {
    this.buildArm(true);  // Left arm
    this.buildArm(false); // Right arm
  }

  buildArm(isLeft) {
    const side = isLeft ? 1 : -1;
    const armKey = isLeft ? 'Left' : 'Right';
    const shoulderX = side * 0.29;

    // Shoulder Pivot Group (Pitch & Roll articulation)
    const shoulderPivot = new THREE.Group();
    shoulderPivot.position.set(shoulderX, 1.22, 0);
    this.group.add(shoulderPivot);
    this.joints[`shoulder${armKey}`] = shoulderPivot;

    // Spherical White Outer Shoulder Armor Cap
    const shoulderCapGeom = new THREE.SphereGeometry(0.082, 32, 24);
    const shoulderCap = new THREE.Mesh(shoulderCapGeom, this.materials.armorWhite);
    this.registerPart(shoulderCap, `shoulder${armKey}`, new THREE.Vector3(side * 0.18, 0.05, 0));
    shoulderPivot.add(shoulderCap);

    // Iconic Circular Cyan Glow Ring on Outer Shoulder Cap (Visible in reference image!)
    const shoulderHaloGeom = new THREE.TorusGeometry(0.058, 0.007, 12, 32);
    shoulderHaloGeom.rotateY(Math.PI / 2);
    const shoulderHalo = new THREE.Mesh(shoulderHaloGeom, this.materials.cyanGlow);
    shoulderHalo.position.set(side * 0.065, 0, 0);
    this.registerPart(shoulderHalo, `shoulder${armKey}`, new THREE.Vector3(side * 0.22, 0.05, 0));
    shoulderPivot.add(shoulderHalo);

    // Shoulder Internal Joint Core
    const shoulderCoreGeom = new THREE.CylinderGeometry(0.055, 0.055, 0.08, 20);
    shoulderCoreGeom.rotateZ(Math.PI / 2);
    const shoulderCore = new THREE.Mesh(shoulderCoreGeom, this.materials.chassisDark);
    this.registerPart(shoulderCore, `shoulder${armKey}`, new THREE.Vector3(side * 0.10, 0.05, 0));
    shoulderPivot.add(shoulderCore);

    // Upper Arm Link Group
    const upperArmGroup = new THREE.Group();
    upperArmGroup.position.set(side * 0.03, -0.11, 0);
    shoulderPivot.add(upperArmGroup);
    this.joints[`upperArm${armKey}`] = upperArmGroup;

    // Upper Arm White Armor Shell (Streamlined shell)
    const upperArmArmorGeom = new RoundedBoxGeometry(0.09, 0.18, 0.10, 4, 0.025);
    const upperArmArmor = new THREE.Mesh(upperArmArmorGeom, this.materials.armorWhite);
    this.registerPart(upperArmArmor, `arm${armKey}`, new THREE.Vector3(side * 0.20, 0, 0));
    upperArmGroup.add(upperArmArmor);

    // Internal Dark Mechanical Skeletal Strut
    const armStrutGeom = new THREE.CylinderGeometry(0.032, 0.032, 0.19, 16);
    const armStrut = new THREE.Mesh(armStrutGeom, this.materials.chassisDark);
    this.registerPart(armStrut, `arm${armKey}`, new THREE.Vector3(side * 0.14, 0, 0));
    upperArmGroup.add(armStrut);

    // Elbow Joint Group (Flexion articulation)
    const elbowPivot = new THREE.Group();
    elbowPivot.position.set(0, -0.11, 0);
    upperArmGroup.add(elbowPivot);
    this.joints[`elbow${armKey}`] = elbowPivot;

    // Dark Graphite Mechanical Elbow Hinge Cylinder
    const elbowHingeGeom = new THREE.CylinderGeometry(0.048, 0.048, 0.075, 24);
    elbowHingeGeom.rotateZ(Math.PI / 2);
    const elbowHinge = new THREE.Mesh(elbowHingeGeom, this.materials.jointMetal);
    this.registerPart(elbowHinge, `elbow${armKey}`, new THREE.Vector3(side * 0.18, -0.06, 0));
    elbowPivot.add(elbowHinge);

    // Elbow Chrome Hinge Pivot Pin
    const elbowPinGeom = new THREE.CylinderGeometry(0.022, 0.022, 0.082, 16);
    elbowPinGeom.rotateZ(Math.PI / 2);
    const elbowPin = new THREE.Mesh(elbowPinGeom, this.materials.chrome);
    this.registerPart(elbowPin, `elbow${armKey}`, new THREE.Vector3(side * 0.20, -0.06, 0));
    elbowPivot.add(elbowPin);

    // Forearm Group
    const forearmGroup = new THREE.Group();
    forearmGroup.position.set(0, -0.11, 0);
    elbowPivot.add(forearmGroup);
    this.joints[`forearm${armKey}`] = forearmGroup;

    // Forearm White Armor Shroud (Tapered, matching reference)
    const forearmArmorGeom = new RoundedBoxGeometry(0.085, 0.18, 0.09, 4, 0.022);
    const forearmArmor = new THREE.Mesh(forearmArmorGeom, this.materials.armorWhite);
    this.registerPart(forearmArmor, `forearm${armKey}`, new THREE.Vector3(side * 0.22, -0.12, 0));
    forearmGroup.add(forearmArmor);

    // Forearm Dark Recessed Channel
    const forearmRecessGeom = new RoundedBoxGeometry(0.03, 0.12, 0.02, 2, 0.008);
    const forearmRecess = new THREE.Mesh(forearmRecessGeom, this.materials.chassisDark);
    forearmRecess.position.set(0, 0, 0.045);
    this.registerPart(forearmRecess, `forearm${armKey}`, new THREE.Vector3(side * 0.22, -0.12, 0.04));
    forearmGroup.add(forearmRecess);

    // Wrist Collar Group (Yaw & Roll)
    const wristPivot = new THREE.Group();
    wristPivot.position.set(0, -0.11, 0);
    forearmGroup.add(wristPivot);
    this.joints[`wrist${armKey}`] = wristPivot;

    const wristCollarGeom = new THREE.CylinderGeometry(0.04, 0.044, 0.04, 20);
    const wristCollar = new THREE.Mesh(wristCollarGeom, this.materials.jointMetal);
    this.registerPart(wristCollar, `wrist${armKey}`, new THREE.Vector3(side * 0.20, -0.18, 0));
    wristPivot.add(wristCollar);

    // Dexterous Robotic Hand & Fingers (Dark graphite articulated fingers matching reference!)
    const handGroup = new THREE.Group();
    handGroup.position.set(0, -0.04, 0);
    wristPivot.add(handGroup);
    this.joints[`hand${armKey}`] = handGroup;

    // Palm Core
    const palmGeom = new RoundedBoxGeometry(0.065, 0.065, 0.035, 3, 0.012);
    const palm = new THREE.Mesh(palmGeom, this.materials.chassisDark);
    this.registerPart(palm, `hand${armKey}`, new THREE.Vector3(side * 0.22, -0.22, 0));
    handGroup.add(palm);

    // White Backhand Shield Plate
    const backhandGeom = new RoundedBoxGeometry(0.068, 0.055, 0.012, 2, 0.004);
    const backhand = new THREE.Mesh(backhandGeom, this.materials.armorWhite);
    backhand.position.set(0, 0, -0.018);
    this.registerPart(backhand, `hand${armKey}`, new THREE.Vector3(side * 0.22, -0.22, -0.04));
    handGroup.add(backhand);

    // Articulated Fingers (Index, Middle, Ring) and Opposable Thumb
    const fingerPositions = [-0.022, 0.0, 0.022];
    const fingers = [];

    fingerPositions.forEach((fx, fIdx) => {
      const fingerRoot = new THREE.Group();
      fingerRoot.position.set(fx, -0.035, 0);
      handGroup.add(fingerRoot);

      // Proximal Phalanx
      const proxGeom = new RoundedBoxGeometry(0.016, 0.045, 0.016, 2, 0.004);
      const prox = new THREE.Mesh(proxGeom, this.materials.chassisDark);
      prox.position.set(0, -0.022, 0);
      this.registerPart(prox, `hand${armKey}`, new THREE.Vector3(side * 0.24, -0.25 - fIdx * 0.02, 0));
      fingerRoot.add(prox);

      // Distal Joint Pivot
      const distPivot = new THREE.Group();
      distPivot.position.set(0, -0.045, 0);
      fingerRoot.add(distPivot);

      // Distal Phalanx with High-Grip Silicone Tactile Tip
      const distGeom = new RoundedBoxGeometry(0.014, 0.035, 0.014, 2, 0.003);
      const dist = new THREE.Mesh(distGeom, this.materials.jointMetal);
      dist.position.set(0, -0.018, 0);
      this.registerPart(dist, `hand${armKey}`, new THREE.Vector3(side * 0.25, -0.28 - fIdx * 0.02, 0));
      distPivot.add(dist);

      fingers.push({ root: fingerRoot, distal: distPivot });
    });

    // Opposable Thumb
    const thumbRoot = new THREE.Group();
    thumbRoot.position.set(-side * 0.032, -0.015, 0.012);
    thumbRoot.rotation.z = side * 0.45;
    thumbRoot.rotation.y = side * 0.35;
    handGroup.add(thumbRoot);

    const thumbProxGeom = new RoundedBoxGeometry(0.015, 0.038, 0.015, 2, 0.003);
    const thumbProx = new THREE.Mesh(thumbProxGeom, this.materials.chassisDark);
    thumbProx.position.set(0, -0.018, 0);
    this.registerPart(thumbProx, `hand${armKey}`, new THREE.Vector3(side * 0.20, -0.22, 0.06));
    thumbRoot.add(thumbProx);

    const thumbDistPivot = new THREE.Group();
    thumbDistPivot.position.set(0, -0.036, 0);
    thumbRoot.add(thumbDistPivot);

    const thumbDistGeom = new RoundedBoxGeometry(0.013, 0.028, 0.013, 2, 0.003);
    const thumbDist = new THREE.Mesh(thumbDistGeom, this.materials.jointMetal);
    thumbDist.position.set(0, -0.014, 0);
    this.registerPart(thumbDist, `hand${armKey}`, new THREE.Vector3(side * 0.20, -0.24, 0.08));
    thumbDistPivot.add(thumbDist);

    this.joints[`fingers${armKey}`] = { fingers, thumb: { root: thumbRoot, distal: thumbDistPivot } };
  }

  // Exploded View Slider (0.0 to 1.0)
  setExplodedProgress(t) {
    this.explodedParts.forEach((mesh) => {
      const orig = mesh.userData.originalPosition;
      const offset = mesh.userData.explodeOffset;
      if (orig && offset) {
        mesh.position.copy(orig).addScaledVector(offset, t);
      }
    });
  }

  // Material Mode Switcher (realistic, clay, wireframe, xray)
  setMaterialMode(mode) {
    this.interactiveMeshes.forEach((mesh) => {
      if (mode === 'wireframe') {
        mesh.material = this.materials.wireframeMat;
      } else if (mode === 'clay') {
        mesh.material = this.materials.clayMat;
      } else if (mode === 'xray') {
        mesh.material = this.materials.xrayMat;
      } else {
        // Restore original realistic material
        const key = mesh.userData.componentKey;
        if (key === 'faceScreen') {
          mesh.material = this.materials.faceScreen;
        } else if (key === 'chestScreen') {
          mesh.material = this.materials.chestScreen;
        } else if (key === 'eyes') {
          mesh.material = this.materials.cyanGlow;
        } else if (key === 'ears') {
          mesh.material = this.materials.cyanGlow;
        } else if (key && (key.startsWith('wheel'))) {
          mesh.material = (mesh.geometry.type === 'TorusGeometry') ? this.materials.cyanGlow : this.materials.rubberTread;
        } else if (mesh.material === this.materials.accentOrange) {
          mesh.material = this.materials.accentOrange;
        } else if (mesh.geometry.type === 'SphereGeometry' || mesh.geometry.type === 'RoundedBoxGeometry') {
          // If was chassis or armor
          if (mesh.userData.isDark || key === 'neck' || key === 'pelvis') {
            mesh.material = this.materials.chassisDark;
          } else {
            mesh.material = this.materials.armorWhite;
          }
        } else {
          mesh.material = this.materials.jointMetal;
        }
      }
    });
  }

  // Component Selection Highlighting
  highlightComponent(componentKey, isHover = true) {
    // Clear previous temporary highlights if not selected
    this.interactiveMeshes.forEach((m) => {
      if (m.userData.isHighlighted && m.userData.componentKey !== this.selectedKey) {
        m.material = m.userData.savedMaterial;
        m.userData.isHighlighted = false;
      }
    });

    if (!componentKey || !this.components.has(componentKey)) return;

    const meshes = this.components.get(componentKey);
    meshes.forEach((m) => {
      if (!m.userData.isHighlighted) {
        m.userData.savedMaterial = m.material;
        m.material = isHover ? this.materials.hoverOutlineMat : this.materials.selectedGlowMat;
        m.userData.isHighlighted = true;
      }
    });
  }

  selectComponent(componentKey) {
    this.selectedKey = componentKey;
    this.interactiveMeshes.forEach((m) => {
      if (m.userData.isHighlighted) {
        m.material = m.userData.savedMaterial;
        m.userData.isHighlighted = false;
      }
    });

    if (componentKey && this.components.has(componentKey)) {
      const meshes = this.components.get(componentKey);
      meshes.forEach((m) => {
        m.userData.savedMaterial = m.material;
        m.material = this.materials.selectedGlowMat;
        m.userData.isHighlighted = true;
      });
    }
  }

  // Rotate wheels during roll animation
  rollWheels(angleDelta) {
    this.wheels.forEach((w) => {
      w.rotation.x += angleDelta;
    });
  }
}
