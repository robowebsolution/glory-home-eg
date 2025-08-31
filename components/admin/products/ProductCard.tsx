"use client";

import { useState } from 'react';
import { MoreHorizontal, Pencil, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { Product, Category } from '@/lib/types';
import Image from 'next/image';

interface ProductCardProps {
  product: Product & { categories: Pick<Category, 'name' | 'name_ar'> | null };
  onEdit: (product: Product) => void;
  onDelete: (productId: string) => void;
}

export function ProductCard({ product, onEdit, onDelete }: ProductCardProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleDelete = () => {
    if (product.id) {
      onDelete(product.id);
    }
    setIsMenuOpen(false);
  };

  const handleEdit = () => {
    onEdit(product);
    setIsMenuOpen(false);
  };

  return (
    <Card className="overflow-hidden group relative">
      <CardHeader className="p-0">
        <div className="aspect-square w-full overflow-hidden">
          <Image
            src={product.main_image || '/placeholder.svg'}
            alt={product.name_ar || 'Product image'}
            width={300}
            height={300}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>

        {/* Actions Dropdown */}
        <div className="absolute top-2 right-2">
          <DropdownMenu open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" size="icon" className="h-8 w-8 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onSelect={handleEdit}>
                <Pencil className="mr-2 h-4 w-4" />
                <span>تعديل</span>
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={handleDelete} className="text-red-500 focus:text-red-500">
                <Trash2 className="mr-2 h-4 w-4" />
                <span>حذف</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-md font-semibold leading-tight">{product.name}</CardTitle>
          <Badge variant={product.in_stock ? 'secondary' : 'destructive'} className="flex-shrink-0">
            {product.in_stock ? 'متوفر' : 'غير متوفر'}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground mt-1">{product.categories?.name}</p>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <p className="text-md font-bold text-primary">{product.price} ج.م</p>
      </CardFooter>
    </Card>
  );
}
