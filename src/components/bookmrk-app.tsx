"use client";

import { useState, useMemo, useCallback, useEffect } from 'react';
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
import { Bookmark, Plus, Search, Settings, Tag, LogOut, User as UserIcon, Loader2, X } from 'lucide-react';
import { useAuth } from './auth-wrapper';
import { clientSignOut } from '@/lib/auth-actions';
import { useRouter } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  addCategory,
  getCategories,
  updateCategory,
  deleteCategory,
  addResource,
  getResources,
  updateResource,
  deleteResource
} from '@/lib/firebase-db';
import { useDebouncedCallback } from 'use-debounce';


export function BookmrkApp() {
  const { toast } = useToast();
  const { user } = useAuth();
  const router = useRouter();
  
  const [categories, setCategories] = useState<Category[]>([]);
  const [resources, setResources] = useState<Resource[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  
  const [isAddResourceOpen, setAddResourceOpen] = useState(false);
  const [isManageCategoriesOpen, setManageCategoriesOpen] = useState(false);
  const [resourceToEdit, setResourceToEdit] = useState<Resource | null>(null);

  // Debounce search term updates
  const debouncedSetSearch = useDebouncedCallback((value: string) => {
    setDebouncedSearchTerm(value);
  }, 300);

  // Update debounced search when searchTerm changes
  useEffect(() => {
    debouncedSetSearch(searchTerm);
  }, [searchTerm, debouncedSetSearch]);

  useEffect(() => {
    if (!user) {
      router.replace('/login');
      return;
    }
  }, [user, router]);

  // Load initial data
  useEffect(() => {
    async function loadData() {
      if (!user) return;
      
      try {
        setIsLoading(true);
        console.log('Loading data for user:', user.uid);
        
        const [loadedCategories, loadedResources] = await Promise.all([
          getCategories(user.uid),
          getResources(user.uid)
        ]);
        
        console.log('Loaded categories:', loadedCategories);
        console.log('Loaded resources:', loadedResources);
        
        setCategories(loadedCategories);
        setResources(loadedResources);
      } catch (error) {
        console.error('Error loading data:', error);
        // Log more details about the error
        if (error instanceof Error) {
          console.error('Error name:', error.name);
          console.error('Error message:', error.message);
          console.error('Error stack:', error.stack);
        }
        toast({ 
          variant: 'destructive',
          title: 'Error',
          description: 'Failed to load your data. Please try again.'
        });
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
  }, [user, toast]);

  const filteredResources = useMemo(() => {
    return resources
      .filter((resource) =>
        selectedCategoryId === null || resource.categoryId === selectedCategoryId
      )
      .filter((resource) => {
        if (!debouncedSearchTerm) return true;
        
        const terms = debouncedSearchTerm.toLowerCase().split(' ').filter(Boolean);
        if (terms.length === 0) return true;

        const searchableText = [
          resource.title,
          resource.description,
          resource.url,
          categories.find(c => c.id === resource.categoryId)?.name || ''
        ].join(' ').toLowerCase();

        // Match all terms (AND search)
        return terms.every(term => searchableText.includes(term));
      });
  }, [resources, selectedCategoryId, debouncedSearchTerm, categories]);

  const handleEditResource = useCallback((resource: Resource) => {
    setResourceToEdit(resource);
    setAddResourceOpen(true);
  }, []);

  const handleDeleteResource = useCallback(async (id: string) => {
    if (!user) return;
    
    try {
      await deleteResource(user.uid, id);
      setResources((prev) => prev.filter((r) => r.id !== id));
      toast({ title: 'Success', description: 'Resource deleted successfully.' });
    } catch (error) {
      console.error('Error deleting resource:', error);
      toast({ 
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to delete resource. Please try again.'
      });
    }
  }, [user, toast]);

  const handleSaveResource = useCallback(async (data: Omit<Resource, 'id'>, id?: string) => {
    if (!user) return;

    try {
      console.log('Saving resource:', { data, id, userId: user.uid });
      
      if (id) {
        const updatedResource = { ...data, id } as Resource;
        await updateResource(user.uid, updatedResource);
        setResources((prev) =>
          prev.map((r) => (r.id === id ? updatedResource : r))
        );
        toast({ title: 'Success', description: 'Resource updated successfully.' });
      } else {
        const newResource = { ...data, id: crypto.randomUUID() } as Resource;
        await addResource(user.uid, newResource);
        setResources((prev) => [...prev, newResource]);
        toast({ title: 'Success', description: 'Resource added successfully.' });
      }
    } catch (error) {
      console.error('Error saving resource:', error);
      if (error instanceof Error) {
        console.error('Error name:', error.name);
        console.error('Error message:', error.message);
        console.error('Error stack:', error.stack);
      }
      toast({ 
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to save resource. Please try again.'
      });
    }
  }, [user, toast]);

  const handleAddCategory = useCallback(async (name: string) => {
    if (!user) return;

    if (categories.some(c => c.name.toLowerCase() === name.toLowerCase())) {
      toast({ variant: 'destructive', title: 'Error', description: 'Category already exists.' });
      return;
    }

    try {
      const newCategory: Category = { id: crypto.randomUUID(), name, archived: false };
      await addCategory(user.uid, newCategory);
      setCategories(prev => [...prev, newCategory]);
      toast({ title: 'Success', description: 'Category added successfully.' });
    } catch (error) {
      console.error('Error adding category:', error);
      toast({ 
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to add category. Please try again.'
      });
    }
  }, [categories, user, toast]);

  const handleToggleCategoryArchive = useCallback(async (id: string) => {
    if (!user) return;

    try {
      const category = categories.find(c => c.id === id);
      if (!category) return;

      const updatedCategory = { ...category, archived: !category.archived };
      await updateCategory(user.uid, updatedCategory);
      setCategories(prev => prev.map(c => 
        c.id === id ? updatedCategory : c
      ));
      toast({ title: 'Success', description: 'Category status updated.' });
    } catch (error) {
      console.error('Error updating category:', error);
      toast({ 
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to update category. Please try again.'
      });
    }
  }, [categories, user, toast]);

  const handleSignOut = async () => {
    const error = await clientSignOut();
    if (error) {
        toast({ variant: 'destructive', title: 'Error', description: error.message });
    } else {
        router.push('/login');
    }
  };

  const currentCategoryName = useMemo(() => {
    if (selectedCategoryId === null) return 'All Resources';
    return categories.find(c => c.id === selectedCategoryId)?.name || 'All Resources';
  }, [selectedCategoryId, categories]);

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Loading your bookmarks...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" className="h-8 w-8 flex-shrink-0">
                    <Bookmark className="h-5 w-5 text-primary" />
                </Button>
                <h1 className="text-lg font-semibold tracking-tight font-headline">Bookmrk</h1>
            </div>
            {user && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.photoURL ?? ''} alt={user.displayName ?? 'User'} />
                      <AvatarFallback>
                        {user.displayName ? user.displayName.charAt(0).toUpperCase() : <UserIcon className="h-4 w-4" />}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user.displayName ?? 'User'}</p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </SidebarHeader>
        <SidebarContent>
            <SidebarGroup>
                <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search by title, URL, description..."
                        className="w-full rounded-lg bg-background pl-8"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    {searchTerm && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute right-2 top-2 h-5 w-5"
                        onClick={() => setSearchTerm('')}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                </div>
                {debouncedSearchTerm && (
                  <div className="mt-2 text-sm text-muted-foreground">
                    Found {filteredResources.length} {filteredResources.length === 1 ? 'result' : 'results'}
                  </div>
                )}
            </SidebarGroup>

            <SidebarGroup>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton onClick={() => setSelectedCategoryId(null)} isActive={selectedCategoryId === null}>
                            <Tag className="h-4 w-4" />
                            <span>All Resources</span>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                    {categories.filter(c => !c.archived).map((category) => (
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
        categories={categories.filter(c => !c.archived)}
      />

      <ManageCategoriesDialog
        isOpen={isManageCategoriesOpen}
        onOpenChange={setManageCategoriesOpen}
        categories={categories}
        onAddCategory={handleAddCategory}
        onToggleArchiveCategory={handleToggleCategoryArchive}
      />
    </SidebarProvider>
  );
}
