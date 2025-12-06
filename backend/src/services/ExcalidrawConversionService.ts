import { MindmapNode } from './MindmapService';

// Define Excalidraw element types based on the structure we observed
export interface ExcalidrawElement {
  id: string;
  type: 'rectangle' | 'ellipse' | 'diamond' | 'arrow' | 'text' | 'line';
  x: number;
  y: number;
  width: number;
  height: number;
  strokeColor: string;
  backgroundColor: string;
  fillStyle: 'hachure' | 'cross-hatch' | 'solid' | 'zigzag';
  strokeWidth: number;
  strokeStyle: 'solid' | 'dashed' | 'dotted';
  roundness: null | { type: 'fixed' | 'dynamic'; value?: number };
  roughness: number;
  opacity: number;
  angle: number;
  seed: number;
  version: number;
  versionNonce: number;
  index: string | null;
  isDeleted: boolean;
  groupIds: string[];
  frameId: string | null;
  boundElements: any[] | null;
  updated: number;
  link: string | null;
  locked: boolean;
  text?: string;
  fontFamily?: string;
  fontSize?: number;
  textAlign?: 'left' | 'center' | 'right';
  verticalAlign?: 'top' | 'middle' | 'bottom';
  strokeRoundness?: 'round' | 'sharp';
  startBinding?: any;
  endBinding?: any;
  points?: Array<{ x: number; y: number }>;
  lastCommittedPoint?: { x: number; y: number };
}

interface PositionedNode {
  node: MindmapNode;
  x: number;
  y: number;
  width: number;
  height: number;
}

class ExcalidrawConversionService {
  // Constants for layout and styling
  private readonly NODE_WIDTH = 200;
  private readonly NODE_HEIGHT = 60;
  private readonly HORIZONTAL_SPACING = 250;
  private readonly VERTICAL_SPACING = 100;
  private readonly FONT_SIZE = 16;
  private readonly STROKE_WIDTH = 2;
  private readonly STROKE_COLOR = '#000000';
  private readonly BACKGROUND_COLOR = '#ffffff';
  private readonly ARROW_COLOR = '#000000';

  /**
   * Convert a mindmap to Excalidraw elements
   * @param mindmap The mindmap to convert
   * @returns Array of Excalidraw elements
   */
  convertToExcalidrawElements(mindmap: MindmapNode): ExcalidrawElement[] {
    const elements: ExcalidrawElement[] = [];
    
    // First, calculate positions for all nodes
    const positionedNodes = this.calculateNodePositions(mindmap);
    
    // Convert nodes to rectangle elements
    const nodeElements = this.convertNodesToElements(positionedNodes);
    elements.push(...nodeElements);
    
    // Convert relationships to arrow elements
    const arrowElements = this.convertRelationshipsToArrows(positionedNodes, mindmap);
    elements.push(...arrowElements);
    
    return elements;
  }

  /**
   * Calculate positions for all nodes in the mindmap
   * @param mindmap The mindmap to calculate positions for
   * @returns Map of node IDs to their positions and dimensions
   */
  private calculateNodePositions(mindmap: MindmapNode): Map<string, PositionedNode> {
    const positions = new Map<string, PositionedNode>();
    
    // Start with the root node at the center top
    const rootPosition: PositionedNode = {
      node: mindmap,
      x: 0,
      y: 0,
      width: this.NODE_WIDTH,
      height: this.NODE_HEIGHT,
    };
    
    positions.set(mindmap.id, rootPosition);
    
    // Calculate positions for children recursively
    this.calculateChildPositions(mindmap, rootPosition, positions);
    
    // Center the entire mindmap by adjusting all positions
    this.centerMindmap(positions);
    
    return positions;
  }

  /**
   * Calculate positions for child nodes
   * @param parentNode The parent node
   * @param parentPosition The parent node's position
   * @param positions Map to store positions
   */
  private calculateChildPositions(
    parentNode: MindmapNode,
    parentPosition: PositionedNode,
    positions: Map<string, PositionedNode>
  ): void {
    if (parentNode.children.length === 0) {
      return;
    }
    
    // Calculate vertical offset for children
    const verticalOffset = parentPosition.y + parentPosition.height + this.VERTICAL_SPACING;
    
    // Calculate horizontal spacing for siblings
    const totalWidth = parentNode.children.length * this.NODE_WIDTH + 
                      (parentNode.children.length - 1) * this.HORIZONTAL_SPACING;
    
    // Start position for the first child
    let currentX = parentPosition.x - totalWidth / 2;
    
    parentNode.children.forEach((child, index) => {
      const childPosition: PositionedNode = {
        node: child,
        x: currentX,
        y: verticalOffset,
        width: this.NODE_WIDTH,
        height: this.NODE_HEIGHT,
      };
      
      positions.set(child.id, childPosition);
      
      // Recursively calculate positions for this child's children
      this.calculateChildPositions(child, childPosition, positions);
      
      // Move to next position for sibling
      currentX += this.NODE_WIDTH + this.HORIZONTAL_SPACING;
    });
  }

  /**
   * Center the entire mindmap by adjusting all positions
   * @param positions Map of node positions
   */
  private centerMindmap(positions: Map<string, PositionedNode>): void {
    if (positions.size === 0) {
      return;
    }
    
    // Find the bounding box of all nodes
    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;
    
    positions.forEach(position => {
      minX = Math.min(minX, position.x);
      minY = Math.min(minY, position.y);
      maxX = Math.max(maxX, position.x + position.width);
      maxY = Math.max(maxY, position.y + position.height);
    });
    
    // Calculate offset to center the mindmap
    const offsetX = -minX + 500; // Add some padding
    const offsetY = -minY + 200;
    
    // Adjust all positions
    positions.forEach(position => {
      position.x += offsetX;
      position.y += offsetY;
    });
  }

  /**
   * Convert nodes to Excalidraw rectangle elements
   * @param positions Map of node positions
   * @returns Array of Excalidraw elements
   */
  private convertNodesToElements(positions: Map<string, PositionedNode>): ExcalidrawElement[] {
    const elements: ExcalidrawElement[] = [];
    
    positions.forEach(position => {
      const element: ExcalidrawElement = this.createRectangleElement(
        position.node.id,
        position.x,
        position.y,
        position.width,
        position.height,
        position.node.topic
      );
      elements.push(element);
    });
    
    return elements;
  }

  /**
   * Create a rectangle element with text
   * @param id Element ID
   * @param x X coordinate
   * @param y Y coordinate
   * @param width Width
   * @param height Height
   * @param text Text content
   * @returns Excalidraw rectangle element
   */
  private createRectangleElement(
    id: string,
    x: number,
    y: number,
    width: number,
    height: number,
    text: string
  ): ExcalidrawElement {
    return {
      id,
      type: 'rectangle',
      x,
      y,
      width,
      height,
      strokeColor: this.STROKE_COLOR,
      backgroundColor: this.BACKGROUND_COLOR,
      fillStyle: 'solid',
      strokeWidth: this.STROKE_WIDTH,
      strokeStyle: 'solid',
      roundness: { type: 'fixed', value: 2 },
      roughness: 1,
      opacity: 1,
      angle: 0,
      seed: Math.floor(Math.random() * 1000000),
      version: 1,
      versionNonce: Math.floor(Math.random() * 1000000),
      index: null,
      isDeleted: false,
      groupIds: [],
      frameId: null,
      boundElements: null,
      updated: Date.now(),
      link: null,
      locked: false,
      text,
      fontFamily: 'Arial',
      fontSize: this.FONT_SIZE,
      textAlign: 'center',
      verticalAlign: 'middle',
      strokeRoundness: 'round',
    };
  }

  /**
   * Convert relationships between nodes to arrow elements
   * @param positions Map of node positions
   * @param mindmap The root mindmap node
   * @returns Array of Excalidraw arrow elements
   */
  private convertRelationshipsToArrows(
    positions: Map<string, PositionedNode>,
    mindmap: MindmapNode
  ): ExcalidrawElement[] {
    const arrows: ExcalidrawElement[] = [];
    
    // Recursively process all nodes and their relationships
    const processNode = (node: MindmapNode) => {
      node.children.forEach(child => {
        const parentPosition = positions.get(node.id);
        const childPosition = positions.get(child.id);
        
        if (parentPosition && childPosition) {
          const arrow = this.createArrowElement(
            `${node.id}-${child.id}`,
            parentPosition,
            childPosition
          );
          arrows.push(arrow);
        }
        
        // Process child's children
        processNode(child);
      });
    };
    
    processNode(mindmap);
    
    return arrows;
  }

  /**
   * Create an arrow element between two nodes
   * @param id Element ID
   * @param fromPosition Source node position
   * @param toPosition Target node position
   * @returns Excalidraw arrow element
   */
  private createArrowElement(
    id: string,
    fromPosition: PositionedNode,
    toPosition: PositionedNode
  ): ExcalidrawElement {
    // Calculate start and end points for the arrow
    const startX = fromPosition.x + fromPosition.width / 2;
    const startY = fromPosition.y + fromPosition.height;
    const endX = toPosition.x + toPosition.width / 2;
    const endY = toPosition.y;
    
    return {
      id,
      type: 'arrow',
      x: startX,
      y: startY,
      width: 0, // Arrows use points instead of width/height
      height: 0,
      strokeColor: this.ARROW_COLOR,
      backgroundColor: this.BACKGROUND_COLOR,
      fillStyle: 'solid',
      strokeWidth: this.STROKE_WIDTH,
      strokeStyle: 'solid',
      roundness: null,
      roughness: 1,
      opacity: 1,
      angle: 0,
      seed: Math.floor(Math.random() * 1000000),
      version: 1,
      versionNonce: Math.floor(Math.random() * 1000000),
      index: null,
      isDeleted: false,
      groupIds: [],
      frameId: null,
      boundElements: null,
      updated: Date.now(),
      link: null,
      locked: false,
      strokeRoundness: 'round',
      points: [
        { x: startX, y: startY },
        { x: endX, y: endY },
      ],
      lastCommittedPoint: { x: endX, y: endY },
    };
  }

  /**
   * Generate a unique ID for Excalidraw elements
   * @returns Unique ID string
   */
  private generateId(): string {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  }
}

export default new ExcalidrawConversionService();
