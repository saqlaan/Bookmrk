"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import type { Resource, Category } from '@/lib/types';
import { Pencil, Trash2, ExternalLink } from 'lucide-react';

interface ResourceCardProps {
  resource: Resource;
  category?: Category;
  onEdit: (resource: Resource) => void;
  onDelete: (id: string) => void;
}

export function ResourceCard({ resource, category, onEdit, onDelete }: ResourceCardProps) {
  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="font-headline tracking-tight">{resource.title}</span>
          <Button variant="ghost" size="icon" asChild>
            <a href={resource.url} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="h-4 w-4 text-muted-foreground" />
              <span className="sr-only">Open link</span>
            </a>
          </Button>
        </CardTitle>
        <CardDescription className="text-sm text-muted-foreground break-all">
          {resource.url}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-sm">{resource.description}</p>
      </CardContent>
      <CardFooter className="flex justify-between items-center">
        {category && <Badge variant="secondary">{category.name}</Badge>}
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="icon" onClick={() => onEdit(resource)} className="h-8 w-8">
            <Pencil className="h-4 w-4" />
            <span className="sr-only">Edit</span>
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive">
                <Trash2 className="h-4 w-4" />
                <span className="sr-only">Delete</span>
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the resource
                  &quot;{resource.title}&quot;.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={() => onDelete(resource.id)} className="bg-destructive hover:bg-destructive/90">
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardFooter>
    </Card>
  );
}
