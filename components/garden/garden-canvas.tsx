"use client";

import { useDroppable } from "@dnd-kit/core";
import { GardenLayout } from "@/types/garden";
import { PlantItem } from "./plant-item";
import { GardenBedItem } from "./garden-bed-item";

interface GardenCanvasProps {
  layout: GardenLayout;
  activeId: string | null;
  onUpdateLayout: (updates: Partial<GardenLayout>) => void;
}

export function GardenCanvas({
  layout,
  activeId,
  onUpdateLayout,
}: GardenCanvasProps) {
  const { setNodeRef } = useDroppable({
    id: "garden-canvas",
    data: {
      type: "canvas",
    },
  });

  const gridCells = [];
  for (let y = 0; y < layout.height; y++) {
    for (let x = 0; x < layout.width; x++) {
      gridCells.push(
        <div
          key={`${x}-${y}`}
          className="border border-dashed border-gray-200 dark:border-gray-800"
          style={{
            gridColumn: x + 1,
            gridRow: y + 1,
          }}
        />
      );
    }
  }

  return (
    <div className="relative border rounded-lg bg-background">
      <div
        ref={setNodeRef}
        className="relative w-full aspect-[4/3] overflow-auto"
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${layout.width}, minmax(40px, 1fr))`,
          gridTemplateRows: `repeat(${layout.height}, minmax(40px, 1fr))`,
        }}
      >
        {gridCells}

        {layout.beds.map((bed) => (
          <GardenBedItem
            key={bed.id}
            bed={bed}
            isActive={activeId === bed.id}
            onUpdate={(updates) => {
              onUpdateLayout({
                beds: layout.beds.map((b) =>
                  b.id === bed.id ? { ...b, ...updates } : b
                ),
              });
            }}
          />
        ))}

        {layout.plants.map((plant) => (
          <PlantItem
            key={plant.id}
            plant={plant}
            isActive={activeId === plant.id}
            onUpdate={(updates) => {
              onUpdateLayout({
                plants: layout.plants.map((p) =>
                  p.id === plant.id ? { ...p, ...updates } : p
                ),
              });
            }}
          />
        ))}
      </div>
    </div>
  );
}