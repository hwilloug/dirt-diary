export interface JournalEntry {
  id: string;
  title: string;
  content: string;
  date: string;
  images: string[];
  tags: string[];
  plantIds: string[];
  tasks: string[];
  createdAt: string;
  updatedAt: string;
}