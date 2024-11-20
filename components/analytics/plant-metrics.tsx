"use client";

import { Plant } from "@/types/plant";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface PlantMetricsProps {
  plants: Plant[];
  detailed?: boolean;
}

export function PlantMetrics({ plants, detailed = false }: PlantMetricsProps) {
  // Calculate plant type distribution
  const typeDistribution = plants.reduce((acc, plant) => {
    acc[plant.type] = (acc[plant.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Calculate category distribution
  const categoryDistribution = plants.reduce((acc, plant) => {
    acc[plant.category] = (acc[plant.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Calculate care schedule stats
  const careStats = plants.reduce(
    (acc, plant) => {
      if (plant.schedule?.watering?.enabled) acc.watering++;
      if (plant.schedule?.fertilizing?.enabled) acc.fertilizing++;
      if (plant.schedule?.pruning?.enabled) acc.pruning++;
      return acc;
    },
    { watering: 0, fertilizing: 0, pruning: 0 }
  );

  return (
    <div className="space-y-6">
      <div className="grid gap-4 grid-cols-2">
        <div>
          <h4 className="text-sm font-medium mb-2">Plant Types</h4>
          <div className="space-y-2">
            {Object.entries(typeDistribution).map(([type, count]) => (
              <div
                key={type}
                className="flex items-center justify-between text-sm"
              >
                <span className="capitalize">{type}</span>
                <Badge variant="secondary">{count}</Badge>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-sm font-medium mb-2">Categories</h4>
          <div className="space-y-2">
            {Object.entries(categoryDistribution).map(([category, count]) => (
              <div
                key={category}
                className="flex items-center justify-between text-sm"
              >
                <span className="capitalize">{category}</span>
                <Badge variant="secondary">{count}</Badge>
              </div>
            ))}
          </div>
        </div>
      </div>

      {detailed && (
        <>
          <div>
            <h4 className="text-sm font-medium mb-2">Care Schedules</h4>
            <div className="grid gap-4 grid-cols-3">
              <Card>
                <CardContent className="pt-6">
                  <div className="text-2xl font-bold">{careStats.watering}</div>
                  <p className="text-xs text-muted-foreground">
                    Watering schedules
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-2xl font-bold">{careStats.fertilizing}</div>
                  <p className="text-xs text-muted-foreground">
                    Fertilizing schedules
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-2xl font-bold">{careStats.pruning}</div>
                  <p className="text-xs text-muted-foreground">
                    Pruning schedules
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium mb-2">Most Active Plants</h4>
            <div className="space-y-2">
              {plants
                .slice(0, 5)
                .map((plant) => (
                  <div
                    key={plant.id}
                    className="flex items-center justify-between text-sm"
                  >
                    <span>{plant.name}</span>
                    <Badge variant="outline">
                      {Object.values(plant.schedule).filter((s) => s?.enabled)
                        .length}{" "}
                      schedules
                    </Badge>
                  </div>
                ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}