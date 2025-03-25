'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../lib/supabase';
import { getCurrentUserInfo, UserInfo } from '../../lib/userService';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

// Zodスキーマの定義
const castSchema = z.object({
  castId: z.string().min(1, { message: 'キャストを選択してください' })
});

const scheduleSchema = z.object({
  date: z.string().min(1, { message: '日付を選択してください' }),
  startTime: z.string().min(1, { message: '開始時間を選択してください' }),
  duration: z.string().min(1, { message: '時間を選択してください' }),
  location: z.string().min(1, { message: '待ち合わせ場所を選択してください' }),
  date2: z.string().optional(),
  startTime2: z.string().optional(),
  date3: z.string().optional(),
  startTime3: z.string().optional(),
  alternateTime: z.string().optional(),
  secondCastId: z.string().optional(),
  budget: z.string().optional(),
  extension: z.string().optional(),
  meetingLocation: z.string().min(1, { message: '待ち合わせ場所のエリアを選択してください' })
});

const confirmationSchema = z.object({
  request: z.string().optional(),
  paymentMethod: z.string().min(1, { message: 'お支払い方法を選択してください' }),
  customerName: z.string().min(1, { message: 'お名前を入力してください' }),
  customerEmail: z.string().email({ message: '有効なメールアドレスを入力してください' }),
  customerPhone: z.string().min(1, { message: '電話番号を入力してください' })
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
  const [, setSession] = useState<{ user: { id: string } } | null>(null);
  const [profile, setProfile] = useState<{id: string; display_name?: string | null} | null>(null);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentStep, setCurrentStep] = useState(1);
  const [casts, setCasts] = useState<Cast[]>([]);
  
  // React Hook Formの設定
  const { 
    register, 
    handleSubmit, 
    formState: { errors },
    watch,
    trigger,
    setValue
  } = useForm<BookingFormData>({
    resolver: zodResolver(bookingFormSchema),
    defaultValues: {
      castId: '',
      secondCastId: '',
      date: '',
      startTime: '',
      date2: '',
      startTime2: '',
      date3: '',
      startTime3: '',
      alternateTime: '別時間帯も検討可能',
      duration: '2',
      location: '',
      meetingLocation: '23区内',
      budget: '',
      extension: 'はい',
      request: '',
      paymentMethod: '当日 - 現金支払い',
      customerName: profile?.display_name || '',
      customerEmail: '',
      customerPhone: ''
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
          .from('customer_profiles')
          .select('*')
          .eq('id', currentSession.user.id)
          .single();
        
        setProfile(profileData);
        
        // userServiceを使ってユーザー情報を取得
        const userInfoData = await getCurrentUserInfo();
        setUserInfo(userInfoData);
        
        // ユーザー情報があればフォームに設定
        if (userInfoData) {
          setValue('customerName', userInfoData.display_name || '');
          setValue('customerEmail', userInfoData.email || '');
          setValue('customerPhone', userInfoData.phone_number || '');
        }
        
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
  }, [router, setValue]);
  
  // ステップ移動関数
  const goToNextStep = async () => {
    if (currentStep < 3) {
      // 現在のステップのバリデーションを実行
      let isValid = false;
      
      if (currentStep === 1) {
        isValid = await trigger('castId');
      } else if (currentStep === 2) {
        isValid = await trigger(['date', 'startTime', 'duration', 'location']);
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
          second_cast_id: data.secondCastId || null,
          date: data.date,
          start_time: data.startTime,
          date2: data.date2 || null,
          start_time2: data.startTime2 || null,
          date3: data.date3 || null,
          start_time3: data.startTime3 || null,
          alternate_time: data.alternateTime,
          duration: parseInt(data.duration),
          location: data.location,
          meeting_location: data.meetingLocation,
          budget: data.budget,
          extension: data.extension,
          payment_method: data.paymentMethod,
          request: data.request || '',
          status: 'pending',
          created_at: new Date().toISOString()
        });
        
      if (error) {
        console.error('予約エラー:', error);
        console.error('エラー詳細:', JSON.stringify(error, null, 2));
        alert(`予約に失敗しました: ${error.message}`);
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
              
              <div className="mb-6">
                <h3 className="font-medium text-lg mb-3">第1希望のキャスト</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-4">
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
              </div>
              
              <div className="mb-6">
                <h3 className="font-medium text-lg mb-3">第2希望のキャスト（任意）</h3>
                <p className="text-sm text-gray-600 mb-3">第1希望のキャストが予約できない場合の代替キャストを選択できます</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-4">
                  {casts.map(cast => (
                    <div key={`second-${cast.id}`} className="text-center">
                      <input
                        type="radio"
                        id={`second-cast-${cast.id}`}
                        value={cast.id}
                        {...register('secondCastId')}
                        className="sr-only"
                      />
                      <label
                        htmlFor={`second-cast-${cast.id}`}
                        className={`block cursor-pointer ${
                          watch('secondCastId') === cast.id
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
              </div>
              
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
                            
              <div className="mb-8 bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                <div className="bg-amber-50 px-4 py-3 border-b border-amber-100">
                  <h3 className="font-medium text-lg text-amber-800">希望日時を選択（最大3つまで）</h3>
                </div>
                
                <div className="p-4">
                  <div className="border-l-4 border-gray-300 pl-4 mb-6 bg-gray-50 p-3 rounded-r">
                    <h4 className="font-medium mb-2">第1希望</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
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
                        <select
                          id="startTime"
                          {...register('startTime')}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-amber-500 focus:border-amber-500"
                        >
                          <option value="">選択してください</option>
                          <option value="10:00">10:00</option>
                          <option value="10:30">10:30</option>
                          <option value="11:00">11:00</option>
                          <option value="11:30">11:30</option>
                          <option value="12:00">12:00</option>
                          <option value="12:30">12:30</option>
                          <option value="13:00">13:00</option>
                          <option value="13:30">13:30</option>
                          <option value="14:00">14:00</option>
                          <option value="14:30">14:30</option>
                          <option value="15:00">15:00</option>
                          <option value="15:30">15:30</option>
                          <option value="16:00">16:00</option>
                          <option value="16:30">16:30</option>
                          <option value="17:00">17:00</option>
                          <option value="17:30">17:30</option>
                          <option value="18:00">18:00</option>
                          <option value="18:30">18:30</option>
                          <option value="19:00">19:00</option>
                          <option value="19:30">19:30</option>
                          <option value="20:00">20:00</option>
                        </select>
                        {errors.startTime && (
                          <p className="text-red-500 text-xs mt-1">{errors.startTime.message}</p>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="border-l-4 border-gray-300 pl-4 mb-6 bg-gray-50 p-3 rounded-r">
                    <h4 className="font-medium mb-2 text-gray-700">第2希望</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
                      <div>
                        <label htmlFor="date2" className="block text-sm font-medium text-gray-700 mb-1">日付</label>
                        <input
                          type="date"
                          id="date2"
                          {...register('date2')}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-amber-500 focus:border-amber-500"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="startTime2" className="block text-sm font-medium text-gray-700 mb-1">開始時間</label>
                        <select
                          id="startTime2"
                          {...register('startTime2')}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-amber-500 focus:border-amber-500"
                        >
                          <option value="">選択してください</option>
                          <option value="10:00">10:00</option>
                          <option value="10:30">10:30</option>
                          <option value="11:00">11:00</option>
                          <option value="11:30">11:30</option>
                          <option value="12:00">12:00</option>
                          <option value="12:30">12:30</option>
                          <option value="13:00">13:00</option>
                          <option value="13:30">13:30</option>
                          <option value="14:00">14:00</option>
                          <option value="14:30">14:30</option>
                          <option value="15:00">15:00</option>
                          <option value="15:30">15:30</option>
                          <option value="16:00">16:00</option>
                          <option value="16:30">16:30</option>
                          <option value="17:00">17:00</option>
                          <option value="17:30">17:30</option>
                          <option value="18:00">18:00</option>
                          <option value="18:30">18:30</option>
                          <option value="19:00">19:00</option>
                          <option value="19:30">19:30</option>
                          <option value="20:00">20:00</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  
                  <div className="border-l-4 border-gray-300 pl-4 mb-6 bg-gray-50 p-3 rounded-r">
                    <h4 className="font-medium mb-2 text-gray-700">第3希望</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
                      <div>
                        <label htmlFor="date3" className="block text-sm font-medium text-gray-700 mb-1">日付</label>
                        <input
                          type="date"
                          id="date3"
                          {...register('date3')}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-amber-500 focus:border-amber-500"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="startTime3" className="block text-sm font-medium text-gray-700 mb-1">開始時間</label>
                        <select
                          id="startTime3"
                          {...register('startTime3')}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-amber-500 focus:border-amber-500"
                        >
                          <option value="">選択してください</option>
                          <option value="10:00">10:00</option>
                          <option value="10:30">10:30</option>
                          <option value="11:00">11:00</option>
                          <option value="11:30">11:30</option>
                          <option value="12:00">12:00</option>
                          <option value="12:30">12:30</option>
                          <option value="13:00">13:00</option>
                          <option value="13:30">13:30</option>
                          <option value="14:00">14:00</option>
                          <option value="14:30">14:30</option>
                          <option value="15:00">15:00</option>
                          <option value="15:30">15:30</option>
                          <option value="16:00">16:00</option>
                          <option value="16:30">16:30</option>
                          <option value="17:00">17:00</option>
                          <option value="17:30">17:30</option>
                          <option value="18:00">18:00</option>
                          <option value="18:30">18:30</option>
                          <option value="19:00">19:00</option>
                          <option value="19:30">19:30</option>
                          <option value="20:00">20:00</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mb-8 bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                <div className="bg-amber-50 px-4 py-3 border-b border-amber-100">
                  <h3 className="font-medium text-lg text-amber-800">レンタル詳細</h3>
                </div>
                
                <div className="p-4">
                  <div className="mb-5 pb-4 border-b border-gray-100">
                    <label className="block text-sm font-medium text-gray-700 mb-2">ご希望の日時以外でも可能な日時はありますか？</label>
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <input
                          type="radio"
                          id="alt-time-1"
                          value="別時間帯も検討可能"
                          {...register('alternateTime')}
                          className="mr-2"
                        />
                        <label htmlFor="alt-time-1" className="text-sm">別時間帯も検討可能</label>
                      </div>
                      <div className="flex items-center">
                        <input
                          type="radio"
                          id="alt-time-2"
                          value="別日時も検討可能"
                          {...register('alternateTime')}
                          className="mr-2"
                        />
                        <label htmlFor="alt-time-2" className="text-sm">別日時も検討可能</label>
                      </div>
                      <div className="flex items-center">
                        <input
                          type="radio"
                          id="alt-time-3"
                          value="希望日時以外は不可"
                          {...register('alternateTime')}
                          className="mr-2"
                        />
                        <label htmlFor="alt-time-3" className="text-sm">希望日時以外は不可</label>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mb-5 pb-4 border-b border-gray-100">
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
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">延長可能性はありますか？</label>
                    <div className="flex space-x-4">
                      <div className="flex items-center">
                        <input
                          type="radio"
                          id="extension-yes"
                          value="はい"
                          {...register('extension')}
                          className="mr-2"
                        />
                        <label htmlFor="extension-yes" className="text-sm">はい</label>
                      </div>
                      <div className="flex items-center">
                        <input
                          type="radio"
                          id="extension-no"
                          value="いいえ"
                          {...register('extension')}
                          className="mr-2"
                        />
                        <label htmlFor="extension-no" className="text-sm">いいえ</label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mb-8 bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                <div className="bg-amber-50 px-4 py-3 border-b border-amber-100">
                  <h3 className="font-medium text-lg text-amber-800">場所と予算</h3>
                </div>
                
                <div className="p-4">
                  <div className="mb-5 pb-4 border-b border-gray-100">
                    <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">待ち合わせ場所</label>
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
                  
                  <div className="mb-5 pb-4 border-b border-gray-100">
                    <label className="block text-sm font-medium text-gray-700 mb-2">レンタル場所</label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="border border-gray-200 rounded-lg p-3 hover:border-amber-500 hover:bg-amber-50 transition cursor-pointer">
                        <input
                          type="radio"
                          id="meeting-location-1"
                          value="23区内"
                          {...register('meetingLocation')}
                          className="sr-only"
                        />
                        <label htmlFor="meeting-location-1" className="block cursor-pointer">
                          <div className="font-medium mb-1">23区内</div>
                          <div className="text-amber-600 text-sm">3,000円</div>
                        </label>
                      </div>
                      
                      <div className="border border-gray-200 rounded-lg p-3 hover:border-amber-500 hover:bg-amber-50 transition cursor-pointer">
                        <input
                          type="radio"
                          id="meeting-location-2"
                          value="23区外"
                          {...register('meetingLocation')}
                          className="sr-only"
                        />
                        <label htmlFor="meeting-location-2" className="block cursor-pointer">
                          <div className="font-medium mb-1">23区外</div>
                          <div className="text-amber-600 text-sm">5,000円～</div>
                        </label>
                      </div>
                    </div>
                    {errors.meetingLocation && (
                      <p className="text-red-500 text-xs mt-2">{errors.meetingLocation.message}</p>
                    )}
                  </div>
                  
                  <div>
                    <label htmlFor="budget" className="block text-sm font-medium text-gray-700 mb-2">予算</label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">¥</span>
                      <input
                        type="text"
                        id="budget"
                        placeholder="予算を入力してください"
                        {...register('budget')}
                        className="w-full pl-8 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-amber-500 focus:border-amber-500"
                      />
                    </div>
                    {errors.budget && (
                      <p className="text-red-500 text-xs mt-1">{errors.budget.message}</p>
                    )}
                  </div>
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
              
              <div className="mb-8 bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                <div className="bg-amber-50 px-4 py-3 border-b border-amber-100">
                  <h3 className="font-medium text-lg text-amber-800">キャスト情報</h3>
                </div>
                
                <div className="p-4">
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-500 mb-1">第1希望キャスト</p>
                      <p className="font-medium text-lg">
                        {casts.find(c => c.id === watch('castId'))?.name || '選択されていません'}
                      </p>
                    </div>
                    
                    {watch('secondCastId') && (
                      <div className="flex-1 p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-500 mb-1">第2希望キャスト</p>
                        <p className="font-medium text-lg">
                          {casts.find(c => c.id === watch('secondCastId'))?.name || '選択されていません'}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="mb-8 bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                <div className="bg-amber-50 px-4 py-3 border-b border-amber-100">
                  <h3 className="font-medium text-lg text-amber-800">日時と時間</h3>
                </div>
                
                <div className="p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                    <div className="flex flex-col gap-4">
                      <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                        <p className="text-sm text-gray-500 mb-1">第1希望日時</p>
                        <p className="font-medium text-lg">{watch('date')} {watch('startTime')}</p>
                      </div>
                      
                      {watch('date2') && watch('startTime2') && (
                        <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                          <p className="text-sm text-gray-500 mb-1">第2希望日時</p>
                          <p className="font-medium text-lg">{watch('date2')} {watch('startTime2')}</p>
                        </div>
                      )}
                      
                      {watch('date3') && watch('startTime3') && (
                        <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                          <p className="text-sm text-gray-500 mb-1">第3希望日時</p>
                          <p className="font-medium text-lg">{watch('date3')} {watch('startTime3')}</p>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-500 mb-1">別日時の可能性</p>
                      <p className="font-medium">{watch('alternateTime')}</p>
                    </div>
                    
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-500 mb-1">時間</p>
                      <p className="font-medium">{watch('duration')}時間</p>
                    </div>
                    
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-500 mb-1">延長可能性</p>
                      <p className="font-medium">{watch('extension')}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mb-8 bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                <div className="bg-amber-50 px-4 py-3 border-b border-amber-100">
                  <h3 className="font-medium text-lg text-amber-800">場所と予算</h3>
                </div>
                
                <div className="p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-500 mb-1">待ち合わせ場所</p>
                      <p className="font-medium">{watch('location')}</p>
                    </div>
                    
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-500 mb-1">レンタル場所</p>
                      <p className="font-medium">{watch('meetingLocation')}</p>
                    </div>
                  </div>
                  
                  {watch('budget') && (
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-500 mb-1">予算</p>
                      <p className="font-medium">¥{watch('budget')}</p>
                    </div>
                  )}
                  
                  <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-amber-100">
                    <p className="text-sm text-gray-500 font-medium mb-1">料金</p>
                    <p className="font-medium text-lg">
                      3,000 円 × {watch('duration')}時間 = 
                      <span className="text-amber-600 font-bold ml-1">
                        {3000 * parseInt(watch('duration') || '1')}円
                      </span>
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="mb-8 bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                <div className="bg-amber-50 px-4 py-3 border-b border-amber-100">
                  <h3 className="font-medium text-lg text-amber-800">お支払い方法</h3>
                </div>
                
                <div className="p-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="border border-gray-200 rounded-lg p-3 hover:border-amber-500 hover:bg-amber-50 transition cursor-pointer">
                      <input
                        type="radio"
                        id="payment-cash"
                        value="当日 - 現金支払い"
                        {...register('paymentMethod')}
                        className="sr-only"
                      />
                      <label htmlFor="payment-cash" className="block cursor-pointer">
                        <div className="font-medium mb-1">当日 - 現金支払い</div>
                        <div className="text-gray-500 text-sm">レンタル当日に現金でお支払い</div>
                      </label>
                    </div>
                    
                    <div className="border border-gray-200 rounded-lg p-3 hover:border-amber-500 hover:bg-amber-50 transition cursor-pointer">
                      <input
                        type="radio"
                        id="payment-card"
                        value="事前 - クレジットカード"
                        {...register('paymentMethod')}
                        className="sr-only"
                      />
                      <label htmlFor="payment-card" className="block cursor-pointer">
                        <div className="font-medium mb-1">事前 - クレジットカード</div>
                        <div className="text-gray-500 text-sm">予約確定後にカード決済</div>
                      </label>
                    </div>
                    
                    <div className="border border-gray-200 rounded-lg p-3 hover:border-amber-500 hover:bg-amber-50 transition cursor-pointer">
                      <input
                        type="radio"
                        id="payment-bank"
                        value="事前 - 銀行振込"
                        {...register('paymentMethod')}
                        className="sr-only"
                      />
                      <label htmlFor="payment-bank" className="block cursor-pointer">
                        <div className="font-medium mb-1">事前 - 銀行振込</div>
                        <div className="text-gray-500 text-sm">予約確定後に振込決済</div>
                      </label>
                    </div>
                  </div>
                  {errors.paymentMethod && (
                    <p className="text-red-500 text-xs mt-2">{errors.paymentMethod.message}</p>
                  )}
                </div>
              </div>
              
              <div className="mb-8 bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                <div className="bg-amber-50 px-4 py-3 border-b border-amber-100">
                  <h3 className="font-medium text-lg text-amber-800">その他リクエスト</h3>
                </div>
                
                <div className="p-4">
                  <textarea
                    id="request"
                    rows={4}
                    placeholder="例: カフェでお話した後、近くの本屋さんに行きたいです。"
                    {...register('request')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-amber-500 focus:border-amber-500"
                  />
                </div>
              </div>
              
              <div className="mb-8 bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                <div className="bg-amber-50 px-4 py-3 border-b border-amber-100">
                  <h3 className="font-medium text-lg text-amber-800">お客様情報の確認</h3>
                </div>
                
                <div className="p-4">
                  <div className="grid grid-cols-1 gap-4 mb-4">
                    <div className="border-b border-gray-200 pb-3">
                      <p className="text-sm font-medium text-gray-700 mb-1">お名前（ニックネーム）</p>
                      <p className="text-base font-medium">{watch('customerName')}</p>
                      <input type="hidden" {...register('customerName')} />
                      {errors.customerName && (
                        <p className="text-red-500 text-xs mt-1">{errors.customerName.message}</p>
                      )}
                    </div>
                    
                    <div className="border-b border-gray-200 pb-3">
                      <p className="text-sm font-medium text-gray-700 mb-1">メールアドレス</p>
                      <p className="text-base">{watch('customerEmail')}</p>
                      <input type="hidden" {...register('customerEmail')} />
                      {errors.customerEmail && (
                        <p className="text-red-500 text-xs mt-1">{errors.customerEmail.message}</p>
                      )}
                    </div>
                    
                    <div className="pb-3">
                      <p className="text-sm font-medium text-gray-700 mb-1">電話番号</p>
                      <p className="text-base">{watch('customerPhone')}</p>
                      <input type="hidden" {...register('customerPhone')} />
                      {errors.customerPhone && (
                        <p className="text-red-500 text-xs mt-1">{errors.customerPhone.message}</p>
                      )}
                    </div>
                    
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">情報を変更する場合は、プロフィール設定から行ってください。</p>
                    </div>
                  </div>
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