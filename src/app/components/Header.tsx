import Link from 'next/link';

export default function Header() {
  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center">
          <Link href="/" className="font-bold text-xl text-gray-800 flex items-center">
            <span>レンタル何もしない人</span>
            <span className="ml-2 bg-amber-500 text-white text-xs px-2 py-1 rounded">PREMIUM</span>
          </Link>
        </div>
        <nav className="hidden md:flex space-x-6 text-sm">
          <Link href="/" className="text-gray-600 hover:text-gray-900">何もしない人一覧</Link>
          <Link href="/pricing" className="text-gray-600 hover:text-gray-900">料金プラン</Link>
          <Link href="/register" className="text-gray-600 hover:text-gray-900">何もしない人登録</Link>
          <Link href="/reasons" className="text-gray-600 hover:text-gray-900">選ばれる理由</Link>
          <Link href="/voices" className="text-gray-600 hover:text-gray-900">ご利用者の声</Link>
        </nav>
        <div className="flex items-center">
          <Link href="/login" className="text-red-500 text-sm mr-4">
            ログイン
          </Link>
          <Link href="/register" className="bg-red-500 text-white text-sm px-4 py-2 rounded-full">
            レンタル予約
          </Link>
        </div>
      </div>
    </header>
  );
}
