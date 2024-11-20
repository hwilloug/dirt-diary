import { JournalManager } from "@/components/journal/journal-manager";

export default function JournalPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Garden Journal</h1>
        <p className="text-muted-foreground">
          Document your gardening journey with notes, photos, and tasks.
        </p>
      </div>
      <JournalManager />
    </div>
  );
}