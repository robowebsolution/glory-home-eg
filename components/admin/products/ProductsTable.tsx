"use client";

import type { Product, Category } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

interface ProductsTableProps {
  products: (Product & { categories: Pick<Category, 'name' | 'name_ar'> | null })[];
  onEdit: (product: Product) => void;
  onDelete: (productId: string) => void;
}

export function ProductsTable({ products, onEdit, onDelete }: ProductsTableProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Stock</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.length > 0 ? (
            products.map((product) => (
              <TableRow key={product.id}>
                <TableCell className="font-medium">{product.name}</TableCell>
                <TableCell>{product.categories?.name || 'N/A'}</TableCell>
                <TableCell>${product.price.toFixed(2)}</TableCell>
                <TableCell>{product.stock_quantity}</TableCell>
                <TableCell>
                  <Badge variant={product.in_stock ? 'default' : 'destructive'}>
                    {product.in_stock ? 'In Stock' : 'Out of Stock'}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm" onClick={() => onEdit(product)}>
                    Edit
                  </Button>
                  <Button variant="ghost" size="sm" className="text-red-500" onClick={() => product.id && onDelete(product.id)} disabled={!product.id}>
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6} className="text-center">
                No products found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
