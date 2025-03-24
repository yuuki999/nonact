-- nonact_staff_pendingテーブルの作成
-- メール確認待ちの仮登録データを格納するテーブル

CREATE TABLE nonact_staff_pending (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  age INTEGER,
  height INTEGER,
  hobbies TEXT,
  bio TEXT,
  image_url TEXT,
  confirmation_token TEXT NOT NULL UNIQUE,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- コメントの追加
COMMENT ON TABLE nonact_staff_pending IS '何もしない人の仮登録情報を保存するテーブル';
COMMENT ON COLUMN nonact_staff_pending.name IS 'スタッフの名前';
COMMENT ON COLUMN nonact_staff_pending.email IS 'スタッフのメールアドレス';
COMMENT ON COLUMN nonact_staff_pending.age IS '年齢';
COMMENT ON COLUMN nonact_staff_pending.height IS '身長';
COMMENT ON COLUMN nonact_staff_pending.hobbies IS '趣味';
COMMENT ON COLUMN nonact_staff_pending.bio IS '自己紹介';
COMMENT ON COLUMN nonact_staff_pending.image_url IS 'プロフィール画像のURL';
COMMENT ON COLUMN nonact_staff_pending.confirmation_token IS 'メール確認用トークン';
COMMENT ON COLUMN nonact_staff_pending.expires_at IS 'トークンの有効期限';
COMMENT ON COLUMN nonact_staff_pending.created_at IS '作成日時';