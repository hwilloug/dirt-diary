export interface GardenPlant {
  id: string;
  plantId: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
}

export interface GardenBed {
  id: string;
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
  type: 'raised' | 'ground' | 'container';
}

export interface GardenLayout {
  id: string;
  name: string;
  width: number;
  height: number;
  gridSize: number;
  beds: GardenBed[];
  plants: GardenPlant[];
  createdAt: string;
  updatedAt: string;
}