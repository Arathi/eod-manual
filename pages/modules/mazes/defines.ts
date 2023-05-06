export enum MazeCellType {
  none,
  wayPoint,
  startPoint,
  target,
}

export interface IMazeCellData {
  x: number;
  y: number;
  type : MazeCellType;
  eastPassable : boolean;
  southPassable : boolean;
}

export const MazeSize = 6;

export class MazeCellData implements IMazeCellData {
  x: number;
  y: number;
  type : MazeCellType;
  eastPassable : boolean;
  southPassable : boolean;
  
  constructor(options: IMazeCellData) {
    this.x = options.x;
    this.y = options.y;
    this.type = options.type;
    this.eastPassable = options.eastPassable;
    this.southPassable = options.southPassable;
  }
}
