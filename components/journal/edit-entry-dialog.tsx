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
import { Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { JournalEntry } from "@/types/journal";
import { UploadButton } from "@/utils/uploadthing";

const formSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters"),
  content: z.string().min(10, "Content must be at least 10 characters"),
  date: z.date(),
  tags: z.string(),
  plantIds: z.string(),
  tasks: z.string(),
});

interface EditEntryDialogProps {
  entry: JournalEntry;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdate: (entry: JournalEntry) => void;
}

export function EditEntryDialog({
  entry,
  open,
  onOpenChange,
  onUpdate,
}: EditEntryDialogProps) {
  const [uploadedImages, setUploadedImages] = useState<string[]>(entry.images);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: entry.title,
      content: entry.content,
      date: new Date(entry.date),
      tags: entry.tags.join(", "),
      plantIds: entry.plantIds.join(", "),
      tasks: entry.tasks.join(", "),
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    const updatedEntry: JournalEntry = {
      ...entry,
      ...values,
      images: uploadedImages,
      tags: values.tags.split(",").map((tag) => tag.trim()),
      plantIds: values.plantIds.split(",").map((id) => id.trim()),
      tasks: values.tasks.split(",").map((task) => task.trim()),
      date: values.date.toISOString(),
      updatedAt: new Date().toISOString(),
    };

    onUpdate(updatedEntry);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Edit Journal Entry</DialogTitle>
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
              name="plantIds"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Related Plants (comma-separated)</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="tomatoes,herbs,roses" />
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
              <Button type="submit">Update Entry</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}