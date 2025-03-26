'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { isAdmin } from '../lib/admin';
import Link from 'next/link';

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const router = useRouter();

  useEffect(() => {
    async function checkAdminStatus() {
      const adminStatus = await isAdmin();
      console.log('adminStatus', adminStatus)
      setAuthorized(adminStatus);
      setLoading(false);
      
      if (!adminStatus) {
        router.push('/');
      }
    }
    
    checkAdminStatus();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-xl font-semibold">Loading...</p>
        </div>
      </div>
    );
  }

  if (!authorized) {
    return null; // router.push('/') が実行されるため、何も表示しない
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">管理者ダッシュボード</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* スタッフ管理カード */}
          <Link href="/admin/staff" className="block">
            <div className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow duration-300">
              <div className="px-4 py-5 sm:p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-indigo-500 rounded-md p-3">
                    <svg className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  </div>
                  <div className="ml-5">
                    <h3 className="text-lg font-medium text-gray-900">スタッフ管理</h3>
                    <p className="mt-2 text-sm text-gray-500">スタッフの追加、編集、有効/無効の切り替えを行います</p>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-4 sm:px-6">
                <div className="text-sm">
                  <span className="font-medium text-indigo-600 hover:text-indigo-500">
                    管理画面を開く <span aria-hidden="true">&rarr;</span>
                  </span>
                </div>
              </div>
            </div>
          </Link>

          {/* 将来的に他の管理機能を追加する場合はここに追加 */}
        </div>
      </div>
    </div>
  );
}
