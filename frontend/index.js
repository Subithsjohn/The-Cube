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

const geometry = new THREE.BoxGeometry( 1, 1, 1, ); 
const material = new THREE.MeshStandardMaterial( {color: 0xffffff, flatShading : true} ); 
const cube = new THREE.Mesh( geometry, material ); 
scene.add( cube );


const wireMat = new THREE.MeshBasicMaterial({
    color : 0xffffff,
    wireframe : true
});

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.03;

const wireMesh = new THREE.Mesh(geometry, wireMat);
wireMesh.scale.setScalar(1.001);
cube.add(wireMesh);

const hemilight = new THREE.HemisphereLight(0x0099ff, 0xaa5500);
scene.add(hemilight);

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
      if (speedSlider) speedSlider.value = 1; // 1 * 0.01 = 0.01

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

// Make sure saveValue is in the global scope
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

// NEW FUNCTION to load the last saved state when the page starts
async function loadInitialState() {
  try {
    // We fetch the saved state from the same endpoint as the reset button
    const res = await fetch("http://localhost:5000/api/cube/cube_1/reset", {
      method: "POST" 
    });
    const data = await res.json();
    if (data.success && data.cube) {
      // Apply the fetched position and speed
      cube.position.set(0,0,0);
      //cube.position.set(data.cube.position.x, data.cube.position.y, data.cube.position.z);
      rotationSpeed = data.cube.rotationSpeed;

      // Also update the slider to match the loaded speed
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
    console.log("STATUS:", msg); // fallback if no <p id="status">
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