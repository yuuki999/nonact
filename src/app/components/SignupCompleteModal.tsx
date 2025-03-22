'use client';

import React from 'react';

interface SignupCompleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  email: string; // 確認メールを送信したメールアドレス
}

export default function SignupCompleteModal({ isOpen, onClose, email }: SignupCompleteModalProps) {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center" 
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-md bg-white rounded-lg shadow-md p-8 m-4 z-10"
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
          aria-label="閉じる"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          
          <h2 className="text-2xl font-bold text-gray-800 mb-2">まだ会員登録は完了していません</h2>
          
          <div className="text-gray-600 mb-6 text-sm">
            <p className="mb-2">ご登録のメールアドレスに、確認メールを送信しました。</p>
            <p className="font-medium mb-2">しばらく待っても届かない場合は、<br/>迷惑メールフォルダをご確認ください。</p>
            <p className="mb-4">また、迷惑メールとして分類されていた場合は、<br/>「迷惑メールではない」と設定をお願いします。</p>
            
            <div className="bg-gray-50 p-3 rounded-md mb-4">
              <p className="font-medium">ご登録中のメールアドレス：</p>
              <p className="text-amber-600 break-all">{email}</p>
            </div>
          </div>
          
          <div className="space-y-3">
            <button
              onClick={onClose}
              className="w-full bg-amber-500 text-white py-3 px-4 rounded-md hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 transition-colors"
            >
              基本情報入力へ進む
            </button>
            
            <button
              onClick={() => {
                // メール再送信処理
                console.log('アドレス確認メールを再送信する:', email);
              }}
              className="w-full text-gray-700 py-2 px-4 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 transition-colors text-sm"
            >
              アドレス確認メールを再送信する
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}