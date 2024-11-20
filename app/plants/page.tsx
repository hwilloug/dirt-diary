import { PlantsManager } from "@/components/plants/plants-manager";

export default function PlantsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">My Plants</h1>
        <p className="text-muted-foreground">
          Manage your plant collection and care instructions.
        </p>
      </div>
      <PlantsManager />
    </div>
  );
}