'use client';

import React from 'react';
import Link from 'next/link';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import { useSearchParams } from 'next/navigation';

export default function RegisterErrorPage() {
  const searchParams = useSearchParams();
  const errorMessage = searchParams.get('message') || '予期せぬエラーが発生しました';
  
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6 text-center">
          <ExclamationTriangleIcon className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-800 mb-4">エラーが発生しました</h1>
          
          <p className="text-gray-600 mb-6">
            {decodeURIComponent(errorMessage)}
          </p>
          
          <div className="mt-8">
            <Link 
              href="/register"
              className="inline-block bg-amber-500 hover:bg-amber-600 text-white font-medium py-2 px-6 rounded-lg transition duration-200"
            >
              登録ページに戻る
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
