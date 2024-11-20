export type PlantType = 'indoor' | 'outdoor';
export type PlantCategory = 'perennials' | 'annuals' | 'herbs' | 'vegetables' | 'fruits' | 'succulents';

export interface PlantSchedule {
  watering?: {
    enabled: boolean;
    frequency: number; // days
    lastDate?: string;
  };
  fertilizing?: {
    enabled: boolean;
    frequency: number; // days
    lastDate?: string;
  };
  pruning?: {
    enabled: boolean;
    frequency: number; // days
    lastDate?: string;
  };
}

export interface Plant {
  id: string;
  name: string;
  type: PlantType;
  category: PlantCategory;
  careInstructions: {
    water: string;
    sunlight: string;
    temperature: string;
  };
  schedule: PlantSchedule;
  purchaseDate?: string;
  plantingDate?: string;
  trefleId?: number;
  archived?: boolean;
  archivedAt?: string;
  archivedReason?: string;
  createdAt: string;
  updatedAt: string;
}