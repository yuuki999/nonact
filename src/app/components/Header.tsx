'use client';

import { useState } from 'react';
import Link from 'next/link';
import AuthModals from './AuthModals';

export default function Header() {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isSignupModalOpen, setIsSignupModalOpen] = useState(false);

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
          <Link href="/register" className="bg-amber-500 text-white text-sm px-4 py-2 rounded-full hover:bg-amber-600 ml-4">
            レンタル予約
          </Link>
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
