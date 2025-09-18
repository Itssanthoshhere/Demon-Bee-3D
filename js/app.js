// Import Three.js, GLTFLoader for 3D models, and GSAP for animations
import * as THREE from "https://cdn.skypack.dev/three@0.129.0/build/three.module.js";
import { GLTFLoader } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/GLTFLoader.js";
import { gsap } from "https://cdn.skypack.dev/gsap";

// Create a perspective camera
const camera = new THREE.PerspectiveCamera(
  10, // field of view
  window.innerWidth / window.innerHeight, // aspect ratio
  0.1, // near clipping plane
  1000 // far clipping plane
);
camera.position.z = 13; // Move the camera backward

// Create a Three.js scene
const scene = new THREE.Scene();

// Variables to store the 3D model and animation mixer
let bee;
let mixer;

// Load the GLB 3D model using GLTFLoader
const loader = new GLTFLoader();
loader.load(
  "/3D-model/demon_bee_full_texture.glb", // Model path
  function (gltf) {
    bee = gltf.scene; // Store the loaded 3D model
    scene.add(bee); // Add the model to the scene

    // Create an AnimationMixer to play animations from the model
    mixer = new THREE.AnimationMixer(bee);
    mixer.clipAction(gltf.animations[0]).play(); // Play the first animation

    modelMove(); // Set initial model position based on the section
  },
  function (xhr) {}, // Progress callback (optional)
  function (error) {} // Error callback (optional)
);

// Create the WebGL renderer with transparent background
const renderer = new THREE.WebGLRenderer({ alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight); // Set canvas size
document.getElementById("container3D").appendChild(renderer.domElement); // Add renderer to DOM

// Add lighting to the scene
const ambientLight = new THREE.AmbientLight(0xffffff, 1.3); // Soft ambient light
scene.add(ambientLight);

const topLight = new THREE.DirectionalLight(0xffffff, 1); // Directional light to simulate sun
topLight.position.set(500, 500, 500); // Position the light
scene.add(topLight);

// Function to render the scene continuously
const reRender3D = () => {
  requestAnimationFrame(reRender3D); // Call on every frame
  renderer.render(scene, camera); // Render the scene with camera
  if (mixer) mixer.update(0.02); // Update animation mixer (if loaded)
};
reRender3D(); // Start rendering loop

// Array defining 3D model positions and rotations for each section
let arrPositionModel = [
  {
    id: "banner",
    position: { x: 0, y: -1, z: 0 },
    rotation: { x: 0, y: 1.5, z: 0 },
  },
  {
    id: "intro",
    position: { x: 1, y: -1, z: -5 },
    rotation: { x: 0.5, y: -0.5, z: 0 },
  },
  {
    id: "description",
    position: { x: -1, y: -1, z: -5 },
    rotation: { x: 0, y: 0.5, z: 0 },
  },
  {
    id: "contact",
    position: { x: 0.8, y: -1, z: 0 },
    rotation: { x: 0.3, y: -0.5, z: 0 },
  },
];

// Function to move the 3D model based on the currently visible section
const modelMove = () => {
  const sections = document.querySelectorAll(".section");
  let currentSection;

  // Detect which section is currently in the viewport
  sections.forEach((section) => {
    const rect = section.getBoundingClientRect();
    if (rect.top <= window.innerHeight / 3) {
      currentSection = section.id;
    }
  });

  // Find the corresponding position and rotation for the active section
  let position_active = arrPositionModel.findIndex(
    (val) => val.id == currentSection
  );

  if (position_active >= 0) {
    let new_coordinates = arrPositionModel[position_active];

    // Animate position smoothly using GSAP
    gsap.to(bee.position, {
      x: new_coordinates.position.x,
      y: new_coordinates.position.y,
      z: new_coordinates.position.z,
      duration: 3,
      ease: "power1.out",
    });

    // Animate rotation smoothly using GSAP
    gsap.to(bee.rotation, {
      x: new_coordinates.rotation.x,
      y: new_coordinates.rotation.y,
      z: new_coordinates.rotation.z,
      duration: 3,
      ease: "power1.out",
    });
  }
};

// Update 3D model position on scroll
window.addEventListener("scroll", () => {
  if (bee) {
    modelMove();
  }
});

// Update renderer and camera aspect ratio on window resize
window.addEventListener("resize", () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
});

