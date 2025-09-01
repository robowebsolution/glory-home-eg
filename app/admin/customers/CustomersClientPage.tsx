"use client";

import { useMemo, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import type { Customer } from '@/lib/types';
import { saveCustomer, deleteCustomer, saveCustomersBulk } from './actions';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { PlusCircle, Search } from 'lucide-react';
import { CustomerForm } from '@/components/admin/customers/CustomerForm';
import { CustomerCard } from '@/components/admin/customers/CustomerCard';

interface CustomersClientPageProps {
  customers: Customer[];
}

export function CustomersClientPage({ customers }: CustomersClientPageProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isBulkOpen, setIsBulkOpen] = useState(false);
  const [bulkText, setBulkText] = useState('');

  const filtered = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return customers;
    return customers.filter((c) => (c.image_url || '').toLowerCase().includes(q));
  }, [customers, searchTerm]);

  const handleAdd = () => {
    setSelectedCustomer(null);
    setIsFormOpen(true);
  };

  const handleEdit = (customer: Customer) => {
    setSelectedCustomer(customer);
    setIsFormOpen(true);
  };

  const onSubmit = (data: { image_url: string }) => {
    startTransition(() => {
      (async () => {
        try {
          const formData = new FormData();
          if (selectedCustomer?.id !== undefined) formData.append('id', String(selectedCustomer.id));
          formData.append('image_url', data.image_url);
          const res = await saveCustomer(null, formData);
          if (res.success) {
            toast.success(res.message);
            setIsFormOpen(false);
            router.refresh();
          } else {
            toast.error(res.message);
          }
        } catch (e) {
          toast.error('حدث خطأ غير متوقع.');
        }
      })();
    });
  };

  const handleDelete = (id: string | number) => {
    if (!confirm('هل أنت متأكد من حذف صورة العميل؟')) return;
    startTransition(() => {
      (async () => {
        try {
          const res = await deleteCustomer(id);
          if (res.success) {
            toast.success(res.message);
            router.refresh();
          } else toast.error(res.message);
        } catch {
          toast.error('حدث خطأ أثناء الحذف.');
        }
      })();
    });
  };

  const handleBulkSubmit = () => {
    startTransition(() => {
      (async () => {
        try {
          const formData = new FormData();
          formData.append('bulk_text', bulkText);
          const res = await saveCustomersBulk(null, formData);
          if (res.success) {
            toast.success(res.message);
            setIsBulkOpen(false);
            setBulkText('');
            router.refresh();
          } else {
            toast.error(res.message);
          }
        } catch (e) {
          toast.error('حدث خطأ غير متوقع.');
        }
      })();
    });
  };

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">عملاؤنا</h1>
          <p className="text-muted-foreground">إدارة صور قسم عملاؤنا في صفحة التعريف.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={handleAdd}>
          <PlusCircle className="mr-2 h-4 w-4" />
          إضافة صورة عميل
          </Button>
          <Button variant="secondary" onClick={() => setIsBulkOpen(true)}>
            <PlusCircle className="mr-2 h-4 w-4" />
            إضافة عدة روابط
          </Button>
        </div>
      </header>

      <div className="flex items-center gap-4 flex-wrap pb-4 border-b border-border">
        <div className="relative flex-grow sm:flex-grow-0 sm:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="البحث برابط الصورة..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-muted/40 focus:bg-background"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {filtered.length > 0 ? (
          filtered.map((c) => (
            <CustomerCard key={String(c.id)} customer={c} onEdit={handleEdit} onDelete={handleDelete} />
          ))
        ) : (
          <div className="col-span-full text-center py-16">
            <h3 className="text-xl font-semibold text-foreground">لا توجد عناصر</h3>
            <p className="text-muted-foreground mt-2">أضف صور العملاء لعرضها في صفحة من نحن.</p>
          </div>
        )}
      </div>

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{selectedCustomer ? 'تعديل الصورة' : 'إضافة صورة جديدة'}</DialogTitle>
            <DialogDescription>
              أدخل رابط الصورة وسيتم عرضها ضمن قسم عملاؤنا في صفحة من نحن.
            </DialogDescription>
          </DialogHeader>
          <CustomerForm
            key={String(selectedCustomer?.id ?? 'new')}
            customer={selectedCustomer}
            onSubmit={onSubmit}
            isPending={isPending}
          />
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">إلغاء</Button>
            </DialogClose>
            <Button type="submit" form="customer-form" disabled={isPending}>
              {isPending ? 'جاري الحفظ...' : 'حفظ'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isBulkOpen} onOpenChange={setIsBulkOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>إضافة عدة روابط دفعة واحدة</DialogTitle>
            <DialogDescription>
              الصق روابط الصور هنا. يمكنك فصل الروابط بأسطر جديدة أو بفواصل/مسافات.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <Textarea
              id="bulk_text"
              rows={10}
              placeholder={"https://example.com/1.jpg\nhttps://example.com/2.png\nhttps://example.com/3.webp"}
              value={bulkText}
              onChange={(e) => setBulkText(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">سيتم تجاهل الأسطر الفارغة تلقائياً.</p>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">إلغاء</Button>
            </DialogClose>
            <Button type="button" onClick={handleBulkSubmit} disabled={isPending || bulkText.trim().length === 0}>
              {isPending ? 'جاري الإضافة...' : 'إضافة الروابط'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
