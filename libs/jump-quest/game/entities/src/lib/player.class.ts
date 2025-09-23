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
  speed: number = 0;
  baseAcceleration: number = 0.07;
  acceleration: number = 0.07;
  accelerationIncrement: number = 0.0008;
  maxAcceleration: number = 0.14;
  maxSpeed: number = 3;
  walkFriction: number = 0.95;
  friction: number = 0.95;
  runFriction: number = 0.98;

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
  frameXOffset: number = 200;
  frameYOffset: number = 200;
  frameScale: number = 0.25;
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
    const playerRect = {
      x: newPos.x - this.radius,
      y: newPos.y - this.radius,
      width: this.radius * 2,
      height: this.radius * 2
    };

    let onGround = false;

    for (const block of this.collisionBlocks) {
      const blockRect = {
        x: block.position.x,
        y: block.position.y,
        width: block.w,
        height: block.h
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
          if (playerRect.x < blockRect.x) {
            newPos.x = blockRect.x - this.radius;
          } else {
            newPos.x = blockRect.x + blockRect.width + this.radius;
          }
          vel.x = 0;
        } else {
          // Vertical collision
          if (playerRect.y < blockRect.y) {
            newPos.y = blockRect.y - this.radius;
            onGround = true;
            vel.y = 0;
          } else {
            newPos.y = blockRect.y + blockRect.height + this.radius;
            vel.y = 0;
          }
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
      this.velocity.y = -15;
      this.isCrouchingForJump = false;
    }

    if (this.a) {
      accelerationX -= this.acceleration;
    }
    if (this.d) {
      accelerationX += this.acceleration;
    }

    // Calculate the combined speed
    this.speed = Math.abs(this.velocity.x);

    // Normalize the velocity vector if the speed exceeds maxSpeed
    if (this.speed > this.maxSpeed) {
      const ratio = this.maxSpeed / this.speed;
      this.velocity.x *= ratio;
      this.velocity.y *= ratio;
      this.speed = this.maxSpeed;
    }

    this.velocity.x += accelerationX;

    // Calculate new position
    const newPos = {
      x: this.position.x + this.velocity.x,
      y: this.position.y + this.velocity.y
    };

    // Check collisions and update position
    const collision = this.checkCollisions(newPos, this.velocity);
    this.position = collision.newPos;
    this.velocity = collision.vel;
    this.isOnGround = collision.onGround;

    if (collision.onGround) {
      this.isJumping = false;
    }

    // Handle facing right/left
    if (this.velocity.x > 0) {
      this.facingRight = true;
    } else if (this.velocity.x < 0) {
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