-- Create nonact_staff table for storing information about non-active staff members
CREATE TABLE nonact_staff (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  nickname VARCHAR(255),
  age INT,
  gender VARCHAR(50),
  prefecture VARCHAR(100),
  bio TEXT,
  hobby TEXT,
  specialty TEXT,
  image_url TEXT,
  hourly_rate DECIMAL(10, 2),
  is_available BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add comment to table
COMMENT ON TABLE nonact_staff IS '何もしない人（nonactスタッフ）の情報を管理するテーブル';

-- Add comments to columns
COMMENT ON COLUMN nonact_staff.id IS 'スタッフの一意識別子';
COMMENT ON COLUMN nonact_staff.name IS 'スタッフの名前';
COMMENT ON COLUMN nonact_staff.email IS 'スタッフのメールアドレス';
COMMENT ON COLUMN nonact_staff.nickname IS 'スタッフのニックネーム';
COMMENT ON COLUMN nonact_staff.age IS 'スタッフの年齢';
COMMENT ON COLUMN nonact_staff.gender IS 'スタッフの性別';
COMMENT ON COLUMN nonact_staff.prefecture IS 'スタッフの出身都道府県';
COMMENT ON COLUMN nonact_staff.bio IS 'スタッフの自己紹介文';
COMMENT ON COLUMN nonact_staff.hobby IS 'スタッフの趣味';
COMMENT ON COLUMN nonact_staff.specialty IS 'スタッフの特技';
COMMENT ON COLUMN nonact_staff.image_url IS 'スタッフのプロフィール画像URL';
COMMENT ON COLUMN nonact_staff.hourly_rate IS 'スタッフの時給';
COMMENT ON COLUMN nonact_staff.is_available IS 'スタッフの利用可能状態';
COMMENT ON COLUMN nonact_staff.created_at IS 'レコード作成日時';
COMMENT ON COLUMN nonact_staff.updated_at IS 'レコード更新日時';

-- Create index on name for faster searches
CREATE INDEX idx_nonact_staff_name ON nonact_staff(name);

-- Create trigger to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_nonact_staff_updated_at
BEFORE UPDATE ON nonact_staff
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();
