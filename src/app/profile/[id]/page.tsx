'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { createBooking } from '@/app/actions/actions';
import { getAvailableTimes, getPersonById } from '@/app/lib/data';

interface Person {
  id: number;
  name: string;
  image: string;
  rank?: number;
  category: string;
  mainTitle: string;
  tags: string[];
  age?: number;
  height?: number;
  hobbies?: string[];
  description?: string;
  schedule?: {
    day: string;
    available: boolean;
  }[];
}

export default function ProfilePage({ params }: { params: { id: string } }) {
  const id = params.id;
  const [person, setPerson] = useState<Person | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [bookingStep, setBookingStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: ''
  });
  const [bookingStatus, setBookingStatus] = useState<{
    loading: boolean;
    message: string;
    success: boolean | null;
  }>({
    loading: false,
    message: '',
    success: null
  });

  // 利用可能な時間帯
  const availableTimes = getAvailableTimes();

  // プロフィールデータの取得
  useEffect(() => {
    async function loadPerson() {
      try {
        const personData = await getPersonById(id);
        setPerson(personData);
      } catch (error) {
        console.error('プロフィールの読み込み中にエラーが発生しました:', error);
      } finally {
        setLoading(false);
      }
    }
    
    loadPerson();
  }, [id]);

  // フォーム入力の処理
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // 予約の送信
  const handleBooking = async () => {
    if (!person || !selectedDate || !selectedTime) return;
    
    setBookingStatus({
      loading: true,
      message: '予約処理中...',
      success: null
    });
    
    try {
      const result = await createBooking({
        personId: person.id,
        date: selectedDate,
        time: selectedTime,
        name: formData.name,
        email: formData.email,
        phone: formData.phone
      });
      
      setBookingStatus({
        loading: false,
        message: result.message,
        success: result.success
      });
      
      if (result.success) {
        // 予約成功後の処理
        setBookingStep(3); // 完了ステップに移動
      }
    } catch (error) {
      setBookingStatus({
        loading: false,
        message: 'エラーが発生しました。後でもう一度お試しください。',
        success: false
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-amber-50 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>
      </div>
    );
  }

  if (!person) {
    return (
      <div className="min-h-screen bg-amber-50 flex justify-center items-center">
        <div className="text-center p-8 bg-white rounded-lg shadow-md">
          <h1 className="text-2xl font-bold text-red-500 mb-4">エラー</h1>
          <p className="mb-4">申し訳ありません。プロフィール情報を取得できませんでした。</p>
          <Link href="/" className="text-blue-500 hover:underline">トップページに戻る</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-2 flex items-center text-sm text-gray-500">
        <Link href="/" className="hover:underline">ホーム</Link>
        <span className="mx-2">/</span>
        <Link href="/" className="hover:underline">レンタル何もしない人一覧</Link>
        <span className="mx-2">/</span>
        <span>{person.name}</span>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden my-8">
        <div className="grid grid-cols-1 md:grid-cols-2">
          <div className="relative h-96 md:h-full">
            <Image 
              src={person.image} 
              alt={person.name}
              fill
              className="object-cover"
            />
            {person.rank && (
              <div className="absolute top-4 right-4 w-14 h-14 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                No.{person.rank}
              </div>
            )}
            <div className="absolute bottom-4 right-4">
              <span className={`text-sm px-3 py-1 rounded-full ${
                person.category === 'プレミアム' ? 'bg-amber-500 text-white' :
                person.category === 'スペシャル' ? 'bg-blue-500 text-white' : 
                'bg-green-500 text-white'
              }`}>
                {person.category}
              </span>
            </div>
          </div>
          <div className="p-6">
            <h1 className="text-2xl font-bold mb-1">{person.name}</h1>
            <p className="text-lg font-medium text-gray-700 mb-4">{person.mainTitle}</p>
            
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <p className="text-sm text-gray-500">年齢</p>
                <p>{person.age}歳</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">身長</p>
                <p>{person.height}cm</p>
              </div>
            </div>
            
            <div className="mb-6">
              <p className="text-sm text-gray-500 mb-1">趣味</p>
              <div className="flex flex-wrap gap-2">
                {person.hobbies?.map((hobby, index) => (
                  <span key={index} className="bg-gray-100 px-3 py-1 rounded-full text-sm">
                    {hobby}
                  </span>
                ))}
              </div>
            </div>
            
            <div className="mb-6">
              <p className="text-sm text-gray-500 mb-1">特徴</p>
              <ul className="space-y-1 text-sm">
                {person.tags.map((tag, index) => (
                  <li key={index} className="flex">
                    <span className="text-amber-500 mr-2">•</span>
                    {tag}
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <p className="text-sm text-gray-500 mb-1">自己紹介</p>
              <p className="text-gray-700 text-sm leading-relaxed">{person.description}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden my-8 p-6">
        <h2 className="text-xl font-bold mb-6">予約する</h2>
        
        {/* 予約ステップインジケーター */}
        <div className="flex mb-8">
          <div className={`flex-1 text-center pb-4 ${bookingStep >= 1 ? 'border-b-2 border-amber-500' : 'border-b border-gray-200'}`}>
            <span className={`inline-block w-8 h-8 rounded-full mb-2 ${bookingStep >= 1 ? 'bg-amber-500 text-white' : 'bg-gray-200'} flex items-center justify-center`}>1</span>
            <p className={bookingStep >= 1 ? 'text-amber-500' : 'text-gray-500'}>日時選択</p>
          </div>
          <div className={`flex-1 text-center pb-4 ${bookingStep >= 2 ? 'border-b-2 border-amber-500' : 'border-b border-gray-200'}`}>
            <span className={`inline-block w-8 h-8 rounded-full mb-2 ${bookingStep >= 2 ? 'bg-amber-500 text-white' : 'bg-gray-200'} flex items-center justify-center`}>2</span>
            <p className={bookingStep >= 2 ? 'text-amber-500' : 'text-gray-500'}>お客様情報</p>
          </div>
          <div className={`flex-1 text-center pb-4 ${bookingStep >= 3 ? 'border-b-2 border-amber-500' : 'border-b border-gray-200'}`}>
            <span className={`inline-block w-8 h-8 rounded-full mb-2 ${bookingStep >= 3 ? 'bg-amber-500 text-white' : 'bg-gray-200'} flex items-center justify-center`}>3</span>
            <p className={bookingStep >= 3 ? 'text-amber-500' : 'text-gray-500'}>完了</p>
          </div>
        </div>
        
        {/* ステップ1: 日時選択 */}
        {bookingStep === 1 && (
          <div>
            <div className="mb-8">
              <h3 className="font-medium mb-3">日付を選択</h3>
              <div className="flex flex-wrap gap-2">
                {person.schedule?.map((item) => (
                  <button
                    key={item.day}
                    onClick={() => setSelectedDate(item.day)}
                    disabled={!item.available}
                    className={`
                      w-12 h-12 rounded-full flex items-center justify-center
                      ${!item.available ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 
                      selectedDate === item.day ? 'bg-amber-500 text-white' : 'bg-gray-100 hover:bg-gray-200'}
                    `}
                  >
                    {item.day}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="mb-8">
              <h3 className="font-medium mb-3">時間を選択</h3>
              <div className="flex flex-wrap gap-2">
                {availableTimes.map((time) => (
                  <button
                    key={time}
                    onClick={() => setSelectedTime(time)}
                    disabled={!selectedDate}
                    className={`
                      px-4 py-2 rounded
                      ${!selectedDate ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 
                      selectedTime === time ? 'bg-amber-500 text-white' : 'bg-gray-100 hover:bg-gray-200'}
                    `}
                  >
                    {time}
                  </button>
                ))}
              </div>
            </div>
            
            <button 
              disabled={!selectedDate || !selectedTime}
              onClick={() => setBookingStep(2)}
              className={`
                w-full py-3 rounded-lg text-white font-medium
                ${(!selectedDate || !selectedTime) ? 'bg-gray-300 cursor-not-allowed' : 'bg-red-500 hover:bg-red-600'}
              `}
            >
              次へ進む
            </button>
          </div>
        )}
        
        {/* ステップ2: お客様情報入力 */}
        {bookingStep === 2 && (
          <div>
            <div className="mb-4">
              <p className="text-sm mb-6">
                {selectedDate}曜日 {selectedTime} に予約を確定します。
                以下の情報を入力してください。
              </p>
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    お名前
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
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    メールアドレス
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                    電話番号
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                    required
                  />
                </div>
              </div>
            </div>
            
            <div className="flex space-x-4 mt-8">
              <button 
                onClick={() => setBookingStep(1)}
                className="flex-1 py-3 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50"
              >
                戻る
              </button>
              
              <button 
                onClick={handleBooking}
                disabled={!formData.name || !formData.email || !formData.phone || bookingStatus.loading}
                className={`
                  flex-1 py-3 rounded-lg text-white font-medium
                  ${(!formData.name || !formData.email || !formData.phone || bookingStatus.loading) ? 
                    'bg-gray-300 cursor-not-allowed' : 'bg-red-500 hover:bg-red-600'}
                `}
              >
                {bookingStatus.loading ? '処理中...' : '予約を確定する'}
              </button>
            </div>
            
            {bookingStatus.message && (
              <div className={`mt-4 p-3 rounded ${
                bookingStatus.success ? 'bg-green-100 text-green-800' : 
                bookingStatus.success === false ? 'bg-red-100 text-red-800' : 'bg-gray-100'
              }`}>
                {bookingStatus.message}
              </div>
            )}
          </div>
        )}
        
        {/* ステップ3: 完了 */}
        {bookingStep === 3 && (
          <div className="text-center py-6">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            
            <h3 className="text-xl font-bold mb-2">予約が完了しました！</h3>
            <p className="text-gray-600 mb-6">
              {person.name}さんの何もしない時間を予約しました。<br />
              確認メールを{formData.email}に送信しました。
            </p>
            
            <div className="bg-gray-50 rounded-lg p-4 mb-6 inline-block">
              <div className="flex justify-between mb-2">
                <span className="text-gray-500">日時:</span>
                <span className="font-medium">{selectedDate}曜日 {selectedTime}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">何もしない人:</span>
                <span className="font-medium">{person.name}</span>
              </div>
            </div>
            
            <Link 
              href="/"
              className="text-amber-500 hover:text-amber-600 font-medium"
            >
              トップページに戻る
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}