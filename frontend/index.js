import * as THREE from "three";
import { OrbitControls } from "jsm/controls/OrbitControls.js";

let rotationSpeed = 0.01;

const w = window.innerWidth;
const h = window.innerHeight;
const renderer = new THREE.WebGLRenderer( { antialias : true}) ; 
renderer.setSize(w,h);
document.body.appendChild(renderer.domElement);     

const fov = 75;
const aspect = w/h;
const near = 0.1;
const far = 10;
const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
camera.position.z = 2;

const scene = new THREE.Scene();

const loader = new THREE.TextureLoader();

const textures = [
  loader.load("../Textures/Grass_block_side.png"),   // right
  loader.load("../Textures/Grass_block_side.png"),   // left
  loader.load("../Textures/Grass_block_top.png"),    // top
  loader.load("../Textures/Grass_block_bottom.png"), // bottom
  loader.load("../Textures/Grass_block_side.png"),   // front
  loader.load("../Textures/Grass_block_side.png")    // back
];

const materials = textures.map(tex => new THREE.MeshStandardMaterial({ map: tex }));

const geometry = new THREE.BoxGeometry(1, 1, 1);
const cube = new THREE.Mesh(geometry, materials);
scene.add(cube);


const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.03;


const pointLight = new THREE.AmbientLight(0xffffff, 0.9);
pointLight.position.set(0, 3, 3);
scene.add(pointLight);

loadInitialState();
animate();
function changespeed() {

}
function getvalue(buttonElement) {
  const direction = buttonElement?.id || 'reset';
  switch (direction) {
    case 'up':
        cube.position.y += 0.05;
      console.log('Moving up! ⬆️');
      break;
    case 'down':
        cube.position.y -= 0.05;
      console.log('Moving down! ⬇️');
      break;
    case 'left':
        cube.position.x -= 0.05;
      console.log('Moving left! ⬅️');
      break;
    case 'right':
        cube.position.x += 0.05;
      console.log('Moving right! ➡️');
      break;
    case 'reset':
        cube.position.x = 0;
        cube.position.y = 0;
        cube.position.z = 0;
      rotationSpeed = 0.01; 
      const speedSlider = document.getElementById("speed");
      if (speedSlider) speedSlider.value = 1; 

      console.log('Resetting to default! ');
      setStatus("Reset to default state.");
      break;
    case 'save':
      console.log('Saving! 💾');
      break;
    default:
      console.log('Invalid direction.');
  }
}


window.saveValue = async function saveValue() {
  try {
    const res = await fetch("http://localhost:5000/api/cube/cube_1/save", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        position: {
          x: cube.position.x,
          y: cube.position.y,
          z: cube.position.z,
          rotationSpeed: 0.01
        },
        rotationSpeed: rotationSpeed
      })
    });
    const data = await res.json();
    if (data.success) {
      console.log("Cube saved:", data.cube);
      setStatus("Cube saved! ");
    }
  } catch (err) {
    console.error("Error saving cube:", err);
    setStatus("Save failed ");
  }
}

window.resetPre = async function resetPre() {
  try {
    const res = await fetch("http://localhost:5000/api/cube/cube_1/reset", {
      method: "POST"
    });
    const data = await res.json();
    if (data.success) {
      cube.position.set(data.cube.position.x, data.cube.position.y, data.cube.position.z);
      rotationSpeed = data.cube.rotationSpeed;
      const speedSlider = document.getElementById("speed");
      if (speedSlider) speedSlider.value = rotationSpeed / 0.01;
      setStatus("Cube reset 🔄");
    }
  } catch (err) {
    console.error("Error resetting cube:", err);
    setStatus("Reset failed ❌");
  }
}


async function loadInitialState() {
  try {
  
    const res = await fetch("http://localhost:5000/api/cube/cube_1/reset", {
      method: "POST" 
    });
    const data = await res.json();
    if (data.success && data.cube) {
      
      cube.position.set(0,0,0);
      
      rotationSpeed = data.cube.rotationSpeed;

      
      const speedSlider = document.getElementById("speed");
      if (speedSlider) speedSlider.value = rotationSpeed / 0.01;
      
      setStatus("Loaded last saved state. ✅");
      console.log("Loaded initial state:", data.cube);
    } else {
        setStatus("No saved state found. Starting fresh.")
    }
  } catch (err) {
    console.error("Could not load initial state:", err);
    setStatus("Could not connect to server. 🔌");
  }
}

function setStatus(msg) {
  const status = document.getElementById("status");
  if (status) {
    status.innerText = msg;
  } else {
    console.log("STATUS:", msg); 
  }
}


window.getvalue = getvalue;

function handleSpeedChange(value) { 
  rotationSpeed = parseFloat(value) * 0.01;
}

document.addEventListener('DOMContentLoaded', () => {
  const speedSlider = document.getElementById('speed');
 
  if (speedSlider) {
    speedSlider.addEventListener('input', (event) => {
      handleSpeedChange(event.target.value);
    });
    handleSpeedChange(speedSlider.value);
  }
});

function animate(c = 0) {
    requestAnimationFrame(animate);
    cube.rotation.y += rotationSpeed;
    cube.rotation.z += rotationSpeed;
    cube.rotation.x += rotationSpeed;
   
    renderer.render(scene, camera);
    controls.update();
}