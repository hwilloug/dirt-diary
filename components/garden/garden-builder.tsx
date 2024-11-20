"use client";

import { useState } from "react";
import { DndContext, DragEndEvent, DragStartEvent } from "@dnd-kit/core";
import { GardenLayout, GardenPlant, GardenBed } from "@/types/garden";
import { GardenCanvas } from "./garden-canvas";
import { PlantLibrary } from "./plant-library";
import { GardenControls } from "./garden-controls";
import { SaveLayoutDialog } from "./save-layout-dialog";
import { Button } from "@/components/ui/button";
import { Plus, Save } from "lucide-react";

const defaultLayout: GardenLayout = {
  id: crypto.randomUUID(),
  name: "My Garden",
  width: 20,
  height: 15,
  gridSize: 1,
  beds: [],
  plants: [],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

export function GardenBuilder() {
  const [layout, setLayout] = useState<GardenLayout>(defaultLayout);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [isSaveDialogOpen, setIsSaveDialogOpen] = useState(false);

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveId(null);
    const { active, over } = event;

    if (over && active.id !== over.id) {
      // Handle plant placement
      if (active.data.current?.type === "plant" && over.data.current?.type === "canvas") {
        const newPlant: GardenPlant = {
          id: crypto.randomUUID(),
          plantId: active.id as string,
          x: Math.round(over.data.current.x / layout.gridSize) * layout.gridSize,
          y: Math.round(over.data.current.y / layout.gridSize) * layout.gridSize,
          width: 1,
          height: 1,
          rotation: 0,
        };

        setLayout((prev) => ({
          ...prev,
          plants: [...prev.plants, newPlant],
          updatedAt: new Date().toISOString(),
        }));
      }
    }
  };

  const handleAddBed = () => {
    const newBed: GardenBed = {
      id: crypto.randomUUID(),
      name: `Garden Bed ${layout.beds.length + 1}`,
      x: 0,
      y: 0,
      width: 4,
      height: 4,
      type: "raised",
    };

    setLayout((prev) => ({
      ...prev,
      beds: [...prev.beds, newBed],
      updatedAt: new Date().toISOString(),
    }));
  };

  const handleUpdateLayout = (updates: Partial<GardenLayout>) => {
    setLayout((prev) => ({
      ...prev,
      ...updates,
      updatedAt: new Date().toISOString(),
    }));
  };

  const handleSaveLayout = (name: string) => {
    const updatedLayout = {
      ...layout,
      name,
      updatedAt: new Date().toISOString(),
    };
    // Here you would typically save to your backend
    console.log("Saving layout:", updatedLayout);
    setIsSaveDialogOpen(false);
  };

  return (
    <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <GardenControls
            width={layout.width}
            height={layout.height}
            gridSize={layout.gridSize}
            onUpdate={handleUpdateLayout}
          />
          <div className="flex space-x-2">
            <Button onClick={handleAddBed}>
              <Plus className="mr-2 h-4 w-4" /> Add Garden Bed
            </Button>
            <Button onClick={() => setIsSaveDialogOpen(true)}>
              <Save className="mr-2 h-4 w-4" /> Save Layout
            </Button>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-[300px_1fr]">
          <PlantLibrary />
          <GardenCanvas
            layout={layout}
            activeId={activeId}
            onUpdateLayout={handleUpdateLayout}
          />
        </div>
      </div>

      <SaveLayoutDialog
        open={isSaveDialogOpen}
        onOpenChange={setIsSaveDialogOpen}
        currentName={layout.name}
        onSave={handleSaveLayout}
      />
    </DndContext>
  );
}