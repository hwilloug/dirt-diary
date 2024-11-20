import { GardenBuilder } from "@/components/garden/garden-builder";

export default function GardenPlannerPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Garden Layout Builder</h1>
        <p className="text-muted-foreground">
          Design your garden layout with our drag-and-drop builder
        </p>
      </div>
      <GardenBuilder />
    </div>
  );
}