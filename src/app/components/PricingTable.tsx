'use client';

import React from 'react';

interface PricingOption {
  category: string;
  basePrice: number;
  originalPrice?: number;
  features: string[];
  color: string;
}

interface PricingTableProps {
  options: PricingOption[];
  onSelect?: (category: string) => void;
  selectedCategory?: string;
}

export default function PricingTable({ options, onSelect, selectedCategory }: PricingTableProps) {
  const showCampaign = true; // キャンペーン表示フラグ
  
  return (
    <div>
      {/* カード表示（モバイル向け） */}
      <div className="block md:hidden">
        <div className="grid grid-cols-1 gap-6 my-8">
          {options.map((option) => (
            <div 
              key={option.category}
              className={`
                border rounded-lg overflow-hidden shadow-md
                ${selectedCategory === option.category ? 'ring-2 ring-offset-2 ' + option.color : ''}
              `}
            >
              <div className={`${option.color} text-white p-4 text-center`}>
                <h3 className="text-xl font-bold mb-1">{option.category}</h3>
                <div className="flex justify-center items-center">
                  {showCampaign && option.originalPrice && (
                    <div className="line-through text-white text-opacity-80 mr-2">
                      ¥{option.originalPrice.toLocaleString()}
                    </div>
                  )}
                  <div className="text-2xl font-bold">
                    ¥{option.basePrice.toLocaleString()}<span className="text-sm font-normal">/時間</span>
                  </div>
                </div>
                <p className="text-sm opacity-80">※出張料別途</p>
              </div>
              
              <div className="p-4 bg-white">
                <ul className="space-y-2">
                  {option.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-green-500 mr-2">✓</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                
                {onSelect && (
                  <button
                    onClick={() => onSelect(option.category)}
                    className={`
                      w-full mt-4 py-2 rounded-lg font-medium
                      ${option.color.replace('bg-', 'bg-opacity-90 hover:bg-opacity-100 text-white bg-')}
                    `}
                  >
                    この料金プランを選択
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* 縦書きリスト表示（デスクトップ向け） */}
      <div className="hidden md:block">
        {showCampaign && (
          <div className="mb-6">
            <h3 className="text-xl font-medium text-pink-500 mb-2">Springキャンペーン</h3>
            <p className="text-gray-600">3月1日(土)～6月30日(月)の間のご利用に適用</p>
          </div>
        )}
        
        <div className="space-y-6">
          {options.map((option) => (
            <div 
              key={option.category} 
              className={`border-b pb-6 last:border-b-0 last:pb-0 ${selectedCategory === option.category ? 'bg-amber-50 -mx-4 px-4 py-4 rounded-lg' : ''}`}
            >
              <div className="flex items-center mb-3">
                <div className={`${option.color} text-white px-3 py-1 rounded text-sm font-medium mr-3`}>
                  {option.category}
                </div>
                <div className="font-medium">
                  {showCampaign && option.originalPrice ? (
                    <span>
                      <span className="line-through text-gray-400 mr-2">¥{option.originalPrice.toLocaleString()}</span>
                      → ¥{option.basePrice.toLocaleString()} /1時間
                    </span>
                  ) : (
                    <span>¥{option.basePrice.toLocaleString()} /1時間</span>
                  )}
                </div>
                
                {onSelect && (
                  <button
                    onClick={() => onSelect(option.category)}
                    className={`
                      ml-auto px-4 py-1 rounded-lg text-sm font-medium
                      ${option.color.replace('bg-', 'bg-opacity-90 hover:bg-opacity-100 text-white bg-')}
                    `}
                  >
                    選択
                  </button>
                )}
              </div>
              
              <ul className="space-y-2">
                {option.features.map((feature, i) => (
                  <li key={i} className="flex items-start">
                    <span className="text-green-500 mr-2 mt-0.5">✓</span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export const pricingOptions: PricingOption[] = [
  {
    category: 'フレッシュ',
    basePrice: 4000,
    originalPrice: 7000,
    features: [
      '初々しい新人キャストもしくは不慣れなところがかわいらしいキャスト'
    ],
    color: 'bg-teal-500'
  },
  {
    category: 'レギュラー',
    basePrice: 5000,
    originalPrice: 8000,
    features: [
      'レンタル何もしない人として経験値・スキル・満足度が標準的で安心のキャスト'
    ],
    color: 'bg-orange-500'
  },
  {
    category: 'スペシャル',
    basePrice: 6000,
    originalPrice: 9000,
    features: [
      'レギュラーよりも経験値・満足度・リピート率が高くて人気のキャスト'
    ],
    color: 'bg-purple-500'
  },
  {
    category: 'プレミアム',
    basePrice: 7000,
    originalPrice: 10000,
    features: [
      'スペシャルよりも経験値・リピート率・満足度が高く大人気のキャスト'
    ],
    color: 'bg-amber-500'
  }
];
