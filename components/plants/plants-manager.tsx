"use client";

import { useState } from "react";
import { Plus, Archive, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PlantList } from "./plant-list";
import { AddPlantDialog } from "./add-plant-dialog";
import { Plant, PlantType, PlantCategory } from "@/types/plant";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Sample plants data
const samplePlants: Plant[] = [
  {
    id: "1",
    name: "Monstera Deliciosa",
    type: "indoor",
    category: "perennials",
    careInstructions: {
      water: "Water when top 2-3 inches of soil is dry",
      sunlight: "Bright indirect light",
      temperature: "65-80°F (18-27°C)",
    },
    trefleId: 123456,
    createdAt: "2024-01-15T08:00:00Z",
    updatedAt: "2024-03-10T15:30:00Z",
    schedule: {
      watering: {
        enabled: true,
        frequency: 7,
        lastDate: "2024-03-08T08:00:00Z",
      },
      fertilizing: {
        enabled: true,
        frequency: 30,
        lastDate: "2024-02-15T08:00:00Z",
      },
    },
  },
  {
    id: "2",
    name: "Tomato Plant",
    type: "outdoor",
    category: "vegetables",
    careInstructions: {
      water: "Keep soil consistently moist",
      sunlight: "Full sun, 6-8 hours daily",
      temperature: "65-85°F (18-29°C)",
    },
    trefleId: 234567,
    createdAt: "2024-02-01T10:00:00Z",
    updatedAt: "2024-03-09T16:45:00Z",
    archived: true,
    archivedAt: "2024-03-09T16:45:00Z",
    archivedReason: "End of growing season",
    schedule: {
      watering: {
        enabled: true,
        frequency: 2,
        lastDate: "2024-03-10T08:00:00Z",
      },
      fertilizing: {
        enabled: true,
        frequency: 14,
        lastDate: "2024-03-01T08:00:00Z",
      },
      pruning: {
        enabled: true,
        frequency: 21,
        lastDate: "2024-02-20T08:00:00Z",
      },
    },
  },
  // Add more sample plants
];

const plantTypes: PlantType[] = ["indoor", "outdoor"];
const plantCategories: PlantCategory[] = [
  "perennials",
  "annuals",
  "herbs",
  "vegetables",
  "fruits",
  "succulents",
];

export function PlantsManager() {
  const [plants, setPlants] = useState<Plant[]>(samplePlants);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedTypes, setSelectedTypes] = useState<PlantType[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<PlantCategory[]>([]);

  const filteredPlants = plants.filter((plant) => {
    const matchesType = selectedTypes.length === 0 || selectedTypes.includes(plant.type);
    const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(plant.category);
    return matchesType && matchesCategory;
  });

  const activePlants = filteredPlants.filter((p) => !p.archived);
  const archivedPlants = filteredPlants.filter((p) => p.archived);

  const handleAddPlant = (plant: Plant) => {
    setPlants((prev) => [...prev, plant]);
    setIsAddDialogOpen(false);
  };

  const handleDeletePlant = (plantId: string) => {
    setPlants((prev) => prev.filter((p) => p.id !== plantId));
  };

  const handleUpdatePlant = (updatedPlant: Plant) => {
    setPlants((prev) =>
      prev.map((p) => (p.id === updatedPlant.id ? updatedPlant : p))
    );
  };

  const handleArchivePlant = (plantId: string, reason: string) => {
    setPlants((prev) =>
      prev.map((p) =>
        p.id === plantId
          ? {
              ...p,
              archived: true,
              archivedAt: new Date().toISOString(),
              archivedReason: reason,
              updatedAt: new Date().toISOString(),
            }
          : p
      )
    );
  };

  const handleRestorePlant = (plantId: string) => {
    setPlants((prev) =>
      prev.map((p) =>
        p.id === plantId
          ? {
              ...p,
              archived: false,
              archivedAt: undefined,
              archivedReason: undefined,
              updatedAt: new Date().toISOString(),
            }
          : p
      )
    );
  };

  const handleTypeToggle = (type: PlantType) => {
    setSelectedTypes((prev) =>
      prev.includes(type)
        ? prev.filter((t) => t !== type)
        : [...prev, type]
    );
  };

  const handleCategoryToggle = (category: PlantCategory) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <h2 className="text-2xl font-semibold tracking-tight">
            Plant Collection
          </h2>
          <p className="text-sm text-muted-foreground">
            {activePlants.length} active plants, {archivedPlants.length} archived
          </p>
        </div>
        <div className="flex space-x-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <Filter className="mr-2 h-4 w-4" />
                Filter
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Plant Types</DropdownMenuLabel>
              {plantTypes.map((type) => (
                <DropdownMenuCheckboxItem
                  key={type}
                  checked={selectedTypes.includes(type)}
                  onCheckedChange={() => handleTypeToggle(type)}
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </DropdownMenuCheckboxItem>
              ))}
              <DropdownMenuSeparator />
              <DropdownMenuLabel>Categories</DropdownMenuLabel>
              {plantCategories.map((category) => (
                <DropdownMenuCheckboxItem
                  key={category}
                  checked={selectedCategories.includes(category)}
                  onCheckedChange={() => handleCategoryToggle(category)}
                >
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <Button onClick={() => setIsAddDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" /> Add Plant
          </Button>
        </div>
      </div>

      <Tabs defaultValue="active" className="space-y-4">
        <TabsList>
          <TabsTrigger value="active">Active Plants</TabsTrigger>
          <TabsTrigger value="archived">
            <Archive className="h-4 w-4 mr-2" />
            Archived
          </TabsTrigger>
        </TabsList>

        <TabsContent value="active">
          <PlantList
            plants={activePlants}
            onDelete={handleDeletePlant}
            onUpdate={handleUpdatePlant}
            onArchive={handleArchivePlant}
          />
        </TabsContent>

        <TabsContent value="archived">
          <PlantList
            plants={archivedPlants}
            onDelete={handleDeletePlant}
            onUpdate={handleUpdatePlant}
            onRestore={handleRestorePlant}
            isArchiveView
          />
        </TabsContent>
      </Tabs>

      <AddPlantDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onAdd={handleAddPlant}
      />
    </div>
  );
}