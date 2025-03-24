'use client';

import React, { useState } from 'react';
import { supabase } from '../lib/supabase';

interface SignupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSignupSuccess: (email: string) => void; // 登録成功時に完了モーダルを表示するための関数
  onSwitchToLogin?: () => void; // ログインモーダルへの切り替え関数
}

export default function SignupModal({ isOpen, onClose, onSignupSuccess, onSwitchToLogin }: SignupModalProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // モーダルが閉じられたときにフォームをリセット
  const handleClose = () => {
    setEmail('');
    setPassword('');
    setError('');
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      // Supabaseを使ってサインアップ & 確認メール送信
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          // App Routerではクッキーベースの認証を使用
          // サインアップ後に自動的にサインインさせない
          emailRedirectTo: `${window.location.origin}/auth/callback`,
          data: {
            // ユーザーのメタデータを追加できます
            signUpDate: new Date().toISOString(),
          }
        }
      });

      if (signUpError) throw signUpError;

      // 既に登録済みのメールアドレスでサインアップを試みた場合
      if (data?.user?.identities?.length === 0) {
        setError('このメールアドレスはすでに登録されています。');
        return;
      }

      console.log('サインアップ成功:', data);
      
      // 成功したら完了モーダルを表示
      handleClose();
      onSignupSuccess(email);
    } catch (error: Error | unknown) {
      console.error('登録エラー:', error);
      const errorMessage = error instanceof Error ? error.message : '登録に失敗しました。別のメールアドレスをお試しください。';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    try {
      // 結果はリダイレクト後に処理されるので、ここでは使用しない
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      });
      
      if (error) throw error;
      
      // GoogleのOAuthは別ウィンドウにリダイレクトするため
      // ここでは特に何もせず、リダイレクト後の処理を待ちます
    } catch (error: Error | unknown) {
      console.error('Googleサインアップエラー:', error);
      const errorMessage = error instanceof Error ? error.message : 'Googleサインアップに失敗しました。';
      setError(errorMessage);
    }
  };

  // const handleLineSignup = async () => {
  //   // LINEはSupabaseのデフォルトプロバイダーではないため
  //   // カスタム認証フローを実装するか、別のライブラリを使用する必要があります
  //   console.log('LINEで登録');
  //   alert('LINE認証は別途実装が必要です。Supabaseカスタム認証プロバイダーを設定してください。');
  // };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center" 
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
      onClick={handleClose}
    >
      {/* モーダルコンテンツ */}
      <div 
        className="relative w-full max-w-md bg-white rounded-lg shadow-md p-8 m-4 z-10"
        onClick={(e) => e.stopPropagation()} // モーダル内クリックが背景クリックとして処理されないようにする
      >
        {/* 閉じるボタン */}
        <button 
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
          aria-label="閉じる"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        
        <h2 className="text-2xl font-bold text-center mb-2">会員登録</h2>
        <p className="text-sm text-gray-600 text-center mb-6">
          すでにアカウントをお持ちの方は<button onClick={(e) => {
            e.preventDefault();
            if (onSwitchToLogin) onSwitchToLogin();
          }} className="text-amber-500 hover:underline bg-transparent border-none p-0 cursor-pointer">ログイン</button>してください。
        </p>
        
        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-md mb-4 text-sm">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              メールアドレス
              <span className="ml-1 text-xs text-red-500">必須</span>
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
              required
              placeholder="例: info@rentalkanojo.com"
            />
          </div>
          
          <div>
            <div className="flex items-center mb-1">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                パスワード
                <span className="ml-1 text-xs text-red-500">必須</span>
              </label>
            </div>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
              required
              placeholder="半角英数8文字以上で入力してください"
            />
            <p className="text-xs text-gray-500 mt-1">半角英数8文字以上で入力してください</p>
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-amber-500 text-white py-2 px-4 rounded-md hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 transition-colors flex items-center justify-center"
          >
            {loading ? '処理中...' : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                新規会員登録
              </>
            )}
          </button>
          
          <div className="text-xs text-center text-gray-500">
            <span>利用規約</span>と<span>プライバシーポリシー</span>に同意の上、登録ください。
          </div>
        </form>
        
        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">または</span>
            </div>
          </div>
          
          <div className="mt-6 space-y-3">
            <button
              onClick={handleGoogleSignup}
              className="w-full flex items-center justify-center gap-3 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18">
                <path fill="#EA4335" d="M5.26620003,9.76452941 C6.19878754,6.93863203 8.85444915,4.90909091 12,4.90909091 C13.6909091,4.90909091 15.2181818,5.50909091 16.4181818,6.49090909 L19.9090909,3 C17.7818182,1.14545455 15.0545455,0 12,0 C7.27006974,0 3.1977497,2.69829785 1.23999023,6.65002441 L5.26620003,9.76452941 Z"/>
                <path fill="#34A853" d="M16.0407269,18.0125889 C14.9509167,18.7163016 13.5660892,19.0909091 12,19.0909091 C8.86648613,19.0909091 6.21911939,17.076871 5.27698177,14.2678769 L1.23746264,17.3349879 C3.19279051,21.2970142 7.26500293,24 12,24 C14.9328362,24 17.7353462,22.9573905 19.834192,20.9995801 L16.0407269,18.0125889 Z"/>
                <path fill="#4A90E2" d="M19.834192,20.9995801 C22.0291676,18.9520994 23.4545455,15.903663 23.4545455,12 C23.4545455,11.2909091 23.3454545,10.5272727 23.1818182,9.81818182 L12,9.81818182 L12,14.4545455 L18.4363636,14.4545455 C18.1187732,16.013626 17.2662994,17.2212117 16.0407269,18.0125889 L19.834192,20.9995801 Z"/>
                <path fill="#FBBC05" d="M5.27698177,14.2678769 C5.03832634,13.556323 4.90909091,12.7937589 4.90909091,12 C4.90909091,11.2182781 5.03443647,10.4668121 5.26620003,9.76452941 L1.23999023,6.65002441 C0.43658717,8.26043162 0,10.0753848 0,12 C0,13.9195484 0.444780743,15.7301709 1.23746264,17.3349879 L5.27698177,14.2678769 Z"/>
              </svg>
              <span>Googleで登録</span>
            </button>
            
            {/* <button
              onClick={handleLineSignup}
              className="w-full flex items-center justify-center gap-3 px-4 py-2 border border-gray-300 rounded-md bg-[#06C755] text-white hover:bg-[#05b14c] focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                <path d="M19.365 9.89c.50 0 .907.41.907.91s-.407.91-.907.91H17.59v1.306h1.775c.5 0 .907.41.907.91s-.407.91-.907.91H16.59c-.5 0-.907-.41-.907-.91v-5.03c0-.5.407-.91.907-.91h2.775c.5 0 .907.41.907.91s-.407.91-.907.91H17.59v1.083h1.775zm-6.09 0c.5 0 .907.41.907.91v3.126c0 .5-.407.91-.907.91s-.907-.41-.907-.91v-3.126c0-.5.407-.91.907-.91zm-2.283.91c0-.5-.407-.91-.907-.91s-.907.41-.907.91v3.126c0 .5.407.91.907.91s.907-.41.907-.91V10.8zm-5.75-1.82c-.5 0-.907.41-.907.91v5.03c0 .5.407.91.907.91s.907-.41.907-.91v-1.98h2.775c.5 0 .907-.41.907-.91s-.407-.91-.907-.91H6.149v-1.306h2.775c.5 0 .907-.41.907-.91s-.407-.91-.907-.91H5.242z"/>
              </svg>
              <span>LINEで登録</span>
            </button> */}
          </div>
        </div>
      </div>
    </div>
  );
}
