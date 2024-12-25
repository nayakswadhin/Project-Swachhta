import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { usePostOffices } from '@/hooks/usePostOffices';
import { Loader2 } from 'lucide-react';

interface PostOfficeSelectProps {
  onPostOfficeChange: (postOffice: string) => void;
}

export function PostOfficeSelect({ onPostOfficeChange }: PostOfficeSelectProps) {
  const { postOffices, loading, error } = usePostOffices();

  if (loading) {
    return (
      <div className="w-[280px] flex items-center space-x-2">
        <Loader2 className="h-4 w-4 animate-spin" />
        <span className="text-sm text-muted-foreground">Loading post offices...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-[280px] text-sm text-destructive">
        Error: {error}
      </div>
    );
  }

  return (
    <Select onValueChange={onPostOfficeChange} defaultValue="all">
      <SelectTrigger className="w-[280px]">
        <SelectValue placeholder="Select post office" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All Post Offices</SelectItem>
        {postOffices.map((office) => (
          <SelectItem key={office.data._id} value={office.data._id}>
            {office.data.name} - ({office.data.cleanlinessScore}% Clean)
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}