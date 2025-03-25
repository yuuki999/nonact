'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../lib/supabase';
import { getCurrentUserInfo } from '../lib/userService';
import Link from 'next/link';
import { toast } from 'sonner';

type UserInfo = {
  id: string;
  display_name?: string | null;
  email?: string | null;
  phone_number?: string | null;
};

type Booking = {
  id: string;
  cast_id: string;
  date: string;
  start_time: string;
  duration: number;
  location: string;
  status: string;
  created_at: string;
};

export default function MyPage() {
  const router = useRouter();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        // 未ログインの場合はホームページにリダイレクト
        router.push('/');
        return;
      }
      
      // ユーザー情報を取得
      const userInfoData = await getCurrentUserInfo();
      setUserInfo(userInfoData);
      
      // 予約情報を取得
      const { data: bookingsData, error } = await supabase
        .from('bookings')
        .select('*')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('予約データ取得エラー:', error);
      } else {
        setBookings(bookingsData || []);
      }
      
      setLoading(false);
    };
    
    checkSession();
  }, [router]);
  
  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        // ログアウト失敗時は赤色の通知を表示
        toast.error('ログアウトに失敗しました', {
          position: 'bottom-right',
          duration: 3000,
          style: { backgroundColor: '#FEE2E2', color: '#B91C1C', border: '1px solid #EF4444' }
        });
        console.error('ログアウトエラー:', error);
        return;
      }
      
      // ログアウト成功時は緑色の通知を表示
      toast.success('ログアウトしました', {
        position: 'bottom-right',
        duration: 3000,
        style: { backgroundColor: '#DCFCE7', color: '#166534', border: '1px solid #22C55E' }
      });
      router.push('/');
    } catch (error) {
      // 予期しないエラーが発生した場合
      console.error('予期しないログアウトエラー:', error);
      toast.error('予期しないエラーが発生しました', {
        position: 'bottom-right',
        duration: 3000,
        style: { backgroundColor: '#FEE2E2', color: '#B91C1C', border: '1px solid #EF4444' }
      });
    }
  };

  if (loading) {
    return <div className="container mx-auto px-4 py-8 text-center">読み込み中...</div>;
  }

  return (
    <div className="bg-amber-50 min-h-screen py-8">
      <div className="container mx-auto px-4 py-4 text-center">
        <h1 className="text-2xl font-bold mb-8">マイページ</h1>
        
        <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-sm overflow-hidden mb-8">
          {/* プロフィール情報セクション */}
          <div className="flex items-center p-6 border-b border-gray-100">
            <div className="flex-shrink-0 mr-4">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
            <div className="flex-grow">
              <div className="flex items-center">
                <h2 className="text-lg font-semibold">プロフィールを充実させよう</h2>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500 ml-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <p className="text-sm text-gray-500 mt-1">キャストとのスムーズなトークのためにあなたのことを教えてください</p>
            </div>
            <div className="flex-shrink-0">
              <Link 
                href="/profile/edit" 
                className="inline-block border border-gray-300 rounded-full px-4 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                プロフィール編集
              </Link>
            </div>
          </div>
          
          {/* メールアドレス変更セクション */}
          <div className="flex items-center justify-between p-6 border-b border-gray-100">
            <div>
              <h3 className="font-medium">メールアドレスの変更</h3>
            </div>
            <div>
              <Link 
                href="/profile/email" 
                className="inline-block border border-gray-300 rounded-full px-4 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                メールアドレス変更
              </Link>
            </div>
          </div>
          
          {/* パスワード変更セクション */}
          <div className="flex items-center justify-between p-6 border-b border-gray-100">
            <div>
              <h3 className="font-medium">パスワードの変更</h3>
            </div>
            <div>
              <Link 
                href="/profile/password" 
                className="inline-block border border-gray-300 rounded-full px-4 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                パスワード変更
              </Link>
            </div>
          </div>
          
          {/* デート事前相談セクション */}
          <div className="flex items-center justify-between p-6 border-b border-gray-100">
            <div>
              <h3 className="font-medium">レンタル内容事前相談</h3>
            </div>
            <div>
              <Link 
                href="/consultation" 
                className="inline-block border border-gray-300 rounded-full px-4 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                事前相談フォームへ
              </Link>
            </div>
          </div>
        </div>
        
        {/* 利用の流れセクション */}
        <div className="max-w-3xl mx-auto mb-8">
          <h2 className="text-xl font-semibold mb-6">利用の流れ</h2>
          
          <div className="flex flex-wrap justify-between items-stretch">
            {/* ステップ1 */}
            <div className="w-full sm:w-1/4 p-2 mb-4">
              <div className="bg-white rounded-xl shadow-sm p-4 h-full flex flex-col items-center justify-center relative">
                <div className="absolute top-2 left-2 text-red-400 font-medium text-sm">step.01</div>
                <div className="mt-6 mb-2 text-center">
                  <p className="font-medium">キャストを選ぶ</p>
                </div>
              </div>
            </div>
            
            {/* 矢印 */}
            <div className="hidden sm:flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </div>
            
            {/* ステップ2 */}
            <div className="w-full sm:w-1/4 p-2 mb-4">
              <div className="bg-white rounded-xl shadow-sm p-4 h-full flex flex-col items-center justify-center relative">
                <div className="absolute top-2 left-2 text-red-400 font-medium text-sm">step.02</div>
                <div className="mt-6 mb-2 text-center">
                  <p className="font-medium">レンタル予約から</p>
                  <p className="font-medium">申込</p>
                </div>
              </div>
            </div>
            
            {/* 矢印 */}
            <div className="hidden sm:flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </div>
            
            {/* ステップ3 */}
            <div className="w-full sm:w-1/4 p-2 mb-4">
              <div className="bg-white rounded-xl shadow-sm p-4 h-full flex flex-col items-center justify-center relative">
                <div className="absolute top-2 left-2 text-red-400 font-medium text-sm">step.03</div>
                <div className="mt-6 mb-2 text-center">
                  <p className="font-medium">お支払い</p>
                  <p className="font-medium">(当日支払いも可)</p>
                </div>
              </div>
            </div>

          </div>
        </div>
        
        {/* 予約履歴セクション */}
        <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-sm overflow-hidden mb-8">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-xl font-semibold text-gray-800">予約履歴</h2>
          </div>
          
          <div className="p-6">
            {bookings.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">予約日</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">時間</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">場所</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ステータス</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">詳細</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {bookings.map((booking) => (
                      <tr key={booking.id}>
                        <td className="px-6 py-4 whitespace-nowrap">{booking.date}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{booking.start_time} ({booking.duration}時間)</td>
                        <td className="px-6 py-4 whitespace-nowrap">{booking.location}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            booking.status === 'confirmed' ? 'bg-green-100 text-green-800' : 
                            booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                            'bg-red-100 text-red-800'
                          }`}>
                            {booking.status === 'confirmed' ? '確定' : 
                             booking.status === 'pending' ? '確認待ち' : 'キャンセル'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-amber-500 hover:text-amber-600">
                          <Link href={`/booking/${booking.id}`}>詳細を見る</Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">予約履歴はありません。</p>
            )}
            
            <div className="mt-6 text-center">
              <Link href="/rental/booking" className="bg-amber-500 text-white px-4 py-2 rounded-md hover:bg-amber-600 transition-colors inline-block">
                新規予約をする
              </Link>
            </div>
          </div>
        </div>
        
        {/* ログアウトボタン */}
        <div className="max-w-3xl mx-auto text-center mt-8">
          <button 
            onClick={handleLogout}
            className="inline-flex items-center px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            ログアウト
          </button>
        </div>
      </div>
    </div>
  );
}
