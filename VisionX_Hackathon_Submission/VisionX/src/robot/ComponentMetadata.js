export const COMPONENT_METADATA = {
  head: {
    name: 'Sensor Dome & Vision Core',
    category: 'Sensing & Perception',
    status: 'OPTIMAL (42°C)',
    dof: '3-DoF (Yaw ±90°, Pitch -30°/+45°, Roll ±15°)',
    specs: 'Dual RGB-D Depth Cameras, 6-DoF IMU, 4-mic beamforming array',
    material: 'Aerospace-grade pearl poly-composite armor shell',
    function: 'Houses central visual perception, spatial SLAM mapping, and human-robot interaction sensors.'
  },
  faceScreen: {
    name: 'Front Visor & Multi-Modal Screen',
    category: 'User Interface / Optics',
    status: 'ACTIVE (60Hz)',
    dof: 'Fixed to Head Gimbal',
    specs: 'Curved anti-glare scratch-resistant Gorilla Glass, 1500 nits',
    material: 'Deep optical black acrylic with anti-reflective coating',
    function: 'Displays emotive facial expressions, system alerts, and houses optical tracking sensors.'
  },
  eyes: {
    name: 'Dual Bi-focal Luminous Optical Lenses',
    category: 'Computer Vision',
    status: 'ONLINE (Stereo 4K)',
    dof: 'Electronic Pan/Tilt Digital Gaze',
    specs: 'Dual 4K HDR sensors + addressable cyan micro-LED emitter rings',
    material: 'Optical-grade sapphire glass with cyan emissive backlighting',
    function: 'Stereoscopic depth estimation, object recognition, human face identification, and emotional feedback.'
  },
  ears: {
    name: 'Lateral Solid-State LiDAR & Audio Array',
    category: 'Obstacle Detection',
    status: 'PULSING (30 FPS)',
    dof: 'Fixed lateral pods',
    specs: '905nm Solid-State LiDAR pods + 4-channel spatial acoustic sensors',
    material: 'Dark graphite housing with cyan luminescent acoustic slots',
    function: 'Provides 360° situational awareness, voice command localization, and indoor obstacle triangulation.'
  },
  neck: {
    name: 'Harmonic Drive Neck Gimbal',
    category: 'Actuation / Mechanical',
    status: 'CALIBRATED',
    dof: '2-DoF High-Precision Servo',
    specs: 'Brushless DC servo motors, 17-bit optical absolute encoders',
    material: 'Dark graphite alloy casing with protective flex seal',
    function: 'Allows smooth, human-like head pan and tilt for conversational engagement and spatial scanning.'
  },
  torso: {
    name: 'Main Monocoque Chassis & NPU Compute',
    category: 'Compute & Power Frame',
    status: 'NOMINAL (52W load)',
    dof: 'Central rigid frame with waist yaw connection',
    specs: 'Twin AI NPUs (550 TOPS), CAN-FD vehicle bus, power conditioning',
    material: 'Magnesium-aluminum skeletal truss with pearl-white armor fairings',
    function: 'Houses main onboard AI processors, thermal heat pipes, auxiliary battery, and structural load frame.'
  },
  chestScreen: {
    name: 'VISIONX Interactive Mission Display',
    category: 'HUD & Mission Telemetry',
    status: 'BROADCASTING',
    dof: 'Rigid front bezel mount',
    specs: '10.5-inch curved OLED telemetry display, dynamic UI rendering',
    material: 'Glossy black tempered glass with cyan luminescent logo',
    function: 'Displays the VISIONX brand identifier, autonomous mission phase, battery level, and user notifications.'
  },
  shoulderLeft: {
    name: 'Left Shoulder Articulation Capsule',
    category: 'Actuation / Manipulator',
    status: 'READY (0.0°)',
    dof: '2-DoF (Pitch -90°/+180°, Roll 0°/+95°)',
    specs: 'High-torque cycloidal drive, 70 N·m peak, cyan position halo ring',
    material: 'Pearl-white spherical armor cap with luminescent status ring',
    function: 'Provides full upper-arm reachability for shelf retrieval and household object handling.'
  },
  shoulderRight: {
    name: 'Right Shoulder Articulation Capsule',
    category: 'Actuation / Manipulator',
    status: 'READY (0.0°)',
    dof: '2-DoF (Pitch -90°/+180°, Roll 0°/+95°)',
    specs: 'High-torque cycloidal drive, 70 N·m peak, cyan position halo ring',
    material: 'Pearl-white spherical armor cap with luminescent status ring',
    function: 'Enables dexterous right-arm manipulation, refrigerator door opening, and wave gestures.'
  },
  armLeft: {
    name: 'Left Bionic Upper Arm',
    category: 'Kinematics',
    status: 'OPERATIONAL',
    dof: '1-DoF Shoulder rotation link',
    specs: 'Carbon-fiber reinforced internal spar with wiring raceway',
    material: 'Dual-tone pearl white fairing with dark graphite joint hubs',
    function: 'Transfers lifting moments from shoulder drive to elbow linkage.'
  },
  armRight: {
    name: 'Right Bionic Upper Arm',
    category: 'Kinematics',
    status: 'OPERATIONAL',
    dof: '1-DoF Shoulder rotation link',
    specs: 'Carbon-fiber reinforced internal spar with wiring raceway',
    material: 'Dual-tone pearl white fairing with dark graphite joint hubs',
    function: 'Transfers lifting moments from shoulder drive to elbow linkage.'
  },
  elbowLeft: {
    name: 'Left High-Torque Elbow Joint',
    category: 'Actuation',
    status: 'CALIBRATED (0°)',
    dof: '1-DoF Flexion/Extension (0° to 135°)',
    specs: 'Strain-wave gear, 45 N·m continuous, magnetic brake',
    material: 'Hardened steel pin with dark anodized aluminum clevis',
    function: 'Controls forearm reach distance and payload elevation.'
  },
  elbowRight: {
    name: 'Right High-Torque Elbow Joint',
    category: 'Actuation',
    status: 'CALIBRATED (0°)',
    dof: '1-DoF Flexion/Extension (0° to 135°)',
    specs: 'Strain-wave gear, 45 N·m continuous, magnetic brake',
    material: 'Hardened steel pin with dark anodized aluminum clevis',
    function: 'Controls forearm reach distance and payload elevation.'
  },
  forearmLeft: {
    name: 'Left Forearm Shell & 6-Axis F/T Sensor',
    category: 'Sensing & Manipulation',
    status: 'BALANCED',
    dof: 'Wrist link with internal force/torque transducer',
    specs: '6-axis multi-axis force cell (100N range, 0.05N resolution)',
    material: 'Aerospace pearl white armor with recessed graphite channel',
    function: 'Provides tactile load feedback during object contact and lifting.'
  },
  forearmRight: {
    name: 'Right Forearm Shell & 6-Axis F/T Sensor',
    category: 'Sensing & Manipulation',
    status: 'BALANCED',
    dof: 'Wrist link with internal force/torque transducer',
    specs: '6-axis multi-axis force cell (100N range, 0.05N resolution)',
    material: 'Aerospace pearl white armor with recessed graphite channel',
    function: 'Provides tactile load feedback during object contact and lifting.'
  },
  wristLeft: {
    name: 'Left Multi-Axis Wrist Collar',
    category: 'Actuation',
    status: 'READY',
    dof: '2-DoF (Pitch ±90°, Continuous Roll ±360°)',
    specs: 'Miniature brushless differential gimbal, 12 N·m',
    material: 'Dark graphite structural collar with chrome trim',
    function: 'Orients end-effector gripper for grasping bowls, cups, and utensils.'
  },
  wristRight: {
    name: 'Right Multi-Axis Wrist Collar',
    category: 'Actuation',
    status: 'READY',
    dof: '2-DoF (Pitch ±90°, Continuous Roll ±360°)',
    specs: 'Miniature brushless differential gimbal, 12 N·m',
    material: 'Dark graphite structural collar with chrome trim',
    function: 'Orients end-effector gripper for grasping bowls, cups, and utensils.'
  },
  handLeft: {
    name: 'Left Dexterous Robotic Gripper',
    category: 'End Effector',
    status: 'IDLE (Grasp Ready)',
    dof: 'Multi-jointed fingers + opposable thumb',
    specs: 'High-friction silicone tactile pads, 8 kg pinch force',
    material: 'Graphite jointed phalanges with white back-plate shell',
    function: 'Safe household manipulation, delicate grasping of kitchenware and bowls.'
  },
  handRight: {
    name: 'Right Dexterous Robotic Gripper',
    category: 'End Effector',
    status: 'IDLE (Grasp Ready)',
    dof: 'Multi-jointed fingers + opposable thumb',
    specs: 'High-friction silicone tactile pads, 8 kg pinch force',
    material: 'Graphite jointed phalanges with white back-plate shell',
    function: 'Safe household manipulation, delicate grasping of kitchenware and bowls.'
  },
  pelvis: {
    name: 'Waist Hub & Primary Solid-State Battery',
    category: 'Chassis / Power',
    status: '98% (49.2V / 2.4 kWh)',
    dof: '1-DoF Continuous Waist Yaw Turntable',
    specs: '48V Solid-State Li-ion pack, BMS with active cell balancing',
    material: 'Reinforced cast aluminum hub with dark ceramic finish',
    function: 'Houses main power cells and provides 360° upper-body yaw rotation.'
  },
  thighLeft: {
    name: 'Left Adaptive Hip & Thigh Armature',
    category: 'Locomotion / Suspension',
    status: 'NOMINAL',
    dof: '1-DoF Hip Pitch with hydro-pneumatic shock absorber',
    specs: 'Dual-chamber air spring, 1200 N max damping rate',
    material: 'Sculpted pearl white fairing with curved cyan accent channel',
    function: 'Maintains robot balance, absorbs floor transitions, and connects chassis to wheels.'
  },
  thighRight: {
    name: 'Right Adaptive Hip & Thigh Armature',
    category: 'Locomotion / Suspension',
    status: 'NOMINAL',
    dof: '1-DoF Hip Pitch with hydro-pneumatic shock absorber',
    specs: 'Dual-chamber air spring, 1200 N max damping rate',
    material: 'Sculpted pearl white fairing with curved cyan accent channel',
    function: 'Maintains robot balance, absorbs floor transitions, and connects chassis to wheels.'
  },
  kneeLeft: {
    name: 'Left Heavy-Duty Knee Pivot Hinge',
    category: 'Structural Pivot',
    status: 'LOCKED',
    dof: '1-DoF Articulation hinge with rotary damper',
    specs: 'Twin ball bearings, hardened titanium axle pin',
    material: 'Dark graphite joint hub with chrome fastener cap',
    function: 'Provides height adjustment and dynamic stance stabilization.'
  },
  kneeRight: {
    name: 'Right Heavy-Duty Knee Pivot Hinge',
    category: 'Structural Pivot',
    status: 'LOCKED',
    dof: '1-DoF Articulation hinge with rotary damper',
    specs: 'Twin ball bearings, hardened titanium axle pin',
    material: 'Dark graphite joint hub with chrome fastener cap',
    function: 'Provides height adjustment and dynamic stance stabilization.'
  },
  lowerLegLeft: {
    name: 'Left Lower Shin Armor & Proximity Array',
    category: 'Protection & Ground Sensing',
    status: 'ACTIVE',
    dof: 'Rigid connection to wheel carriage',
    specs: 'Ground-facing ultrasonic altimeter + cliff sensors',
    material: 'Aerodynamic pearl white shin fairing',
    function: 'Protects lower cables and detects staircases, rugs, and obstacles.'
  },
  lowerLegRight: {
    name: 'Right Lower Shin Armor & Proximity Array',
    category: 'Protection & Ground Sensing',
    status: 'ACTIVE',
    dof: 'Rigid connection to wheel carriage',
    specs: 'Ground-facing ultrasonic altimeter + cliff sensors',
    material: 'Aerodynamic pearl white shin fairing',
    function: 'Protects lower cables and detects staircases, rugs, and obstacles.'
  },
  wheelLeft: {
    name: 'Left Dual-Wheel High-Precision Glide Pod',
    category: 'Mobility & Drivetrain',
    status: 'READY (Traction 100%)',
    dof: 'Dual Rolling In-Hub Motors (Tandem configuration)',
    specs: 'Twin direct-drive brushless motors (350W each), cyan LED halo rims',
    material: 'Vulcanized non-marking rubber tire with illuminated hub',
    function: 'Delivers whisper-quiet indoor holonomic motion and agile zero-radius turns.'
  },
  wheelRight: {
    name: 'Right Dual-Wheel High-Precision Glide Pod',
    category: 'Mobility & Drivetrain',
    status: 'READY (Traction 100%)',
    dof: 'Dual Rolling In-Hub Motors (Tandem configuration)',
    specs: 'Twin direct-drive brushless motors (350W each), cyan LED halo rims',
    material: 'Vulcanized non-marking rubber tire with illuminated hub',
    function: 'Delivers whisper-quiet indoor holonomic motion and agile zero-radius turns.'
  }
};
