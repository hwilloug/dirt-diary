"use client";

import { useState } from "react";
import { Plus, Calendar as CalendarIcon, List } from "lucide-react";
import { Button } from "@/components/ui/button";
import { JournalList } from "./journal-list";
import { JournalCalendar } from "./journal-calendar";
import { AddEntryDialog } from "./add-entry-dialog";
import { JournalEntry } from "@/types/journal";
import { Plant } from "@/types/plant";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
    schedule: {
      watering: {
        enabled: true,
        frequency: 7,
      },
    },
    purchaseDate: "2024-01-15T08:00:00Z",
    plantingDate: "2024-01-16T10:00:00Z",
    createdAt: "2024-01-15T08:00:00Z",
    updatedAt: "2024-03-10T15:30:00Z",
  },
  // Add more sample plants as needed
];

// Sample journal entries
const sampleEntries: JournalEntry[] = [
  {
    id: "1",
    title: "Spring Garden Preparation",
    content: "Started preparing the garden beds for spring planting. Added new compost and tested soil pH levels.",
    date: "2024-03-10T10:00:00Z",
    images: [
      "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&auto=format&fit=crop",
    ],
    tags: ["spring", "preparation", "soil"],
    plantIds: ["1"],
    tasks: ["prepare soil", "add compost", "check pH"],
    createdAt: "2024-03-10T10:00:00Z",
    updatedAt: "2024-03-10T10:00:00Z",
  },
  // Add more sample entries as needed
];

export function JournalManager() {
  const [entries, setEntries] = useState<JournalEntry[]>(sampleEntries);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const handleAddEntry = (entry: JournalEntry) => {
    setEntries((prev) => [...prev, entry]);
    setIsAddDialogOpen(false);
  };

  const handleDeleteEntry = (entryId: string) => {
    setEntries((prev) => prev.filter <boltAction type="file" filePath="components/journal/journal-manager.tsx">((prev) => prev.filter((e) => e.id !== entryId));
  };

  const handleUpdateEntry = (updatedEntry: JournalEntry) => {
    setEntries((prev) =>
      prev.map((e) => (e.id === updatedEntry.id ? updatedEntry : e))
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <h2 className="text-2xl font-semibold tracking-tight">
            Journal Entries
          </h2>
          <p className="text-sm text-muted-foreground">
            {entries.length} entries recorded
          </p>
        </div>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> New Entry
        </Button>
      </div>

      <Tabs defaultValue="list" className="space-y-4">
        <TabsList>
          <TabsTrigger value="list">
            <List className="h-4 w-4 mr-2" />
            List View
          </TabsTrigger>
          <TabsTrigger value="calendar">
            <CalendarIcon className="h-4 w-4 mr-2" />
            Calendar View
          </TabsTrigger>
        </TabsList>

        <TabsContent value="list">
          <JournalList
            entries={entries}
            onDelete={handleDeleteEntry}
            onUpdate={handleUpdateEntry}
            plants={samplePlants}
          />
        </TabsContent>

        <TabsContent value="calendar">
          <JournalCalendar entries={entries} plants={samplePlants} />
        </TabsContent>
      </Tabs>

      <AddEntryDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onAdd={handleAddEntry}
        plants={samplePlants}
      />
    </div>
  );
}