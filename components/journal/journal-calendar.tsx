"use client";

import { useState } from "react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { JournalEntry } from "@/types/journal";
import { Plant } from "@/types/plant";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface JournalCalendarProps {
  entries: JournalEntry[];
  plants: Plant[];
}

export function JournalCalendar({ entries, plants }: JournalCalendarProps) {
  const [date, setDate] = useState<Date | undefined>(new Date());

  const selectedDateEntries = entries.filter(
    (entry) => format(new Date(entry.date), "yyyy-MM-dd") === format(date!, "yyyy-MM-dd")
  );

  const getPlantNames = (plantIds: string[]): string[] => {
    return plantIds.map(
      (id) => plants.find((p) => p.id === id)?.name || "Unknown Plant"
    );
  };

  return (
    <div className="grid gap-6 md:grid-cols-[300px_1fr]">
      <Card>
        <CardContent className="p-4">
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            className="rounded-md border"
            modifiers={{
              hasEntry: entries.map((entry) => new Date(entry.date)),
            }}
            modifiersStyles={{
              hasEntry: {
                backgroundColor: "hsl(var(--primary))",
                color: "hsl(var(--primary-foreground))",
              },
            }}
          />
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          {date && (
            <div className="space-y-4">
              <h3 className="font-semibold">
                Entries for {format(date, "MMMM d, yyyy")}
              </h3>
              {selectedDateEntries.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No entries for this date.
                </p>
              ) : (
                <div className="space-y-4">
                  {selectedDateEntries.map((entry) => (
                    <div
                      key={entry.id}
                      className="border rounded-lg p-4 space-y-2"
                    >
                      <h4 className="font-medium">{entry.title}</h4>
                      <p className="text-sm text-muted-foreground">
                        {entry.content}
                      </p>
                      {entry.plantIds.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {getPlantNames(entry.plantIds).map((name) => (
                            <Badge key={name} variant="outline">
                              {name}
                            </Badge>
                          ))}
                        </div>
                      )}
                      {entry.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {entry.tags.map((tag) => (
                            <Badge key={tag} variant="secondary">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}