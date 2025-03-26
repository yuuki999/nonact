'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import AuthStatus from './components/AuthStatus';
import { supabase } from './lib/supabase';


interface Staff {
  id: string;
  created_at: string;
  name: string;
  display_name: string;
  profile_image_url?: string;
  rank?: number;
  category?: string;
  main_title?: string;
  tags?: string[];
  bio?: string;
  is_available: boolean;
}

export default function Home() {
  const [staffList, setStaffList] = useState<Staff[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  
  useEffect(() => {
    async function fetchStaff() {
      try {
        setLoading(true);
        
        // Supabaseからnonact_staffテーブルのデータを取得
        const { data, error } = await supabase
          .from('nonact_staff')
          .select('*')
          .eq('is_available', true)
          .order('created_at', { ascending: false }); // rankの代わりにcreated_atを使用
        
        if (error) {
          throw error;
        }
        
        if (data) {
          // データが取得できたらステートに設定
          setStaffList(data);
          console.log('スタッフデータを取得しました:', data);
        }
      } catch (err) {
        console.error('スタッフデータの取得中にエラーが発生しました:', err);
        setError(err instanceof Error ? err.message : 'データの取得中にエラーが発生しました');
      } finally {
        setLoading(false);
      }
    }
    
    fetchStaff();
  }, []);

  return (
    <div className="min-h-screen bg-amber-50">
      <div className="container mx-auto px-4 py-8">
        {process.env.NEXT_PUBLIC_DEBUG_MODE === 'true' && (
          <div className="mb-6">
            <AuthStatus />
          </div>
        )}
        <h1 className="text-2xl font-bold text-center my-10">レンタル何もしない人® 一覧</h1>

        <p className="text-center text-gray-700 mb-6 max-w-3xl mx-auto">
          レンタル何もしない人®は、何もしないプロフェッショナルが登録し、そのサービスを利用したい人がレンタルできるプラットフォームです。
          何もしない時間の贅沢さと心地よさを体験してみませんか。
          {/* <Link href="/reasons" className="text-blue-600 hover:underline">選ばれる理由を見る</Link> */}
        </p>

        {loading && (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>
          </div>
        )}

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6">
            <strong className="font-bold">エラー: </strong>
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        {!loading && !error && staffList.length === 0 && (
          <div className="text-center py-10">
            <p className="text-gray-600">現在、利用可能な何もしない人がいません。</p>
          </div>
        )}

        {!loading && staffList.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {staffList.map((staff) => (
              <div key={staff.id} className="bg-white rounded-lg overflow-hidden shadow-md relative">
                <div className="relative h-80">
                  <Image 
                    src={staff.profile_image_url || '/images/default-profile.jpg'} 
                    alt={staff.display_name || 'スタッフプロフィール画像'}
                    fill
                    className="object-cover"
                  />
                  {staff.rank && (
                    <div className="absolute bottom-4 right-4 w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold">
                      No.{staff.rank}
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-medium text-lg">{staff.display_name}</h3>
                    <span className={`text-xs px-2 py-1 rounded ${
                      staff.category === 'プレミアム' ? 'bg-amber-500 text-white' :
                      staff.category === 'スペシャル' ? 'bg-blue-500 text-white' : 
                      'bg-green-500 text-white'
                    }`}>
                      {staff.category || 'スタンダード'}
                    </span>
                  </div>
                  <p className="font-bold text-gray-800 mb-3">{staff.main_title || '何もしないプロフェッショナル'}</p>
                  <ul className="space-y-1 text-sm text-gray-600">
                    {staff.tags && staff.tags.length > 0 ? (
                      staff.tags.map((tag, index) => (
                        <li key={index} className="flex">
                          <span className="text-gray-400 mr-1">#{index+1}</span>
                          {tag}
                        </li>
                      ))
                    ) : (
                      <li className="flex">
                        <span className="text-gray-400 mr-1">#1</span>
                        何もしないプロフェッショナル
                      </li>
                    )}
                  </ul>
                </div>
                <Link 
                  href={`/rental/${staff.id}`}
                  className="block bg-gray-100 text-center py-3 text-gray-700 hover:bg-gray-200 transition"
                >
                  詳細を見る
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}