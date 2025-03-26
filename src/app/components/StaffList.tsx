'use client';

import { useState } from 'react';
import { Staff } from '../types/staff';
import StaffCard from './StaffCard';

interface StaffListProps {
  initialStaffList: Staff[];
  error?: string | null;
}

export default function StaffList({ initialStaffList, error }: StaffListProps) {
  const [staffList] = useState<Staff[]>(initialStaffList);
  
  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6">
        <strong className="font-bold">エラー: </strong>
        <span className="block sm:inline">{error}</span>
      </div>
    );
  }

  if (staffList.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-600">現在、利用可能な何もしない人がいません。</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {staffList.map((staff) => (
        <StaffCard key={staff.id} staff={staff} />
      ))}
    </div>
  );
}
