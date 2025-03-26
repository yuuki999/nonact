'use client';

import { supabase } from './supabase';
import { useRouter } from 'next/navigation';
import React from 'react';

// 管理者権限を確認する関数
export async function isAdmin(): Promise<boolean> {
  try {
    // 現在のセッションを取得
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) return false;
    
    // ユーザーのメールアドレスを取得
    const userEmail = session.user.email;
    
    if (!userEmail) return false;
    
    // 管理者メールアドレスのリスト（環境変数から取得するか、DBから取得する方法も検討可能）
    // 本番環境では、DBで管理する方が望ましい
    const adminEmails = process.env.NEXT_PUBLIC_ADMIN_EMAILS?.split(',') || [];

    return adminEmails.includes(userEmail);
  } catch (error) {
    console.error('管理者権限確認エラー:', error);
    return false;
  }
}

// 管理者ページのアクセス制御用のラッパーコンポーネント
export function withAdminAuth<T extends object>(Component: React.ComponentType<T>) {
  return function AdminProtected(props: T) {
    const [isAuthorized, setIsAuthorized] = React.useState(false);
    const [loading, setLoading] = React.useState(true);
    const router = useRouter();
    
    React.useEffect(() => {
      async function checkAdminAuth() {
        const admin = await isAdmin();
        setIsAuthorized(admin);
        setLoading(false);
        
        if (!admin) {
          router.push('/');
        }
      }
      
      checkAdminAuth();
    }, [router]);
    
    if (loading) return React.createElement('div', null, 'Loading...');
    if (!isAuthorized) return null;
    
    return React.createElement(Component, props);
  };
}
