"use client";

import { Plant } from "@/types/plant";
import { PlantCard } from "./plant-card";

interface PlantListProps {
  plants: Plant[];
  onDelete: (id: string) => void;
  onUpdate: (plant: Plant) => void;
  onArchive?: (id: string, reason: string) => void;
  onRestore?: (id: string) => void;
  isArchiveView?: boolean;
}

export function PlantList({
  plants,
  onDelete,
  onUpdate,
  onArchive,
  onRestore,
  isArchiveView = false,
}: PlantListProps) {
  if (plants.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">
          {isArchiveView
            ? "No archived plants."
            : "No plants added yet. Click the Add Plant button to start your collection."}
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {plants.map((plant) => (
        <PlantCard
          key={plant.id}
          plant={plant}
          onDelete={onDelete}
          onUpdate={onUpdate}
          onArchive={onArchive}
          onRestore={onRestore}
          isArchiveView={isArchiveView}
        />
      ))}
    </div>
  );
}