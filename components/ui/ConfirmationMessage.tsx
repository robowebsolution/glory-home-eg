import React from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface ConfirmationMessageProps {
  onContinueShopping: () => void;
}

const ConfirmationMessage: React.FC<ConfirmationMessageProps> = ({ onContinueShopping }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-8 max-w-sm w-full">
        <h2 className="text-2xl font-bold text-center mb-4 text-gray-900 dark:text-white">
          Purchase Confirmed!
        </h2>
        <p className="text-center text-gray-600 dark:text-gray-300 mb-6">
          Thank you for your purchase. You can continue shopping or view your orders.
        </p>
        <div className="flex justify-center">
          <Button onClick={onContinueShopping} className="mr-2">
            Continue Shopping
          </Button>
          <Link href="/orders">
            <Button variant="outline">
              View Orders
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationMessage;
