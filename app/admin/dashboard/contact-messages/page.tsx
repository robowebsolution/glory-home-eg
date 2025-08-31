"use client";

import type { ContactMessage } from "@/lib/types";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase-client";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Eye, Mail, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

export default function ContactMessagesPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);


  async function fetchMessages() {
    setLoading(true);
    const { data, error } = await supabase
      .from("contact_messages")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast.error("Failed to fetch messages.");
      console.error(error);
    } else {
      setMessages(data as ContactMessage[]);
    }
    setLoading(false);
  }

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleToggleReadStatus = async (id: number, currentStatus: boolean) => {
    const { error } = await supabase
      .from('contact_messages')
      .update({ is_read: !currentStatus })
      .eq('id', id);

    if (error) {
      toast.error('Failed to update message status.');
    } else {
      setMessages(messages.map(msg => msg.id === id ? { ...msg, is_read: !currentStatus } : msg));
      toast.success(currentStatus ? 'Message marked as unread.' : 'Message marked as read.');
    }
  };

  return (
    <div className="p-4 md:p-6">
      <h1 className="text-2xl md:text-3xl font-bold mb-6">Contact Form Messages</h1>
      
      {loading ? (
        <div className="text-center text-gray-500">Loading messages...</div>
      ) : messages.length === 0 ? (
        <div className="text-center text-gray-500 py-10">No messages found.</div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {messages.map((message) => (
            <Card key={message.id} className={`${!message.is_read ? 'border-primary' : ''}`}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-lg font-semibold">{message.name}</CardTitle>
                {!message.is_read && <Badge>New</Badge>}
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-gray-500 dark:text-gray-400">{message.email}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{new Date(message.created_at).toLocaleString()}</p>
                <div className="p-3 bg-gray-100 dark:bg-gray-800 rounded-md whitespace-pre-wrap text-sm">
                  {message.message}
                </div>
                <Button 
                  onClick={() => handleToggleReadStatus(message.id, message.is_read)}
                  variant={message.is_read ? 'outline' : 'default'}
                  className="w-full">
                  {message.is_read ? 'Mark as Unread' : 'Mark as Read'}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
