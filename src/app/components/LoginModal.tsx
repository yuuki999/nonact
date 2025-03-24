'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { supabase } from '../lib/supabase';
import { FaTwitter, FaFacebook } from 'react-icons/fa';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToSignup?: () => void; // 新規登録モーダルへの切り替え関数
}

export default function LoginModal({ isOpen, onClose, onSwitchToSignup }: LoginModalProps) {
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

  // メール/パスワードでのログイン処理
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      // Supabaseを使ってログイン (App Routerではクッキーベースの認証を使用)
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) throw signInError;

      console.log('ログイン成功:', data);
      
      // 成功したらモーダルを閉じる
      handleClose();
      
      // ページをリロードしてログイン状態を反映
      window.location.reload();
    } catch (error: Error | unknown) {
      console.error('ログインエラー:', error);

      let errorMessage = 'ログインに失敗しました。メールアドレスとパスワードを確認してください。';

      // AuthApiErrorの場合、errorCodeに基づいてメッセージをカスタマイズ
      if (error && typeof error === 'object') {
        // ここで型アサーションを使って、name と code プロパティへのアクセスを可能にする
        const authError = error as { name?: string; code?: string; message?: string };
        
        if (authError.name === 'AuthApiError') {
          if (authError.code === 'invalid_credentials') {
            errorMessage = 'ログインに失敗しました。メールアドレスとパスワードを確認してください。';
          } else if (authError.code === 'user_not_found') {
            errorMessage = 'このメールアドレスは登録されていません。';
          } else if (authError.code === 'email_not_confirmed') {
            errorMessage = 'メールアドレスの確認が完了していません。確認メールをご確認ください。';
          }
        }
      } else if (error instanceof Error) {
        errorMessage = `エラーが発生しました: ${error.message}`;
      }

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
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
      console.error('Googleログインエラー:', error);
      const errorMessage = error instanceof Error ? error.message : 'Googleログインに失敗しました。';
      setError(errorMessage);
    }
  };

  const handleTwitterLogin = async () => {
    try {
      // 結果はリダイレクト後に処理されるので、ここでは使用しない
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'twitter',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      });
      
      if (error) throw error;
      
      // TwitterのOAuthは別ウィンドウにリダイレクトするため
      // ここでは特に何もせず、リダイレクト後の処理を待ちます
    } catch (error: Error | unknown) {
      console.error('Twitterログインエラー:', error);
      const errorMessage = error instanceof Error ? error.message : 'Twitterログインに失敗しました。';
      setError(errorMessage);
    }
  };

  const handleFacebookLogin = async () => {
    try {
      // 結果はリダイレクト後に処理されるので、ここでは使用しない
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'facebook',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      });
      
      if (error) throw error;
      
      // FacebookのOAuthは別ウィンドウにリダイレクトするため
      // ここでは特に何もせず、リダイレクト後の処理を待ちます
    } catch (error: Error | unknown) {
      console.error('Facebookログインエラー:', error);
      const errorMessage = error instanceof Error ? error.message : 'Facebookログインに失敗しました。';
      setError(errorMessage);
    }
  };

  const handleLineLogin = async () => {
    // LINEはSupabaseのデフォルトプロバイダーではないため
    // カスタム認証フローを実装するか、別のライブラリを使用する必要があります
    console.log('LINEでログイン');
    alert('LINE認証は現在Supabaseでサポートされていません。カスタム認証プロバイダーの設定が必要です。');
  };

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
        
        <h2 className="text-2xl font-bold text-center mb-2">ログイン</h2>
        <p className="text-sm text-gray-600 text-center mb-6">
          初めての方は<button 
            onClick={(e) => {
              e.preventDefault();
              if (onSwitchToSignup) onSwitchToSignup();
            }}
            className="text-amber-500 hover:underline bg-transparent border-none p-0 cursor-pointer"
          >
            アカウントを作成
          </button>してください。
        </p>
        
        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-md mb-4 text-sm">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              電子メールアドレス
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
              required
            />
          </div>
          
          <div>
            <div className="flex justify-between items-center mb-1">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                パスワード
              </label>
              <Link href="/forgot-password" className="text-xs text-amber-500 hover:underline">
                または
              </Link>
            </div>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
              required
            />
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-amber-500 text-white py-2 px-4 rounded-md hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 transition-colors"
          >
            {loading ? '処理中...' : 'ログイン'}
          </button>
        </form>
        
        {/* <div className="mt-6"> */}
          {/* <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">または</span>
            </div>
          </div> */}
          
          {/* <div className="mt-6 space-y-3">
            <button
              onClick={handleGoogleLogin}
              className="w-full flex items-center justify-center gap-3 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18">
                <path fill="#EA4335" d="M5.26620003,9.76452941 C6.19878754,6.93863203 8.85444915,4.90909091 12,4.90909091 C13.6909091,4.90909091 15.2181818,5.50909091 16.4181818,6.49090909 L19.9090909,3 C17.7818182,1.14545455 15.0545455,0 12,0 C7.27006974,0 3.1977497,2.69829785 1.23999023,6.65002441 L5.26620003,9.76452941 Z"/>
                <path fill="#34A853" d="M16.0407269,18.0125889 C14.9509167,18.7163016 13.5660892,19.0909091 12,19.0909091 C8.86648613,19.0909091 6.21911939,17.076871 5.27698177,14.2678769 L1.23746264,17.3349879 C3.19279051,21.2970142 7.26500293,24 12,24 C14.9328362,24 17.7353462,22.9573905 19.834192,20.9995801 L16.0407269,18.0125889 Z"/>
                <path fill="#4A90E2" d="M19.834192,20.9995801 C22.0291676,18.9520994 23.4545455,15.903663 23.4545455,12 C23.4545455,11.2909091 23.3454545,10.5272727 23.1818182,9.81818182 L12,9.81818182 L12,14.4545455 L18.4363636,14.4545455 C18.1187732,16.013626 17.2662994,17.2212117 16.0407269,18.0125889 L19.834192,20.9995801 Z"/>
                <path fill="#FBBC05" d="M5.27698177,14.2678769 C5.03832634,13.556323 4.90909091,12.7937589 4.90909091,12 C4.90909091,11.2182781 5.03443647,10.4668121 5.26620003,9.76452941 L1.23999023,6.65002441 C0.43658717,8.26043162 0,10.0753848 0,12 C0,13.9195484 0.444780743,15.7301709 1.23746264,17.3349879 L5.27698177,14.2678769 Z"/>
              </svg>
              <span>Googleでログイン</span>
            </button>
            
            <button
              onClick={handleTwitterLogin}
              className="w-full flex items-center justify-center gap-3 px-4 py-2 border border-gray-300 rounded-md bg-[#1DA1F2] text-white hover:bg-[#0d8ecf] focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 transition-colors"
            >
              <FaTwitter className="w-4 h-4" />
              <span>Twitterでログイン</span>
            </button>
            
            <button
              onClick={handleFacebookLogin}
              className="w-full flex items-center justify-center gap-3 px-4 py-2 border border-gray-300 rounded-md bg-[#4267B2] text-white hover:bg-[#365899] focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 transition-colors"
            >
              <FaFacebook className="w-4 h-4" />
              <span>Facebookでログイン</span>
            </button>
            
            <button
              onClick={handleLineLogin}
              className="w-full flex items-center justify-center gap-3 px-4 py-2 border border-gray-300 rounded-md bg-[#06C755] text-white hover:bg-[#05b14c] focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                <path d="M19.365 9.89c.50 0 .907.41.907.91s-.407.91-.907.91H17.59v1.306h1.775c.5 0 .907.41.907.91s-.407.91-.907.91H16.59c-.5 0-.907-.41-.907-.91v-5.03c0-.5.407-.91.907-.91h2.775c.5 0 .907.41.907.91s-.407.91-.907.91H17.59v1.083h1.775zm-6.09 0c.5 0 .907.41.907.91v3.126c0 .5-.407.91-.907.91s-.907-.41-.907-.91v-3.126c0-.5.407-.91.907-.91zm-2.283.91c0-.5-.407-.91-.907-.91s-.907.41-.907.91v3.126c0 .5.407.91.907.91s.907-.41.907-.91V10.8zm-5.75-1.82c-.5 0-.907.41-.907.91v5.03c0 .5.407.91.907.91s.907-.41.907-.91v-1.98h2.775c.5 0 .907-.41.907-.91s-.407-.91-.907-.91H6.149v-1.306h2.775c.5 0 .907-.41.907-.91s-.407-.91-.907-.91H5.242z"/>
              </svg>
              <span>LINEでログイン</span>
            </button>
          </div>
        </div> */}
        
        <div className="mt-6 text-center text-xs text-gray-500">
          <Link href="/privacy-policy" className="text-amber-600 hover:underline">プライバシーポリシー</Link>
          <span className="mx-2">•</span>
          <Link href="/terms" className="text-amber-600 hover:underline">利用規約</Link>
        </div>
      </div>
    </div>
  );
}