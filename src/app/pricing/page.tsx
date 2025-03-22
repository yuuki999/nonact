'use client';

import React from 'react';
import Link from 'next/link';
import { pricingOptions } from '../components/PricingTable';
import { useState, useEffect, useMemo } from 'react';

export default function PricingPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(undefined);
  const [hours, setHours] = useState<number>(1);
  const [location, setLocation] = useState<string>('23区内');
  const [totalPrice, setTotalPrice] = useState<number>(0);
  
  // 出張料金の設定 - useMemoでメモ化
  const travelFees = useMemo(() => ({
    '23区内': 3000,
    '23区外 | 新宿駅より片道～1時間未満': 4000,
    '23区外 | 新宿駅より片道1～1.5時間未満': 5000,
    '23区外 | 新宿駅より片道1.5～2時間未満': 6000,
    '23区外 | 新宿駅より片道2～2.5時間未満': 7000,
    '23区外 | 新宿駅より片道2.5～3時間未満': 8000,
    '23区外 | 新宿駅より片道3～3.5時間未満': 9000,
    '23区外 | 新宿駅より片道3.5～4時間未満': 10000,
    '23区外 | 新宿駅より片道4時間以上': 12000
  }), []);
  
  // 料金計算
  useEffect(() => {
    if (selectedCategory) {
      const selectedPlan = pricingOptions.find(option => option.category === selectedCategory);
      if (selectedPlan) {
        const basePrice = selectedPlan.basePrice * hours;
        const travelFee = travelFees[location as keyof typeof travelFees] || 0;
        setTotalPrice(basePrice + travelFee);
      }
    } else {
      setTotalPrice(0);
    }
  }, [selectedCategory, hours, location, travelFees]);
  
  return (
    <div className="container mx-auto px-4 py-12">      
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold mb-4">レンタル何もしない人® 料金プラン</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          何もしない時間の贅沢をお楽しみいただくための料金プランです。
          あなたのニーズに合わせて最適なプランをお選びください。
          すべてのプランに運営手数料50%が含まれています。
        </p>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-12">
        <h2 className="text-xl font-bold mb-4">指名料について</h2>
        
        <div className="mb-6">
          <div className="text-pink-500 font-medium mb-2">Springキャンペーン</div>
          <p className="text-gray-600 mb-4">3月1日(土)～6月30日(月)の間のご利用に適用</p>
          
          <div className="space-y-4">
            <div className="flex items-center border-b pb-3">
              <div className="bg-teal-500 text-white px-3 py-1 rounded text-sm font-medium mr-3">フレッシュ</div>
              <div>
                <span className="line-through text-gray-400 mr-2">7,000円</span>
                → <span className="font-medium">4,000円</span> /1時間
              </div>
            </div>
            <p className="text-gray-700 ml-4">初々しい新人キャストもしくは不慣れなところがかわいらしいキャスト</p>
            
            <div className="flex items-center border-b pb-3">
              <div className="bg-orange-500 text-white px-3 py-1 rounded text-sm font-medium mr-3">レギュラー</div>
              <div>
                <span className="line-through text-gray-400 mr-2">8,000円</span>
                → <span className="font-medium">5,000円</span> /1時間
              </div>
            </div>
            <p className="text-gray-700 ml-4">レンタル何もしない人として経験値・スキル・満足度が標準的で安心のキャスト</p>
            
            <div className="flex items-center border-b pb-3">
              <div className="bg-purple-500 text-white px-3 py-1 rounded text-sm font-medium mr-3">スペシャル</div>
              <div>
                <span className="line-through text-gray-400 mr-2">9,000円</span>
                → <span className="font-medium">6,000円</span> /1時間
              </div>
            </div>
            <p className="text-gray-700 ml-4">レギュラーよりも経験値・満足度・リピート率が高くて人気のキャスト</p>
            
            <div className="flex items-center border-b pb-3">
              <div className="bg-amber-500 text-white px-3 py-1 rounded text-sm font-medium mr-3">プレミアム</div>
              <div>
                <span className="line-through text-gray-400 mr-2">10,000円</span>
                → <span className="font-medium">7,000円</span> /1時間
              </div>
            </div>
            <p className="text-gray-700 ml-4">スペシャルよりも経験値・リピート率・満足度が高く大人気のキャスト</p>
          </div>
          
          <p className="text-sm text-gray-500 mt-6">※デートのお申込は2時間以上からの1時間単位となります</p>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-12">
        <h2 className="text-xl font-bold mb-4">料金に関する補足情報</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="font-medium text-lg mb-2">出張料金について</h3>
            <p className="text-gray-600 mb-4">
              基本料金とは別に、以下の出張料金が発生します。
            </p>
            <ul className="space-y-2">
              <li className="flex items-start">
                <span className="text-amber-500 mr-2">•</span>
                <div>
                  <span className="font-medium">23区内</span>: 3,000円
                </div>
              </li>
              <li className="flex items-start">
                <span className="text-amber-500 mr-2">•</span>
                <div>
                  <span className="font-medium">23区外 | 新宿駅より片道～1時間未満</span>: 4,000円
                </div>
              </li>
              <li className="flex items-start">
                <span className="text-amber-500 mr-2">•</span>
                <div>
                  <span className="font-medium">23区外 | 新宿駅より片道1～1.5時間未満</span>: 5,000円
                </div>
              </li>
              <li className="flex items-start">
                <span className="text-amber-500 mr-2">•</span>
                <div>
                  <span className="font-medium">23区外 | 新宿駅より片道1.5～2時間未満</span>: 6,000円
                </div>
              </li>
              <li className="flex items-start">
                <span className="text-amber-500 mr-2">•</span>
                <div>
                  <span className="font-medium">23区外 | 新宿駅より片道2時間以上</span>: 要相談
                </div>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-medium text-lg mb-2">キャンセルポリシー</h3>
            <p className="text-gray-600 mb-4">
              予約のキャンセルには以下の料金が発生します。
            </p>
            <ul className="space-y-2">
              <li className="flex items-start">
                <span className="text-amber-500 mr-2">•</span>
                <div>
                  <span className="font-medium">予約日の7日前まで</span>: 無料
                </div>
              </li>
              <li className="flex items-start">
                <span className="text-amber-500 mr-2">•</span>
                <div>
                  <span className="font-medium">予約日の3日前まで</span>: 料金の30%
                </div>
              </li>
              <li className="flex items-start">
                <span className="text-amber-500 mr-2">•</span>
                <div>
                  <span className="font-medium">予約日の前日まで</span>: 料金の50%
                </div>
              </li>
              <li className="flex items-start">
                <span className="text-amber-500 mr-2">•</span>
                <div>
                  <span className="font-medium">予約日当日</span>: 料金の100%
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-12">
        <h2 className="text-xl font-bold mb-4">料金シミュレーション</h2>
        <p className="text-gray-600 mb-6">価格費用は以下の2点です。</p>
        
        <div className="flex items-center justify-center mb-6">
          <div className="text-center px-6">
            <div className="text-lg font-medium">指名料</div>
          </div>
          <div className="text-3xl font-bold px-4">+</div>
          <div className="text-center px-6">
            <div className="text-lg font-medium">出張料</div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              キャストランク
            </label>
            <select
              value={selectedCategory || ''}
              onChange={(e) => setSelectedCategory(e.target.value || undefined)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              <option value="">選択してください</option>
              {pricingOptions.map(option => (
                <option key={option.category} value={option.category}>
                  {option.category} (¥{option.basePrice.toLocaleString()}/時間)
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              時間数
            </label>
            <select
              value={hours}
              onChange={(e) => setHours(Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              {[1, 2, 3, 4, 5, 6].map(h => (
                <option key={h} value={h}>{h}時間</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              待ち合わせ場所
            </label>
            <select
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              {Object.keys(travelFees).map(loc => (
                <option key={loc} value={loc}>{loc}</option>
              ))}
            </select>
          </div>
        </div>
        
        <div className="bg-amber-50 p-4 rounded-lg">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <div className="text-center">
              <p className="text-sm font-medium mb-1">指名料</p>
              <p className="text-xl font-bold">
                {selectedCategory ? `¥${(pricingOptions.find(option => option.category === selectedCategory)?.basePrice || 0).toLocaleString()}` : '-'}
              </p>
              <p className="text-xs text-gray-500">×</p>
            </div>
            
            <div className="text-center">
              <p className="text-sm font-medium mb-1">時間数</p>
              <p className="text-xl font-bold">{hours}時間</p>
              <p className="text-xs text-gray-500">+</p>
            </div>
            
            <div className="text-center">
              <p className="text-sm font-medium mb-1">出張料</p>
              <p className="text-xl font-bold">
                {location ? `¥${(travelFees[location as keyof typeof travelFees] || 0).toLocaleString()}` : '-'}
              </p>
              <p className="text-xs text-gray-500">=</p>
            </div>
            
            <div className="text-center">
              <p className="text-sm font-medium mb-1">合計</p>
              <p className="text-2xl font-bold text-amber-600">
                {totalPrice > 0 ? `¥${totalPrice.toLocaleString()}` : '-'}
              </p>
            </div>
          </div>
          
          <p className="text-sm text-gray-600 text-center">
            ※ 最低2時間からになります。<br />
            ※ その他デート中に発生する費用は全てお客様負担となります（移動費、飲食費、施設利用費など）
          </p>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-12">
        <h2 className="text-xl font-bold mb-4">支払いに関して</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gray-50 p-4 rounded-lg text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
            </div>
            <h3 className="font-medium mb-2">事前 - カード決済</h3>
            <p className="text-sm text-gray-600">
              ご予約が完了すると「料金内訳」「決済URL」「決済期限」のご案内があります。カード決済の確認ができましたらお支払いが完了となります。
            </p>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg text-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="font-medium mb-2">事前 - 銀行振込</h3>
            <p className="text-sm text-gray-600">
              ご予約が完了すると「料金内訳」「振込先」「振込期限」のご案内があります。お振込みの確認ができましたらお支払いが完了となります。
            </p>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg text-center">
            <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="font-medium mb-2">当日 - 現金支払</h3>
            <p className="text-sm text-gray-600">
              デート当日に何もしない人と合流するとデート開始20分以内にデート料金のお支払いのご案内があります。何もしない人はデートの雰囲気を崩さないような場所でお声掛けいたします。
            </p>
          </div>
        </div>
        
        <div className="mt-6 pt-6 border-t border-gray-200">
          <h3 className="font-medium mb-2">決済代行会社について</h3>
          <p className="text-sm text-gray-600 mb-2">
            ユニヴァ・ペイキャスト社のUnivaPay を利用しています。
            クレジットカード情報は弊社では保持できませんので、安心してご利用いただけます。
          </p>
          <p className="text-sm text-gray-600">
            <span className="font-medium">ご利用可能なカード:</span> VISA、MASTER、JCBがご利用いただけます。
          </p>
        </div>
      </div>
        
        <div className="flex justify-center">
          <Link 
            href="/" 
            className="inline-block bg-amber-500 hover:bg-amber-600 text-white font-medium py-3 px-6 rounded-lg transition-colors"
          >
            何もしない人一覧を見る
          </Link>
        </div>
    </div>
  );
}
