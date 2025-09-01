"use client";

import type { Customer } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Edit, Trash2 } from 'lucide-react';

interface CustomerCardProps {
  customer: Customer;
  onEdit: (customer: Customer) => void;
  onDelete: (customerId: string | number) => void;
}

export function CustomerCard({ customer, onEdit, onDelete }: CustomerCardProps) {
  const id = customer.id as string | number | undefined;
  return (
    <Card className="flex flex-col overflow-hidden transition-shadow hover:shadow-lg">
      <div className="relative">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={customer.image_url || '/placeholder.svg'}
          alt="Customer image"
          className="w-full h-40 object-contain bg-muted"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src = '/placeholder.svg';
          }}
        />
        <div className="absolute top-2 right-2 flex gap-2">
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 bg-white/80 backdrop-blur-sm hover:bg-white"
            onClick={() => onEdit(customer)}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="destructive"
            size="icon"
            className="h-8 w-8"
            onClick={() => id !== undefined && onDelete(id)}
            disabled={id === undefined}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <CardContent className="p-4 text-center text-xs text-muted-foreground">
        {customer.image_url}
      </CardContent>
    </Card>
  );
}
