"use client";

import type { Category } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Edit, Trash2 } from 'lucide-react';

interface CategoryCardProps {
  category: Category;
  onEdit: (category: Category) => void;
  onDelete: (categoryId: string) => void;
}

export function CategoryCard({ category, onEdit, onDelete }: CategoryCardProps) {
  return (
    <Card className="flex flex-col overflow-hidden transition-shadow hover:shadow-lg">
      <div className="relative">
        <img 
          src={category.image_url || '/placeholder.svg'} 
          alt={category.name} 
          className="w-full h-40 object-cover" 
          onError={(e) => { e.currentTarget.src = '/placeholder.svg'; }}
        />
        <div className="absolute top-2 right-2 flex gap-2">
          <Button variant="outline" size="icon" className="h-8 w-8 bg-white/80 backdrop-blur-sm hover:bg-white" onClick={() => onEdit(category)}>
            <Edit className="h-4 w-4" />
          </Button>
          <Button variant="destructive" size="icon" className="h-8 w-8" onClick={() => category.id && onDelete(category.id)} disabled={!category.id}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <CardContent className="p-4 flex-grow">
        <CardTitle className="text-lg mb-1 truncate" title={category.name}>{category.name}</CardTitle>
        <p className="text-sm text-muted-foreground truncate" title={category.name_ar}>{category.name_ar}</p>
      </CardContent>
    </Card>
  );
}
