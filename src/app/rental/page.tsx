'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../lib/supabase';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

// Zodスキーマの定義
const step1Schema = z.object({
  nickname: z.string().min(1, { message: 'ニックネームは必須です' }),
  birthdate: z.string().min(1, { message: '生年月日は必須です' }),
  gender: z.string().min(1, { message: '性別を選択してください' }),
  location: z.string().min(1, { message: '居住地は必須です' })
});

const step2Schema = z.object({
  interests: z.array(z.string()).min(1, { message: '少なくとも1つの趣味・興味を選択してください' }),
  usagePurposes: z.array(z.string()).min(1, { message: '少なくとも1つの利用用途を選択してください' })
});

const step3Schema = z.object({
  additionalInfo: z.string().optional()
});

const rentalFormSchema = z.object({
  ...step1Schema.shape,
  ...step2Schema.shape,
  ...step3Schema.shape
});

type RentalFormData = z.infer<typeof rentalFormSchema>;

export default function RentalPage() {
  const router = useRouter();
  const [session, setSession] = useState<{ user: { id: string } } | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentStep, setCurrentStep] = useState(1);
  
  // React Hook Formの設定
  const { 
    register, 
    handleSubmit, 
    formState: { errors },
    getValues,
    setValue,
    watch
  } = useForm<RentalFormData>({
    resolver: zodResolver(rentalFormSchema),
    defaultValues: {
      nickname: '',
      birthdate: '',
      gender: '',
      location: '',
      interests: [],
      usagePurposes: [],
      additionalInfo: ''
    },
    mode: 'onChange'
  });
  
  // フォームの値を監視
  const formValues = watch();
  
  // 趣味・興味の選択肢
  const interestOptions = [
    '映画', '観劇', 'アート', '音楽', 'カラオケ', '料理・グルメ', 'お酒', 'カフェ', 
    'スポーツ', 'スポーツ鑑賞', 'お笑い', 'その他', '動画・TV', '散歩', '旅行', 
    'サウナ', '温泉', '生き物・ペット', '天体・惑星', 'DIY', '歴史', '経済', 
    '投資', '政治', '読書', 'アニメ・漫画', 'イラスト', 'ゲーム', 'ボードゲーム', 
    'メイドカフェ', 'ボーカロイド', 'コミケ', 'アイドル推し活', 'コスプレ', 
    '特撮', 'カメラ', 'インターネット'
  ];
  
  // 利用用途の選択肢
  const usagePurposeOptions = [
    'デートをしたい',
    '悩み相談をしたい',
    '会話やデートの練習をしたい',
    '恋愛・婚活のコーチング',
    'イベントなどの同行',
    'その他'
  ];
  
  useEffect(() => {
    const getSession = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        if (error) throw error;
        
        setSession(data.session);
        
        if (data.session) {
          // プロフィール情報の取得
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', data.session.user.id)
            .single();
          
          if (profileError && profileError.code !== 'PGRST116') {
            throw profileError;
          }
          
          if (profileData) {
            // プロフィール情報をフォームに設定
            setValue('nickname', profileData.display_name || '');
            setValue('birthdate', profileData.birthdate || '');
            setValue('gender', profileData.gender || '');
            setValue('location', profileData.location || '');
            
            // 趣味・興味の取得
            const { data: interestsData } = await supabase
              .from('user_interests')
              .select('interest')
              .eq('user_id', data.session.user.id);
            
            if (interestsData && interestsData.length > 0) {
              const interests = interestsData.map(item => item.interest);
              setValue('interests', interests);
            }
            
            // 利用用途の取得
            const { data: purposesData } = await supabase
              .from('user_purposes')
              .select('purpose, additional_info')
              .eq('user_id', data.session.user.id);
            
            if (purposesData && purposesData.length > 0) {
              const purposes = purposesData.map(item => item.purpose);
              setValue('usagePurposes', purposes);
              
              if (purposesData[0].additional_info) {
                setValue('additionalInfo', purposesData[0].additional_info);
              }
            }
          }
        }
      } catch (error) {
        console.error('セッション取得エラー:', error);
      } finally {
        setLoading(false);
      }
    };

    getSession();
  }, [setValue, router]);
  
  // チェックボックスの変更ハンドラ
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>, fieldName: 'interests' | 'usagePurposes') => {
    const { value, checked } = e.target;
    const currentValues = getValues(fieldName) || [];
    
    if (checked) {
      // 追加
      setValue(fieldName, [...currentValues, value], { shouldValidate: true });
    } else {
      // 削除
      setValue(
        fieldName, 
        currentValues.filter(item => item !== value),
        { shouldValidate: true }
      );
    }
  };
  
  // ステップ移動関数
  const goToNextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };
  
  const goToPrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };
  
  // フォーム送信処理
  const onSubmit: SubmitHandler<RentalFormData> = async (data) => {
    if (!session) return;

    
    try {
      // プロフィール情報を更新
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({
          id: session.user.id,
          display_name: data.nickname,
          birthdate: data.birthdate || null,
          gender: data.gender || null,
          location: data.location || null,
          updated_at: new Date().toISOString()
        });
      
      if (profileError) throw profileError;
      
      // 既存の趣味・興味を削除（更新のため）
      if (data.interests.length > 0) {
        const { error: deleteInterestsError } = await supabase
          .from('user_interests')
          .delete()
          .eq('user_id', session.user.id);
        
        if (deleteInterestsError) throw deleteInterestsError;
        
        // 新しい趣味・興味を保存
        const interestsToInsert = data.interests.map(interest => ({
          user_id: session.user.id,
          interest
        }));
        
        const { error: insertInterestsError } = await supabase
          .from('user_interests')
          .insert(interestsToInsert);
        
        if (insertInterestsError) throw insertInterestsError;
      }
      
      // 既存の利用用途を削除（更新のため）
      if (data.usagePurposes.length > 0) {
        const { error: deletePurposesError } = await supabase
          .from('user_purposes')
          .delete()
          .eq('user_id', session.user.id);
        
        if (deletePurposesError) throw deletePurposesError;
        
        // 新しい利用用途を保存
        const purposesToInsert = data.usagePurposes.map(purpose => ({
          user_id: session.user.id,
          purpose,
          additional_info: data.additionalInfo
        }));
        
        const { error: insertPurposesError } = await supabase
          .from('user_purposes')
          .insert(purposesToInsert);
        
        if (insertPurposesError) throw insertPurposesError;
      }
      
      // 完了後に予約ページへリダイレクト
      router.push('/rental/booking');
      
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('情報の保存中にエラーが発生しました。もう一度お試しください。');
    }
  };
  
  if (loading) {
    return <div className="container mx-auto px-4 py-8 text-center">読み込み中...</div>;
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-center mb-8">あなたのことを教えてください</h1>
        
        {/* ステッププログレス */}
        <div className="flex items-center justify-between mb-8">
          <div className={`w-1/3 text-center ${currentStep >= 1 ? 'text-amber-500' : 'text-gray-400'}`}>
            <div className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center ${currentStep >= 1 ? 'bg-amber-500 text-white' : 'bg-gray-200 text-gray-500'}`}>1</div>
            <div className="mt-2 text-xs">情報・興味</div>
          </div>
          <div className={`w-1/3 text-center ${currentStep >= 2 ? 'text-amber-500' : 'text-gray-400'}`}>
            <div className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center ${currentStep >= 2 ? 'bg-amber-500 text-white' : 'bg-gray-200 text-gray-500'}`}>2</div>
            <div className="mt-2 text-xs">利用用途</div>
          </div>
          <div className={`w-1/3 text-center ${currentStep >= 3 ? 'text-amber-500' : 'text-gray-400'}`}>
            <div className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center ${currentStep >= 3 ? 'bg-amber-500 text-white' : 'bg-gray-200 text-gray-500'}`}>3</div>
            <div className="mt-2 text-xs">デート</div>
          </div>
        </div>
        
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* ステップ1: 基本情報 */}
          {currentStep === 1 && (
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4">基本情報</h2>
              
              <div className="mb-4">
                <label htmlFor="nickname" className="block text-sm font-medium text-gray-700 mb-1">ニックネーム <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  id="nickname"
                  {...register('nickname')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-amber-500 focus:border-amber-500"
                />
                {errors.nickname && (
                  <p className="text-red-500 text-xs mt-1">{errors.nickname.message}</p>
                )}
              </div>
              
              <div className="mb-4">
                <label htmlFor="birthdate" className="block text-sm font-medium text-gray-700 mb-1">生年月日 <span className="text-red-500">*</span></label>
                <input
                  type="date"
                  id="birthdate"
                  {...register('birthdate')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-amber-500 focus:border-amber-500"
                />
                {errors.birthdate && (
                  <p className="text-red-500 text-xs mt-1">{errors.birthdate.message}</p>
                )}
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">性別 <span className="text-red-500">*</span></label>
                <div className="flex space-x-4">
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      value="男性"
                      {...register('gender')}
                      className="h-4 w-4 text-amber-500 focus:ring-amber-400 border-gray-300"
                    />
                    <span className="ml-2 text-sm text-gray-700">男性</span>
                  </label>
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      value="女性"
                      {...register('gender')}
                      className="h-4 w-4 text-amber-500 focus:ring-amber-400 border-gray-300"
                    />
                    <span className="ml-2 text-sm text-gray-700">女性</span>
                  </label>
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      value="その他"
                      {...register('gender')}
                      className="h-4 w-4 text-amber-500 focus:ring-amber-400 border-gray-300"
                    />
                    <span className="ml-2 text-sm text-gray-700">その他</span>
                  </label>
                </div>
                {errors.gender && (
                  <p className="text-red-500 text-xs mt-1">{errors.gender.message}</p>
                )}
              </div>
              
              <div className="mb-4">
                <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">居住地 <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  id="location"
                  {...register('location')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-amber-500 focus:border-amber-500"
                  placeholder="例: 東京都渋谷区"
                />
                {errors.location && (
                  <p className="text-red-500 text-xs mt-1">{errors.location.message}</p>
                )}
              </div>
              
              <div className="mt-6 text-right">
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
          
          {/* ステップ2: 趣味・興味と利用用途 */}
          {currentStep === 2 && (
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4">趣味・興味 <span className="text-red-500 text-sm">複数選択可</span></h2>
              
              <div className="mb-6">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {interestOptions.map(interest => (
                    <div key={interest} className="flex items-center">
                      <input
                        type="checkbox"
                        id={`interest-${interest}`}
                        value={interest}
                        checked={formValues.interests?.includes(interest)}
                        onChange={(e) => handleCheckboxChange(e, 'interests')}
                        className="h-4 w-4 text-amber-500 focus:ring-amber-400 border-gray-300 rounded"
                      />
                      <label htmlFor={`interest-${interest}`} className="ml-2 text-sm text-gray-700">
                        {interest}
                      </label>
                    </div>
                  ))}
                </div>
                {errors.interests && (
                  <p className="text-red-500 text-xs mt-1">{errors.interests.message}</p>
                )}
              </div>
              
              <h2 className="text-xl font-semibold mb-4 mt-8">利用用途 <span className="text-red-500 text-sm">複数選択可</span></h2>
              
              <div className="mb-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {usagePurposeOptions.map(purpose => (
                    <div key={purpose} className="flex items-center mb-3">
                      <input
                        type="checkbox"
                        id={`purpose-${purpose}`}
                        value={purpose}
                        checked={formValues.usagePurposes?.includes(purpose)}
                        onChange={(e) => handleCheckboxChange(e, 'usagePurposes')}
                        className="h-5 w-5 text-amber-500 focus:ring-amber-400 border-gray-300 rounded"
                      />
                      <label htmlFor={`purpose-${purpose}`} className="ml-2 text-gray-700">
                        {purpose}
                      </label>
                    </div>
                  ))}
                </div>
                {errors.usagePurposes && (
                  <p className="text-red-500 text-xs mt-1">{errors.usagePurposes.message}</p>
                )}
              </div>
              
              <div className="mt-6 flex justify-between">
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
          
          {/* ステップ3: 追加情報 */}
          {currentStep === 3 && (
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4">具体的な希望</h2>
              
              <div className="mb-4">
                <label htmlFor="additionalInfo" className="block text-sm font-medium text-gray-700 mb-1">
                  ステップ2に関して、どんなことがしたいか具体的なことがあれば記載をお願いいたします。
                </label>
                <textarea
                  id="additionalInfo"
                  {...register('additionalInfo')}
                  rows={5}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-amber-500 focus:border-amber-500"
                  placeholder="例: カフェ巡りが好きなので、おしゃれなカフェに一緒に行きたいです。"
                />
              </div>
              
              <div className="mt-6 flex justify-between">
                <button
                  type="button"
                  onClick={goToPrevStep}
                  className="text-gray-600 px-6 py-2 rounded-full hover:bg-gray-100 focus:outline-none"
                >
                  戻る
                </button>
                <button
                  type="submit"
                  className="bg-amber-500 text-white px-6 py-2 rounded-full hover:bg-amber-600 focus:outline-none"
                >
                  完了
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
