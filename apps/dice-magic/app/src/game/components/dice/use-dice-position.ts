import { useState, useCallback } from 'react';
import * as THREE from 'three';

export const useDicePositions = (center: THREE.Vector3 = new THREE.Vector3(0, 0, 0)) => {
  const [positions, setPositions] = useState<{ [id: string]: THREE.Vector3 }>({});

  const updatePosition = useCallback((id: string, pos: THREE.Vector3) => {
    setPositions((prev) => ({ ...prev, [id]: pos }));
  }, []);

  const distances = Object.entries(positions).map(([id, pos]) => ({
    id,
    distance: pos.distanceTo(center),
  }));

  return { positions, updatePosition, distances };
};
