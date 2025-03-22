'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

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
      mainTitle: '元気でよくしゃべる',
      tags: ['人見知りもしない', '優しく一緒に過ごしたいなら間違いない', '積極的に話しかけてくれる']
    },
    {
      id: 2,
      name: '白石あやな',
      image: '/images/person2.jpg',
      rank: 2,
      category: 'スペシャル',
      mainTitle: '自信がない人に寄り添いたい',
      tags: ['遠慮せずに気兼ねなく', '自然な笑顔に癒やされるのでぜひ心のお食事が目標', 'クッカが喋く、楽しそうに『きは』と笑うタイプ']
    },
    {
      id: 3,
      name: '羽山さつき',
      image: '/images/person3.jpg',
      rank: 3,
      category: 'レギュラー',
      mainTitle: '明るく共感力にあふれる',
      tags: ['先輩のような言葉選びがセンス抜群', 'なんでも聴いてみようと話を聞いてくれる', 'お手洗いたくても上品に笑っています']
    },
    {
      id: 4,
      name: '杉崎澪',
      image: '/images/person4.jpg',
      category: 'スペシャル',
      mainTitle: '無邪気でなつっこい',
      tags: ['ナチュラルな優女感', '特徴さなくても大丈夫', 'ハンターキャット中年男性']
    },
    {
      id: 5,
      name: '鈴木ありさ',
      image: '/images/person5.jpg',
      category: 'スペシャル',
      mainTitle: '優しい雰囲気が魅力的',
      tags: ['落ち着いた空間を作れる', '話を聞くのが得意', '心地よい距離感']
    },
    {
      id: 6,
      name: '山田ななこ',
      image: '/images/person6.jpg',
      category: 'プレミアム',
      mainTitle: '元気で明るい性格',
      tags: ['どんな場所でも盛り上げる', '初対面でも緊張しない', '楽しい時間を提供します']
    },
    {
      id: 7,
      name: '高橋みく',
      image: '/images/person7.jpg',
      category: 'レギュラー',
      mainTitle: '知的で落ち着いた雰囲気',
      tags: ['幅広い話題に対応', '静かな時間も大切に', '一緒にいて疲れない']
    },
    {
      id: 8,
      name: '田中ゆい',
      image: '/images/person8.jpg',
      category: 'スペシャル',
      mainTitle: '癒しオーラの持ち主',
      tags: ['リラックスできる空間作り', '穏やかな笑顔', '自然体で接します']
    }
  ]);

  return (
    <div className="min-h-screen bg-amber-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-2 flex items-center text-sm text-gray-500">
          <Link href="/" className="hover:underline">ホーム</Link>
          <span className="mx-2">/</span>
          <span>レンタル何もしない人一覧</span>
        </div>

        <h1 className="text-2xl font-bold text-center my-10">レンタル何もしない人® 一覧</h1>

        <p className="text-center text-gray-700 mb-6 max-w-3xl mx-auto">
          レンタル何もしない人®PREMIUMはしっかりと研修を行った彼女のみが対応いたします。
          ただ女の子を物扱いしているようなサービスには全く賛同致しかねます。
          <Link href="/reasons" className="text-blue-600 hover:underline">選ばれる理由を見る</Link>
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