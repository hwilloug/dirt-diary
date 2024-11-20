"use client";

import { useDraggable } from "@dnd-kit/core";
import { GardenPlant } from "@/types/garden";
import { Flower } from "lucide-react";

interface PlantItemProps {
  plant: GardenPlant;
  isActive: boolean;
  onUpdate: (updates: Partial<GardenPlant>) => void;
}

export function PlantItem({ plant, isActive, onUpdate }: PlantItemProps) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: plant.id,
    data: {
      type: "placed-plant",
      plant,
    },
  });

  const style = {
    gridColumn: `span ${plant.width}`,
    gridRow: `span ${plant.height}`,
    transform: transform
      ? `translate3d(${transform.x}px, ${transform.y}px, 0) rotate(${plant.rotation}deg)`
      : `rotate(${plant.rotation}deg)`,
  };

  return (
    <div
      ref={setNodeRef}
      className={`flex items-center justify-center ${
        isActive ? "ring-2 ring-primary" : ""
      }`}
      style={style}
      {...listeners}
      {...attributes}
    >
      <Flower className="h-6 w-6 text-primary" />
    </div>
  );
}