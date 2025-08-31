"use client";

import type { ProjectCategory } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Edit, Trash2, FolderOpen } from 'lucide-react';

interface ProjectCategoryCardProps {
  category: ProjectCategory;
  onEdit: (category: ProjectCategory) => void;
  onDelete: (categoryId: string | number) => void;
}

export function ProjectCategoryCard({ category, onEdit, onDelete }: ProjectCategoryCardProps) {
  return (
    <Card className="flex flex-col overflow-hidden transition-shadow hover:shadow-lg">
      <CardHeader className="p-0">
        <div className="w-full h-40 bg-muted/40 flex items-center justify-center relative">
          <FolderOpen className="h-10 w-10 text-muted-foreground" />
          <div className="absolute top-2 right-2 flex gap-2">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 bg-white/80 backdrop-blur-sm hover:bg-white"
              onClick={() => onEdit(category)}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="destructive"
              size="icon"
              className="h-8 w-8"
              onClick={() => category.id != null && onDelete(category.id)}
              disabled={category.id == null}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4 flex-grow">
        <CardTitle className="text-lg mb-1 truncate" title={category.name_en}>{category.name_en}</CardTitle>
        <p className="text-sm text-muted-foreground truncate" title={category.name_ar}>{category.name_ar}</p>
      </CardContent>
    </Card>
  );
}
