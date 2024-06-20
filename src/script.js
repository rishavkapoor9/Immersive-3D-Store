import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import * as lilGui from 'lil-gui';
import gsap from 'gsap';

// Canvas
const canvas = document.querySelector('canvas');

// Scene
const scene = new THREE.Scene();
const light = new THREE.AmbientLight(0xADD8E6,1.6); 
scene.add(light);

// Camera
const camera = new THREE.PerspectiveCamera(
  45, 
  window.innerWidth / window.innerHeight, 
  0.1, 
  1000 
);

// Initial position of the camera
camera.position.set(-6, 3, 2);
camera.rotation.set(0, 50, 0);

// Renderer
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(window.innerWidth, window.innerHeight);

// Orbit Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

let position = 0;

// GLTF Loader
const gltfLoader = new GLTFLoader();
gltfLoader.load('/model/vr_store/scene.gltf', (gltf) => {
  console.log('Our model here!', gltf);
  const model = gltf.scene;
  scene.add(model);
  const gui = new lilGui.GUI();

  gui
    .add(model.position, 'x')
    .min(-100)
    .max(100)
    .step(0.001)
    .name('Model X Axis Position');
  gui
    .add(model.position, 'y')
    .min(-100)
    .max(100)
    .step(0.001)
    .name('Model Y Axis Position');
  gui
    .add(model.position, 'z')
    .min(-100)
    .max(100)
    .step(0.001)
    .name('Model Z Axis Position');

  // Button meshes
  const buttonGeometry = new THREE.SphereGeometry(0.1, 32, 32);
  const buttonMaterial = new THREE.MeshBasicMaterial({ color: 0xf9f9f9 });
  const button1 = new THREE.Mesh(buttonGeometry, buttonMaterial);
  button1.position.set(-4, 1, 1);
  button1.userData = { name: 'kurkure' };
  scene.add(button1);

  const button2 = new THREE.Mesh(buttonGeometry, buttonMaterial);
  button2.position.set(2, 1, 1.8);
  button2.userData = { name: 'sprite' };
  scene.add(button2);

  // Raycaster
  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();

  function onClick(event) {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);

    const intersects = raycaster.intersectObjects([button1, button2]);

    if (intersects.length > 0) {
      const clickedObject = intersects[0].object;
      showModule(clickedObject);
    }
  }

  canvas.addEventListener('click', onClick);

  function showModule(clickedObject) {
    console.log(clickedObject)
    const popup = document.createElement('div');
    popup.className = 'popup';
    popup.innerHTML = `<p>${clickedObject.userData.name=="kurkure"?"KURKURE Rs. 25":"SPRITE Rs. 20"}</p><button id="closePopup">Close</button><button id="addToCart">Add to Cart</button>`;
    document.body.appendChild(popup);

    document.getElementById('closePopup').addEventListener('click', () => {
      document.body.removeChild(popup);
    });
    document.getElementById('addToCart').addEventListener('click', () => {
      alert("Added to cart")
    });
  }
});

// Key Controls
const keys = {
  w: false,
  a: false,
  s: false,
  d: false,
};

window.addEventListener('keydown', (event) => {
  if (event.key in keys) {
    keys[event.key] = true;
  }
});

window.addEventListener('keyup', (event) => {
  if (event.key in keys) {
    keys[event.key] = false;
  }
});

const moveSpeed = 0.1;

function updateCameraPosition() {
  if (keys.w) {
    camera.position.x += moveSpeed;
  }
  if (keys.s) {
    camera.position.x -= moveSpeed;
  }
  if (keys.a) {
    camera.position.z -= moveSpeed;
  }
  if (keys.d) {
    camera.position.z += moveSpeed;
  }
}

// Animation and loop
const animate = () => {
  updateCameraPosition();
  controls.update();
  renderer.render(scene, camera);
};

renderer.setAnimationLoop(animate); 

animate();
