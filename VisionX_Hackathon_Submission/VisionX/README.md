# 🤖 VISIONX — Autonomous Household Robot & 3D Engineering Simulation

[![Built with Three.js](https://img.shields.io/badge/Three.js-WebGL_3D-black?style=for-the-badge&logo=three.js)](https://threejs.org/)
[![Vite](https://img.shields.io/badge/Vite-5.x-646CFF?style=for-the-badge&logo=vite)](https://vitejs.dev/)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/)
[![Status](https://img.shields.io/badge/Status-Hackathon_Ready-00E5FF?style=for-the-badge)](#)

> **An interactive 3D digital twin and realistic autonomous robotics simulation for household domestic assistance, domestic logistics, and human-robot interaction (HRI).**

---

## 🌟 Executive Summary & Problem Statement

Modern domestic robotics faces a critical barrier: **bridging high-level natural language intent with real-world spatial perception, dynamic obstacle navigation, and dexterous manipulation**. 

**VISIONX** is an end-to-end 3D engineering platform that simulates and visualizes an autonomous household robot capable of performing complex domestic fetch-and-carry tasks in cluttered indoor environments (benchmarked on the classic Indian household scenario: *"Bring the bowl of sabji from the refrigerator"*).

Through high-fidelity WebGL graphics and real-time telemetry, VisionX demonstrates mechanical kinematics, sensor fusion, spatial SLAM, and multi-stage autonomous mission execution in a web browser.

---

## 🚀 Key Features

### 1. 🔬 Interactive 3D Engineering Studio
- **Dynamic 3D Digital Twin**: High-poly PBR model with carbon-aerogel body shells, brushed aluminum linkages, copper busbars, and illuminated status matrices.
- **Exploded View Architecture**: Continuous 0%–100% interactive exploded assembly view revealing inner actuators, LiDAR hub, computing core, and tandem wheel pods.
- **Multi-Modal Inspection Render Modes**:
  - 🌐 **Standard PBR**: Photorealistic materials with studio lighting.
  - 🦴 **X-Ray Transparent**: View internal mechanisms, gear trains, and cable routing.
  - 🌡️ **Thermal Heatmap**: Visualizes heat dissipation across 550 TOPS compute modules and battery packs.
  - 📐 **Wireframe CAD**: Inspect structural geometry, polygon density, and joint meshes.
- **Component Telemetry Raycasting**: Hover or click any part of the robot to inspect its Degrees of Freedom (DoF), sensor specs, materials, and health status in real time.
- **Multi-Angle Camera Presets**: Isometric, Front, Rear, Top, Visor, Wheels, and Auto-Spin.

### 2. 🍲 Autonomous Household Mission: "Sabji Fetch"
Simulates a complete real-world domestic task split across 7 autonomous phases:
1. **NLP Voice Instruction Parsing**: Decodes *“Bring the bowl of sabji from the refrigerator”* into structured intent, source, item, and recipient targets.
2. **3D Spatial SLAM & Visual Detection**: Stereo RGB-D cameras & LiDAR triangulate appliances, kitchen counters, and the sabji bowl with 99% confidence.
3. **A\* Pathfinding & Costmap Generation**: Computes collision-free Catmull-Rom splines maintaining 0.45m clearance around indoor obstacles.
4. **Tandem Wheel Mobility & Obstacle Clearance**: Dual-wheel glide steering navigates past dining stools and tight hallways.
5. **Smart Appliance Docking**: Precision alignment and magnetic latch opening of the refrigerator door.
6. **Dexterous Grasp & Retrieval**: Articulated robotic arm with tactile fingertips secures the bowl using calibrated 14N grip force.
7. **Delivery & Expressive HRI**: Autonomous transit back to user with expressive OLED face graphics.

---

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| **Core 3D Engine** | Three.js (r162) WebGL Rendering |
| **Build & Bundling** | Vite 5 |
| **Logic & State** | Modular Vanilla JavaScript (ES Modules) |
| **Interface & Styling** | Custom Cyber-Aerospace Glassmorphism CSS |
| **Iconography & Badges** | Lucide Icons + Custom SVG Vectors |

---

## 📂 Project Architecture

```
VisionX/
├── index.html               # Main HTML entry with UI panels & WebGL container
├── package.json             # Project dependencies & scripts
├── vite.config.js           # Vite configuration with relative portable base
├── start.bat                # 1-click Windows dev runner (install + launch)
├── build.bat                # 1-click Windows production bundler
├── preview.bat              # 1-click production preview server
├── dist/                    # Compiled production-ready standalone build
└── src/
    ├── main.js              # Application bootstrapper & event controller
    ├── style.css            # Responsive futuristic design system
    ├── robot/
    │   ├── VisionXRobot.js      # Complete 3D procedural geometry & kinematic hierarchy
    │   ├── Materials.js         # PBR, X-Ray, Thermal, and Wireframe material shaders
    │   ├── Animations.js        # Pose interpolations, head nods, wheel drive loops
    │   └── ComponentMetadata.js # Engineering telemetry database for raycasting
    ├── scene/
    │   ├── Environment.js       # Studio lighting, shadows, and reflective ground
    │   ├── StudioScene.js       # 3D inspection studio stage
    │   └── HouseholdScene.js    # Living room, kitchen counter, fridge & obstacle props
    └── simulation/
        └── SabjiMission.js      # 7-stage mission state machine & camera choreography
```

---

## ⚡ Quick Start Guide

### Prerequisites
- [Node.js](https://nodejs.org/) (Version 18.0 or higher)
- NPM (comes with Node.js)

### Option A: 1-Click Launch (Windows)
Double-click **`start.bat`**. It will automatically install packages (if not already installed) and open the dev server.

### Option B: Terminal Setup
```bash
# 1. Clone or extract the project folder
cd VisionX

# 2. Install dependencies
npm install

# 3. Start local development server
npm run dev
```
Open **`http://localhost:5173`** in your browser.

---

## 📦 Production Build & Deployment

To generate an optimized, minified bundle:
```bash
npm run build
```
The compiled static website will be in the **`dist/`** directory. It is completely portable and can be deployed in seconds to:
- **Vercel**: Drag and drop the `dist/` folder into your Vercel Dashboard.
- **Netlify**: Drag and drop the `dist/` folder into Netlify Drop.
- **GitHub Pages**: Push the repository and configure GitHub Pages to serve `dist/`.
- **Local Preview**: Run `npm run preview`.

---

## 🏆 Hackathon Submission Pitch

- **Track**: AI & Robotics / Emerging Technologies / Assistive Living
- **Innovation**: Real-time browser-based 3D digital twin without heavy CAD installation or proprietary simulator dependencies.
- **Impact**: Provides an intuitive visual validation benchmark for household service robotics, demonstrating that complex domestic tasks can be simulated, tested, and demonstrated interactively.
