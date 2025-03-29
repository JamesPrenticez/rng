import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

export const setupThreeJS = (mountElement: HTMLElement) => {
  // Scene setup
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x87ceeb); // Sky blue background
  
  // Camera setup
  const camera = new THREE.PerspectiveCamera(
    75, 
    mountElement.clientWidth / mountElement.clientHeight, 
    0.1, 
    1000
  );
  camera.position.set(0, 15, 20);
  camera.lookAt(0, 0, 0);
  
  // Renderer
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(mountElement.clientWidth, mountElement.clientHeight);
  renderer.shadowMap.enabled = true;
  mountElement.appendChild(renderer.domElement);
  
  // Orbit controls for camera manipulation
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  
  // Handle window resize
  const handleResize = () => {
    const width = mountElement.clientWidth;
    const height = mountElement.clientHeight;
    
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
  };
  window.addEventListener('resize', handleResize);
  
  // Cleanup function
  const cleanup = () => {
    window.removeEventListener('resize', handleResize);
    mountElement.removeChild(renderer.domElement);
  };
  
  return { scene, camera, renderer, controls, cleanup };
};