'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../lib/supabase';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

// Zodスキーマの定義
const castSchema = z.object({
  castId: z.string().min(1, { message: 'キャストを選択してください' })
});

const scheduleSchema = z.object({
  plan: z.string().min(1, { message: 'プランを選択してください' }),
  date: z.string().min(1, { message: '日付を選択してください' }),
  startTime: z.string().min(1, { message: '開始時間を選択してください' }),
  duration: z.string().min(1, { message: '時間を選択してください' }),
  location: z.string().min(1, { message: '待ち合わせ場所を入力してください' })
});

const confirmationSchema = z.object({
  request: z.string().optional()
});

const bookingFormSchema = z.object({
  ...castSchema.shape,
  ...scheduleSchema.shape,
  ...confirmationSchema.shape
});

type BookingFormData = z.infer<typeof bookingFormSchema>;

// キャストデータの型定義
type Cast = {
  id: string;
  name: string;
  imageUrl: string;
};

export default function BookingPage() {
  const router = useRouter();
  const [session, setSession] = useState<{ user: { id: string } } | null>(null);
  const [profile, setProfile] = useState<{id: string; display_name?: string | null} | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentStep, setCurrentStep] = useState(1);
  const [casts, setCasts] = useState<Cast[]>([]);
  
  // React Hook Formの設定
  const { 
    register, 
    handleSubmit, 
    formState: { errors },
    getValues,
    setValue,
    watch,
    trigger
  } = useForm<BookingFormData>({
    resolver: zodResolver(bookingFormSchema),
    defaultValues: {
      castId: '',
      plan: 'standard',
      date: '',
      startTime: '',
      duration: '2',
      location: '',
      request: ''
    },
    mode: 'onChange'
  });
  
  // キャストデータの取得
  useEffect(() => {
    // ダミーデータを設定
    const dummyCasts: Cast[] = [
      { id: '1', name: '佐々木連', imageUrl: '/trainer/cast1.jpg' },
      { id: '2', name: '白石あやな', imageUrl: '/trainer/cast2.jpg' },
      { id: '3', name: '中村千花', imageUrl: '/trainer/cast3.jpg' },
      { id: '4', name: '羽山さつき', imageUrl: '/trainer/cast4.jpg' },
      { id: '5', name: '阿部なおみ', imageUrl: '/trainer/cast5.jpg' },
      { id: '6', name: '高橋沙奈', imageUrl: '/trainer/cast6.jpg' },
      { id: '7', name: '杉崎凛', imageUrl: '/trainer/cast7.jpg' },
      { id: '8', name: '上村美久', imageUrl: '/trainer/cast8.jpg' },
      { id: '9', name: '松本亜美', imageUrl: '/trainer/cast9.jpg' },
      { id: '10', name: '高崎のぞみ', imageUrl: '/trainer/cast10.jpg' },
      { id: '11', name: '石原さくら', imageUrl: '/trainer/cast11.jpg' },
      { id: '12', name: '桜井花実', imageUrl: '/trainer/cast12.jpg' },
    ];
    setCasts(dummyCasts);
  }, []);
  
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session: currentSession } } = await supabase.auth.getSession();
      setSession(currentSession);
      
      if (currentSession) {
        // プロフィール情報を取得
        const { data: profileData } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', currentSession.user.id)
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
  
  // ステップ移動関数
  const goToNextStep = async () => {
    if (currentStep < 3) {
      // 現在のステップのバリデーションを実行
      let isValid = false;
      
      if (currentStep === 1) {
        isValid = await trigger('castId');
      } else if (currentStep === 2) {
        isValid = await trigger(['plan', 'date', 'startTime', 'duration', 'location']);
      }
      
      if (isValid) {
        setCurrentStep(currentStep + 1);
      }
    }
  };
  
  const goToPrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };
  
  // フォーム送信処理
  const onSubmit: SubmitHandler<BookingFormData> = async (data) => {
    console.log('予約データ:', data);
    
    // TODO: Supabaseに予約データを送信
    try {
      // 予約データを保存
      const { error } = await supabase
        .from('bookings')
        .insert({
          user_id: profile?.id,
          cast_id: data.castId,
          plan: data.plan,
          date: data.date,
          start_time: data.startTime,
          duration: data.duration,
          location: data.location,
          request: data.request || '',
          status: 'pending'
        });
        
      if (error) {
        console.error('予約エラー:', error);
        alert('予約に失敗しました。再度お試しください。');
      } else {
        alert('予約が完了しました。');
        router.push('/mypage'); // マイページにリダイレクト
      }
    } catch (err) {
      console.error('予約エラー:', err);
      alert('予約に失敗しました。再度お試しください。');
    }
  };
  
  if (loading) {
    return <div className="container mx-auto px-4 py-8 text-center">読み込み中...</div>;
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center mb-8">レンタル予約</h1>
        
        {/* ステップインジケーター */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex-1">
            <div className={`h-2 ${currentStep >= 1 ? 'bg-amber-500' : 'bg-gray-200'} rounded-l-full`}></div>
            <p className="text-center text-sm mt-1">キャスト選択</p>
          </div>
          <div className="flex-1">
            <div className={`h-2 ${currentStep >= 2 ? 'bg-amber-500' : 'bg-gray-200'}`}></div>
            <p className="text-center text-sm mt-1">日程選択</p>
          </div>
          <div className="flex-1">
            <div className={`h-2 ${currentStep >= 3 ? 'bg-amber-500' : 'bg-gray-200'} rounded-r-full`}></div>
            <p className="text-center text-sm mt-1">お支払い</p>
          </div>
        </div>
        
        {profile && (
          <div className="mb-6">
            <p className="text-lg mb-2">こんにちは、<span className="font-semibold">{profile.display_name}</span>さん</p>
            <p className="text-gray-600">以下のフォームからレンタルの予約を行ってください</p>
          </div>
        )}
        
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* ステップ 1: キャスト選択 */}
          {currentStep === 1 && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4 pb-2 border-b border-gray-200">キャストを選択</h2>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-6">
                {casts.map(cast => (
                  <div key={cast.id} className="text-center">
                    <input
                      type="radio"
                      id={`cast-${cast.id}`}
                      value={cast.id}
                      {...register('castId')}
                      className="sr-only"
                    />
                    <label
                      htmlFor={`cast-${cast.id}`}
                      className={`block cursor-pointer ${
                        watch('castId') === cast.id
                          ? 'ring-2 ring-amber-500'
                          : 'hover:opacity-80'
                      }`}
                    >
                      <div className="relative pb-[100%] overflow-hidden rounded-full mb-2">
                        <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
                          <span className="text-3xl">👩</span>
                        </div>
                      </div>
                      <p className="text-sm font-medium">{cast.name}</p>
                    </label>
                  </div>
                ))}
              </div>
              
              {errors.castId && (
                <p className="text-red-500 text-sm mt-1">{errors.castId.message}</p>
              )}
              
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={goToNextStep}
                  className="bg-amber-500 text-white px-6 py-2 rounded-full hover:bg-amber-600 focus:outline-none"
                >
                  次へ
                </button>
              </div>
            </div>
          )}
          
          {/* ステップ 2: 日程選択 */}
          {currentStep === 2 && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4 pb-2 border-b border-gray-200">日程を選択</h2>
              
              <div className="mb-6">
                <h3 className="font-medium text-lg mb-3">プランを選択</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="border border-gray-200 rounded-lg p-4 hover:border-amber-500 hover:shadow-md transition cursor-pointer">
                    <input
                      type="radio"
                      id="plan-standard"
                      value="standard"
                      {...register('plan')}
                      className="sr-only"
                    />
                    <label
                      htmlFor="plan-standard"
                      className={`block cursor-pointer ${
                        watch('plan') === 'standard' ? 'text-amber-500' : ''
                      }`}
                    >
                      <h3 className="font-semibold text-lg mb-2">スタンダードプラン</h3>
                      <p className="text-gray-600 mb-2">1時間 3,000円〜</p>
                      <ul className="text-sm text-gray-500 list-disc list-inside">
                        <li>カフェでのお話</li>
                        <li>散歩</li>
                        <li>ショッピング同行</li>
                      </ul>
                    </label>
                  </div>
                  
                  <div className="border border-gray-200 rounded-lg p-4 hover:border-amber-500 hover:shadow-md transition cursor-pointer">
                    <input
                      type="radio"
                      id="plan-premium"
                      value="premium"
                      {...register('plan')}
                      className="sr-only"
                    />
                    <label
                      htmlFor="plan-premium"
                      className={`block cursor-pointer ${
                        watch('plan') === 'premium' ? 'text-amber-500' : ''
                      }`}
                    >
                      <h3 className="font-semibold text-lg mb-2">プレミアムプラン</h3>
                      <p className="text-gray-600 mb-2">1時間 5,000円〜</p>
                      <ul className="text-sm text-gray-500 list-disc list-inside">
                        <li>レストランでの食事</li>
                        <li>映画・美術館</li>
                        <li>アクティビティ</li>
                      </ul>
                    </label>
                  </div>
                </div>
                {errors.plan && (
                  <p className="text-red-500 text-sm mt-1">{errors.plan.message}</p>
                )}
              </div>
              
              <div className="mb-6">
                <h3 className="font-medium text-lg mb-3">日時を選択</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">日付</label>
                    <input
                      type="date"
                      id="date"
                      {...register('date')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-amber-500 focus:border-amber-500"
                    />
                    {errors.date && (
                      <p className="text-red-500 text-xs mt-1">{errors.date.message}</p>
                    )}
                  </div>
                  
                  <div>
                    <label htmlFor="startTime" className="block text-sm font-medium text-gray-700 mb-1">開始時間</label>
                    <input
                      type="time"
                      id="startTime"
                      {...register('startTime')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-amber-500 focus:border-amber-500"
                    />
                    {errors.startTime && (
                      <p className="text-red-500 text-xs mt-1">{errors.startTime.message}</p>
                    )}
                  </div>
                  
                  <div>
                    <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-1">時間</label>
                    <select
                      id="duration"
                      {...register('duration')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-amber-500 focus:border-amber-500"
                    >
                      <option value="1">1時間</option>
                      <option value="2">2時間</option>
                      <option value="3">3時間</option>
                      <option value="4">4時間</option>
                    </select>
                    {errors.duration && (
                      <p className="text-red-500 text-xs mt-1">{errors.duration.message}</p>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="mb-6">
                <h3 className="font-medium text-lg mb-3">場所</h3>
                <div className="mb-4">
                  <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">待ち合わせ場所</label>
                  <input
                    type="text"
                    id="location"
                    placeholder="例: 渋谷駅ハチ公前"
                    {...register('location')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-amber-500 focus:border-amber-500"
                  />
                  {errors.location && (
                    <p className="text-red-500 text-xs mt-1">{errors.location.message}</p>
                  )}
                </div>
              </div>
              
              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={goToPrevStep}
                  className="text-gray-600 px-6 py-2 rounded-full hover:bg-gray-100 focus:outline-none"
                >
                  戻る
                </button>
                <button
                  type="button"
                  onClick={goToNextStep}
                  className="bg-amber-500 text-white px-6 py-2 rounded-full hover:bg-amber-600 focus:outline-none"
                >
                  次へ
                </button>
              </div>
            </div>
          )}
          
          {/* ステップ 3: 確認とお支払い */}
          {currentStep === 3 && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4 pb-2 border-b border-gray-200">確認とお支払い</h2>
              
              <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <h3 className="font-medium text-lg mb-3">予約内容</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-500">キャスト</p>
                    <p className="font-medium">
                      {casts.find(c => c.id === watch('castId'))?.name || '選択されていません'}
                    </p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-500">プラン</p>
                    <p className="font-medium">
                      {watch('plan') === 'standard' ? 'スタンダードプラン' : 'プレミアムプラン'}
                    </p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-500">日付</p>
                    <p className="font-medium">{watch('date')}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-500">時間</p>
                    <p className="font-medium">{watch('startTime')} ({watch('duration')}時間)</p>
                  </div>
                  
                  <div className="md:col-span-2">
                    <p className="text-sm text-gray-500">場所</p>
                    <p className="font-medium">{watch('location')}</p>
                  </div>
                </div>
                
                <div className="border-t border-gray-200 pt-4 mt-4">
                  <p className="text-sm text-gray-500">料金</p>
                  <p className="font-medium text-lg">
                    {watch('plan') === 'standard' ? '3,000' : '5,000'} 円 × {watch('duration')}時間 = 
                    <span className="text-amber-500 font-bold">
                      {(watch('plan') === 'standard' ? 3000 : 5000) * parseInt(watch('duration') || '1')}円
                    </span>
                  </p>
                </div>
              </div>
              
              <div className="mb-6">
                <label htmlFor="request" className="block text-sm font-medium text-gray-700 mb-1">
                  特別なリクエストがあれば記入してください
                </label>
                <textarea
                  id="request"
                  rows={4}
                  placeholder="例: カフェでお話した後、近くの本屋さんに行きたいです。"
                  {...register('request')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-amber-500 focus:border-amber-500"
                />
              </div>
              
              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={goToPrevStep}
                  className="text-gray-600 px-6 py-2 rounded-full hover:bg-gray-100 focus:outline-none"
                >
                  戻る
                </button>
                <button
                  type="submit"
                  className="bg-amber-500 text-white px-8 py-3 rounded-full hover:bg-amber-600 focus:outline-none"
                >
                  予約を確定する
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}