import * as THREE from 'three';

export const addDevHelpers = (scene: any) => {
  // Grid helper for development
  const gridHelper = new THREE.GridHelper(30, 30);
  scene.add(gridHelper);
  
  // Axes helper to show coordinate system
  const axesHelper = new THREE.AxesHelper(5);
  scene.add(axesHelper);
  
  return { gridHelper, axesHelper };
};