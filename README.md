# カウンセリング前アンケート

## デプロイ手順

### 1. GitHubにアップロード
- GitHubで新しいリポジトリを作成
- このフォルダの中身を全てアップロード（.env.local は不要）

### 2. Vercelにデプロイ
- vercel.com にGitHubでログイン
- 「Add New Project」→ リポジトリを選択
- Environment Variables に以下を追加：
  - ANTHROPIC_API_KEY → AnthropicのAPIキー
  - ADMIN_PASSWORD → 管理者パスワード
- Deploy！

### ページ構成
- / → トップ（名前入力）
- /counseling → AIチャット
- /admin → 管理者ダッシュボード

### パスワード変更
Vercel管理画面 → Settings → Environment Variables → ADMIN_PASSWORD を変更して再デプロイ
