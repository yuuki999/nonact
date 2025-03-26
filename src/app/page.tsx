import { Suspense } from 'react';
import { getAvailableStaff } from './services/staffService';
import StaffList from './components/StaffList';
import AuthStatus from './components/AuthStatus';

export default async function Home() {
  // サーバーサイドでデータを取得
  const { data: staffList, error } = await getAvailableStaff();
  
  return (
    <div className="min-h-screen bg-amber-50">
      <div className="container mx-auto px-4 py-8">
        {process.env.NEXT_PUBLIC_DEBUG_MODE === 'true' && (
          <div className="mb-6">
            <AuthStatus />
          </div>
        )}
        <h1 className="text-2xl font-bold text-center my-10">レンタル何もしない人® 一覧</h1>

        <p className="text-center text-gray-700 mb-6 max-w-3xl mx-auto">
          レンタル何もしない人®は、何もしないプロフェッショナルが登録し、そのサービスを利用したい人がレンタルできるプラットフォームです。
          何もしない時間の贅沢さと心地よさを体験してみませんか。
          {/* <Link href="/reasons" className="text-blue-600 hover:underline">選ばれる理由を見る</Link> */}
        </p>

        <Suspense fallback={
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>
          </div>
        }>
          <StaffList 
            initialStaffList={staffList || []} 
            error={error ? error.message : null} 
          />
        </Suspense>
      </div>
    </div>
  );
}