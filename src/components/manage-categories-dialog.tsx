"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { Category } from '@/lib/types';
import { Trash2, Plus } from 'lucide-react';
import { ScrollArea } from './ui/scroll-area';

interface ManageCategoriesDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  categories: Category[];
  onAddCategory: (name: string) => void;
  onDeleteCategory: (id: string) => void;
}

export function ManageCategoriesDialog({
  isOpen,
  onOpenChange,
  categories,
  onAddCategory,
  onDeleteCategory,
}: ManageCategoriesDialogProps) {
  const [newCategoryName, setNewCategoryName] = useState('');

  const handleAddClick = () => {
    if (newCategoryName.trim()) {
      onAddCategory(newCategoryName.trim());
      setNewCategoryName('');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Manage Categories</DialogTitle>
          <DialogDescription>
            Add, edit, or remove categories to keep your links organized.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex items-center space-x-2">
            <div className="grid flex-1 gap-2">
                <Label htmlFor="new-category" className="sr-only">
                    New Category
                </Label>
                <Input
                    id="new-category"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    placeholder="New category name"
                />
            </div>
            <Button type="button" size="icon" onClick={handleAddClick} disabled={!newCategoryName.trim()}>
                <Plus className="h-4 w-4" />
                <span className="sr-only">Add</span>
            </Button>
          </div>

          <ScrollArea className="h-48">
            <div className="space-y-2 pr-4">
              {categories.map((category) => (
                <div key={category.id} className="flex items-center justify-between rounded-md border p-3">
                  <span className="text-sm">{category.name}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDeleteCategory(category.id)}
                    className="h-8 w-8 text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only">Delete {category.name}</span>
                  </Button>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
        <DialogFooter>
          <Button onClick={() => onOpenChange(false)}>Done</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
