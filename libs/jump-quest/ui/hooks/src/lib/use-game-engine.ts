import React, { useRef, useEffect, useCallback } from "react"
import { useGameStore } from "@jump-quest/stores"
import { Position, Velocity } from "@jump-quest/models";

export const useGameEngine = (canvasRef: React.RefObject<HTMLCanvasElement>) => {
  const { 
    player, 
    collisionBlocks, 
    keys, 
    isPlaying, 
    setPlayer, 
    updatePlayerPosition, 
    updatePlayerVelocity,
    setFrameRate 
  } = useGameStore();

  const animationRef = useRef<number>();
  const lastFrameTime = useRef<number>(0);
  const frameCount = useRef<number>(0);
  const lastSecond = useRef<number>(0);

  // Physics constants
  const gravity = 0.12;
  const walkFriction = 0.95;
  const runFriction = 0.98;
  const baseAcceleration = 0.07;
const jumpVelocity = 10;

  const maxAcceleration = 0.14;
  const accelerationIncrement = 0.0008;

  // Collision detection
  const checkCollisions = useCallback((newPos: Position, vel: Velocity) => {
    const playerRect = {
      x: newPos.x - player.radius,
      y: newPos.y - player.radius,
      width: player.radius * 2,
      height: player.radius * 2
    };

    let collisionX = false;
    let collisionY = false;
    let onGround = false;

    for (const block of collisionBlocks) {
      const blockRect = {
        x: block.position.x,
        y: block.position.y,
        width: block.width,
        height: block.height
      };

      // Check if collision would occur
      if (
        playerRect.x < blockRect.x + blockRect.width &&
        playerRect.x + playerRect.width > blockRect.x &&
        playerRect.y < blockRect.y + blockRect.height &&
        playerRect.y + playerRect.height > blockRect.y
      ) {
        // Determine collision side
        const overlapX = Math.min(
          playerRect.x + playerRect.width - blockRect.x,
          blockRect.x + blockRect.width - playerRect.x
        );
        const overlapY = Math.min(
          playerRect.y + playerRect.height - blockRect.y,
          blockRect.y + blockRect.height - playerRect.y
        );

        if (overlapX < overlapY) {
          // Horizontal collision
          collisionX = true;
          if (playerRect.x < blockRect.x) {
            newPos.x = blockRect.x - player.radius;
          } else {
            newPos.x = blockRect.x + blockRect.width + player.radius;
          }
          vel.x = 0;
        } else {
          // Vertical collision
          collisionY = true;
          if (playerRect.y < blockRect.y) {
            newPos.y = blockRect.y - player.radius;
            onGround = true;
            vel.y = 0;
          } else {
            newPos.y = blockRect.y + blockRect.height + player.radius;
            vel.y = 0;
          }
        }
      }
    }

    return { newPos, vel, onGround };
  }, [collisionBlocks, player.radius]);

  // Jump state management
  const jumpStateRef = useRef({ crouchStartTime: 0, isCrouchingForJump: false });

  // Update physics
  const updatePhysics = useCallback(() => {
    const newPlayer = { ...player };
    let accelerationX = 0;
    const currentTime = Date.now();

    // Handle jump input with proper state management
    if (keys['KeyW'] && newPlayer.isOnGround && !jumpStateRef.current.isCrouchingForJump) {
      // Start crouch phase
      jumpStateRef.current.isCrouchingForJump = true;
      jumpStateRef.current.crouchStartTime = currentTime;
      newPlayer.isCrouching = true;
    }

    // Handle crouch-to-jump transition
    if (jumpStateRef.current.isCrouchingForJump && 
        currentTime - jumpStateRef.current.crouchStartTime > 50) {
      // Execute jump
      newPlayer.isCrouching = false;
      newPlayer.isJumping = true;
      newPlayer.isOnGround = false;
      newPlayer.velocity.y = -jumpVelocity; // Jump velocity
      jumpStateRef.current.isCrouchingForJump = false;
    }

    if (keys['KeyA']) {
      accelerationX -= newPlayer.acceleration;
      newPlayer.facingRight = false;
    }
    if (keys['KeyD']) {
      accelerationX += newPlayer.acceleration;
      newPlayer.facingRight = true;
    }

    // Apply acceleration
    newPlayer.velocity.x += accelerationX;

    // Apply friction
    const friction = newPlayer.speed > 2 ? runFriction : walkFriction;
    newPlayer.velocity.x *= friction;
    newPlayer.velocity.y *= friction;

    // Apply gravity
    if (!newPlayer.isOnGround) {
      newPlayer.velocity.y += gravity;
    }

    // Calculate speed
    newPlayer.speed = Math.abs(newPlayer.velocity.x);

    // Limit speed
    if (newPlayer.speed > newPlayer.maxSpeed) {
      const ratio = newPlayer.maxSpeed / newPlayer.speed;
      newPlayer.velocity.x *= ratio;
      newPlayer.speed = newPlayer.maxSpeed;
    }

    // Update position with collision detection
    const newPos = {
      x: newPlayer.position.x + newPlayer.velocity.x,
      y: newPlayer.position.y + newPlayer.velocity.y
    };

    const collision = checkCollisions(newPos, newPlayer.velocity);
    newPlayer.position = collision.newPos;
    newPlayer.velocity = collision.vel;
    newPlayer.isOnGround = collision.onGround;

    if (collision.onGround) {
      newPlayer.isJumping = false;
    }

    // Set action and frame properties based on state
    if (newPlayer.isCrouching) {
      newPlayer.action = 'crouch';
      newPlayer.frameRow = 3;
      newPlayer.frameLength = 1;
    } else if (newPlayer.isJumping) {
      newPlayer.action = 'jump';
      newPlayer.frameRow = 3;
      newPlayer.frameLength = 1;
    } else if (newPlayer.speed < 0.4) {
      newPlayer.action = 'idle';
      newPlayer.frameRow = 0;
      newPlayer.frameLength = 7;
      newPlayer.acceleration = baseAcceleration;
    } else if (newPlayer.speed <= 1.99) {
      newPlayer.action = 'walk';
      newPlayer.frameRow = 1;
      newPlayer.frameLength = 7;
    } else {
      newPlayer.action = 'run';
      newPlayer.frameRow = 2;
      newPlayer.frameLength = 7;
    }

    // Update frame animation
    newPlayer.frameColumn++;
    if (newPlayer.frameColumn >= newPlayer.frameSpeed) {
      newPlayer.frameColumn = 0;
      newPlayer.frameCurrent++;
      if (newPlayer.frameCurrent >= newPlayer.frameLength) {
        newPlayer.frameCurrent = 0;
      }
    }

    setPlayer(newPlayer);
  }, [player, keys, checkCollisions, setPlayer]);

  // Render function
  const render = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.fillStyle = '#DADADA';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw collision blocks
    ctx.fillStyle = 'rgba(255, 0, 0, 0.7)';
    ctx.strokeStyle = 'rgba(170, 36, 36, 0.7)';
    ctx.lineWidth = 2;
    collisionBlocks.forEach(block => {
      ctx.fillRect(block.position.x, block.position.y, block.width, block.height);
      ctx.strokeRect(block.position.x, block.position.y, block.width, block.height);
    });

    // Draw player sprite or fallback circle
    if (player.sprite && player.sprite.complete) {
      const sourceX = (player.frameCurrent * player.frameWidth) + player.frameXOffset;
      const sourceY = (player.frameRow * player.frameHeight) + player.frameYOffset;
      const width = player.frameWidth * player.frameScale;
      const height = player.frameHeight * player.frameScale;
      const x = player.position.x - (width / 2);
      const y = player.position.y - (height / 2);

      ctx.save();
      
      if (!player.facingRight) {
        ctx.scale(-1, 1);
        ctx.drawImage(
          player.sprite,
          sourceX, sourceY, player.frameWidth, player.frameHeight,
          -(x + width), y, width, height
        );
      } else {
        ctx.drawImage(
          player.sprite,
          sourceX, sourceY, player.frameWidth, player.frameHeight,
          x, y, width, height
        );
      }
      
      ctx.restore();

      // Draw player collision circle for debugging
      ctx.strokeStyle = '#00ff00';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(player.position.x, player.position.y, player.radius, 0, Math.PI * 2);
      ctx.stroke();
    } else {
      // Fallback: Draw simple circle if sprite not loaded
      ctx.fillStyle = '#fff';
      ctx.beginPath();
      ctx.arc(player.position.x, player.position.y, player.radius, 0, Math.PI * 2);
      ctx.fill();
    }

    // Draw player info
    ctx.fillStyle = '#fff';
    ctx.font = '12px Arial';
    ctx.fillText(`Action: ${player.action}`, 10, 20);
    ctx.fillText(`Speed: ${player.speed.toFixed(2)}`, 10, 35);
    ctx.fillText(`Position: ${Math.round(player.position.x)}, ${Math.round(player.position.y)}`, 10, 50);
    ctx.fillText(`On Ground: ${player.isOnGround}`, 10, 65);

    // Draw frame rate
    const now = Date.now();
    const deltaTime = now - lastFrameTime.current;
    frameCount.current++;
    
    const currentSecond = Math.floor(now / 1000);
    if (currentSecond !== lastSecond.current) {
      setFrameRate(frameCount.current);
      frameCount.current = 0;
      lastSecond.current = currentSecond;
    }
    lastFrameTime.current = now;

    ctx.fillStyle = '#dadada';
    ctx.font = '10px Arial';
    ctx.fillText(`FPS: ${useGameStore.getState().frameRate}`, canvas.width - 60, 15);
  }, [canvasRef, collisionBlocks, player, setFrameRate]);

  // Game loop
  const gameLoop = useCallback(() => {
    if (!isPlaying) return;

    updatePhysics();
    render();

    animationRef.current = requestAnimationFrame(gameLoop);
  }, [isPlaying, updatePhysics, render]);

  // Start/stop game loop
  useEffect(() => {
    if (isPlaying) {
      animationRef.current = requestAnimationFrame(gameLoop);
    } else {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPlaying, gameLoop]);
};
