import React from 'react';
import axios from 'axios';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PostOffice } from '@/types/postOffice';
import { Send, X, User, AlertCircle, Info, CheckCircle2, AlertTriangle, AlertOctagon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface MessageDialogProps {
  postOffice: PostOffice;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const importanceOptions = [
  { value: 'INFO', label: 'Information', icon: Info, color: 'text-blue-500' },
  { value: 'SUCCESS', label: 'Success', icon: CheckCircle2, color: 'text-green-500' },
  { value: 'WARNING', label: 'Warning', icon: AlertTriangle, color: 'text-amber-500' },
  { value: 'URGENT', label: 'Urgent', icon: AlertCircle, color: 'text-orange-500' },
  { value: 'CRITICAL', label: 'Critical', icon: AlertOctagon, color: 'text-red-500' }
];

export function MessageDialog({ postOffice, open, onOpenChange }: MessageDialogProps) {
  const [message, setMessage] = React.useState('');
  const [importance, setImportance] = React.useState('INFO');
  const [isLoading, setIsLoading] = React.useState(false);
  const { toast } = useToast();

  const selectedImportance = importanceOptions.find(opt => opt.value === importance);

  const handleSend = async () => {
    if (!message.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter a message',
        variant: 'destructive',
      });
      return;
    }

    try {
      setIsLoading(true);
      const doOfficer = JSON.parse(localStorage.getItem('doOfficer') || '{}');
      
      const messageData = {
        senderId: doOfficer._id,
        senderRole: 'DIVISIONAL_OFFICE',
        recipientId: postOffice.userId?._id,
        content: message,
        type: 'DIRECT',
        importance: importance
      };

      await axios.post('http://localhost:3000/messages', messageData);

      toast({
        title: 'Success',
        description: `Your message has been sent to ${postOffice.name}`,
      });
      
      setMessage('');
      setImportance('INFO');
      onOpenChange(false);
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: 'Error',
        description: 'Failed to send message. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] bg-white/95 backdrop-blur-lg border-green-100">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-green-900 flex items-center gap-2">
            Message to {postOffice.name}
          </DialogTitle>
          <DialogDescription className="text-green-600">
            Send important updates or inquiries to the post office staff
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="recipients" className="text-sm font-medium text-gray-700">
              Recipients
            </Label>
            <div className="flex flex-wrap gap-2 p-3 border rounded-lg bg-gray-50">
              <div
                key={postOffice.userId?._id}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-100 text-green-700 text-sm"
              >
                <div className="p-1 bg-green-200 rounded-full">
                  <User className="h-3 w-3" />
                </div>
                <span className="font-medium">{postOffice.userId?.name || 'Staff Member'}</span>
                <span className="text-green-600/60 text-xs">
                  {postOffice.userId?.email || 'No email'}
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="importance" className="text-sm font-medium text-gray-700">
              Message Importance
            </Label>
            <Select value={importance} onValueChange={setImportance}>
              <SelectTrigger className="w-full">
                <SelectValue>
                  {selectedImportance && (
                    <div className="flex items-center gap-2">
                      {React.createElement(selectedImportance.icon, {
                        className: cn('h-4 w-4', selectedImportance.color)
                      })}
                      <span>{selectedImportance.label}</span>
                    </div>
                  )}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {importanceOptions.map((option) => (
                  <SelectItem
                    key={option.value}
                    value={option.value}
                    className="flex items-center gap-2"
                  >
                    <div className="flex items-center gap-2">
                      {React.createElement(option.icon, {
                        className: cn('h-4 w-4', option.color)
                      })}
                      <span>{option.label}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="message" className="text-sm font-medium text-gray-700">
              Message
            </Label>
            <Textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message here..."
              className={cn(
                "min-h-[150px] resize-none border-green-100 focus:ring-green-200",
                importance === 'CRITICAL' && "border-red-200 bg-red-50",
                importance === 'URGENT' && "border-orange-200 bg-orange-50",
                importance === 'WARNING' && "border-amber-200 bg-amber-50",
                importance === 'SUCCESS' && "border-green-200 bg-green-50",
                importance === 'INFO' && "border-blue-200 bg-blue-50"
              )}
              disabled={isLoading}
            />
          </div>
        </div>

        <DialogFooter className="sm:justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="gap-2 border-green-200 hover:bg-green-50"
            disabled={isLoading}
          >
            <X className="h-4 w-4" />
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleSend}
            className={cn(
              "text-white gap-2",
              importance === 'CRITICAL' && "bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700",
              importance === 'URGENT' && "bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700",
              importance === 'WARNING' && "bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700",
              importance === 'SUCCESS' && "bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700",
              importance === 'INFO' && "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
            )}
            disabled={isLoading}
          >
            <Send className="h-4 w-4" />
            {isLoading ? 'Sending...' : 'Send Message'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}