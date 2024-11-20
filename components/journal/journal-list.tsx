"use client";

import { JournalEntry } from "@/types/journal";
import { Plant } from "@/types/plant";
import { JournalCard } from "./journal-card";

interface JournalListProps {
  entries: JournalEntry[];
  plants: Plant[];
  onDelete: (id: string) => void;
  onUpdate: (entry: JournalEntry) => void;
}

export function JournalList({ entries, plants, onDelete, onUpdate }: JournalListProps) {
  if (entries.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No journal entries yet.</p>
        <p className="text-sm text-muted-foreground">
          Click the New Entry button to start documenting your garden journey.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {entries.map((entry) => (
        <JournalCard
          key={entry.id}
          entry={entry}
          plants={plants}
          onDelete={onDelete}
          onUpdate={onUpdate}
        />
      ))}
    </div>
  );
}