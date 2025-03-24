'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AuthConfirmedPage() {
  const router = useRouter();
  const [user, setUser] = useState<{ email?: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkUser() {
      try {
        const { data } = await supabase.auth.getUser();
        setUser(data.user);
      } catch (error) {
        console.error('ユーザー情報取得エラー:', error);
      } finally {
        setLoading(false);
      }
    }
    
    checkUser();
  }, []);

  // ホームページに進む
  const handleContinue = () => {
    router.push('/'); // ホームページに移動
  };

  // ユーザー情報を表示するか、ログイン状態に応じて異なる内容を表示する
  const userEmail = user?.email;
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-amber-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500 mx-auto mb-4"></div>
          <p className="text-gray-600">読み込み中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-amber-50">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          
          <h1 className="text-2xl font-bold text-gray-800 mb-4">メール認証が完了しました</h1>
          
          <p className="text-gray-600 mb-6">
            メールアドレスの確認が完了しました。これで全ての機能をご利用いただけます。
            {userEmail && (
              <span className="block mt-2 text-sm font-medium">
                確認されたメールアドレス: <span className="text-amber-600">{userEmail}</span>
              </span>
            )}
          </p>
          
          <button
            onClick={handleContinue}
            className="w-full bg-amber-500 text-white py-3 px-4 rounded-md hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 transition-colors"
          >
            ホームに戻る
          </button>

          <div className="mt-4 text-sm text-gray-500">
            <Link href="/profile" className="text-amber-500 hover:underline">プロフィール設定</Link>
            <span className="mx-2">|</span>
            <Link href="/" className="text-amber-500 hover:underline">何もしない人一覧</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
