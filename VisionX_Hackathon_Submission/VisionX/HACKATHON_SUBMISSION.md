# 📋 HACKATHON SUBMISSION COPY-PASTE TEMPLATE

Use this document to quickly fill out submission forms on **Devpost, Devfolio, Unstop, DoraHacks, MLH**, or your hackathon's portal.

---

### 🏷️ Project Details
- **Project Name**: VISIONX
- **Subtitle / Tagline**: 
  > *Autonomous Vision-Based Household Robot & Interactive 3D Digital Twin Simulation.*
- **Category / Tracks**:
  - Robotics & Hardware Simulation
  - AI & Autonomous Systems
  - Emerging Tech / Human-Robot Interaction (HRI)

---

### 💡 Elevator Pitch (30-second summary)
> Traditional household robots are limited to vacuuming discs or rigid robotic arms. **VISIONX** introduces an agile, autonomous domestic assistant designed for real-world household logistics. Through our high-fidelity 3D WebGL simulator, users and judges can interactively inspect the robot's mechanical anatomy (exploded view, X-ray, thermal dissipation) and watch an end-to-end 7-stage autonomous mission benchmarked on Indian households: retrieving a bowl of sabji from the refrigerator while navigating dynamic obstacles.

---

### ❓ The Problem It Solves
1. **Accessibility & Assistive Domestic Logistics**: Elderly and mobility-impaired individuals frequently struggle with retrieving everyday kitchen items, hot meals, and medicines.
2. **Simulator Accessibility**: Industrial robotics simulators (ROS/Gazebo/Isaac Sim) require high-end GPU workstations and complex Linux setups. VisionX delivers an interactive, photorealistic digital twin directly in any web browser without installation.
3. **Complex Multi-Stage Autonomy**: Simulates the full chain of autonomy from natural language intent parsing to 3D spatial SLAM, dynamic path planning, appliance interaction, and dexterous tactile manipulation.

---

### 🛠️ How We Built It
- **Three.js (WebGL)**: Built a modular procedural 3D model featuring tandem dual-wheel glide base, 7-DoF articulated arm, sensor head dome, and expressive OLED interface.
- **Shader & Material Pipelines**: Custom physical materials including PBR metallic/roughness, transparent X-ray shells, thermal heat maps, and wireframe CAD views.
- **Kinematic State Machine & Mission Logic**: Engineered a 7-stage state machine controlling Catmull-Rom spline path generation, obstacle clearance calculation, appliance door kinematics, and payload attachment.
- **Modern Frontend System**: Fast bundling with Vite 5, responsive glassmorphism UI with HUD telemetry feeds and live status indicators.

---

### 🧗 Challenges We Ran Into
- **Procedural Kinematics in Three.js**: Coordinating multiple nested parent-child joint transformations (torso rotation, shoulder articulation, elbow extension, and gripper fingers) while keeping smooth 60 FPS animation loops.
- **Real-Time Material Switching**: Dynamically swapping between standard PBR, transparent X-Ray, and thermal shader representations without rebuilding scene geometries or dropping frames.
- **Dynamic Camera Choreography**: Seamlessly transitioning camera viewports between manual orbit controls in studio inspection mode and guided cinematic tracking during the household mission.

---

### 🏆 Accomplishments We're Proud Of
- 100% browser-based with zero plugin or driver dependencies.
- Smooth interactive exploded assembly view from 0% to 100% expansion.
- Engaging, culturally grounded benchmark ("Sabji Fetch" mission) showing real-world utility for domestic Indian households.
- Comprehensive telemetry HUD displaying TOPS compute, battery status, LiDAR range, and component specs.

---

### 🔮 What's Next for VisionX
- WebRTC streaming to connect the 3D twin to real ROS2 hardware nodes.
- LLM / VLM API integration (e.g. Gemini 1.5 Pro) for dynamic open-vocabulary voice commands.
- Multi-room procedural floorplan generation for arbitrary household environments.
