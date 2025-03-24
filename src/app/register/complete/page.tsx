'use client';

import React from 'react';
import Link from 'next/link';
import { CheckCircleIcon } from '@heroicons/react/24/outline';

export default function RegisterCompletePage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6 text-center">
          <CheckCircleIcon className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-800 mb-4">登録完了</h1>
          
          <p className="text-gray-600 mb-6">
            登録が完了しました。審査後に連絡いたします。
          </p>
          
          <p className="text-gray-600 mb-8">
            審査には通常1〜3営業日ほどかかります。
            承認されると、登録したメールアドレスに通知が届きます。
          </p>
          
          <div className="mt-8">
            <Link 
              href="/"
              className="inline-block bg-amber-500 hover:bg-amber-600 text-white font-medium py-2 px-6 rounded-lg transition duration-200"
            >
              トップページに戻る
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
