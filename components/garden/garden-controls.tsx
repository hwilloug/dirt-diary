"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";

interface GardenControlsProps {
  width: number;
  height: number;
  gridSize: number;
  onUpdate: (updates: { width?: number; height?: number; gridSize?: number }) => void;
}

export function GardenControls({
  width,
  height,
  gridSize,
  onUpdate,
}: GardenControlsProps) {
  return (
    <Card className="w-[300px]">
      <CardHeader>
        <CardTitle>Garden Size</CardTitle>
        <CardDescription>Adjust your garden dimensions</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label>Width ({width} units)</Label>
          <Slider
            value={[width]}
            min={5}
            max={30}
            step={1}
            onValueChange={([value]) => onUpdate({ width: value })}
          />
        </div>

        <div className="space-y-2">
          <Label>Height ({height} units)</Label>
          <Slider
            value={[height]}
            min={5}
            max={30}
            step={1}
            onValueChange={([value]) => onUpdate({ height: value })}
          />
        </div>

        <div className="space-y-2">
          <Label>Grid Size ({gridSize} unit)</Label>
          <Slider
            value={[gridSize]}
            min={0.5}
            max={2}
            step={0.5}
            onValueChange={([value]) => onUpdate({ gridSize: value })}
          />
        </div>
      </CardContent>
    </Card>
  );
}