import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { Staff } from '../types/staff';
import { Database } from '../types/supabase';

export async function getAvailableStaff(): Promise<{ data: Staff[] | null; error: Error | null }> {
  try {
    const cookieStore = cookies();
    const supabase = createServerComponentClient<Database>({ cookies: () => cookieStore });
    
    const { data, error } = await supabase
      .from('nonact_staff')
      .select('*')
      .eq('is_available', true)
      .order('created_at', { ascending: false });
    
    if (error) {
      throw error;
    }
    
    return { data, error: null };
  } catch (error) {
    console.error('スタッフデータの取得中にエラーが発生しました:', error);
    return { data: null, error: error instanceof Error ? error : new Error('データの取得中にエラーが発生しました') };
  }
}
