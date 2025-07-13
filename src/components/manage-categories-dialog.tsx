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
import { Archive, ArchiveRestore, Plus } from 'lucide-react';
import { ScrollArea } from './ui/scroll-area';
import { Separator } from './ui/separator';

interface ManageCategoriesDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  categories: Category[];
  onAddCategory: (name: string) => void;
  onToggleArchiveCategory: (id: string) => void;
}

export function ManageCategoriesDialog({
  isOpen,
  onOpenChange,
  categories,
  onAddCategory,
  onToggleArchiveCategory,
}: ManageCategoriesDialogProps) {
  const [newCategoryName, setNewCategoryName] = useState('');

  const handleAddClick = () => {
    if (newCategoryName.trim()) {
      onAddCategory(newCategoryName.trim());
      setNewCategoryName('');
    }
  };
  
  const activeCategories = categories.filter(c => !c.archived);
  const archivedCategories = categories.filter(c => c.archived);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Manage Categories</DialogTitle>
          <DialogDescription>
            Add new categories, or archive old ones to hide them.
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

          <ScrollArea className="h-64">
            <div className="space-y-2 pr-4">
              <Label className="text-xs text-muted-foreground">Active</Label>
              {activeCategories.map((category) => (
                <div key={category.id} className="flex items-center justify-between rounded-md border p-3">
                  <span className="text-sm">{category.name}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onToggleArchiveCategory(category.id)}
                    className="h-8 w-8 text-muted-foreground hover:text-destructive"
                  >
                    <Archive className="h-4 w-4" />
                    <span className="sr-only">Archive {category.name}</span>
                  </Button>
                </div>
              ))}
               {archivedCategories.length > 0 && (
                 <>
                    <Separator className="my-4" />
                    <Label className="text-xs text-muted-foreground">Archived</Label>
                    {archivedCategories.map((category) => (
                        <div key={category.id} className="flex items-center justify-between rounded-md border p-3">
                        <span className="text-sm text-muted-foreground italic">{category.name}</span>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => onToggleArchiveCategory(category.id)}
                            className="h-8 w-8 text-muted-foreground hover:text-primary"
                        >
                            <ArchiveRestore className="h-4 w-4" />
                            <span className="sr-only">Unarchive {category.name}</span>
                        </Button>
                        </div>
                    ))}
                 </>
               )}
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
