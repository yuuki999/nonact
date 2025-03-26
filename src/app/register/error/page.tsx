'use client';

import React, { Suspense } from 'react';
import Link from 'next/link';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import { useSearchParams } from 'next/navigation';

// SearchParamsを使用するコンポーネントを分離し、Suspenseでラップする
function ErrorContent() {
  const searchParams = useSearchParams();
  const errorMessage = searchParams.get('message') || '予期せぬエラーが発生しました';
  
  return (
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
  );
}

export default function RegisterErrorPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        <Suspense fallback={
          <div className="p-6 text-center">
            <div className="animate-pulse">
              <div className="h-16 w-16 bg-gray-200 rounded-full mx-auto mb-4"></div>
              <div className="h-6 bg-gray-200 rounded w-3/4 mx-auto mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto mb-6"></div>
              <div className="h-10 bg-gray-200 rounded w-1/3 mx-auto"></div>
            </div>
          </div>
        }>
          <ErrorContent />
        </Suspense>
      </div>
    </div>
  );
}
