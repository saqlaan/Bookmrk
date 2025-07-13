"use client";

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { Category, Resource } from '@/lib/types';
import { Sparkles } from 'lucide-react';
import { summarizeUrl } from '@/ai/flows/summarize-url-flow';
import { useToast } from '@/hooks/use-toast';

const urlSchema = z.string().url({ message: 'Please enter a valid URL.' });

const resourceSchema = z.object({
  title: z.string().min(2, { message: 'Title must be at least 2 characters.' }),
  url: urlSchema,
  description: z.string().min(10, { message: 'Description must be at least 10 characters.' }),
  categoryId: z.string({ required_error: 'Please select a category.' }),
});

type ResourceFormValues = z.infer<typeof resourceSchema>;

interface AddResourceDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onSave: (resource: Omit<Resource, 'id'>, id?: string) => void;
  resourceToEdit?: Resource | null;
  categories: Category[];
}

export function AddResourceDialog({
  isOpen,
  onOpenChange,
  onSave,
  resourceToEdit,
  categories,
}: AddResourceDialogProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const form = useForm<ResourceFormValues>({
    resolver: zodResolver(resourceSchema),
    defaultValues: {
      title: '',
      url: '',
      description: '',
      categoryId: '',
    },
  });

  useEffect(() => {
    if (resourceToEdit) {
      form.reset(resourceToEdit);
    } else {
      form.reset({
        title: '',
        url: '',
        description: '',
        categoryId: '',
      });
    }
  }, [resourceToEdit, form, isOpen]);

  const handleGenerate = async () => {
    const url = form.getValues('url');
    const result = urlSchema.safeParse(url);
    if (!result.success) {
        form.setError('url', { type: 'manual', message: 'Please enter a valid URL to generate details.' });
        return;
    }

    setIsGenerating(true);
    try {
        const summary = await summarizeUrl({ url });
        if (summary) {
            form.setValue('title', summary.title, { shouldValidate: true });
            form.setValue('description', summary.description, { shouldValidate: true });
        }
    } catch (error) {
        console.error('Failed to generate summary:', error);
        toast({
            variant: 'destructive',
            title: 'Error',
            description: 'Could not generate details for this URL.',
        });
    } finally {
        setIsGenerating(false);
    }
  };

  const onSubmit = (data: ResourceFormValues) => {
    onSave(data, resourceToEdit?.id);
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>{resourceToEdit ? 'Edit Resource' : 'Add New Resource'}</DialogTitle>
          <DialogDescription>
            {resourceToEdit ? 'Update the details of your saved link.' : 'Fill in the details to add a new link to your collection.'}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 py-4">
            <FormField
              control={form.control}
              name="url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>URL</FormLabel>
                  <div className="flex items-center space-x-2">
                    <FormControl>
                        <Input placeholder="https://example.com" {...field} />
                    </FormControl>
                    <Button type="button" variant="outline" size="icon" onClick={handleGenerate} disabled={isGenerating}>
                        <Sparkles className={`h-4 w-4 ${isGenerating ? 'animate-spin' : ''}`} />
                        <span className="sr-only">Generate Details</span>
                    </Button>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Awesome Design Tools" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="A brief description of the link."
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="categoryId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter className="pt-4">
              <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit">Save Resource</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
