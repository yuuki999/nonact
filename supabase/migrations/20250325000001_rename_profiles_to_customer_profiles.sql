-- profiles テーブルを customer_profiles に名前変更
ALTER TABLE public.profiles RENAME TO customer_profiles;

-- 電話番号フィールドを追加
ALTER TABLE public.customer_profiles ADD COLUMN phone_number TEXT;

-- 外部キー制約の更新
ALTER TABLE public.user_interests 
  DROP CONSTRAINT user_interests_user_id_fkey,
  ADD CONSTRAINT user_interests_user_id_fkey 
    FOREIGN KEY (user_id) 
    REFERENCES public.customer_profiles(id) 
    ON DELETE CASCADE;

ALTER TABLE public.user_purposes 
  DROP CONSTRAINT user_purposes_user_id_fkey,
  ADD CONSTRAINT user_purposes_user_id_fkey 
    FOREIGN KEY (user_id) 
    REFERENCES public.customer_profiles(id) 
    ON DELETE CASCADE;

-- RLSポリシーの更新
DROP POLICY IF EXISTS "Users can view their own profile" ON public.customer_profiles;
CREATE POLICY "Users can view their own profile" 
  ON public.customer_profiles 
  FOR SELECT 
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update their own profile" ON public.customer_profiles;
CREATE POLICY "Users can update their own profile" 
  ON public.customer_profiles 
  FOR UPDATE 
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can insert their own profile" ON public.customer_profiles;
CREATE POLICY "Users can insert their own profile" 
  ON public.customer_profiles 
  FOR INSERT 
  WITH CHECK (auth.uid() = id);
