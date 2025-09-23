// libs/jump-quest/game/entities/src/lib/enhanced-map.class.ts
import { TileSize, Position } from '@jump-quest/models';
import { CollisionBlock } from './collision-block.class';
import { Camera } from './camera.class';

export interface MapLayer {
  name: string;
  data: number[];
  visible: boolean;
  opacity: number;
}

export class GameMap {
  ctx: CanvasRenderingContext2D;
  name: string;
  tileSize: TileSize;
  mapWidth: number; // in tiles
  mapHeight: number; // in tiles
  worldWidth: number; // in pixels
  worldHeight: number; // in pixels
  
  // Map layers (background, foreground, collision, etc.)
  layers: MapLayer[] = [];
  collisionLayer: number[] = [];
  
  // Collision blocks
  collisionBlocks: CollisionBlock[] = [];
  visibleCollisionBlocks: CollisionBlock[] = [];
  
  // Tileset image (if using sprites instead of colored rectangles)
  tilesetImage?: HTMLImageElement;
  tilesPerRow?: number;
  
  // Background color
  backgroundColor: string = '#87CEEB'; // Sky blue

  constructor(
    ctx: CanvasRenderingContext2D,
    name: string,
    tileSize: TileSize,
    mapWidth: number,
    mapHeight: number
  ) {
    this.ctx = ctx;
    this.name = name;
    this.tileSize = tileSize;
    this.mapWidth = mapWidth;
    this.mapHeight = mapHeight;
    this.worldWidth = mapWidth * tileSize.w;
    this.worldHeight = mapHeight * tileSize.h;
  }

  /**
   * Add a layer to the map
   */
  addLayer(layer: MapLayer): void {
    this.layers.push(layer);
  }

  /**
   * Set collision data and generate collision blocks
   */
  setCollisionLayer(collisionData: number[]): void {
    this.collisionLayer = collisionData;
    this.generateCollisionBlocks();
  }

  /**
   * Generate collision blocks from collision data
   */
  private generateCollisionBlocks(): void {
    this.collisionBlocks = [];
    
    for (let i = 0; i < this.collisionLayer.length; i++) {
      if (this.collisionLayer[i] !== 0) {
        const x = (i % this.mapWidth) * this.tileSize.w;
        const y = Math.floor(i / this.mapWidth) * this.tileSize.h;
        
        this.collisionBlocks.push(new CollisionBlock(this.ctx, { x, y }));
      }
    }
  }

  /**
   * Load tileset image for sprite-based rendering
   */
  loadTileset(imagePath: string, tilesPerRow: number): Promise<void> {
    return new Promise((resolve, reject) => {
      this.tilesetImage = new Image();
      this.tilesPerRow = tilesPerRow;
      
      this.tilesetImage.onload = () => resolve();
      this.tilesetImage.onerror = reject;
      this.tilesetImage.src = imagePath;
    });
  }

  /**
   * Update visible elements based on camera viewport
   */
  updateVisibleElements(camera: Camera): void {
    const visibleArea = camera.getVisibleArea();
    
    // Update visible collision blocks
    this.visibleCollisionBlocks = this.collisionBlocks.filter(block => 
      camera.isVisible(block.position.x, block.position.y, block.w, block.h)
    );
  }

  /**
   * Render the map with viewport culling
   */
  render(camera: Camera): void {
    // Update visible elements first
    this.updateVisibleElements(camera);
    
    const visibleArea = camera.getVisibleArea();
    
    // Calculate which tiles are visible
    const startTileX = Math.max(0, Math.floor(visibleArea.left / this.tileSize.w));
    const endTileX = Math.min(this.mapWidth - 1, Math.ceil(visibleArea.right / this.tileSize.w));
    const startTileY = Math.max(0, Math.floor(visibleArea.top / this.tileSize.h));
    const endTileY = Math.min(this.mapHeight - 1, Math.ceil(visibleArea.bottom / this.tileSize.h));

    // Draw background
    this.drawBackground(camera, visibleArea);
    
    // Render each layer
    this.layers.forEach(layer => {
      if (layer.visible) {
        this.renderLayer(layer, startTileX, endTileX, startTileY, endTileY, camera);
      }
    });
    
    // Draw collision blocks (for debugging)
    this.drawVisibleCollisions();
  }

  /**
   * Draw background that fills the visible area
   */
  private drawBackground(camera: Camera, visibleArea: any): void {
    this.ctx.fillStyle = this.backgroundColor;
    this.ctx.fillRect(
      visibleArea.left,
      visibleArea.top,
      visibleArea.right - visibleArea.left,
      visibleArea.bottom - visibleArea.top
    );
  }

  /**
   * Render a specific layer with viewport culling
   */
  private renderLayer(
    layer: MapLayer,
    startTileX: number,
    endTileX: number,
    startTileY: number,
    endTileY: number,
    camera: Camera
  ): void {
    this.ctx.globalAlpha = layer.opacity;
    
    for (let tileY = startTileY; tileY <= endTileY; tileY++) {
      for (let tileX = startTileX; tileX <= endTileX; tileX++) {
        const tileIndex = tileY * this.mapWidth + tileX;
        const tileId = layer.data[tileIndex];
        
        if (tileId !== 0) {
          const worldX = tileX * this.tileSize.w;
          const worldY = tileY * this.tileSize.h;
          
          this.drawTile(tileId, worldX, worldY);
        }
      }
    }
    
    this.ctx.globalAlpha = 1.0; // Reset alpha
  }

  /**
   * Draw a single tile
   */
  private drawTile(tileId: number, worldX: number, worldY: number): void {
    if (this.tilesetImage && this.tilesetImage.complete && this.tilesPerRow) {
      // Sprite-based rendering
      const tileIndexInTileset = tileId - 1; // Assuming tileId starts from 1
      const sourceX = (tileIndexInTileset % this.tilesPerRow) * this.tileSize.w;
      const sourceY = Math.floor(tileIndexInTileset / this.tilesPerRow) * this.tileSize.h;
      
      this.ctx.drawImage(
        this.tilesetImage,
        sourceX, sourceY, this.tileSize.w, this.tileSize.h,
        worldX, worldY, this.tileSize.w, this.tileSize.h
      );
    } else {
      // Fallback: colored rectangles based on tile ID
      this.drawColoredTile(tileId, worldX, worldY);
    }
  }

  /**
   * Draw colored tile as fallback
   */
  private drawColoredTile(tileId: number, worldX: number, worldY: number): void {
    // Define colors for different tile types
    const tileColors: { [key: number]: string } = {
      1: '#8B4513', // Brown for dirt
      2: '#228B22', // Green for grass
      3: '#696969', // Gray for stone
      292: '#A0522D', // Different brown for collision blocks
      // Add more tile types as needed
    };
    
    const color = tileColors[tileId] || '#CCCCCC'; // Default gray
    
    this.ctx.fillStyle = color;
    this.ctx.fillRect(worldX, worldY, this.tileSize.w, this.tileSize.h);
    
    // Optional: Add border for better visibility
    this.ctx.strokeStyle = '#000000';
    this.ctx.lineWidth = 1;
    this.ctx.strokeRect(worldX, worldY, this.tileSize.w, this.tileSize.h);
  }

  /**
   * Draw only visible collision blocks
   */
  drawVisibleCollisions(): void {
    this.visibleCollisionBlocks.forEach(block => {
      block.draw();
    });
  }

  /**
   * Get collision blocks in a specific area (useful for player collision detection)
   */
  getCollisionBlocksInArea(x: number, y: number, width: number, height: number): CollisionBlock[] {
    return this.collisionBlocks.filter(block =>
      !(block.position.x + block.w < x ||
        block.position.x > x + width ||
        block.position.y + block.h < y ||
        block.position.y > y + height)
    );
  }

  /**
   * Create a simple test map for demonstration
   */
  static createTestMap(ctx: CanvasRenderingContext2D, tileSize: TileSize): GameMap {
    const mapWidth = 50; // 50 tiles wide
    const mapHeight = 30; // 30 tiles high
    
    const map = new GameMap(ctx, 'test-map', tileSize, mapWidth, mapHeight);
    
    // Create background layer
    const backgroundData = new Array(mapWidth * mapHeight).fill(0);
    map.addLayer({
      name: 'background',
      data: backgroundData,
      visible: true,
      opacity: 1.0
    });
    
    // Create terrain layer with platforms
    const terrainData = new Array(mapWidth * mapHeight).fill(0);
    
    // Add ground
    for (let x = 0; x < mapWidth; x++) {
      for (let y = mapHeight - 3; y < mapHeight; y++) {
        terrainData[y * mapWidth + x] = 1; // Dirt
      }
    }
    
    // Add some platforms
    for (let x = 10; x < 20; x++) {
      terrainData[20 * mapWidth + x] = 2; // Grass platform
    }
    
    for (let x = 30; x < 40; x++) {
      terrainData[15 * mapWidth + x] = 2; // Another grass platform
    }
    
    // Add walls
    for (let y = 0; y < mapHeight; y++) {
      terrainData[y * mapWidth + 0] = 3; // Left wall
      terrainData[y * mapWidth + (mapWidth - 1)] = 3; // Right wall
    }
    
    map.addLayer({
      name: 'terrain',
      data: terrainData,
      visible: true,
      opacity: 1.0
    });
    
    // Create collision data (292 represents collision blocks)
    const collisionData = terrainData.map(tile => tile === 0 ? 0 : 292);
    map.setCollisionLayer(collisionData);
    
    return map;
  }
}