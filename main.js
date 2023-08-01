import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x222222);

const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

var status = "World";

const geometry = new THREE.BoxGeometry( 1, 3, 1 );
const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
const cube = new THREE.Mesh( geometry, material );
scene.add( cube );

const square_geometry = new THREE.BoxGeometry( 1, 1, 1 );
const component1 = new THREE.Mesh( square_geometry, material );
component1.position.x += 4.0;
scene.add( component1 );

camera.position.z = 15;
const scale = 12;

// Assuming you have already created a Three.js scene, camera, and renderer

// Set initial variables
var isDragging = false;
var previousMouseX = 0;

// Add event listeners for mouse and touch events
document.addEventListener('mousedown', onMouseDown);
document.addEventListener('touchstart', onTouchStart);

document.addEventListener('mousemove', onMouseMove);
document.addEventListener('touchmove', onTouchMove);

document.addEventListener('mouseup', onMouseUp);
document.addEventListener('touchend', onTouchEnd);

const button = document.getElementById('backButton');
const descriptionText = document.getElementById('messageBox');

/* CLICK */
// Add click event listener to the renderer or canvas element
renderer.domElement.addEventListener('click', onClick);

function onClick(event) {
  if (event.button === 0) { // Check if left mouse button was pressed
    //console.log('clicked');

    // Convert mouse coordinates to NDC
    const mouse = new THREE.Vector2();
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    // Create a raycaster from the camera and mouse coordinates
    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, camera);

    // Perform raycasting to check for intersections
    const intersects = raycaster.intersectObjects(scene.children, true);

    if (intersects.length > 0) {
      // Sort intersected objects based on rendering order
      intersects.sort((a, b) => b.object.renderOrder - a.object.renderOrder);
      
      switch(intersects[0].object.customId){
        case "Unity":
          status = "Zoom";
          camera.position.x = scale;
          camera.position.z = scale;
          camera.lookAt(new THREE.Vector3(0, 0, 0));
          button.style.display = 'block';
          descriptionText.innerHTML = `This is Unity.<br>I've used this to create a game called "DuoSolus".`;
          break;
        case "Github":
          status = "Zoom";
          camera.position.x = scale;
          camera.position.z = scale;
          camera.lookAt(new THREE.Vector3(0, 0, 0));
          button.style.display = 'block';
          console.log("Wow that's github!");
          break;
        case undefined:
          break;
        default:

      }
    }
  }
}
/* DONE CLICK */

//backbutton
button.addEventListener('click', () => {
  console.log('Button clicked!');
  
});

// Resize function to handle window resize
function onWindowResize() {
  const newWidth = window.innerWidth;
  const newHeight = window.innerHeight;
  renderer.setSize(newWidth, newHeight);
  camera.aspect = newWidth / newHeight;
  camera.updateProjectionMatrix();
}

// Add event listener for window resize
window.addEventListener('resize', onWindowResize);

// Functions to handle mouse events
var cameraPosition = 0;

function onMouseDown(event) {
  isDragging = true;
  previousMouseX = event.clientX;
}

function onMouseMove(event) {
  if (!isDragging || status === "Zoom") return;
  console.log("MOVING");

  var movementX = event.clientX - previousMouseX;
  previousMouseX = event.clientX;

  // Adjust camera position based on horizontal mouse movement
  cameraPosition += movementX * 0.005; // Adjust the speed as needed
  camera.position.x = scale*Math.cos(cameraPosition);
  camera.position.z = scale*Math.sin(cameraPosition);
  camera.lookAt(new THREE.Vector3(0, 0, 0));
}

function onMouseUp(event) {
  isDragging = false;
}

// Functions to handle touch events
function onTouchStart(event) {
  if (event.touches.length !== 1) return;

  isDragging = true;
  previousMouseX = event.touches[0].clientX;
}

function onTouchMove(event) {
  if (!isDragging || event.touches.length !== 1) return;

  var movementX = event.touches[0].clientX - previousMouseX;
  previousMouseX = event.touches[0].clientX;

  // Adjust camera position based on horizontal touch movement
  camera.position.x -= movementX * 0.05; // Adjust the speed as needed
  //camera.position.z -= movementZ * 0.05; // Adjust the speed as needed
}

function onTouchEnd(event) {
  isDragging = false;
}


const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(1, 1, 1); // Set the light's position
scene.add(light);

function cubeAnimate() {
	requestAnimationFrame( cubeAnimate );

	//cube.rotation.x += 0.01;
	//cube.rotation.y += 0.01;

	renderer.render( scene, camera );
}

cubeAnimate();

// Unity
const unityIconLoader = new GLTFLoader();
unityIconLoader.load('../public/model/unityIcon.glb', function (gltf) {
  const unitymodel = gltf.scene;
  unitymodel.position.x = 4;
  unitymodel.position.y = 0;
  unitymodel.position.z = 4;
  unitymodel.scale.set(3,3,3);
  unitymodel.traverse((object) => {
    if (object.isMesh) {
      object.customId = 'Unity'; // Set the desired customId for each mesh
    }
  });
  scene.add(unitymodel);
  console.log("Checking id", unitymodel.customId);

  // Animate the model (optional)
  function animate() {
    requestAnimationFrame(animate);
    unitymodel.rotation.y += 0.01; // Rotate the model
    renderer.render(scene, camera);
  }
  animate();
});

// Github
const githubIconLoader = new GLTFLoader();
githubIconLoader.load('../public/model/githubIcon.glb', function (gltf) {
  const model = gltf.scene;
  model.position.x = -4*Math.cos(Math.PI/2);
  model.position.y = 0;
  model.position.z = 4*Math.sin(Math.PI/2);
  model.scale.set(20,20,20);
  model.traverse((object) => {
    if (object.isMesh) {
      object.customId = 'Github'; // Set the desired customId for each mesh
    }
  });
  scene.add(model);

  // Animate the model (optional)
  function animate() {
    requestAnimationFrame(animate);
    model.rotation.z += 0.01; // Rotate the model
    renderer.render(scene, camera);
  }
  animate();
});
