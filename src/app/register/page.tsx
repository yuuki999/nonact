'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

// Zodスキーマの定義
const registerFormSchema = z.object({
  name: z.string().min(1, { message: '名前は必須です' }),
  email: z.string().email({ message: '有効なメールアドレスを入力してください' }),
  age: z.string().min(1, { message: '年齢は必須です' }),
  height: z.string().min(1, { message: '身長は必須です' }),
  hobbies: z.string().min(1, { message: '趣味は必須です' }),
  description: z.string().min(10, { message: '自己紹介は10文字以上入力してください' })
});

type RegisterFormData = z.infer<typeof registerFormSchema>;

export default function RegisterPage() {
  const [step, setStep] = useState(1);
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState<{ success: boolean; message: string } | null>(null);
  
  // React Hook Formの設定
  const { 
    register, 
    handleSubmit: handleFormSubmit, 
    formState: { errors, isValid },
    getValues
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerFormSchema),
    mode: 'onChange'
  });
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setProfileImage(e.target.files[0]);
    }
  };
  
  const onSubmit = async (data: RegisterFormData) => {
    if (!profileImage) {
      alert('プロフィール画像は必須です');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // 画像をBase64に変換
      const profileImageBase64 = await convertFileToBase64(profileImage);
      
      // APIリクエストの準備
      const requestData = {
        ...data,
        profileImageBase64
      };
      
      // API呼び出し
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || '登録処理中にエラーが発生しました');
      }
      
      // 成功
      setSubmitResult({
        success: true,
        message: result.message || '登録が完了しました。確認メールをご確認ください。'
      });
      
      // 最終ステップに進む
      setStep(2);
    } catch (error) {
      console.error('登録エラー:', error);
      setSubmitResult({
        success: false,
        message: error instanceof Error ? error.message : '登録中にエラーが発生しました。後でもう一度お試しください。'
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // ファイルをBase64に変換する関数
  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };
  

  
  return (
    <div className="container mx-auto px-4 py-12">      
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold mb-4">レンタル何もしない人® 登録</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          あなたも「何もしない人」として登録しませんか？<br />
          登録後、審査を経て承認されると、レンタル何もしない人としてサービスを提供できます。<br />
          料金の50%があなたの収入になります。
        </p>
      </div>
      
      {/* ステップインジケーター */}
      <div className="flex mb-8 max-w-2xl mx-auto">
        <div className={`flex-1 text-center pb-4 ${step >= 1 ? 'border-b-2 border-amber-500' : 'border-b border-gray-200'}`}>
          <span className={`inline-block w-8 h-8 rounded-full mb-2 ${step >= 1 ? 'bg-amber-500 text-white' : 'bg-gray-200'} flex items-center justify-center`}>1</span>
          <p className={step >= 1 ? 'text-amber-500' : 'text-gray-500'}>基本情報</p>
        </div>
        <div className={`flex-1 text-center pb-4 ${step >= 2 ? 'border-b-2 border-amber-500' : 'border-b border-gray-200'}`}>
          <span className={`inline-block w-8 h-8 rounded-full mb-2 ${step >= 2 ? 'bg-amber-500 text-white' : 'bg-gray-200'} flex items-center justify-center`}>2</span>
          <p className={step >= 2 ? 'text-amber-500' : 'text-gray-500'}>完了</p>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden max-w-2xl mx-auto">
        <form onSubmit={handleFormSubmit(onSubmit)}>
          {/* ステップ1: 基本情報 */}
          {step === 1 && (
            <div className="p-6">
              <h2 className="text-xl font-bold mb-6">基本情報を入力</h2>
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    お名前 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    {...register('name')}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message as string}</p>}
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    メールアドレス <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    {...register('email')}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="example@example.com"
                  />
                  {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message as string}</p>}
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-1">
                      年齢 <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      id="age"
                      {...register('age')}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 ${errors.age ? 'border-red-500' : 'border-gray-300'}`}
                    />
                    {errors.age && <p className="text-red-500 text-xs mt-1">{errors.age.message as string}</p>}
                  </div>
                  
                  <div>
                    <label htmlFor="height" className="block text-sm font-medium text-gray-700 mb-1">
                      身長(cm) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      id="height"
                      {...register('height')}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 ${errors.height ? 'border-red-500' : 'border-gray-300'}`}
                    />
                    {errors.height && <p className="text-red-500 text-xs mt-1">{errors.height.message as string}</p>}
                  </div>
                </div>
                
                <div>
                  <label htmlFor="hobbies" className="block text-sm font-medium text-gray-700 mb-1">
                    趣味 (カンマ区切りで入力) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="hobbies"
                    {...register('hobbies')}
                    placeholder="例: 読書, 散歩, 音楽鑑賞"
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 ${errors.hobbies ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  {errors.hobbies && <p className="text-red-500 text-xs mt-1">{errors.hobbies.message as string}</p>}
                </div>
                
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                    自己紹介 <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="description"
                    {...register('description')}
                    rows={4}
                    placeholder="何もしない時間の提供について、あなたの考えや特徴を記入してください"
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 ${errors.description ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description.message as string}</p>}
                </div>
                
                <div>
                  <label htmlFor="profileImage" className="block text-sm font-medium text-gray-700 mb-1">
                    プロフィール画像 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="file"
                    id="profileImage"
                    name="profileImage"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                  {!profileImage && <p className="text-red-500 text-xs mt-1">プロフィール画像は必須です</p>}
                  <p className="text-xs text-gray-500 mt-1">※ 顔がはっきり写っている写真をアップロードしてください</p>
                </div>
              </div>
              
              <div className="mt-8 flex justify-end">
                <button
                  type="submit"
                  disabled={!isValid || !profileImage || isSubmitting}
                  className={`
                    py-2 px-6 rounded-lg font-medium
                    ${isValid && profileImage && !isSubmitting ? 'bg-amber-500 hover:bg-amber-600 text-white' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}
                  `}
                >
                  {isSubmitting ? '送信中...' : '登録する'}
                </button>
              </div>
            </div>
          )}
          

          
          {/* ステップ2: 完了 */}
          {step === 2 && (
            <div className="p-6 text-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              
              <h3 className="text-xl font-bold mb-2">登録申請が完了しました！</h3>
              <p className="text-gray-600 mb-6">
                審査には1〜3営業日ほどお時間をいただきます。<br />
                審査結果はメールでお知らせいたします。
              </p>
              
              <div className="bg-amber-50 rounded-lg p-4 mb-6 text-left">
                <h4 className="font-medium mb-2">登録情報</h4>
                <ul className="space-y-1 text-sm">
                  <li><span className="font-medium">お名前:</span> {getValues('name')}</li>
                  <li><span className="font-medium">メールアドレス:</span> {getValues('email')}</li>
                  <li><span className="font-medium">年齢:</span> {getValues('age')}歳</li>
                  <li><span className="font-medium">趣味:</span> {getValues('hobbies')}</li>
                </ul>
              </div>
              
              <div className="bg-blue-50 rounded-lg p-4 mb-6 text-left">
                <h4 className="font-medium mb-2">収益について</h4>
                <p className="text-sm">
                  レンタル何もしない人®では、お客様からいただいた料金の50%があなたの収入となります。<br />
                  残りの50%はプラットフォーム運営費用として使用されます。<br />
                  <br />
                  基本料金: 3,000円/時間の場合<br />
                  あなたの収入: 1,500円/時間
                </p>
              </div>
              
              <Link 
                href="/" 
                className="inline-block bg-amber-500 hover:bg-amber-600 text-white font-medium py-2 px-6 rounded-lg transition-colors"
              >
                トップページに戻る
              </Link>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
