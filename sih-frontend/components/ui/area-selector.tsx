import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface AreaSelectorProps {
  value: string;
  onChange: (value: string) => void;
  areas: string[];
  label: string;
}

export function AreaSelector({ value, onChange, areas, label }: AreaSelectorProps) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-gray-500">{label}</label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="Select area" />
        </SelectTrigger>
        <SelectContent>
          {areas.map((area) => (
            <SelectItem key={area} value={area}>
              {area}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}