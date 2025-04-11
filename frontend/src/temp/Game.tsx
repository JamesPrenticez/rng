import { useRef, useEffect } from 'react';
import { createArena } from './Arena';
import { handleLighting } from '../utils/lighting';
import { setupThreeJS } from '../utils/setupThreeJS';
import { addDevHelpers } from '../utils/helpers';
import { useGameState } from './xxxuse-game-state-context';
import { createPlayerMovement } from '../utils/playerMovement';
import * as THREE from 'three';

export const DiceGame = () => {
  const mountRef = useRef(null);
  const { state, setPlayerAngle, lockPosition } = useGameState();
  const playerMovementRef = useRef(createPlayerMovement());
  const lastTimeRef = useRef(0);
  const redLineRef = useRef<THREE.Line | null>(null);
  const playerDotRef = useRef<THREE.Mesh | null>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    const currentRef = mountRef.current;

    // Setup Three.js environment
    const { scene, camera, renderer, controls, cleanup } = setupThreeJS(currentRef);

    // Add arena components
    const arenaRadius = 10;
    createArena(scene, arenaRadius);

    // Create red line around arena
    const points = [];
    const segments = 128;
    for (let i = 0; i <= segments; i++) {
      const angle = (i / segments) * Math.PI * 2;
      points.push(new THREE.Vector3(
        Math.cos(angle) * arenaRadius,
        0,
        Math.sin(angle) * arenaRadius
      ));
    }
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const material = new THREE.LineBasicMaterial({ color: 0xff0000, linewidth: 1 });
    const redLine = new THREE.Line(geometry, material);
    scene.add(redLine);
    redLineRef.current = redLine;

    // Create player dot
    const dotGeometry = new THREE.SphereGeometry(0.2, 16, 16);
    const dotMaterial = new THREE.MeshBasicMaterial({ color: 0x0000ff });
    const playerDot = new THREE.Mesh(dotGeometry, dotMaterial);
    scene.add(playerDot);
    playerDotRef.current = playerDot;

    // Setup lighting
    handleLighting(scene);

    // Add development helpers
    addDevHelpers(scene);

    // Handle keyboard input
    const handleKeyDown = (event: KeyboardEvent) => {
      if (state.isPositionLocked) return;
      
      switch (event.key) {
        case 'ArrowLeft':
          playerMovementRef.current.applyForce(-1);
          break;
        case 'ArrowRight':
          playerMovementRef.current.applyForce(1);
          break;
        case ' ':
          lockPosition();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    // Animation loop
    const animate = (currentTime: number) => {
      requestAnimationFrame(animate);
      
      const deltaTime = (currentTime - lastTimeRef.current) / 1000; // Convert to seconds
      lastTimeRef.current = currentTime;

      if (!state.isPositionLocked) {
        const newAngle = playerMovementRef.current.update(deltaTime);
        setPlayerAngle(newAngle);
      }

      // Update player dot position
      if (playerDotRef.current) {
        playerDotRef.current.position.x = Math.cos(state.playerAngle) * arenaRadius;
        playerDotRef.current.position.z = Math.sin(state.playerAngle) * arenaRadius;
      }

      controls.update();
      renderer.render(scene, camera);
    };
    animate(0);

    // Cleanup
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      cleanup();
    };
  }, [state.isPositionLocked, state.playerAngle, setPlayerAngle, lockPosition]);

  return <div ref={mountRef} style={{ width: '100%', height: '800px' }} />;
};