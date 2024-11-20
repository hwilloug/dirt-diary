"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plant } from "@/types/plant";
import { JournalEntry } from "@/types/journal";
import { PlantMetrics } from "./plant-metrics";
import { TaskMetrics } from "./task-metrics";
import { GrowthChart } from "./growth-chart";
import { ActivityHeatmap } from "./activity-heatmap";
import { Flower2, Sprout, Calendar, CheckCircle2 } from "lucide-react";

export function AnalyticsDashboard() {
  const [plants, setPlants] = useState<Plant[]>([]);
  const [entries, setEntries] = useState<JournalEntry[]>([]);

  // Calculate metrics
  const totalPlants = plants.length;
  const completedTasks = entries.reduce((acc, entry) => acc + entry.tasks.length, 0);
  const totalJournalEntries = entries.length;
  const activePlants = plants.filter(p => 
    p.schedule?.watering?.enabled || 
    p.schedule?.fertilizing?.enabled || 
    p.schedule?.pruning?.enabled
  ).length;

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Plants</CardTitle>
            <Flower2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalPlants}</div>
            <p className="text-xs text-muted-foreground">
              {activePlants} with active care schedules
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tasks Completed</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedTasks}</div>
            <p className="text-xs text-muted-foreground">
              Across all plants
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Growth Milestones</CardTitle>
            <Sprout className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalJournalEntries}</div>
            <p className="text-xs text-muted-foreground">
              Journal entries recorded
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Period</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">120 days</div>
            <p className="text-xs text-muted-foreground">
              Of garden tracking
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="plants">Plants</TabsTrigger>
          <TabsTrigger value="tasks">Tasks</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Growth Progress</CardTitle>
              </CardHeader>
              <CardContent className="pl-2">
                <GrowthChart entries={entries} />
              </CardContent>
            </Card>

            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Plant Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <PlantMetrics plants={plants} />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="plants">
          <Card>
            <CardHeader>
              <CardTitle>Plant Care Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <PlantMetrics plants={plants} detailed />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tasks">
          <Card>
            <CardHeader>
              <CardTitle>Task Completion Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <TaskMetrics entries={entries} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity">
          <Card>
            <CardHeader>
              <CardTitle>Activity Heatmap</CardTitle>
            </CardHeader>
            <CardContent>
              <ActivityHeatmap entries={entries} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}