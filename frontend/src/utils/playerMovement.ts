import { Vector3 } from 'three';

export interface PlayerMovementState {
  velocity: number;
  position: number;
  acceleration: number;
}

export const createPlayerMovement = (initialPosition: number = 0) => {
  const state: PlayerMovementState = {
    velocity: 0,
    position: initialPosition,
    acceleration: 0,
  };

  const update = (deltaTime: number) => {
    // Apply friction
    state.velocity *= 0.95;

    // Update position
    state.position += state.velocity * deltaTime;

    // Normalize position to stay within 0 to 2π
    state.position = state.position % (2 * Math.PI);
    if (state.position < 0) state.position += 2 * Math.PI;

    return state.position;
  };

  const applyForce = (direction: number) => {
    // direction should be -1 for left, 1 for right
    state.acceleration = direction * 0.5;
    state.velocity += state.acceleration;
    
    // Limit maximum velocity
    state.velocity = Math.max(Math.min(state.velocity, 2), -2);
  };

  return {
    state,
    update,
    applyForce,
  };
}; 