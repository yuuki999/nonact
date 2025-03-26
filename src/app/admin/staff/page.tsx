'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../lib/supabase';
import { isAdmin } from '../../lib/admin';
import Image from 'next/image';
import { toast } from 'sonner';

// スタッフの型定義
interface Staff {
  id: number;
  name: string;
  image: string;
  category: string;
  mainTitle: string;
  tags: string[];
  is_available: boolean;
  created_at: string;
}

export default function StaffManagement() {
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const [staffList, setStaffList] = useState<Staff[]>([]);
  const [editingStaff, setEditingStaff] = useState<Staff | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();

  // 管理者権限の確認
  useEffect(() => {
    async function checkAdminStatus() {
      const adminStatus = await isAdmin();
      setAuthorized(adminStatus);
      
      if (!adminStatus) {
        router.push('/');
      } else {
        fetchStaff();
      }
    }
    
    checkAdminStatus();
  }, [router]);

  // スタッフデータの取得
  async function fetchStaff() {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('nonact_staff')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        throw error;
      }
      
      if (data) {
        setStaffList(data as Staff[]);
      }
    } catch (err) {
      console.error('スタッフデータの取得中にエラーが発生しました:', err);
      toast.error('スタッフデータの取得に失敗しました');
    } finally {
      setLoading(false);
    }
  }

  // スタッフの有効/無効を切り替える
  async function toggleStaffAvailability(id: number, currentStatus: boolean) {
    try {
      const { error } = await supabase
        .from('nonact_staff')
        .update({ is_available: !currentStatus })
        .eq('id', id);
      
      if (error) {
        throw error;
      }
      
      // 成功したらリストを更新
      setStaffList(prevList =>
        prevList.map(staff =>
          staff.id === id ? { ...staff, is_available: !currentStatus } : staff
        )
      );
      
      toast.success(`スタッフを${!currentStatus ? '有効' : '無効'}にしました`);
    } catch (err) {
      console.error('スタッフのステータス更新中にエラーが発生しました:', err);
      toast.error('ステータスの更新に失敗しました');
    }
  }

  // スタッフの編集モーダルを開く
  function openEditModal(staff: Staff) {
    setEditingStaff(staff);
    setIsModalOpen(true);
  }

  // スタッフの編集モーダルを閉じる
  function closeEditModal() {
    setEditingStaff(null);
    setIsModalOpen(false);
  }

  // スタッフ情報を保存する
  async function saveStaffChanges(e: React.FormEvent) {
    e.preventDefault();
    
    if (!editingStaff) return;
    
    try {
      const { error } = await supabase
        .from('nonact_staff')
        .update({
          name: editingStaff.name,
          mainTitle: editingStaff.mainTitle,
          category: editingStaff.category,
          tags: editingStaff.tags,
        })
        .eq('id', editingStaff.id);
      
      if (error) {
        throw error;
      }
      
      // 成功したらリストを更新
      setStaffList(prevList =>
        prevList.map(staff =>
          staff.id === editingStaff.id ? editingStaff : staff
        )
      );
      
      toast.success('スタッフ情報を更新しました');
      closeEditModal();
    } catch (err) {
      console.error('スタッフ情報の更新中にエラーが発生しました:', err);
      toast.error('情報の更新に失敗しました');
    }
  }

  // 新しいスタッフを追加するためのモーダルを開く
  function openNewStaffModal() {
    setEditingStaff({
      id: 0, // 仮のID（保存時に自動生成される）
      name: '',
      image: '',
      category: '',
      mainTitle: '',
      tags: [],
      is_available: true,
      created_at: new Date().toISOString()
    });
    setIsModalOpen(true);
  }

  // 新しいスタッフを追加する
  async function addNewStaff(e: React.FormEvent) {
    e.preventDefault();
    
    if (!editingStaff) return;
    
    try {
      const { data, error } = await supabase
        .from('nonact_staff')
        .insert([
          {
            name: editingStaff.name,
            image: editingStaff.image || '/images/default-profile.jpg', // デフォルト画像
            mainTitle: editingStaff.mainTitle,
            category: editingStaff.category,
            tags: editingStaff.tags,
            is_available: true
          }
        ])
        .select();
      
      if (error) {
        throw error;
      }
      
      if (data) {
        // 新しいスタッフをリストに追加
        setStaffList(prevList => [data[0] as Staff, ...prevList]);
        toast.success('新しいスタッフを追加しました');
        closeEditModal();
      }
    } catch (err) {
      console.error('スタッフの追加中にエラーが発生しました:', err);
      toast.error('スタッフの追加に失敗しました');
    }
  }

  // タグの追加
  function addTag(tag: string) {
    if (!editingStaff) return;
    
    if (tag.trim() && !editingStaff.tags.includes(tag)) {
      setEditingStaff({
        ...editingStaff,
        tags: [...editingStaff.tags, tag.trim()]
      });
    }
  }

  // タグの削除
  function removeTag(index: number) {
    if (!editingStaff) return;
    
    setEditingStaff({
      ...editingStaff,
      tags: editingStaff.tags.filter((_, i) => i !== index)
    });
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-xl font-semibold">Loading...</p>
        </div>
      </div>
    );
  }

  if (!authorized) {
    return null; // router.push('/') が実行されるため、何も表示しない
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">スタッフ管理</h1>
          <button
            onClick={() => router.push('/admin')}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            ← ダッシュボードに戻る
          </button>
        </div>
        
        <div className="mb-6">
          <button
            onClick={openNewStaffModal}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            新しいスタッフを追加
          </button>
        </div>

        {/* スタッフ一覧 */}
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {staffList.length > 0 ? (
              staffList.map((staff) => (
                <li key={staff.id}>
                  <div className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-12 w-12 relative">
                          <Image 
                            src={staff.image || '/images/default-profile.jpg'}
                            alt={staff.name}
                            className="rounded-full object-cover"
                            width={48}
                            height={48}
                          />
                        </div>
                        <div className="ml-4">
                          <div className="flex items-center">
                            <h3 className="text-lg font-medium text-gray-900">{staff.name}</h3>
                            <span className={`ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${staff.is_available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                              {staff.is_available ? '有効' : '無効'}
                            </span>
                          </div>
                          <p className="text-sm text-gray-500">{staff.mainTitle}</p>
                          <p className="text-sm text-gray-500">{staff.category}</p>
                          <div className="mt-1 flex flex-wrap gap-1">
                            {staff.tags && staff.tags.map((tag, index) => (
                              <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => openEditModal(staff)}
                          className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                          編集
                        </button>
                        <button
                          onClick={() => toggleStaffAvailability(staff.id, staff.is_available)}
                          className={`inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md ${staff.is_available ? 'text-red-700 bg-red-100 hover:bg-red-200' : 'text-green-700 bg-green-100 hover:bg-green-200'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
                        >
                          {staff.is_available ? '無効にする' : '有効にする'}
                        </button>
                      </div>
                    </div>
                  </div>
                </li>
              ))
            ) : (
              <li className="px-4 py-4 sm:px-6 text-center text-gray-500">
                スタッフが登録されていません
              </li>
            )}
          </ul>
        </div>
      </div>

      {/* 編集モーダル */}
      {isModalOpen && editingStaff && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg font-medium leading-6 text-gray-900">
                {editingStaff.id === 0 ? 'スタッフを追加' : 'スタッフ情報を編集'}
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                スタッフの情報を入力してください
              </p>
            </div>
            <form onSubmit={editingStaff.id === 0 ? addNewStaff : saveStaffChanges}>
              <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
                <div className="grid grid-cols-1 gap-y-6 gap-x-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                      名前
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        name="name"
                        id="name"
                        required
                        value={editingStaff.name}
                        onChange={(e) => setEditingStaff({...editingStaff, name: e.target.value})}
                        className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>
                  </div>

                  {editingStaff.id === 0 && (
                    <div>
                      <label htmlFor="image" className="block text-sm font-medium text-gray-700">
                        画像URL
                      </label>
                      <div className="mt-1">
                        <input
                          type="text"
                          name="image"
                          id="image"
                          value={editingStaff.image}
                          onChange={(e) => setEditingStaff({...editingStaff, image: e.target.value})}
                          placeholder="/images/default-profile.jpg"
                          className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        />
                      </div>
                      <p className="mt-1 text-xs text-gray-500">空の場合はデフォルト画像が使用されます</p>
                    </div>
                  )}

                  <div>
                    <label htmlFor="mainTitle" className="block text-sm font-medium text-gray-700">
                      メインタイトル
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        name="mainTitle"
                        id="mainTitle"
                        required
                        value={editingStaff.mainTitle}
                        onChange={(e) => setEditingStaff({...editingStaff, mainTitle: e.target.value})}
                        className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                      カテゴリ
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        name="category"
                        id="category"
                        required
                        value={editingStaff.category}
                        onChange={(e) => setEditingStaff({...editingStaff, category: e.target.value})}
                        className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="tags" className="block text-sm font-medium text-gray-700">
                      タグ
                    </label>
                    <div className="mt-2 flex flex-wrap gap-1">
                      {editingStaff.tags && editingStaff.tags.map((tag, index) => (
                        <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {tag}
                          <button
                            type="button"
                            onClick={() => removeTag(index)}
                            className="ml-1 inline-flex text-blue-400 hover:text-blue-600 focus:outline-none"
                          >
                            <span className="sr-only">削除</span>
                            <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                          </button>
                        </span>
                      ))}
                    </div>
                    <div className="mt-1 flex rounded-md shadow-sm">
                      <input
                        type="text"
                        name="newTag"
                        id="newTag"
                        className="focus:ring-indigo-500 focus:border-indigo-500 flex-1 block w-full rounded-none rounded-l-md sm:text-sm border-gray-300"
                        placeholder="新しいタグ"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            addTag((e.target as HTMLInputElement).value);
                            (e.target as HTMLInputElement).value = '';
                          }
                        }}
                      />
                      <button
                        type="button"
                        onClick={(e) => {
                          const input = document.getElementById('newTag') as HTMLInputElement;
                          addTag(input.value);
                          input.value = '';
                        }}
                        className="inline-flex items-center px-3 py-2 border border-l-0 border-gray-300 rounded-r-md bg-gray-50 text-gray-500 sm:text-sm hover:bg-gray-100"
                      >
                        追加
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="px-4 py-3 bg-gray-50 text-right sm:px-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={closeEditModal}
                  className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  キャンセル
                </button>
                <button
                  type="submit"
                  className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  {editingStaff.id === 0 ? '追加' : '保存'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
