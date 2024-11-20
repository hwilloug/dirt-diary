"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Plant, PlantType, PlantCategory } from "@/types/plant";
import { searchPlants, getPlantDetails } from "@/lib/trefle-api";

const plantTypes: PlantType[] = ["indoor", "outdoor"];
const plantCategories: PlantCategory[] = [
  "perennials",
  "annuals",
  "herbs",
  "vegetables",
  "fruits",
  "succulents",
];

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  type: z.enum(["indoor", "outdoor"]),
  category: z.enum([
    "perennials",
    "annuals",
    "herbs",
    "vegetables",
    "fruits",
    "succulents",
  ]),
  wateringEnabled: z.boolean(),
  wateringFrequency: z.number().min(1).optional(),
  fertilizingEnabled: z.boolean(),
  fertilizingFrequency: z.number().min(1).optional(),
  pruningEnabled: z.boolean(),
  pruningFrequency: z.number().min(1).optional(),
});

interface AddPlantDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (plant: Plant) => void;
}

export function AddPlantDialog({
  open,
  onOpenChange,
  onAdd,
}: AddPlantDialogProps) {
  const [isSearching, setIsSearching] = useState(false);
  const [scheduleDefaults, setScheduleDefaults] = useState({
    watering: 7,
    fertilizing: 30,
    pruning: 90,
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      type: "indoor",
      category: "perennials",
      wateringEnabled: false,
      wateringFrequency: scheduleDefaults.watering,
      fertilizingEnabled: false,
      fertilizingFrequency: scheduleDefaults.fertilizing,
      pruningEnabled: false,
      pruningFrequency: scheduleDefaults.pruning,
    },
  });

  const updateScheduleDefaults = async (plantName: string) => {
    try {
      const searchResults = await searchPlants(plantName);
      if (searchResults.length > 0) {
        const plantDetails = await getPlantDetails(searchResults[0].id);
        
        // Calculate watering frequency based on precipitation needs
        const wateringDays = plantDetails.main_species?.growth?.precipitation_minimum?.cm
          ? Math.max(3, Math.min(14, Math.round(14 / (plantDetails.main_species.growth.precipitation_minimum.cm / 2.5))))
          : 7;

        // Determine fertilizing frequency based on growth rate
        const growthRate = plantDetails.main_species?.growth?.growth_rate || "moderate";
        const fertilizingDays = {
          rapid: 14,
          moderate: 30,
          slow: 45,
        }[growthRate] || 30;

        // Set pruning frequency based on growth habit
        const growthHabit = plantDetails.main_species?.specifications?.growth_habit || "herb";
        const pruningDays = {
          tree: 120,
          shrub: 90,
          herb: 60,
          graminoid: 45,
          vine: 30,
        }[growthHabit] || 90;

        setScheduleDefaults({
          watering: wateringDays,
          fertilizing: fertilizingDays,
          pruning: pruningDays,
        });

        // Update form with new defaults
        form.setValue("wateringFrequency", wateringDays);
        form.setValue("fertilizingFrequency", fertilizingDays);
        form.setValue("pruningFrequency", pruningDays);
      }
    } catch (error) {
      console.error("Error updating schedule defaults:", error);
    }
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSearching(true);
    try {
      const searchResults = await searchPlants(values.name);
      let careInstructions = {
        water: "Regular watering needed",
        sunlight: "Moderate sunlight",
        temperature: "65-75°F (18-24°C)",
      };

      if (searchResults.length > 0) {
        const plantDetails = await getPlantDetails(searchResults[0].id);
        careInstructions = {
          water: plantDetails.main_species?.growth?.precipitation_minimum?.cm
            ? `Water when soil is dry. Needs ${plantDetails.main_species.growth.precipitation_minimum.cm}cm of water`
            : "Regular watering needed",
          sunlight:
            plantDetails.main_species?.growth?.light || "Moderate sunlight",
          temperature: plantDetails.main_species?.growth?.temperature_minimum?.deg_f
            ? `${plantDetails.main_species.growth.temperature_minimum.deg_f}°F minimum`
            : "65-75°F (18-24°C)",
        };
      }

      const newPlant: Plant = {
        id: crypto.randomUUID(),
        ...values,
        careInstructions,
        schedule: {
          watering: values.wateringEnabled
            ? {
                enabled: true,
                frequency: values.wateringFrequency!,
                lastDate: new Date().toISOString(),
              }
            : undefined,
          fertilizing: values.fertilizingEnabled
            ? {
                enabled: true,
                frequency: values.fertilizingFrequency!,
                lastDate: new Date().toISOString(),
              }
            : undefined,
          pruning: values.pruningEnabled
            ? {
                enabled: true,
                frequency: values.pruningFrequency!,
                lastDate: new Date().toISOString(),
              }
            : undefined,
        },
        trefleId: searchResults[0]?.id,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      onAdd(newPlant);
      form.reset();
    } catch (error) {
      console.error("Error adding plant:", error);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Add New Plant</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Plant Name</FormLabel>
                  <FormControl>
                    <Input 
                      {...field} 
                      onChange={(e) => {
                        field.onChange(e);
                        updateScheduleDefaults(e.target.value);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {plantTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type.charAt(0).toUpperCase() + type.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {plantCategories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category.charAt(0).toUpperCase() + category.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-4">
              <h3 className="text-lg font-medium">Maintenance Schedule</h3>
              <p className="text-sm text-muted-foreground">
                Schedules are automatically suggested based on plant type, but you can customize them.
              </p>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <FormLabel>Watering Schedule</FormLabel>
                    <p className="text-sm text-muted-foreground">
                      Automatically create watering tasks
                    </p>
                  </div>
                  <FormField
                    control={form.control}
                    name="wateringEnabled"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
                {form.watch("wateringEnabled") && (
                  <FormField
                    control={form.control}
                    name="wateringFrequency"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Frequency (days)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min={1}
                            {...field}
                            onChange={(e) =>
                              field.onChange(parseInt(e.target.value))
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <FormLabel>Fertilizing Schedule</FormLabel>
                    <p className="text-sm text-muted-foreground">
                      Automatically create fertilizing tasks
                    </p>
                  </div>
                  <FormField
                    control={form.control}
                    name="fertilizingEnabled"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
                {form.watch("fertilizingEnabled") && (
                  <FormField
                    control={form.control}
                    name="fertilizingFrequency"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Frequency (days)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min={1}
                            {...field}
                            onChange={(e) =>
                              field.onChange(parseInt(e.target.value))
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <FormLabel>Pruning Schedule</FormLabel>
                    <p className="text-sm text-muted-foreground">
                      Automatically create pruning tasks
                    </p>
                  </div>
                  <FormField
                    control={form.control}
                    name="pruningEnabled"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
                {form.watch("pruningEnabled") && (
                  <FormField
                    control={form.control}
                    name="pruningFrequency"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Frequency (days)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min={1}
                            {...field}
                            onChange={(e) =>
                              field.onChange(parseInt(e.target.value))
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </div>
            </div>

            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSearching}>
                {isSearching ? "Adding..." : "Add Plant"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}