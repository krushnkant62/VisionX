import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';

export class HouseholdScene {
  constructor(scene) {
    this.scene = scene;
    this.group = new THREE.Group();
    this.group.name = 'Household_Interior';
    this.group.visible = false;
    this.scene.add(this.group);

    this.buildRoom();
    this.buildKitchenAndFridge();
    this.buildLivingArea();
    this.buildSabjiBowl();
    this.buildNavigationPath();
  }

  buildRoom() {
    // 1. Hardwood Living / Kitchen Floor
    const floorGeom = new THREE.PlaneGeometry(12, 10);
    floorGeom.rotateX(-Math.PI / 2);
    const floorMat = new THREE.MeshStandardMaterial({
      color: 0x3d3024,
      roughness: 0.65,
      metalness: 0.1
    });
    const floor = new THREE.Mesh(floorGeom, floorMat);
    floor.position.y = 0;
    floor.receiveShadow = true;
    this.group.add(floor);

    // Subtle floor plank lines
    const grid = new THREE.GridHelper(12, 24, 0x5a4838, 0x2e2319);
    grid.position.y = 0.002;
    this.group.add(grid);

    // 2. Interior Walls
    const wallMat = new THREE.MeshStandardMaterial({
      color: 0x22262e,
      roughness: 0.85
    });

    // Back Wall
    const backWallGeom = new THREE.BoxGeometry(12, 4.0, 0.2);
    const backWall = new THREE.Mesh(backWallGeom, wallMat);
    backWall.position.set(0, 2.0, -5.0);
    backWall.receiveShadow = true;
    this.group.add(backWall);

    // Left Wall
    const leftWallGeom = new THREE.BoxGeometry(0.2, 4.0, 10);
    const leftWall = new THREE.Mesh(leftWallGeom, wallMat);
    leftWall.position.set(-6.0, 2.0, 0);
    leftWall.receiveShadow = true;
    this.group.add(leftWall);

    // Decorative Wall Wood Slat Accent
    for (let i = 0; i < 14; i++) {
      const slatGeom = new THREE.BoxGeometry(0.08, 3.8, 0.04);
      const slatMat = new THREE.MeshStandardMaterial({ color: 0x5c432d, roughness: 0.6 });
      const slat = new THREE.Mesh(slatGeom, slatMat);
      slat.position.set(-5.85, 2.0, -4.5 + i * 0.25);
      this.group.add(slat);
    }
  }

  buildKitchenAndFridge() {
    // 1. Kitchen Counter Island / Cabinets
    const counterGeom = new RoundedBoxGeometry(3.2, 0.95, 1.1, 4, 0.03);
    const counterMat = new THREE.MeshStandardMaterial({
      color: 0x181c22,
      roughness: 0.4,
      metalness: 0.3
    });
    const counter = new THREE.Mesh(counterGeom, counterMat);
    counter.position.set(3.2, 0.475, -4.0);
    counter.castShadow = true;
    counter.receiveShadow = true;
    this.group.add(counter);

    // White Quartz Countertop
    const topGeom = new RoundedBoxGeometry(3.3, 0.06, 1.2, 3, 0.015);
    const topMat = new THREE.MeshStandardMaterial({
      color: 0xe8ecf0,
      roughness: 0.2,
      metalness: 0.05
    });
    const top = new THREE.Mesh(topGeom, topMat);
    top.position.set(3.2, 0.98, -4.0);
    top.castShadow = true;
    top.receiveShadow = true;
    this.group.add(top);

    // Kitchen Sink & Faucet
    const sinkGeom = new RoundedBoxGeometry(0.8, 0.02, 0.5, 3, 0.01);
    const sinkMat = new THREE.MeshStandardMaterial({ color: 0x22262d, roughness: 0.3, metalness: 0.8 });
    const sink = new THREE.Mesh(sinkGeom, sinkMat);
    sink.position.set(2.4, 1.015, -4.0);
    this.group.add(sink);

    const faucetGeom = new THREE.TorusGeometry(0.12, 0.018, 12, 24, Math.PI);
    faucetGeom.rotateZ(Math.PI / 2);
    const faucetMat = new THREE.MeshStandardMaterial({ color: 0xd8dee9, metalness: 0.9, roughness: 0.1 });
    const faucet = new THREE.Mesh(faucetGeom, faucetMat);
    faucet.position.set(2.4, 1.14, -4.2);
    this.group.add(faucet);

    // 2. High-Tech Smart Refrigerator
    this.fridgeGroup = new THREE.Group();
    this.fridgeGroup.position.set(5.1, 0, -3.8);
    this.group.add(this.fridgeGroup);

    // Fridge Body
    const fridgeBodyGeom = new RoundedBoxGeometry(1.2, 2.2, 0.95, 4, 0.04);
    const fridgeMat = new THREE.MeshStandardMaterial({
      color: 0x282e36,
      roughness: 0.35,
      metalness: 0.75
    });
    const fridgeBody = new THREE.Mesh(fridgeBodyGeom, fridgeMat);
    fridgeBody.position.set(0, 1.1, 0);
    fridgeBody.castShadow = true;
    fridgeBody.receiveShadow = true;
    this.fridgeGroup.add(fridgeBody);

    // Fridge Door Hinge Pivot (For animated opening)
    this.fridgeDoorPivot = new THREE.Group();
    this.fridgeDoorPivot.position.set(-0.58, 1.1, 0.48);
    this.fridgeGroup.add(this.fridgeDoorPivot);

    const doorGeom = new RoundedBoxGeometry(1.16, 1.35, 0.08, 4, 0.02);
    const doorMat = new THREE.MeshStandardMaterial({
      color: 0x1f242b,
      roughness: 0.3,
      metalness: 0.8
    });
    const door = new THREE.Mesh(doorGeom, doorMat);
    door.position.set(0.58, 0.28, 0);
    door.castShadow = true;
    this.fridgeDoorPivot.add(door);

    // Fridge Door Handle
    const handleGeom = new THREE.CylinderGeometry(0.014, 0.014, 0.6, 16);
    const handleMat = new THREE.MeshStandardMaterial({ color: 0xd8dee9, metalness: 0.95, roughness: 0.1 });
    const handle = new THREE.Mesh(handleGeom, handleMat);
    handle.position.set(1.08, 0.28, 0.06);
    this.fridgeDoorPivot.add(handle);

    // Inside Shelf
    const shelfGeom = new THREE.BoxGeometry(1.0, 0.02, 0.7);
    const shelfMat = new THREE.MeshStandardMaterial({ color: 0x88ccff, transparent: true, opacity: 0.6 });
    const shelf = new THREE.Mesh(shelfGeom, shelfMat);
    shelf.position.set(0, 1.35, 0);
    this.fridgeGroup.add(shelf);

    // Inside Refrigerator Warm LED Light
    this.fridgeLight = new THREE.PointLight(0xfff3d6, 1.8, 2.5);
    this.fridgeLight.position.set(0, 1.8, 0.1);
    this.fridgeGroup.add(this.fridgeLight);

    // Target Bounding Box Reticle for HUD perception (Object Identification)
    const bboxGeom = new THREE.BoxGeometry(1.35, 2.35, 1.1);
    const bboxEdges = new THREE.EdgesGeometry(bboxGeom);
    this.fridgeBBox = new THREE.LineSegments(
      bboxEdges,
      new THREE.LineBasicMaterial({ color: 0x00ff88, transparent: true, opacity: 0.9 })
    );
    this.fridgeBBox.position.set(0, 1.1, 0);
    this.fridgeBBox.visible = false;
    this.fridgeGroup.add(this.fridgeBBox);
  }

  buildSabjiBowl() {
    this.bowlGroup = new THREE.Group();
    // Default position inside refrigerator on the shelf
    this.bowlGroup.position.set(5.1, 1.37, -3.75);
    this.group.add(this.bowlGroup);

    // Ceramic Bowl Body
    const bowlGeom = new THREE.CylinderGeometry(0.12, 0.07, 0.075, 24);
    const bowlMat = new THREE.MeshStandardMaterial({
      color: 0xf0f4f8,
      roughness: 0.25,
      metalness: 0.05
    });
    const bowl = new THREE.Mesh(bowlGeom, bowlMat);
    bowl.castShadow = true;
    this.bowlGroup.add(bowl);

    // Delicious Indian Sabji (Rich spiced curry with vegetables & coriander flakes!)
    const sabjiGeom = new THREE.CylinderGeometry(0.11, 0.08, 0.025, 24);
    const sabjiMat = new THREE.MeshStandardMaterial({
      color: 0xd95d08, // Rich golden-orange turmeric / tikka masala curry
      roughness: 0.45,
      metalness: 0.1
    });
    const sabji = new THREE.Mesh(sabjiGeom, sabjiMat);
    sabji.position.y = 0.03;
    this.bowlGroup.add(sabji);

    // Green coriander garnish flecks
    for (let i = 0; i < 7; i++) {
      const flakeGeom = new THREE.BoxGeometry(0.015, 0.005, 0.015);
      const flakeMat = new THREE.MeshStandardMaterial({ color: 0x2e7d32 });
      const flake = new THREE.Mesh(flakeGeom, flakeMat);
      const angle = (i / 7) * Math.PI * 2;
      flake.position.set(Math.cos(angle) * 0.05, 0.045, Math.sin(angle) * 0.05);
      this.bowlGroup.add(flake);
    }

    // Bowl Target Bounding Box
    const bowlBBoxGeom = new THREE.BoxGeometry(0.28, 0.14, 0.28);
    const bowlBBoxEdges = new THREE.EdgesGeometry(bowlBBoxGeom);
    this.bowlBBox = new THREE.LineSegments(
      bowlBBoxEdges,
      new THREE.LineBasicMaterial({ color: 0x00e5ff, transparent: true, opacity: 0.9 })
    );
    this.bowlBBox.visible = false;
    this.bowlGroup.add(this.bowlBBox);
  }

  buildLivingArea() {
    // 1. Modern Dining / Living Room Table
    const tableGeom = new THREE.CylinderGeometry(1.0, 1.0, 0.04, 32);
    const tableMat = new THREE.MeshStandardMaterial({ color: 0x423223, roughness: 0.5 });
    const table = new THREE.Mesh(tableGeom, tableMat);
    table.position.set(-2.0, 0.72, -1.0);
    table.castShadow = true;
    table.receiveShadow = true;
    this.group.add(table);

    const tableLegGeom = new THREE.CylinderGeometry(0.06, 0.06, 0.72, 16);
    const tableLeg = new THREE.Mesh(tableLegGeom, new THREE.MeshStandardMaterial({ color: 0x1a1a1a }));
    tableLeg.position.set(-2.0, 0.36, -1.0);
    this.group.add(tableLeg);

    // 2. Obstacle in Robot's Path (A modern Scandinavian lounge stool / chair)
    this.obstacleChair = new THREE.Group();
    this.obstacleChair.position.set(2.0, 0, -1.8);
    this.group.add(this.obstacleChair);

    const stoolGeom = new RoundedBoxGeometry(0.55, 0.45, 0.55, 3, 0.05);
    const stoolMat = new THREE.MeshStandardMaterial({ color: 0x8b5a2b, roughness: 0.7 });
    const stool = new THREE.Mesh(stoolGeom, stoolMat);
    stool.position.y = 0.225;
    stool.castShadow = true;
    stool.receiveShadow = true;
    this.obstacleChair.add(stool);

    // Obstacle Hazard Proximity Ring (Cyan/Red warning ring)
    const hazardGeom = new THREE.RingGeometry(0.55, 0.60, 32);
    hazardGeom.rotateX(-Math.PI / 2);
    this.hazardRing = new THREE.Mesh(
      hazardGeom,
      new THREE.MeshBasicMaterial({ color: 0xff3b30, transparent: true, opacity: 0.0 })
    );
    this.hazardRing.position.y = 0.005;
    this.obstacleChair.add(this.hazardRing);

    // 3. Modern Living Sofa
    const sofaGeom = new RoundedBoxGeometry(2.4, 0.7, 0.9, 4, 0.08);
    const sofaMat = new THREE.MeshStandardMaterial({ color: 0x2a333d, roughness: 0.8 });
    const sofa = new THREE.Mesh(sofaGeom, sofaMat);
    sofa.position.set(-2.4, 0.35, 2.4);
    sofa.castShadow = true;
    this.group.add(sofa);

    // 4. House Plant in Ceramic Pot
    const potGeom = new THREE.CylinderGeometry(0.2, 0.14, 0.4, 20);
    const potMat = new THREE.MeshStandardMaterial({ color: 0xe0e6ed, roughness: 0.3 });
    const pot = new THREE.Mesh(potGeom, potMat);
    pot.position.set(-4.5, 0.2, -4.2);
    this.group.add(pot);

    const foliageGeom = new THREE.SphereGeometry(0.35, 16, 16);
    const foliageMat = new THREE.MeshStandardMaterial({ color: 0x2e6930, roughness: 0.9 });
    const foliage = new THREE.Mesh(foliageGeom, foliageMat);
    foliage.position.set(-4.5, 0.6, -4.2);
    this.group.add(foliage);
  }

  buildNavigationPath() {
    // Spline curve demonstrating autonomous obstacle avoidance trajectory from user to fridge
    const curvePoints = [
      new THREE.Vector3(0, 0.015, 1.8),     // User starting origin
      new THREE.Vector3(0.5, 0.015, 0.5),   // Approaching corridor
      new THREE.Vector3(0.8, 0.015, -1.0),  // Steering left around obstacle stool
      new THREE.Vector3(2.8, 0.015, -2.4),  // Safe clearance turn
      new THREE.Vector3(4.2, 0.015, -3.5)   // In front of refrigerator!
    ];

    this.navCurve = new THREE.CatmullRomCurve3(curvePoints);
    const points = this.navCurve.getPoints(50);
    const pathGeom = new THREE.BufferGeometry().setFromPoints(points);

    this.navPathLine = new THREE.Line(
      pathGeom,
      new THREE.LineBasicMaterial({
        color: 0x00e5ff,
        linewidth: 3,
        transparent: true,
        opacity: 0.85
      })
    );
    this.navPathLine.visible = false;
    this.group.add(this.navPathLine);

    // Animated path waypoint pulses
    this.waypointMarkers = [];
    points.forEach((p, i) => {
      if (i % 10 === 0) {
        const ringGeom = new THREE.RingGeometry(0.06, 0.08, 16);
        ringGeom.rotateX(-Math.PI / 2);
        const ring = new THREE.Mesh(
          ringGeom,
          new THREE.MeshBasicMaterial({ color: 0x00e5ff, side: THREE.DoubleSide, transparent: true, opacity: 0.7 })
        );
        ring.position.copy(p);
        this.group.add(ring);
        this.waypointMarkers.push(ring);
      }
    });
  }

  setVisible(visible) {
    this.group.visible = visible;
  }

  setDoorOpen(angle) {
    if (this.fridgeDoorPivot) {
      this.fridgeDoorPivot.rotation.y = angle;
    }
  }

  setBBoxesVisible(visible) {
    if (this.fridgeBBox) this.fridgeBBox.visible = visible;
    if (this.bowlBBox) this.bowlBBox.visible = visible;
    if (this.hazardRing) this.hazardRing.material.opacity = visible ? 0.8 : 0.0;
  }

  setPathVisible(visible) {
    if (this.navPathLine) this.navPathLine.visible = visible;
    this.waypointMarkers.forEach(m => m.visible = visible);
  }
}
