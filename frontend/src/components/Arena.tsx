import * as THREE from 'three';

export const createArena = (scene: THREE.Scene, radius: number) => {
  // Create circular arena floor
  const arenaGeometry = new THREE.CircleGeometry(radius, 64);
  const arenaMaterial = new THREE.MeshStandardMaterial({ 
    color: 0xd2b48c,  // Tan/sand color
    roughness: 0.8,
    metalness: 0.2,
    side: THREE.DoubleSide
  });
  const arenaFloor = new THREE.Mesh(arenaGeometry, arenaMaterial);
  arenaFloor.rotation.x = -Math.PI / 2; // Rotate to be horizontal
  arenaFloor.receiveShadow = true;
  scene.add(arenaFloor);

  // Create arena wall/boundary
  const wallHeight = 1;
  const wallThickness = 0.5;
  const wallGeometry = new THREE.CylinderGeometry(
    radius + wallThickness,
    radius + wallThickness,
    wallHeight,
    64,
    1,
    true
  );
  const wallMaterial = new THREE.MeshStandardMaterial({
    color: 0x8b4513,  // Saddle brown
    roughness: 0.7,
    metalness: 0.3,
    side: THREE.DoubleSide
  });
  const arenaWall = new THREE.Mesh(wallGeometry, wallMaterial);
  arenaWall.position.y = wallHeight / 2;
  arenaWall.receiveShadow = true;
  arenaWall.castShadow = true;
  scene.add(arenaWall);

  return { arenaFloor, arenaWall };
};