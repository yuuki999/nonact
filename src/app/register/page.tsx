'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { pricingOptions } from '../components/PricingTable';

interface FormData {
  name: string;
  age: string;
  height: string;
  hobbies: string;
  description: string;
  mainTitle: string;
  tags: string[];
  category: string;
  profileImage: File | null;
  schedule: {
    day: string;
    available: boolean;
  }[];
}

export default function RegisterPage() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    age: '',
    height: '',
    hobbies: '',
    description: '',
    mainTitle: '',
    tags: ['', '', ''],
    category: '',
    profileImage: null,
    schedule: [
      { day: '月', available: false },
      { day: '火', available: false },
      { day: '水', available: false },
      { day: '木', available: false },
      { day: '金', available: false },
      { day: '土', available: false },
      { day: '日', available: false },
    ]
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState<{ success: boolean; message: string } | null>(null);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleTagChange = (index: number, value: string) => {
    const newTags = [...formData.tags];
    newTags[index] = value;
    setFormData(prev => ({ ...prev, tags: newTags }));
  };
  
  const handleScheduleChange = (day: string) => {
    const newSchedule = formData.schedule.map(item => {
      if (item.day === day) {
        return { ...item, available: !item.available };
      }
      return item;
    });
    setFormData(prev => ({ ...prev, schedule: newSchedule }));
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData(prev => ({ ...prev, profileImage: e.target.files![0] }));
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // ここで実際のAPIを呼び出して登録処理を行います
    // この例ではシミュレーションのみ行います
    try {
      // 登録処理をシミュレート
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // 成功したと仮定
      setSubmitResult({
        success: true,
        message: '登録が完了しました。審査後に連絡いたします。'
      });
      
      // 最終ステップに進む
      setStep(3);
    } catch (error) {
      setSubmitResult({
        success: false,
        message: '登録中にエラーが発生しました。後でもう一度お試しください。'
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const isStepOneValid = () => {
    return (
      formData.name.trim() !== '' &&
      formData.age.trim() !== '' &&
      formData.height.trim() !== '' &&
      formData.hobbies.trim() !== '' &&
      formData.description.trim() !== '' &&
      formData.profileImage !== null
    );
  };
  
  const isStepTwoValid = () => {
    return (
      formData.mainTitle.trim() !== '' &&
      formData.tags.every(tag => tag.trim() !== '') &&
      formData.category !== '' &&
      formData.schedule.some(item => item.available)
    );
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
          <p className={step >= 2 ? 'text-amber-500' : 'text-gray-500'}>プロフィール設定</p>
        </div>
        <div className={`flex-1 text-center pb-4 ${step >= 3 ? 'border-b-2 border-amber-500' : 'border-b border-gray-200'}`}>
          <span className={`inline-block w-8 h-8 rounded-full mb-2 ${step >= 3 ? 'bg-amber-500 text-white' : 'bg-gray-200'} flex items-center justify-center`}>3</span>
          <p className={step >= 3 ? 'text-amber-500' : 'text-gray-500'}>完了</p>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden max-w-2xl mx-auto">
        <form onSubmit={handleSubmit}>
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
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                    required
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-1">
                      年齢 <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      id="age"
                      name="age"
                      value={formData.age}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="height" className="block text-sm font-medium text-gray-700 mb-1">
                      身長(cm) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      id="height"
                      name="height"
                      value={formData.height}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="hobbies" className="block text-sm font-medium text-gray-700 mb-1">
                    趣味 (カンマ区切りで入力) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="hobbies"
                    name="hobbies"
                    value={formData.hobbies}
                    onChange={handleInputChange}
                    placeholder="例: 読書, 散歩, 音楽鑑賞"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                    自己紹介 <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={4}
                    placeholder="何もしない時間の提供について、あなたの考えや特徴を記入してください"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                    required
                  />
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
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">※ 顔がはっきり写っている写真をアップロードしてください</p>
                </div>
              </div>
              
              <div className="mt-8 flex justify-end">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  disabled={!isStepOneValid()}
                  className={`
                    py-2 px-6 rounded-lg font-medium
                    ${isStepOneValid() ? 'bg-amber-500 hover:bg-amber-600 text-white' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}
                  `}
                >
                  次へ進む
                </button>
              </div>
            </div>
          )}
          
          {/* ステップ2: プロフィール設定 */}
          {step === 2 && (
            <div className="p-6">
              <h2 className="text-xl font-bold mb-6">プロフィールを設定</h2>
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="mainTitle" className="block text-sm font-medium text-gray-700 mb-1">
                    メインタイトル <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="mainTitle"
                    name="mainTitle"
                    value={formData.mainTitle}
                    onChange={handleInputChange}
                    placeholder="例: 何もしないのが得意"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">※ あなたの「何もしない」特徴を端的に表す一文を入力してください</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    特徴タグ (3つ) <span className="text-red-500">*</span>
                  </label>
                  <div className="space-y-2">
                    {[0, 1, 2].map(index => (
                      <input
                        key={index}
                        type="text"
                        value={formData.tags[index]}
                        onChange={(e) => handleTagChange(index, e.target.value)}
                        placeholder={`特徴タグ ${index + 1}`}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                        required
                      />
                    ))}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">※ あなたの「何もしない」サービスの特徴を表すタグを3つ入力してください</p>
                </div>
                
                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                    カテゴリー <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                    required
                  >
                    <option value="">選択してください</option>
                    {pricingOptions.map(option => (
                      <option key={option.category} value={option.category}>
                        {option.category} (¥{option.basePrice.toLocaleString()}/時間)
                      </option>
                    ))}
                  </select>
                  <p className="text-xs text-gray-500 mt-1">※ あなたの「何もしない」レベルに合ったカテゴリーを選択してください</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    対応可能な曜日 <span className="text-red-500">*</span>
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {formData.schedule.map((item) => (
                      <button
                        key={item.day}
                        type="button"
                        onClick={() => handleScheduleChange(item.day)}
                        className={`
                          w-12 h-12 rounded-full flex items-center justify-center
                          ${item.available ? 'bg-amber-500 text-white' : 'bg-gray-100 text-gray-700'}
                        `}
                      >
                        {item.day}
                      </button>
                    ))}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">※ 対応可能な曜日を選択してください（複数選択可）</p>
                </div>
              </div>
              
              <div className="mt-8 flex justify-between">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="py-2 px-6 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50"
                >
                  戻る
                </button>
                
                <button
                  type="submit"
                  disabled={!isStepTwoValid() || isSubmitting}
                  className={`
                    py-2 px-6 rounded-lg font-medium
                    ${!isStepTwoValid() || isSubmitting ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-amber-500 hover:bg-amber-600 text-white'}
                  `}
                >
                  {isSubmitting ? '送信中...' : '登録する'}
                </button>
              </div>
            </div>
          )}
          
          {/* ステップ3: 完了 */}
          {step === 3 && (
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
                  <li><span className="font-medium">お名前:</span> {formData.name}</li>
                  <li><span className="font-medium">年齢:</span> {formData.age}歳</li>
                  <li><span className="font-medium">カテゴリー:</span> {formData.category}</li>
                  <li><span className="font-medium">メインタイトル:</span> {formData.mainTitle}</li>
                </ul>
              </div>
              
              <div className="bg-blue-50 rounded-lg p-4 mb-6 text-left">
                <h4 className="font-medium mb-2">収益について</h4>
                <p className="text-sm">
                  レンタル何もしない人®では、お客様からいただいた料金の50%があなたの収入となります。<br />
                  残りの50%はプラットフォーム運営費用として使用されます。<br />
                  <br />
                  例: {formData.category}プラン（{pricingOptions.find(o => o.category === formData.category)?.basePrice.toLocaleString() || 0}円/時間）の場合<br />
                  あなたの収入: {Math.floor((pricingOptions.find(o => o.category === formData.category)?.basePrice || 0) * 0.5).toLocaleString()}円/時間
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
