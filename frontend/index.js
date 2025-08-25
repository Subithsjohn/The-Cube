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
      console.log('Resetting! 🔄');
      break;
    case 'save':
      console.log('Saving! 💾');
      break;
    default:
      console.log('Invalid direction.');
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
    cube.rotation.z = c * 0.0002;
    cube.rotation.x = c * 0.0002;
   
    renderer.render(scene, camera);
    controls.update();
}