'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../lib/supabase';

export default function BookingPage() {
  const router = useRouter();
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
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();
        
        setProfile(profileData);
        
        // プロフィール情報がない場合は基本情報入力ページへリダイレクト
        if (!profileData || !profileData.display_name) {
          router.push('/rental');
        }
      } else {
        // 未ログインの場合はホームページにリダイレクト
        router.push('/');
      }
      
      setLoading(false);
    };
    
    checkSession();
  }, [router]);
  
  if (loading) {
    return <div className="container mx-auto px-4 py-8 text-center">読み込み中...</div>;
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center mb-8">レンタル予約</h1>
        
        {profile && (
          <div className="mb-6">
            <p className="text-lg mb-2">こんにちは、<span className="font-semibold">{profile.display_name}</span>さん</p>
            <p className="text-gray-600">以下から予約内容を選択してください</p>
          </div>
        )}
        
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4 pb-2 border-b border-gray-200">予約内容</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border border-gray-200 rounded-lg p-4 hover:border-amber-500 hover:shadow-md transition cursor-pointer">
              <h3 className="font-semibold text-lg mb-2">スタンダードプラン</h3>
              <p className="text-gray-600 mb-2">1時間 3,000円〜</p>
              <ul className="text-sm text-gray-500 list-disc list-inside">
                <li>カフェでのお話</li>
                <li>散歩</li>
                <li>ショッピング同行</li>
              </ul>
            </div>
            
            <div className="border border-gray-200 rounded-lg p-4 hover:border-amber-500 hover:shadow-md transition cursor-pointer">
              <h3 className="font-semibold text-lg mb-2">プレミアムプラン</h3>
              <p className="text-gray-600 mb-2">1時間 5,000円〜</p>
              <ul className="text-sm text-gray-500 list-disc list-inside">
                <li>レストランでの食事</li>
                <li>映画・美術館</li>
                <li>アクティビティ</li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4 pb-2 border-b border-gray-200">日時を選択</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">日付</label>
              <input
                type="date"
                id="date"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-amber-500 focus:border-amber-500"
              />
            </div>
            
            <div>
              <label htmlFor="start-time" className="block text-sm font-medium text-gray-700 mb-1">開始時間</label>
              <input
                type="time"
                id="start-time"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-amber-500 focus:border-amber-500"
              />
            </div>
            
            <div>
              <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-1">時間</label>
              <select
                id="duration"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-amber-500 focus:border-amber-500"
              >
                <option value="1">1時間</option>
                <option value="2">2時間</option>
                <option value="3">3時間</option>
                <option value="4">4時間</option>
              </select>
            </div>
          </div>
        </div>
        
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4 pb-2 border-b border-gray-200">場所</h2>
          
          <div className="mb-4">
            <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">待ち合わせ場所</label>
            <input
              type="text"
              id="location"
              placeholder="例: 渋谷駅ハチ公前"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-amber-500 focus:border-amber-500"
            />
          </div>
        </div>
        
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4 pb-2 border-b border-gray-200">リクエスト内容</h2>
          
          <div className="mb-4">
            <label htmlFor="request" className="block text-sm font-medium text-gray-700 mb-1">特別なリクエストがあれば記入してください</label>
            <textarea
              id="request"
              rows={4}
              placeholder="例: カフェでお話した後、近くの本屋さんに行きたいです。"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-amber-500 focus:border-amber-500"
            ></textarea>
          </div>
        </div>
        
        <div className="text-center">
          <button className="bg-amber-500 text-white px-8 py-3 rounded-full hover:bg-amber-600 focus:outline-none">
            予約を確定する
          </button>
        </div>
      </div>
    </div>
  );
}
