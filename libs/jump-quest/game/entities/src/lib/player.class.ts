import { Position, Velocity } from "@jump-quest/models";
import { Weapon } from "./weapon.class";
import { CollisionBlock } from "./collision-block.class";

export class Player {
  ctx: CanvasRenderingContext2D;
  name: string;
  position: Position;
  hp: number = 10;
  killCount: number = 0;
  radius: number = 10;
  color: string = "#FFF";
  velocity: Velocity = { x: 0, y: 0 };

  // Movement Values
  speed: number = 0;
  baseAcceleration: number = 0.07;
  acceleration: number = 0.07;
  accelerationIncrement: number = 0.0008;
  maxAcceleration: number = 0.14;
  maxSpeed: number = 3;
  walkFriction: number = 0.95;
  friction: number = 0.95;
  runFriction: number = 0.98;
  jumpVelocity: number = 10;

  // Gravity and ground detection
  gravity: number = 0.12;
  isOnGround: boolean = false;
  isCrouching: boolean = false;
  isJumping: boolean = false;

  // Player Controls
  w: boolean = false;
  a: boolean = false;
  s: boolean = false;
  d: boolean = false;

  // Sprite properties
  frameRow: number = 0;
  frameColumn: number = 0;
  frameSpeed: number = 10;
  frameCurrent: number = 0;
  frameLength: number = 7;
  frameWidth: number = 512;
  frameHeight: number = 512;
  frameXOffset: number = 0;
  frameYOffset: number = 100;
  frameScale: number = 0.33;
  action: string = "idle";
  facingRight: boolean = true;
  img: HTMLImageElement;

  // Inventory
  weapon: Weapon | null = null;

  // Jump timing
  crouchStartTime: number = 0;
  isCrouchingForJump: boolean = false;

  // Collision system
  collisionBlocks: CollisionBlock[];

  constructor(ctx: CanvasRenderingContext2D, name: string, x: number, y: number, collisionBlocks: CollisionBlock[]) {
    this.ctx = ctx;
    this.name = name;
    this.position = { x, y };
    this.collisionBlocks = collisionBlocks;

    // Load sprite image
    this.img = new Image();
    this.img.src = "./player.spritesheet.png";
  }

  update = () => {
    this.physics();
    this.movePlayer();
    this.setPlayerAction();
    this.drawPlayerSprite();
  }

  drawPlayerSprite = () => {
    this.frameColumn++;

    if (this.frameColumn >= this.frameSpeed) {
      this.frameColumn = 0;
      this.frameCurrent++;

      if (this.frameCurrent >= this.frameLength) {
        this.frameCurrent = 0;
      }
    }

    // Draw sprite if loaded, otherwise fallback to circle
    if (this.img.complete && this.img.naturalWidth > 0) {
      const sourceX = (this.frameCurrent * this.frameWidth) + this.frameXOffset;
      const sourceY = (this.frameRow * this.frameHeight) + this.frameYOffset;
      const width = this.frameWidth * this.frameScale;
      const height = this.frameHeight * this.frameScale;
      const x = this.position.x - (width / 2);
      const y = this.position.y - (height / 2);

      this.ctx.save();

      if (this.facingRight) {
        this.ctx.scale(1, 1);
        this.ctx.drawImage(this.img, sourceX, sourceY, 512, 512, x, y, width, height);
      } else {
        this.ctx.scale(-1, 1);
        this.ctx.drawImage(this.img, sourceX, sourceY, 512, 512, -x - width, y, width, height);
      }

      this.ctx.restore();

      // Draw collision circle for debugging
      this.ctx.strokeStyle = '#00ff00';
      this.ctx.lineWidth = 1;
      this.ctx.beginPath();
      this.ctx.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
      this.ctx.stroke();
    } else {
      // Fallback: simple circle
      this.ctx.fillStyle = this.color;
      this.ctx.beginPath();
      this.ctx.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
      this.ctx.fill();
    }

    // Draw the weapon if the player has one
    if (this.weapon && this.weapon.image.complete) {
      this.weapon.draw(this.ctx, this.position.x, this.position.y, this.facingRight);
    }
  };

  pickUpWeapon = (weapon: Weapon) => {
    this.weapon = weapon;
  }

  physics = () => {
    this.velocity.x *= this.friction;
    this.velocity.y *= this.friction;

    // Apply gravity
    if (!this.isOnGround) {
      this.velocity.y += this.gravity;
    }

    // Small threshold to avoid floating-point precision issues
    const threshold = 0.01;

    if (Math.abs(this.velocity.x) < threshold) {
      this.velocity.x = 0;
    }
    if (Math.abs(this.velocity.y) < threshold) {
      this.velocity.y = 0;
    }
  }

  checkCollisions = (newPos: Position, vel: Velocity) => {
    let onGround = false;
    const margin = 0.1; // Small margin to prevent floating point issues

    // Check horizontal collisions first
    const nextX = newPos.x + vel.x;
    for (const block of this.collisionBlocks) {
      const blockRect = {
        x: block.position.x,
        y: block.position.y,
        width: block.w,
        height: block.h
      };

      // Check horizontal collision
      if (
        nextX - this.radius < blockRect.x + blockRect.width + margin &&
        nextX + this.radius > blockRect.x - margin &&
        newPos.y - this.radius < blockRect.y + blockRect.height &&
        newPos.y + this.radius > blockRect.y
      ) {
        // Horizontal collision detected
        if (vel.x > 0) {
          // Moving right
          newPos.x = blockRect.x - this.radius - margin;
        } else if (vel.x < 0) {
          // Moving left
          newPos.x = blockRect.x + blockRect.width + this.radius + margin;
        }
        vel.x = 0;
        break;
      }
    }

    // Check vertical collisions second
    const nextY = newPos.y + vel.y;
    for (const block of this.collisionBlocks) {
      const blockRect = {
        x: block.position.x,
        y: block.position.y,
        width: block.w,
        height: block.h
      };

      // Check vertical collision
      if (
        newPos.x - this.radius < blockRect.x + blockRect.width + margin &&
        newPos.x + this.radius > blockRect.x - margin &&
        nextY - this.radius < blockRect.y + blockRect.height + margin &&
        nextY + this.radius > blockRect.y - margin
      ) {
        // Vertical collision detected
        if (vel.y > 0) {
          // Falling down - landing on top of block
          newPos.y = blockRect.y - this.radius - margin;
          onGround = true;
        } else if (vel.y < 0) {
          // Moving up - hitting ceiling
          newPos.y = blockRect.y + blockRect.height + this.radius + margin;
        }
        vel.y = 0;
        break;
      }
    }

    // Additional ground check for stability
    if (!onGround) {
      const groundCheckY = newPos.y + this.radius + 2; // Check slightly below player
      for (const block of this.collisionBlocks) {
        const blockRect = {
          x: block.position.x,
          y: block.position.y,
          width: block.w,
          height: block.h
        };

        if (
          newPos.x - this.radius < blockRect.x + blockRect.width &&
          newPos.x + this.radius > blockRect.x &&
          groundCheckY >= blockRect.y &&
          groundCheckY <= blockRect.y + 5
        ) {
          onGround = true;
          break;
        }
      }
    }

    return { newPos, vel, onGround };
  }

  movePlayer = () => {
    let accelerationX = 0;
    const currentTime = Date.now();

    // Handle jump input
    if (this.w && this.isOnGround && !this.isCrouchingForJump) {
      this.isCrouchingForJump = true;
      this.crouchStartTime = currentTime;
      this.isCrouching = true;
    }

    // Handle crouch-to-jump transition
    if (this.isCrouchingForJump && currentTime - this.crouchStartTime > 50) {
      this.isCrouching = false;
      this.isJumping = true;
      this.isOnGround = false;
      this.velocity.y = -this.jumpVelocity;
      this.isCrouchingForJump = false;
    }

    if (this.a) {
      accelerationX -= this.acceleration;
    }
    if (this.d) {
      accelerationX += this.acceleration;
    }

    // Apply acceleration
    this.velocity.x += accelerationX;

    // Calculate the combined speed
    this.speed = Math.abs(this.velocity.x);

    // Limit speed
    if (this.speed > this.maxSpeed) {
      const ratio = this.maxSpeed / this.speed;
      this.velocity.x *= ratio;
      this.speed = this.maxSpeed;
    }

    // Store current position for collision checking
    const oldPos = { ...this.position };

    // Calculate new position
    const newPos = {
      x: this.position.x + this.velocity.x,
      y: this.position.y + this.velocity.y
    };

    // Create a copy of velocity for collision checking
    const newVel = { ...this.velocity };

    // Check collisions and update position
    const collision = this.checkCollisions(newPos, newVel);
    
    // Update position and velocity
    this.position = collision.newPos;
    this.velocity = newVel;
    
    // Update ground state
    const wasOnGround = this.isOnGround;
    this.isOnGround = collision.onGround;

    // Reset jumping flag when landing
    if (!wasOnGround && this.isOnGround) {
      this.isJumping = false;
    }

    // Handle facing right/left
    if (this.velocity.x > 0.1) {
      this.facingRight = true;
    } else if (this.velocity.x < -0.1) {
      this.facingRight = false;
    }
  }

  setPlayerAction = () => {
    if (this.isCrouching) {
      this.action = 'crouch';
      this.frameRow = 3;
      this.frameLength = 1;
    }
    else if (this.isJumping) {
      this.action = 'jump';
      this.frameRow = 3;
      this.frameLength = 1;
    } else if (this.speed < 0.4) {
      this.friction = this.walkFriction;
      this.acceleration = this.baseAcceleration;
      this.action = 'idle';
      this.frameRow = 0;
      this.frameLength = 7;
    } else if (this.speed <= 1.99) {
      this.action = 'walk';
      this.frameRow = 1;
      this.frameLength = 7;
    } else {
      this.friction = this.runFriction;
      this.action = 'run';
      this.frameRow = 2;
      this.frameLength = 7;
    }
  };

  // Key event handlers
  setKeyState = (key: string, pressed: boolean) => {
    switch (key) {
      case "KeyW":
        this.w = pressed;
        break;
      case "KeyA":
        this.a = pressed;
        break;
      case "KeyS":
        this.s = pressed;
        break;
      case "KeyD":
        this.d = pressed;
        break;
    }

    if (pressed) {
      if (this.acceleration < this.maxAcceleration) {
        this.acceleration += this.accelerationIncrement;
      }
    }
  }
}