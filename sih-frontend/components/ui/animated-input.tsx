'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { LucideIcon } from 'lucide-react';

interface AnimatedInputProps {
  icon: LucideIcon;
  label: string;
  id?: string;
  name: string;
  type?: string;
  required?: boolean;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  isFocused: boolean;
  onFocusChange: (focused: boolean) => void;
}

export function AnimatedInput({
  icon: Icon,
  label,
  id,
  name,
  type = 'text',
  required = false,
  value,
  onChange,
  placeholder,
  isFocused,
  onFocusChange,
}: AnimatedInputProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className="relative group space-y-2"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Label 
        htmlFor={id || name}
        className={`block text-sm font-medium transition-colors duration-200 ${
          isFocused || isHovered ? 'text-green-600' : 'text-gray-700'
        }`}
      >
        {label}
      </Label>
      <div className="relative">
        <motion.div
          animate={{
            scale: isFocused || isHovered ? 1.1 : 1,
            color: isFocused || isHovered ? '#059669' : '#9CA3AF'
          }}
          className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
        >
          <Icon className="h-4 w-4" />
        </motion.div>
        <motion.div
          animate={{
            scale: isFocused ? 1.02 : 1,
            borderColor: isFocused ? '#059669' : '#E5E7EB'
          }}
        >
          <Input
            id={id || name}
            name={name}
            type={type}
            required={required}
            value={value}
            onChange={onChange}
            onFocus={() => onFocusChange(true)}
            onBlur={() => onFocusChange(false)}
            className={`pl-10 transition-all duration-300 border-gray-200
              ${isFocused || isHovered ? 'border-green-500 ring-1 ring-green-500/20' : ''}
              hover:border-green-400`}
            placeholder={placeholder}
          />
        </motion.div>
      </div>
    </div>
  );
}