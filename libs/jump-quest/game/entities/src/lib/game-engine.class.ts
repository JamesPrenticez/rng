// libs/jump-quest/game/entities/src/lib/game-engine-enhanced.class.ts
import { Canvas } from "./canvas.class";
import { Player } from "./player.class";
import { Weapon } from "./weapon.class";
import { Camera } from "./camera.class";
import { GameMap } from "./map.class";

export class GameEngine {
  canvas: Canvas;
  player: Player;
  weapon: Weapon;
  map: GameMap;
  camera: Camera;
  isPlaying: boolean = false;
  animationId: number | null = null;
  
  // Debug options
  showCollisions: boolean = true;
  showCameraInfo: boolean = true;

  constructor(canvasElement: HTMLCanvasElement) {
    const tileSize = { w: 64, h: 64 };
    
    // Initialize canvas
    this.canvas = new Canvas(canvasElement, tileSize.w * 16, tileSize.h * 9);
    
    // Initialize camera
    this.camera = new Camera(this.canvas.width, this.canvas.height);
    
    // Create enhanced map
    this.map = GameMap.createTestMap(this.canvas.ctx, tileSize);
    
    // Set camera bounds to the map size
    this.camera.setMapBounds(this.map.worldWidth, this.map.worldHeight);
    
    // Create player at the center of the map
    const playerStartX = this.map.worldWidth / 2;
    const playerStartY = this.map.worldHeight / 2 - 200; // A bit above center
    
    this.player = new Player(
      this.canvas.ctx,
      "player1",
      playerStartX,
      playerStartY,
      this.map.collisionBlocks
    );

    // Initialize camera to follow player
    this.camera.position.x = playerStartX - this.canvas.width / 2;
    this.camera.position.y = playerStartY - this.canvas.height / 2;

    // Create weapon
    this.weapon = new Weapon(
      'bow',
      5,
      0.15,
      -16,
      -16,
      "./weapon.spritesheet.png"
    );

    this.player.pickUpWeapon(this.weapon);
  }

  gameLoop = () => {
    if (!this.isPlaying) return;

    // Update camera to follow player
    this.camera.follow(this.player.position);

    // Clear canvas
    this.canvas.clear();
    
    // Save the context state
    this.canvas.ctx.save();
    
    // Apply camera transformation
    this.camera.applyTransform(this.canvas.ctx);
    
    // Update player with collision detection against nearby blocks
    this.updatePlayerCollisions();
    this.player.update();
    
    // Render the map (with viewport culling)
    this.map.render(this.camera);
    
    // Restore context (remove camera transformation)
    this.canvas.ctx.restore();
    
    // Draw UI elements (these stay in screen space)
    this.drawUI();

    // Request next animation frame
    this.animationId = requestAnimationFrame(this.gameLoop);
  }

  /**
   * Update player collision detection to only check nearby blocks
   */
  private updatePlayerCollisions(): void {
    // Get collision blocks in the area around the player
    const margin = 100; // Extra margin around player
    const nearbyBlocks = this.map.getCollisionBlocksInArea(
      this.player.position.x - this.player.radius - margin,
      this.player.position.y - this.player.radius - margin,
      this.player.radius * 2 + margin * 2,
      this.player.radius * 2 + margin * 2
    );
    
    // Update player's collision blocks to only nearby ones
    this.player.collisionBlocks = nearbyBlocks;
  }

  /**
   * Draw UI elements that stay in screen space
   */
  private drawUI(): void {
    // Frame rate
    this.canvas.drawFrameRate();
    
    if (this.showCameraInfo) {
      this.drawCameraInfo();
    }
    
    // Draw crosshair at screen center
    this.drawCrosshair();
  }

  /**
   * Draw camera debug information
   */
  private drawCameraInfo(): void {
    const ctx = this.canvas.ctx;
    ctx.font = "12px Arial";
    ctx.fillStyle = "#ffffff";
    
    // Camera position
    ctx.fillText(
      `Camera: (${Math.round(this.camera.position.x)}, ${Math.round(this.camera.position.y)})`,
      10, 30
    );
    
    // Player world position
    ctx.fillText(
      `Player: (${Math.round(this.player.position.x)}, ${Math.round(this.player.position.y)})`,
      10, 45
    );
    
    // Player screen position
    const playerScreenPos = this.camera.worldToScreen(this.player.position);
    ctx.fillText(
      `Player Screen: (${Math.round(playerScreenPos.x)}, ${Math.round(playerScreenPos.y)})`,
      10, 60
    );
    
    // Visible collision blocks count
    ctx.fillText(
      `Visible Blocks: ${this.map.visibleCollisionBlocks.length}/${this.map.collisionBlocks.length}`,
      10, 75
    );
  }

  /**
   * Draw crosshair at screen center
   */
  private drawCrosshair(): void {
    const ctx = this.canvas.ctx;
    const centerX = this.canvas.width / 2;
    const centerY = this.canvas.height / 2;
    const size = 10;
    
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(centerX - size, centerY);
    ctx.lineTo(centerX + size, centerY);
    ctx.moveTo(centerX, centerY - size);
    ctx.lineTo(centerX, centerY + size);
    ctx.stroke();
  }

  startGame = () => {
    if (!this.isPlaying) {
      this.isPlaying = true;
      this.gameLoop();
    }
  }

  pauseGame = () => {
    if (this.isPlaying) {
      this.isPlaying = false;
      if (this.animationId) {
        cancelAnimationFrame(this.animationId);
      }
    }
  }

  toggleGame = () => {
    if (this.isPlaying) {
      this.pauseGame();
    } else {
      this.startGame();
    }
  }

  handleKeyDown = (e: KeyboardEvent) => {
    this.player.setKeyState(e.code, true);
    
    // Debug controls
    if (e.code === 'KeyC') {
      this.showCollisions = !this.showCollisions;
    }
    if (e.code === 'KeyI') {
      this.showCameraInfo = !this.showCameraInfo;
    }
  }

  handleKeyUp = (e: KeyboardEvent) => {
    this.player.setKeyState(e.code, false);
  }

  /**
   * Handle mouse clicks (convert screen to world coordinates)
   */
  handleMouseClick = (e: MouseEvent) => {
    const rect = this.canvas.canvas.getBoundingClientRect();
    const screenX = e.clientX - rect.left;
    const screenY = e.clientY - rect.top;
    
    // Convert screen coordinates to world coordinates
    const worldPos = this.camera.screenToWorld({ x: screenX, y: screenY });
    
    console.log(`Clicked at world position: (${worldPos.x}, ${worldPos.y})`);
    // Here you could add functionality like shooting projectiles toward the clicked position
  }

  /**
   * Teleport player to a specific world position (useful for debugging)
   */
  teleportPlayer = (worldX: number, worldY: number) => {
    this.player.position.x = worldX;
    this.player.position.y = worldY;
    this.player.velocity.x = 0;
    this.player.velocity.y = 0;
  }

  /**
   * Get camera instance for external access
   */
  getCamera = (): Camera => {
    return this.camera;
  }

  /**
   * Get map instance for external access
   */
  getMap = (): GameMap => {
    return this.map;
  }
}