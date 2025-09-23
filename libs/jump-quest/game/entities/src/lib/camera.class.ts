import { Position } from '@jump-quest/models';

export class Camera {
  position: Position;
  viewportWidth: number;
  viewportHeight: number;
  deadZoneWidth: number = 200;
  deadZoneHeight: number = 150;
  smoothing: number = 0.1;
  
  // Map boundaries (optional - prevents camera from showing outside the map)
  mapWidth?: number;
  mapHeight?: number;

  constructor(viewportWidth: number, viewportHeight: number, startX: number = 0, startY: number = 0) {
    this.viewportWidth = viewportWidth;
    this.viewportHeight = viewportHeight;
    this.position = { x: startX, y: startY };
  }

  /**
   * Update camera position to follow a target (usually the player)
   */
  follow(target: Position): void {
    // Calculate the center of the viewport
    const viewportCenterX = this.position.x + this.viewportWidth / 2;
    const viewportCenterY = this.position.y + this.viewportHeight / 2;

    // Calculate dead zone boundaries
    const deadZoneLeft = viewportCenterX - this.deadZoneWidth / 2;
    const deadZoneRight = viewportCenterX + this.deadZoneWidth / 2;
    const deadZoneTop = viewportCenterY - this.deadZoneHeight / 2;
    const deadZoneBottom = viewportCenterY + this.deadZoneHeight / 2;

    // Target position for the camera
    let targetCameraX = this.position.x;
    let targetCameraY = this.position.y;

    // Check if target is outside the dead zone horizontally
    if (target.x < deadZoneLeft) {
      targetCameraX = target.x - this.viewportWidth / 2 + this.deadZoneWidth / 2;
    } else if (target.x > deadZoneRight) {
      targetCameraX = target.x - this.viewportWidth / 2 - this.deadZoneWidth / 2;
    }

    // Check if target is outside the dead zone vertically
    if (target.y < deadZoneTop) {
      targetCameraY = target.y - this.viewportHeight / 2 + this.deadZoneHeight / 2;
    } else if (target.y > deadZoneBottom) {
      targetCameraY = target.y - this.viewportHeight / 2 - this.deadZoneHeight / 2;
    }

    // Apply map boundaries if set
    if (this.mapWidth !== undefined) {
      targetCameraX = Math.max(0, Math.min(targetCameraX, this.mapWidth - this.viewportWidth));
    }
    if (this.mapHeight !== undefined) {
      targetCameraY = Math.max(0, Math.min(targetCameraY, this.mapHeight - this.viewportHeight));
    }

    // Smooth camera movement
    this.position.x += (targetCameraX - this.position.x) * this.smoothing;
    this.position.y += (targetCameraY - this.position.y) * this.smoothing;
  }

  /**
   * Convert world coordinates to screen coordinates
   */
  worldToScreen(worldPos: Position): Position {
    return {
      x: worldPos.x - this.position.x,
      y: worldPos.y - this.position.y
    };
  }

  /**
   * Convert screen coordinates to world coordinates
   */
  screenToWorld(screenPos: Position): Position {
    return {
      x: screenPos.x + this.position.x,
      y: screenPos.y + this.position.y
    };
  }

  /**
   * Check if a rectangle is visible in the current viewport
   */
  isVisible(worldX: number, worldY: number, width: number, height: number): boolean {
    return !(
      worldX + width < this.position.x ||
      worldX > this.position.x + this.viewportWidth ||
      worldY + height < this.position.y ||
      worldY > this.position.y + this.viewportHeight
    );
  }

  /**
   * Get the current visible area in world coordinates
   */
  getVisibleArea() {
    return {
      left: this.position.x,
      right: this.position.x + this.viewportWidth,
      top: this.position.y,
      bottom: this.position.y + this.viewportHeight
    };
  }

  /**
   * Set map boundaries for camera constraints
   */
  setMapBounds(width: number, height: number): void {
    this.mapWidth = width;
    this.mapHeight = height;
  }

  /**
   * Apply camera transformation to the canvas context
   */
  applyTransform(ctx: CanvasRenderingContext2D): void {
    ctx.translate(-this.position.x, -this.position.y);
  }

  /**
   * Remove camera transformation from the canvas context
   */
  removeTransform(ctx: CanvasRenderingContext2D): void {
    ctx.translate(this.position.x, this.position.y);
  }
}