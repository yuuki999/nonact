-- Seed data for nonact_staff table
-- 3 sample staff members with various attributes

INSERT INTO nonact_staff (name, email, nickname, age, gender, prefecture, bio, hobby, specialty, image_url, hourly_rate, is_available) VALUES
(
  '佐藤 静香', 
  'shizuka@example.com',
  'しずか', 
  28, 
  '女性', 
  '東京都', 
  '何もしないことが得意です。静かに座っているだけで心を落ち着かせる効果があります。忙しい日常から離れて、ただそこにいる時間を共有しませんか？', 
  '読書、瞑想、窓の外を眺めること', 
  '静かな空間作り、心地よい沈黙の提供', 
  'https://kkwpbhcjxpvdwsyqdbqg.supabase.co/storage/v1/object/public/trainer/staff/shizuka.jpg', 
  3000.00, 
  TRUE
),
(
  '田中 大樹', 
  'daiki@example.com',
  'だいき', 
  35, 
  '男性', 
  '神奈川県', 
  '元システムエンジニア。バーンアウトを経験し、何もしないことの大切さに気づきました。一緒に何もしない時間を過ごすことで、新たな視点が生まれるかもしれません。', 
  'ぼんやり考え事、雲を見ること、昼寝', 
  '無言でのサポート、心地よい存在感の提供', 
  'https://kkwpbhcjxpvdwsyqdbqg.supabase.co/storage/v1/object/public/trainer/staff/daiki.jpg', 
  3500.00, 
  TRUE
),
(
  '鈴木 花子', 
  'hanako@example.com',
  'はなこ', 
  24, 
  '女性', 
  '埼玉県', 
  '大学生時代から「何もしない」ことを極めてきました。ただそばにいるだけで安心感を与えられます。日常の喧騒から離れて、静かな時間を共有しましょう。', 
  '星空観察、散歩、音楽鑑賞', 
  'リラックス空間の創出、穏やかな会話', 
  'https://kkwpbhcjxpvdwsyqdbqg.supabase.co/storage/v1/object/public/trainer/staff/hanako.jpg', 
  2800.00, 
  TRUE
);
