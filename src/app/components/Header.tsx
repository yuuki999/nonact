'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import AuthModals from './AuthModals';
import { supabase } from '../lib/supabase';

export default function Header() {
  const router = useRouter();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isSignupModalOpen, setIsSignupModalOpen] = useState(false);
  const [session, setSession] = useState<{ user: { id: string } } | null>(null);
  const [profile, setProfile] = useState<{id: string; display_name?: string | null} | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      
      if (session) {
        // プロフィール情報を取得
        const { data: profileData } = await supabase
          .from('customer_profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();
        
        setProfile(profileData);
      }
      
      setLoading(false);
    };
    
    checkSession();
    
    // 認証状態の変更を監視
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      checkSession();
    });
    
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const openLoginModal = () => {
    setIsLoginModalOpen(true);
    setIsSignupModalOpen(false);
  };

  const closeLoginModal = () => {
    setIsLoginModalOpen(false);
  };
  
  const openSignupModal = () => {
    setIsSignupModalOpen(true);
    setIsLoginModalOpen(false);
  };

  const closeSignupModal = () => {
    setIsSignupModalOpen(false);
  };
  
  // レンタル予約ボタンのクリック処理
  const handleRentalClick = () => {
    if (!session) {
      // 未ログインの場合はログインモーダルを表示
      openLoginModal();
      return;
    }
    
    if (!profile || !profile.display_name) {
      // ログイン済みだが基本情報がない場合は入力フォームへ
      router.push('/rental');
      return;
    }
    
    // ログイン済みで基本情報もある場合は予約ページへ
    router.push('/rental/booking');
  };

  if (loading) {
    // ローディング中はヘッダーをシンプルに表示
    return (
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center">
            <Link href="/" className="font-bold text-xl text-gray-800 flex items-center">
              <span>レンタル何もしない人</span>
              <span className="ml-2 bg-amber-500 text-white text-xs px-2 py-1 rounded">PREMIUM</span>
            </Link>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center">
          <Link href="/" className="font-bold text-xl text-gray-800 flex items-center">
            <span>レンタル何もしない人</span>
            <span className="ml-2 bg-amber-500 text-white text-xs px-2 py-1 rounded">PREMIUM</span>
          </Link>
        </div>
        <nav className="hidden md:flex space-x-6 text-sm">
          <Link href="/" className="text-gray-600 hover:text-gray-900">何もしない人一覧</Link>
          <Link href="/pricing" className="text-gray-600 hover:text-gray-900">料金プラン</Link>
          <Link href="/register" className="text-gray-600 hover:text-gray-900">何もしない人登録</Link>
          {/* <Link href="/reasons" className="text-gray-600 hover:text-gray-900">選ばれる理由</Link> */}
          <Link href="/voices" className="text-gray-600 hover:text-gray-900">ご利用者の声</Link>
        </nav>
        <div className="flex items-center">
          <div className="flex items-center space-x-3">
            <button
              onClick={openLoginModal}
              className="text-amber-500 text-sm hover:text-amber-600 focus:outline-none"
            >
              ログイン
            </button>
            {/* <span className="text-gray-300">|</span>
            <button
              onClick={openSignupModal}
              className="text-amber-500 text-sm hover:text-amber-600 focus:outline-none"
            >
              新規登録
            </button> */}
          </div>
          <button
            onClick={handleRentalClick}
            className="bg-amber-500 text-white text-sm px-4 py-2 rounded-full hover:bg-amber-600 ml-4"
          >
            レンタル予約
          </button>
        </div>
      </div>
      
      {/* 認証モーダル管理コンポーネント */}
      <AuthModals
        isLoginOpen={isLoginModalOpen}
        isSignupOpen={isSignupModalOpen}
        onLoginClose={closeLoginModal}
        onSignupClose={closeSignupModal}
        openLogin={openLoginModal}
        openSignup={openSignupModal}
      />
    </header>
  );
}
