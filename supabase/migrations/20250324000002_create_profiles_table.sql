-- profiles テーブルの作成
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  email TEXT,
  display_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  birthdate DATE,
  gender TEXT,
  location TEXT
);

-- RLSポリシーの設定
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 自分のプロフィールのみ参照可能
CREATE POLICY "Users can view their own profile" 
  ON public.profiles 
  FOR SELECT 
  USING (auth.uid() = id);

-- 自分のプロフィールのみ更新可能
CREATE POLICY "Users can update their own profile" 
  ON public.profiles 
  FOR UPDATE 
  USING (auth.uid() = id);

-- 自分のプロフィールのみ挿入可能
CREATE POLICY "Users can insert their own profile" 
  ON public.profiles 
  FOR INSERT 
  WITH CHECK (auth.uid() = id);

-- ユーザー趣味・興味テーブルの作成
CREATE TABLE IF NOT EXISTS public.user_interests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  interest TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- RLSポリシーの設定
ALTER TABLE public.user_interests ENABLE ROW LEVEL SECURITY;

-- 自分の趣味・興味のみ参照可能
CREATE POLICY "Users can view their own interests" 
  ON public.user_interests 
  FOR SELECT 
  USING (auth.uid() = user_id);

-- 自分の趣味・興味のみ挿入可能
CREATE POLICY "Users can insert their own interests" 
  ON public.user_interests 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- 自分の趣味・興味のみ削除可能
CREATE POLICY "Users can delete their own interests" 
  ON public.user_interests 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- ユーザー利用用途テーブルの作成
CREATE TABLE IF NOT EXISTS public.user_purposes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  purpose TEXT NOT NULL,
  additional_info TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- RLSポリシーの設定
ALTER TABLE public.user_purposes ENABLE ROW LEVEL SECURITY;

-- 自分の利用用途のみ参照可能
CREATE POLICY "Users can view their own purposes" 
  ON public.user_purposes 
  FOR SELECT 
  USING (auth.uid() = user_id);

-- 自分の利用用途のみ挿入可能
CREATE POLICY "Users can insert their own purposes" 
  ON public.user_purposes 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- 自分の利用用途のみ削除可能
CREATE POLICY "Users can delete their own purposes" 
  ON public.user_purposes 
  FOR DELETE 
  USING (auth.uid() = user_id);
