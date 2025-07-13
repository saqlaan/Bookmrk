"use client";

import { useState, useMemo, useCallback } from 'react';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  SidebarGroup,
  SidebarSeparator,
} from '@/components/ui/sidebar';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { initialCategories, initialResources } from '@/lib/data';
import type { Category, Resource } from '@/lib/types';
import { ResourceCard } from './resource-card';
import { AddResourceDialog } from './add-resource-dialog';
import { ManageCategoriesDialog } from './manage-categories-dialog';
import { Bookmark, Plus, Search, Settings, Tag } from 'lucide-react';

export function LinkWiseApp() {
  const { toast } = useToast();
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [resources, setResources] = useState<Resource[]>(initialResources);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [isAddResourceOpen, setAddResourceOpen] = useState(false);
  const [isManageCategoriesOpen, setManageCategoriesOpen] = useState(false);
  const [resourceToEdit, setResourceToEdit] = useState<Resource | null>(null);

  const filteredResources = useMemo(() => {
    return resources
      .filter((resource) =>
        selectedCategoryId === null || resource.categoryId === selectedCategoryId
      )
      .filter((resource) => {
        const term = searchTerm.toLowerCase();
        return (
          resource.title.toLowerCase().includes(term) ||
          resource.description.toLowerCase().includes(term) ||
          resource.url.toLowerCase().includes(term)
        );
      });
  }, [resources, selectedCategoryId, searchTerm]);

  const handleEditResource = useCallback((resource: Resource) => {
    setResourceToEdit(resource);
    setAddResourceOpen(true);
  }, []);

  const handleDeleteResource = useCallback((id: string) => {
    setResources((prev) => prev.filter((r) => r.id !== id));
    toast({ title: 'Success', description: 'Resource deleted successfully.' });
  }, [toast]);

  const handleSaveResource = useCallback((data: Omit<Resource, 'id'>, id?: string) => {
      if (id) {
        setResources((prev) =>
          prev.map((r) => (r.id === id ? { ...r, ...data } : r))
        );
        toast({ title: 'Success', description: 'Resource updated successfully.' });
      } else {
        setResources((prev) => [
          ...prev,
          { ...data, id: crypto.randomUUID() },
        ]);
        toast({ title: 'Success', description: 'Resource added successfully.' });
      }
    }, [toast]
  );

  const handleAddCategory = useCallback((name: string) => {
      if (categories.some(c => c.name.toLowerCase() === name.toLowerCase())) {
          toast({ variant: 'destructive', title: 'Error', description: 'Category already exists.' });
          return;
      }
      const newCategory: Category = { id: crypto.randomUUID(), name };
      setCategories(prev => [...prev, newCategory]);
      toast({ title: 'Success', description: 'Category added successfully.' });
  }, [categories, toast]);

  const handleDeleteCategory = useCallback((id: string) => {
      if (resources.some(r => r.categoryId === id)) {
          toast({ variant: 'destructive', title: 'Error', description: 'Cannot delete category with resources.' });
          return;
      }
      setCategories(prev => prev.filter(c => c.id !== id));
      toast({ title: 'Success', description: 'Category deleted successfully.' });
  }, [resources, toast]);

  const currentCategoryName = useMemo(() => {
    if (selectedCategoryId === null) return 'All Resources';
    return categories.find(c => c.id === selectedCategoryId)?.name || 'All Resources';
  }, [selectedCategoryId, categories]);


  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="h-8 w-8 flex-shrink-0">
                <Bookmark className="h-5 w-5 text-primary" />
            </Button>
            <h1 className="text-lg font-semibold tracking-tight font-headline">LinkWise</h1>
          </div>
        </SidebarHeader>
        <SidebarContent>
            <SidebarGroup>
                <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search..."
                        className="w-full rounded-lg bg-background pl-8"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </SidebarGroup>

            <SidebarGroup>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton onClick={() => setSelectedCategoryId(null)} isActive={selectedCategoryId === null}>
                            <Tag className="h-4 w-4" />
                            <span>All Resources</span>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                    {categories.map((category) => (
                    <SidebarMenuItem key={category.id}>
                        <SidebarMenuButton onClick={() => setSelectedCategoryId(category.id)} isActive={selectedCategoryId === category.id}>
                            <Tag className="h-4 w-4" />
                            <span>{category.name}</span>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                    ))}
                </SidebarMenu>
            </SidebarGroup>
        </SidebarContent>
        <SidebarSeparator />
        <SidebarFooter>
            <div className="flex flex-col gap-2">
                <Button variant="default" className="w-full justify-start gap-2" onClick={() => { setResourceToEdit(null); setAddResourceOpen(true); }}>
                    <Plus className="h-4 w-4" />
                    Add Resource
                </Button>
                 <Button variant="secondary" className="w-full justify-start gap-2" onClick={() => setManageCategoriesOpen(true)}>
                    <Settings className="h-4 w-4" />
                    Manage Categories
                </Button>
            </div>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <main className="flex-1 p-4 md:p-6">
            <div className="mb-6">
                <h2 className="text-2xl font-bold tracking-tight font-headline">{currentCategoryName}</h2>
                <p className="text-muted-foreground">{filteredResources.length} {filteredResources.length === 1 ? 'resource' : 'resources'} found</p>
            </div>

            {filteredResources.length > 0 ? (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {filteredResources.map((resource) => (
                    <ResourceCard
                        key={resource.id}
                        resource={resource}
                        category={categories.find((c) => c.id === resource.categoryId)}
                        onEdit={handleEditResource}
                        onDelete={handleDeleteResource}
                    />
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center h-[50vh] text-center rounded-lg border border-dashed">
                    <h3 className="text-xl font-semibold tracking-tight font-headline">No resources found</h3>
                    <p className="text-muted-foreground mt-2">
                        {searchTerm ? "Try adjusting your search." : "Add a new resource to get started."}
                    </p>
                     <Button className="mt-4" onClick={() => { setResourceToEdit(null); setAddResourceOpen(true); }}>
                        <Plus className="mr-2 h-4 w-4" /> Add Resource
                    </Button>
                </div>
            )}

        </main>
      </SidebarInset>

      <AddResourceDialog
        isOpen={isAddResourceOpen}
        onOpenChange={setAddResourceOpen}
        onSave={handleSaveResource}
        resourceToEdit={resourceToEdit}
        categories={categories}
      />

      <ManageCategoriesDialog
        isOpen={isManageCategoriesOpen}
        onOpenChange={setManageCategoriesOpen}
        categories={categories}
        onAddCategory={handleAddCategory}
        onDeleteCategory={handleDeleteCategory}
      />
    </SidebarProvider>
  );
}
