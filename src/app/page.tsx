'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import AuthStatus from './components/AuthStatus';

interface Person {
  id: number;
  name: string;
  image: string;
  rank?: number;
  category: string;
  mainTitle: string;
  tags: string[];
}

export default function Home() {
  const [people, setPeople] = useState<Person[]>([
    {
      id: 1,
      name: '佐々木遥',
      image: '/images/person1.jpg',
      rank: 1,
      category: 'プレミアム',
      mainTitle: '何もしないのが得意',
      tags: ['静かに寄り添います', '一緒にいるだけで安心感', '無言でも心地よい時間を提供']
    },
    {
      id: 2,
      name: '白石あやな',
      image: '/images/person2.jpg',
      rank: 2,
      category: 'スペシャル',
      mainTitle: '存在感を消すのが上手',
      tags: ['気を遣わせません', '自然体で過ごせます', '何もしない時間の心地よさを体験']
    },
    {
      id: 3,
      name: '羽山さつき',
      image: '/images/person3.jpg',
      rank: 3,
      category: 'レギュラー',
      mainTitle: '穏やかな空気を作る',
      tags: ['無言でも不思議と落ち着く', '何もしない時間を大切に', '一緒にいるだけでリラックス']
    },
    {
      id: 4,
      name: '杉崎澪',
      image: '/images/person4.jpg',
      category: 'スペシャル',
      mainTitle: '静かな共有時間の達人',
      tags: ['存在を主張しません', '何もしない贅沢を体験', '心地よい距離感を保ちます']
    },
    {
      id: 5,
      name: '鈴木ありさ',
      image: '/images/person5.jpg',
      category: 'スペシャル',
      mainTitle: '無の境地を極める',
      tags: ['何もしない時間の価値を知る', '静寂を楽しむ', '心穏やかな時間を共有']
    },
    {
      id: 6,
      name: '山田ななこ',
      image: '/images/person6.jpg',
      category: 'プレミアム',
      mainTitle: '何もしない上級者',
      tags: ['無駄な気遣いをさせません', '自然な間を大切に', '何もしないことの豊かさを体験']
    },
    {
      id: 7,
      name: '高橋みく',
      image: '/images/person7.jpg',
      category: 'レギュラー',
      mainTitle: '静寂の中の安らぎ',
      tags: ['無言でも居心地が良い', '何もしない贅沢な時間', '自分のペースを尊重します']
    },
    {
      id: 8,
      name: '田中ゆい',
      image: '/images/person8.jpg',
      category: 'スペシャル',
      mainTitle: '無為自然の時間を提供',
      tags: ['何もしないプロフェッショナル', '静かな存在感', '心地よい空間を作ります']
    }
  ]);

  return (
    <div className="min-h-screen bg-amber-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <AuthStatus />
        </div>
        <h1 className="text-2xl font-bold text-center my-10">レンタル何もしない人® 一覧</h1>

        <p className="text-center text-gray-700 mb-6 max-w-3xl mx-auto">
          レンタル何もしない人®は、何もしないプロフェッショナルが登録し、そのサービスを利用したい人がレンタルできるプラットフォームです。
          何もしない時間の贅沢さと心地よさを体験してみませんか。
          {/* <Link href="/reasons" className="text-blue-600 hover:underline">選ばれる理由を見る</Link> */}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {people.map((person) => (
            <div key={person.id} className="bg-white rounded-lg overflow-hidden shadow-md relative">
              <div className="relative h-80">
                <Image 
                  src={person.image} 
                  alt={person.name}
                  fill
                  className="object-cover"
                />
                {person.rank && (
                  <div className="absolute bottom-4 right-4 w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold">
                    No.{person.rank}
                  </div>
                )}
              </div>
              <div className="p-4">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-medium text-lg">{person.name}</h3>
                  <span className={`text-xs px-2 py-1 rounded ${
                    person.category === 'プレミアム' ? 'bg-amber-500 text-white' :
                    person.category === 'スペシャル' ? 'bg-blue-500 text-white' : 
                    'bg-green-500 text-white'
                  }`}>
                    {person.category}
                  </span>
                </div>
                <p className="font-bold text-gray-800 mb-3">{person.mainTitle}</p>
                <ul className="space-y-1 text-sm text-gray-600">
                  {person.tags.map((tag, index) => (
                    <li key={index} className="flex">
                      <span className="text-gray-400 mr-1">#{index+1}</span>
                      {tag}
                    </li>
                  ))}
                </ul>
              </div>
              <Link href={`/profile/${person.id}`} className="block bg-gray-100 text-center py-3 text-gray-700 hover:bg-gray-200 transition">
                詳細を見る
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}