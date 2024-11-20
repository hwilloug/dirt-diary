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
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Calendar as CalendarIcon, Upload } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { JournalEntry } from "@/types/journal";
import { UploadButton } from "@/utils/uploadthing";
import { Plant } from "@/types/plant";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Check } from "lucide-react";

const formSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters"),
  content: z.string().min(10, "Content must be at least 10 characters"),
  date: z.date(),
  tags: z.string(),
  plantIds: z.array(z.string()),
  tasks: z.string(),
});

interface AddEntryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (entry: JournalEntry) => void;
  plants: Plant[];
}

export function AddEntryDialog({
  open,
  onOpenChange,
  onAdd,
  plants,
}: AddEntryDialogProps) {
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [plantSelectOpen, setPlantSelectOpen] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      content: "",
      date: new Date(),
      tags: "",
      plantIds: [],
      tasks: "",
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    const newEntry: JournalEntry = {
      id: crypto.randomUUID(),
      ...values,
      images: uploadedImages,
      tags: values.tags.split(",").map((tag) => tag.trim()),
      plantIds: values.plantIds,
      tasks: values.tasks.split(",").map((task) => task.trim()),
      date: values.date.toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    onAdd(newEntry);
    form.reset();
    setUploadedImages([]);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>New Journal Entry</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Content</FormLabel>
                  <FormControl>
                    <Textarea {...field} rows={4} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date</FormLabel>
                  <FormControl>
                    <div className="grid gap-2">
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-[240px] pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                        onClick={(e) => {
                          e.preventDefault();
                          const elem = e.target as HTMLElement;
                          const calendar = elem.nextElementSibling;
                          if (calendar) {
                            calendar.classList.toggle("hidden");
                          }
                        }}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                      </Button>
                      <div className="hidden">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          initialFocus
                        />
                      </div>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-4">
              <FormLabel>Images</FormLabel>
              <UploadButton
                endpoint="imageUploader"
                onClientUploadComplete={(res) => {
                  if (res) {
                    setUploadedImages((prev) => [
                      ...prev,
                      ...res.map((file) => file.url),
                    ]);
                  }
                }}
                onUploadError={(error: Error) => {
                  console.error("Upload error:", error);
                }}
              />
              {uploadedImages.length > 0 && (
                <div className="grid grid-cols-2 gap-4">
                  {uploadedImages.map((url, index) => (
                    <img
                      key={index}
                      src={url}
                      alt={`Uploaded ${index + 1}`}
                      className="rounded-lg object-cover aspect-video"
                    />
                  ))}
                </div>
              )}
            </div>

            <FormField
              control={form.control}
              name="plantIds"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Related Plants</FormLabel>
                  <FormControl>
                    <Popover open={plantSelectOpen} onOpenChange={setPlantSelectOpen}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          role="combobox"
                          className="w-full justify-between"
                        >
                          {field.value.length > 0
                            ? `${field.value.length} plants selected`
                            : "Select plants"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-full p-0">
                        <Command>
                          <CommandInput placeholder="Search plants..." />
                          <CommandEmpty>No plants found.</CommandEmpty>
                          <CommandGroup>
                            {plants.map((plant) => (
                              <CommandItem
                                key={plant.id}
                                onSelect={() => {
                                  const newValue = field.value.includes(plant.id)
                                    ? field.value.filter((id) => id !== plant.id)
                                    : [...field.value, plant.id];
                                  field.onChange(newValue);
                                }}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    field.value.includes(plant.id)
                                      ? "opacity-100"
                                      : "opacity-0"
                                  )}
                                />
                                {plant.name}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </Command>
                      </PopoverContent>
                    </Popover>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="tags"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tags (comma-separated)</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="watering,pruning,planting" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="tasks"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tasks (comma-separated)</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="water plants,add fertilizer,prune"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Create Entry</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}