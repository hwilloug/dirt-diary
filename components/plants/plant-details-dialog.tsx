"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Plant } from "@/types/plant";
import { JournalEntry } from "@/types/journal";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getPlantDetails } from "@/lib/trefle-api";
import { format } from "date-fns";

interface PlantDetailsDialogProps {
  plant: Plant;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface TreflePlantDetails {
  common_name: string;
  scientific_name: string;
  family_common_name: string;
  duration: string;
  growth: {
    description: string;
    sowing: string;
    days_to_harvest: number;
    row_spacing: { cm: number };
    spread: { cm: number };
    ph_maximum: number;
    ph_minimum: number;
    light: number;
    atmospheric_humidity: number;
    soil_nutriments: number;
    soil_salinity: number;
  };
}

// Sample journal entries (replace with actual data in production)
const sampleJournalEntries: JournalEntry[] = [
  {
    id: "1",
    title: "First Signs of Growth",
    content: "Noticed new leaves sprouting today!",
    date: "2024-03-01T10:00:00Z",
    images: [],
    tags: ["growth", "progress"],
    plantIds: ["1"],
    tasks: ["water", "check growth"],
    createdAt: "2024-03-01T10:00:00Z",
    updatedAt: "2024-03-01T10:00:00Z",
  },
  // Add more sample entries as needed
];

export function PlantDetailsDialog({
  plant,
  open,
  onOpenChange,
}: PlantDetailsDialogProps) {
  const [trefleDetails, setTrefleDetails] = useState<TreflePlantDetails | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function fetchTrefleDetails() {
      if (plant.trefleId && open) {
        setIsLoading(true);
        try {
          const details = await getPlantDetails(plant.trefleId);
          setTrefleDetails(details);
        } catch (error) {
          console.error("Error fetching plant details:", error);
        } finally {
          setIsLoading(false);
        }
      }
    }

    fetchTrefleDetails();
  }, [plant.trefleId, open]);

  const relatedEntries = sampleJournalEntries.filter((entry) =>
    entry.plantIds.includes(plant.id)
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>{plant.name}</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="details" className="space-y-4">
          <TabsList>
            <TabsTrigger value="details">Plant Details</TabsTrigger>
            <TabsTrigger value="care">Care Guide</TabsTrigger>
            <TabsTrigger value="journal">Journal Entries</TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Basic Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between">
                    <span className="font-medium">Type:</span>
                    <span className="capitalize">{plant.type}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Category:</span>
                    <span className="capitalize">{plant.category}</span>
                  </div>
                  {plant.purchaseDate && (
                    <div className="flex justify-between">
                      <span className="font-medium">Purchased:</span>
                      <span>
                        {format(new Date(plant.purchaseDate), "MMMM d, yyyy")}
                      </span>
                    </div>
                  )}
                  {plant.plantingDate && (
                    <div className="flex justify-between">
                      <span className="font-medium">Planted:</span>
                      <span>
                        {format(new Date(plant.plantingDate), "MMMM d, yyyy")}
                      </span>
                    </div>
                  )}
                </CardContent>
              </Card>

              {trefleDetails && (
                <Card>
                  <CardHeader>
                    <CardTitle>Scientific Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex justify-between">
                      <span className="font-medium">Scientific Name:</span>
                      <span>{trefleDetails.scientific_name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Family:</span>
                      <span>{trefleDetails.family_common_name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Duration:</span>
                      <span className="capitalize">{trefleDetails.duration}</span>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {trefleDetails?.growth && (
              <Card>
                <CardHeader>
                  <CardTitle>Growth Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {trefleDetails.growth.description && (
                    <p className="text-sm">{trefleDetails.growth.description}</p>
                  )}
                  <div className="grid gap-4 md:grid-cols-2">
                    {trefleDetails.growth.days_to_harvest && (
                      <div className="flex justify-between">
                        <span className="font-medium">Days to Harvest:</span>
                        <span>{trefleDetails.growth.days_to_harvest} days</span>
                      </div>
                    )}
                    {trefleDetails.growth.row_spacing && (
                      <div className="flex justify-between">
                        <span className="font-medium">Row Spacing:</span>
                        <span>{trefleDetails.growth.row_spacing.cm} cm</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="care" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Care Instructions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <h4 className="font-medium mb-2">Water</h4>
                    <p className="text-sm">{plant.careInstructions.water}</p>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Sunlight</h4>
                    <p className="text-sm">{plant.careInstructions.sunlight}</p>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Temperature</h4>
                    <p className="text-sm">{plant.careInstructions.temperature}</p>
                  </div>
                </div>

                {trefleDetails?.growth && (
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <h4 className="font-medium mb-2">Soil pH</h4>
                      <p className="text-sm">
                        {trefleDetails.growth.ph_minimum} -{" "}
                        {trefleDetails.growth.ph_maximum}
                      </p>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Light</h4>
                      <p className="text-sm">
                        {trefleDetails.growth.light}/10 (Higher is more light)
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {plant.schedule && (
              <Card>
                <CardHeader>
                  <CardTitle>Maintenance Schedule</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {plant.schedule.watering?.enabled && (
                    <div className="flex justify-between items-center">
                      <span>Watering</span>
                      <Badge>Every {plant.schedule.watering.frequency} days</Badge>
                    </div>
                  )}
                  {plant.schedule.fertilizing?.enabled && (
                    <div className="flex justify-between items-center">
                      <span>Fertilizing</span>
                      <Badge>
                        Every {plant.schedule.fertilizing.frequency} days
                      </Badge>
                    </div>
                  )}
                  {plant.schedule.pruning?.enabled && (
                    <div className="flex justify-between items-center">
                      <span>Pruning</span>
                      <Badge>Every {plant.schedule.pruning.frequency} days</Badge>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="journal" className="space-y-4">
            {relatedEntries.length === 0 ? (
              <Card>
                <CardContent className="py-8 text-center">
                  <p className="text-muted-foreground">
                    No journal entries found for this plant.
                  </p>
                </CardContent>
              </Card>
            ) : (
              relatedEntries.map((entry) => (
                <Card key={entry.id}>
                  <CardHeader>
                    <CardTitle className="text-lg">{entry.title}</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {format(new Date(entry.date), "MMMM d, yyyy")}
                    </p>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">{entry.content}</p>
                    {entry.tags.length > 0 && (
                      <div className="flex gap-2 mt-4">
                        {entry.tags.map((tag) => (
                          <Badge key={tag} variant="secondary">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}