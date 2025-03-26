'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Staff } from '../types/staff';

interface StaffCardProps {
  staff: Staff;
}

export default function StaffCard({ staff }: StaffCardProps) {
  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-md relative">
      <div className="relative h-80">
        <Image 
          src={staff.profile_image_url || '/images/default-profile.jpg'} 
          alt={staff.display_name || 'スタッフプロフィール画像'}
          fill
          className="object-cover"
        />
        {staff.rank && (
          <div className="absolute bottom-4 right-4 w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold">
            No.{staff.rank}
          </div>
        )}
      </div>
      <div className="p-4">
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-medium text-lg">{staff.display_name}</h3>
          <span className={`text-xs px-2 py-1 rounded ${
            staff.category === 'プレミアム' ? 'bg-amber-500 text-white' :
            staff.category === 'スペシャル' ? 'bg-blue-500 text-white' : 
            'bg-green-500 text-white'
          }`}>
            {staff.category || 'スタンダード'}
          </span>
        </div>
        <p className="font-bold text-gray-800 mb-3">{staff.main_title || '何もしないプロフェッショナル'}</p>
        <ul className="space-y-1 text-sm text-gray-600">
          {staff.tags && staff.tags.length > 0 ? (
            staff.tags.map((tag, index) => (
              <li key={index} className="flex">
                <span className="text-gray-400 mr-1">#{index+1}</span>
                {tag}
              </li>
            ))
          ) : (
            <li className="flex">
              <span className="text-gray-400 mr-1">#1</span>
              何もしないプロフェッショナル
            </li>
          )}
        </ul>
      </div>
      <Link 
        href={`/rental/${staff.id}`}
        className="block bg-gray-100 text-center py-3 text-gray-700 hover:bg-gray-200 transition"
      >
        詳細を見る
      </Link>
    </div>
  );
}
