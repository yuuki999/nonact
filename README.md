## supabase使い方

### ローカルSupabaseの起動
supabase start

### ローカルSupabaseの停止
supabase stop

### 状態確認
supabase status

### 新しいマイグレーションの作成
supabase migration new migration_name

### マイグレーションの適用
supabase migration up

### DBのリセット（全データ削除＆マイグレーション再適用）
supabase db reset

### 型定義の生成
supabase gen types typescript --local > lib/database.types.ts

### リモートプロジェクトとの連携
supabase link --project-ref your-project-ref

### リモートにマイグレーションを適用
supabase db push

> [!TIP]
> supabase/config.toml でsupabaseのportを編集できる。

## メール認証機能

Supabaseのローカル環境では、`supabase/config.toml`の`[auth.email]`セクションで`enable_confirmations = true`に設定することで、メール確認機能が有効になります。

```toml
[auth.email]
# If enabled, users need to confirm their email address before signing in.
enable_confirmations = true
```

### ローカル環境でのメール確認方法

1. ユーザー登録後、確認メールが送信されます
2. ローカル環境では実際のメールは送信されず、Inbucketというメールキャッチャーで確認できます
3. Inbucketは以下のURLでアクセスできます:
   - **Inbucket URL**: http://127.0.0.1:54324
4. Inbucketにアクセスして登録したメールアドレス宛のメールを確認し、認証リンクをクリックしてください
5. 認証リンクをクリックすると、`/auth/callback`ルートが処理を行い、`/auth/confirmed`ページにリダイレクトされます

> [!NOTE]
> ローカル環境のSupabaseでは、実際のSMTPサーバーは使用されず、すべてのメールはInbucketに送信されます。本番環境では`[auth.email.smtp]`セクションでSMTP設定を行う必要があります。

