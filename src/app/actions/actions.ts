'use server';

import { revalidatePath } from 'next/cache';

interface BookingData {
  personId: number;
  date: string;
  time: string;
  name: string;
  email: string;
  phone: string;
}

export async function createBooking(data: BookingData) {
  // ここで実際のAPIを呼び出して予約を保存します
  // この例ではシミュレーションのみ行います
  
  console.log('予約データを受け取りました:', data);
  
  // 予約処理を行う（実際のアプリではデータベースに保存）
  await new Promise((resolve) => setTimeout(resolve, 1000));
  
  // 成功したと仮定
  const success = Math.random() > 0.2; // 80%の確率で成功
  
  if (!success) {
    return { 
      success: false, 
      message: '予約の処理中にエラーが発生しました。後でもう一度お試しください。' 
    };
  }
  
  // キャッシュを更新
  revalidatePath(`/profile/${data.personId}`);
  
  return { 
    success: true, 
    message: '予約が完了しました。確認メールをお送りしました。', 
    bookingId: Math.floor(Math.random() * 1000000).toString() 
  };
}

export async function sendContactMessage(formData: FormData) {
  const name = formData.get('name') as string;
  const email = formData.get('email') as string;
  const message = formData.get('message') as string;
  
  // バリデーション
  if (!name || !email || !message) {
    return { success: false, message: '全ての項目を入力してください。' };
  }
  
  // メール送信をシミュレート
  await new Promise((resolve) => setTimeout(resolve, 1000));
  
  return { 
    success: true, 
    message: 'お問い合わせを受け付けました。担当者からご連絡いたします。' 
  };
}