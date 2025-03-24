'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { User } from '@supabase/supabase-js';

export default function AuthStatus() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // ログイン状態を確認する関数
    async function checkUser() {
      try {
        // 現在のセッションを取得
        const { data: { session } } = await supabase.auth.getSession();
        
        // セッションがあればユーザー情報を設定
        if (session) {
          setUser(session.user);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error('セッション取得エラー:', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    }
    
    // 初回読み込み時にユーザー情報を取得
    checkUser();
    
    // 認証状態の変更を監視
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user || null);
        setLoading(false);
      }
    );
    
    // クリーンアップ関数
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // ログアウト処理
  const handleLogout = async () => {
    await supabase.auth.signOut();
    // ページをリロードしてログアウト状態を反映
    window.location.reload();
  };

  if (loading) {
    return (
      <div className="p-4 bg-gray-100 rounded-md">
        <p className="text-gray-600">認証状態を確認中...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="p-4 bg-red-50 rounded-md">
        <p className="text-red-600 font-medium">ログインしていません</p>
        <p className="text-sm text-gray-600 mt-1">ログインするとすべての機能が利用できます</p>
      </div>
    );
  }

  return (
    <div className="p-4 bg-green-50 rounded-md">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-green-600 font-medium">ログイン中</p>
          <p className="text-sm text-gray-600 mt-1">メールアドレス: {user.email}</p>
          <p className="text-xs text-gray-500 mt-1">ユーザーID: {user.id}</p>
          {user.user_metadata && (
            <div className="mt-2">
              <p className="text-xs text-gray-500">メタデータ:</p>
              <pre className="text-xs bg-gray-100 p-2 rounded mt-1 overflow-auto max-h-20">
                {JSON.stringify(user.user_metadata, null, 2)}
              </pre>
            </div>
          )}
        </div>
        <button
          onClick={handleLogout}
          className="px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600 transition-colors"
        >
          ログアウト
        </button>
      </div>
    </div>
  );
}
