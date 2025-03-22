export interface Person {
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
  
  // 実際のアプリケーションではAPIから取得しますが、この例ではモックデータを使用します
  export const getPeople = async (): Promise<Person[]> => {
    // APIフェッチをシミュレート
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          {
            id: 1,
            name: '佐々木遥',
            image: '/images/person1.jpg',
            rank: 1,
            category: 'プレミアム',
            mainTitle: '元気でよくしゃべる',
            tags: ['人見知りもしない', '優しく一緒に過ごしたいなら間違いない', '積極的に話しかけてくれる'],
            age: 23,
            height: 162,
            hobbies: ['カフェ巡り', '映画鑑賞', '散歩'],
            description: '明るく前向きな性格で、初対面の方とでもすぐに打ち解けることができます。話を聞くことが得意で、何もしなくても居心地の良い時間を提供します。一緒にいるだけでリラックスできる空間を作ることを心がけています。',
            schedule: [
              { day: '月', available: true },
              { day: '火', available: true },
              { day: '水', available: false },
              { day: '木', available: true },
              { day: '金', available: true },
              { day: '土', available: true },
              { day: '日', available: false },
            ]
          },
          {
            id: 2,
            name: '白石あやな',
            image: '/images/person2.jpg',
            rank: 2,
            category: 'スペシャル',
            mainTitle: '自信がない人に寄り添いたい',
            tags: ['遠慮せずに気兼ねなく', '自然な笑顔に癒やされるのでぜひ心のお食事が目標', 'クッカが喋く、楽しそうに『きは』と笑うタイプ'],
            age: 25,
            height: 158,
            hobbies: ['読書', '料理', 'ヨガ'],
            description: '穏やかな性格で、相手の気持ちに寄り添うことを大切にしています。普段は静かですが、会話が弾むと笑顔が増えます。何もしなくても一緒にいるだけで、安心できる空間を作れると思います。',
            schedule: [
              { day: '月', available: false },
              { day: '火', available: true },
              { day: '水', available: true },
              { day: '木', available: true },
              { day: '金', available: true },
              { day: '土', available: false },
              { day: '日', available: true },
            ]
          },
          {
            id: 3,
            name: '羽山さつき',
            image: '/images/person3.jpg',
            rank: 3,
            category: 'レギュラー',
            mainTitle: '明るく共感力にあふれる',
            tags: ['先輩のような言葉選びがセンス抜群', 'なんでも聴いてみようと話を聞いてくれる', 'お手洗いたくても上品に笑っています'],
            age: 24,
            height: 165,
            hobbies: ['アート鑑賞', '音楽', '写真撮影'],
            description: '共感力が高く、どんな話でも興味を持って聞くことができます。相手の気持ちに寄り添いながら、自然な会話を心がけています。一緒にいて楽しく、でもプレッシャーを感じさせない関係を大切にしています。',
            schedule: [
              { day: '月', available: true },
              { day: '火', available: false },
              { day: '水', available: true },
              { day: '木', available: false },
              { day: '金', available: true },
              { day: '土', available: true },
              { day: '日', available: true },
            ]
          },
          {
            id: 4,
            name: '杉崎澪',
            image: '/images/person4.jpg',
            category: 'スペシャル',
            mainTitle: '無邪気でなつっこい',
            tags: ['ナチュラルな優女感', '特徴さなくても大丈夫', 'ハンターキャット中年男性'],
            age: 22,
            height: 156,
            hobbies: ['ダンス', '旅行', 'カラオケ'],
            description: '明るく無邪気な性格で、自然と笑顔になれる時間を提供します。何気ない会話や一緒にいるだけの時間も大切にしています。リラックスして過ごせる空間づくりが得意です。',
            schedule: [
              { day: '月', available: false },
              { day: '火', available: true },
              { day: '水', available: true },
              { day: '木', available: true },
              { day: '金', available: false },
              { day: '土', available: true },
              { day: '日', available: false },
            ]
          },
          {
            id: 5,
            name: '鈴木ありさ',
            image: '/images/person5.jpg',
            category: 'スペシャル',
            mainTitle: '優しい雰囲気が魅力的',
            tags: ['落ち着いた空間を作れる', '話を聞くのが得意', '心地よい距離感'],
            age: 26,
            height: 160,
            hobbies: ['ピアノ', 'ガーデニング', '絵画'],
            description: '穏やかで優しい雰囲気が特徴です。会話も大切にしますが、一緒に静かな時間を過ごすことも苦になりません。相手のペースに合わせて、心地よい時間を提供します。',
            schedule: [
              { day: '月', available: true },
              { day: '火', available: true },
              { day: '水', available: false },
              { day: '木', available: false },
              { day: '金', available: true },
              { day: '土', available: false },
              { day: '日', available: true },
            ]
          },
          {
            id: 6,
            name: '山田ななこ',
            image: '/images/person6.jpg',
            category: 'プレミアム',
            mainTitle: '元気で明るい性格',
            tags: ['どんな場所でも盛り上げる', '初対面でも緊張しない', '楽しい時間を提供します'],
            age: 23,
            height: 159,
            hobbies: ['スポーツ観戦', 'ボードゲーム', 'フードツーリング'],
            description: 'どんな場所でも場を明るくできる性格です。初対面の方でも緊張せずに接することができます。何もしなくても一緒にいて楽しい時間を過ごせるよう心がけています。',
            schedule: [
              { day: '月', available: true },
              { day: '火', available: false },
              { day: '水', available: true },
              { day: '木', available: true },
              { day: '金', available: true },
              { day: '土', available: true },
              { day: '日', available: false },
            ]
          },
          {
            id: 7,
            name: '高橋みく',
            image: '/images/person7.jpg',
            category: 'レギュラー',
            mainTitle: '知的で落ち着いた雰囲気',
            tags: ['幅広い話題に対応', '静かな時間も大切に', '一緒にいて疲れない'],
            age: 27,
            height: 164,
            hobbies: ['博物館巡り', '古典文学', 'ジャズ鑑賞'],
            description: '落ち着いた雰囲気で、知的な会話を楽しむことができます。しかし、無理に話す必要はなく、静かな時間も大切にしています。相手に合わせて、心地よい距離感を保つことを心がけています。',
            schedule: [
              { day: '月', available: false },
              { day: '火', available: true },
              { day: '水', available: true },
              { day: '木', available: false },
              { day: '金', available: true },
              { day: '土', available: true },
              { day: '日', available: true },
            ]
          },
          {
            id: 8,
            name: '田中ゆい',
            image: '/images/person8.jpg',
            category: 'スペシャル',
            mainTitle: '癒しオーラの持ち主',
            tags: ['リラックスできる空間作り', '穏やかな笑顔', '自然体で接します'],
            age: 25,
            height: 161,
            hobbies: ['アロマテラピー', 'ヨガ', '自然散策'],
            description: '穏やかな笑顔と優しい声が特徴です。周りの人をリラックスさせる雰囲気を持っています。何もしなくても、一緒にいるだけで安らぎを感じられる時間を提供したいと思っています。',
            schedule: [
              { day: '月', available: true },
              { day: '火', available: true },
              { day: '水', available: false },
              { day: '木', available: true },
              { day: '金', available: false },
              { day: '土', available: false },
              { day: '日', available: true },
            ]
          }
        ]);
      }, 500);
    });
  };
  
  export const getPersonById = async (id: string): Promise<Person | null> => {
    const people = await getPeople();
    return people.find(person => person.id === Number(id)) || null;
  };
  
  export const getAvailableTimes = (): string[] => {
    return [
      '10:00', '11:00', '12:00', '13:00', '14:00', 
      '15:00', '16:00', '17:00', '18:00', '19:00'
    ];
  };