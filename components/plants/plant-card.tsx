"use client";

import { Plant } from "@/types/plant";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit2, Trash2, Droplets, Sun, Thermometer, Info, Archive, RefreshCw } from "lucide-react";
import { EditPlantDialog } from "./edit-plant-dialog";
import { PlantDetailsDialog } from "./plant-details-dialog";
import { ArchivePlantDialog } from "./archive-plant-dialog";
import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface PlantCardProps {
  plant: Plant;
  onDelete: (id: string) => void;
  onUpdate: (plant: Plant) => void;
  onArchive?: (id: string, reason: string) => void;
  onRestore?: (id: string) => void;
  isArchiveView?: boolean;
}

export function PlantCard({
  plant,
  onDelete,
  onUpdate,
  onArchive,
  onRestore,
  isArchiveView = false,
}: PlantCardProps) {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isArchiveDialogOpen, setIsArchiveDialogOpen] = useState(false);

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xl font-semibold">{plant.name}</CardTitle>
          <div className="flex space-x-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsDetailsDialogOpen(true)}
            >
              <Info className="h-4 w-4" />
            </Button>
            {!isArchiveView && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsEditDialogOpen(true)}
                >
                  <Edit2 className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsArchiveDialogOpen(true)}
                >
                  <Archive className="h-4 w-4" />
                </Button>
              </>
            )}
            {isArchiveView && onRestore && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onRestore(plant.id)}
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsDeleteDialogOpen(true)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium">Type:</span>
              <span className="text-sm text-muted-foreground capitalize">
                {plant.type}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium">Category:</span>
              <span className="text-sm text-muted-foreground capitalize">
                {plant.category}
              </span>
            </div>
            {(plant.purchaseDate || plant.plantingDate) && (
              <div className="space-y-2">
                {plant.purchaseDate && (
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium">Purchased:</span>
                    <span className="text-sm text-muted-foreground">
                      {new Date(plant.purchaseDate).toLocaleDateString()}
                    </span>
                  </div>
                )}
                {plant.plantingDate && (
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium">Planted:</span>
                    <span className="text-sm text-muted-foreground">
                      {new Date(plant.plantingDate).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </div>
            )}
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Care Instructions:</h4>
              <div className="grid grid-cols-1 gap-2">
                <div className="flex items-center space-x-2">
                  <Droplets className="h-4 w-4 text-blue-500" />
                  <span className="text-sm">{plant.careInstructions.water}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Sun className="h-4 w-4 text-yellow-500" />
                  <span className="text-sm">{plant.careInstructions.sunlight}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Thermometer className="h-4 w-4 text-red-500" />
                  <span className="text-sm">
                    {plant.careInstructions.temperature}
                  </span>
                </div>
              </div>
            </div>
            {plant.archived && plant.archivedReason && (
              <div className="mt-4 p-2 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground">
                  <span className="font-medium">Archived:</span>{" "}
                  {plant.archivedReason}
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <PlantDetailsDialog
        plant={plant}
        open={isDetailsDialogOpen}
        onOpenChange={setIsDetailsDialogOpen}
      />

      <EditPlantDialog
        plant={plant}
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        onUpdate={onUpdate}
      />

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Plant</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {plant.name}? This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                onDelete(plant.id);
                setIsDeleteDialogOpen(false);
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {onArchive && (
        <ArchivePlantDialog
          plant={plant}
          open={isArchiveDialogOpen}
          onOpenChange={setIsArchiveDialogOpen}
          onArchive={onArchive}
        />
      )}
    </>
  );
}