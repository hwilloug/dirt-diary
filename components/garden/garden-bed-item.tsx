"use client";

import { useDraggable } from "@dnd-kit/core";
import { GardenBed } from "@/types/garden";

interface GardenBedItemProps {
  bed: GardenBed;
  isActive: boolean;
  onUpdate: (updates: Partial<GardenBed>) => void;
}

export function GardenBedItem({ bed, isActive, onUpdate }: GardenBedItemProps) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: bed.id,
    data: {
      type: "bed",
      bed,
    },
  });

  const style = {
    gridColumn: `span ${bed.width}`,
    gridRow: `span ${bed.height}`,
    transform: transform
      ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
      : undefined,
  };

  return (
    <div
      ref={setNodeRef}
      className={`relative border-2 rounded-lg ${
        bed.type === "raised"
          ? "border-brown-600 bg-brown-100"
          : "border-green-600 bg-green-100"
      } ${isActive ? "ring-2 ring-primary" : ""}`}
      style={style}
      {...listeners}
      {...attributes}
    >
      <div className="absolute inset-0 flex items-center justify-center text-sm font-medium">
        {bed.name}
      </div>
    </div>
  );
}