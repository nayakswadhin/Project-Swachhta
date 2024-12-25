import React from 'react';
import { Building2 } from 'lucide-react';
import { PostOfficeStaff } from '@/types/postOffice';

interface PostOfficeHeaderProps {
  name: string;
  staff: PostOfficeStaff[];
}

export function PostOfficeHeader({ name, staff = [] }: PostOfficeHeaderProps) {
  return (
    <div className="flex items-start justify-between">
      <div className="flex items-center gap-5">
        <div className="p-3.5 bg-gradient-to-br from-green-100 to-emerald-50 rounded-xl shadow-sm">
          <Building2 className="h-7 w-7 text-green-600" />
        </div>
        <div>
          <h3 className="text-2xl font-bold text-gray-900">{name}</h3>
          <p className="text-sm font-medium text-green-600 mt-1.5">{staff?.length || 0} Staff Members</p>
        </div>
      </div>
      <div className="flex -space-x-4">
        {staff.slice(0, 3).map((member) => (
          <img
            key={member.id}
            src={member.avatar}
            alt={member.name}
            className="w-11 h-11 rounded-full border-2 border-white shadow-sm hover:scale-110 transition-transform duration-200"
          />
        ))}
        {staff.length > 3 && (
          <div className="w-11 h-11 rounded-full bg-gradient-to-br from-green-100 to-emerald-50 border-2 border-white shadow-sm flex items-center justify-center">
            <span className="text-xs font-semibold text-green-700">+{staff.length - 3}</span>
          </div>
        )}
      </div>
    </div>
  );
}