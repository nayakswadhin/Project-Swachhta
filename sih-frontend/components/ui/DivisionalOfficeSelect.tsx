import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";

interface DivisionalOfficeSelectProps {
  onDivisionalOfficeChange: (divisionalOffice: string) => void;
  divisionalOffices: any[];
  loading?: boolean;
  error?: string | null;
}

export function DivisionalOfficeSelect({
  onDivisionalOfficeChange,
  divisionalOffices,
  loading = false,
  error = null,
}: DivisionalOfficeSelectProps) {
  if (loading) {
    return (
      <div className="flex items-center gap-2">
        <Loader2 className="h-4 w-4 animate-spin" />
        <span>Loading divisional offices...</span>
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  return (
    <Select onValueChange={onDivisionalOfficeChange} defaultValue="all">
      <SelectTrigger className="w-[200px]">
        <SelectValue placeholder="Select Office" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All Divisional Offices</SelectItem>
        {divisionalOffices &&
          divisionalOffices.map((office) => (
            <SelectItem key={office._id} value={office._id}>
              {office.name}
            </SelectItem>
          ))}
      </SelectContent>
    </Select>
  );
}
