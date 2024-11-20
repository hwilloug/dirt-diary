"use client";

import { useState } from "react";
import { useDraggable } from "@dnd-kit/core";
import { Plant } from "@/types/plant";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search } from "lucide-react";
import { AddPlantDialog } from "../plants/add-plant-dialog";

// Sample plant library data
const samplePlants: Plant[] = [
  {
    id: "1",
    name: "Tomato",
    type: "outdoor",
    category: "vegetables",
    careInstructions: {
      water: "Regular watering",
      sunlight: "Full sun",
      temperature: "65-85°F",
    },
    schedule: {
      watering: {
        enabled: true,
        frequency: 2,
      },
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "2",
    name: "Basil",
    type: "indoor",
    category: "herbs",
    careInstructions: {
      water: "Keep soil moist",
      sunlight: "Partial sun",
      temperature: "60-70°F",
    },
    schedule: {
      watering: {
        enabled: true,
        frequency: 3,
      },
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

function DraggablePlantCard({ plant }: { plant: Plant }) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: plant.id,
    data: {
      type: "plant",
      plant,
    },
  });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined;

  return (
    <div ref={setNodeRef} style={style} {...listeners} {...attributes}>
      <Card className="cursor-move">
        <CardHeader className="p-4">
          <CardTitle className="text-sm">{plant.name}</CardTitle>
          <CardDescription>{plant.category}</CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
}

export function PlantLibrary() {
  const [plants, setPlants] = useState<Plant[]>(samplePlants);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const filteredPlants = plants.filter((plant) =>
    plant.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddPlant = (plant: Plant) => {
    setPlants((prev) => [...prev, plant]);
    setIsAddDialogOpen(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Plant Library</CardTitle>
        <CardDescription>Drag plants onto the garden layout</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex space-x-2">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search plants..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8"
            />
          </div>
          <Button onClick={() => setIsAddDialogOpen(true)}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        <div className="space-y-2">
          {filteredPlants.map((plant) => (
            <DraggablePlantCard key={plant.id} plant={plant} />
          ))}
        </div>
      </CardContent>

      <AddPlantDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onAdd={handleAddPlant}
      />
    </Card>
  );
}