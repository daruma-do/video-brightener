# Chrome Web Store 公開チェックリスト

## 開発者側で実施が必要な作業

### 1. Chrome Web Store デベロッパー登録（一回限り・$5）

1. https://chrome.google.com/webstore/devconsole にアクセス
2. Googleアカウントでログイン（公開時に開発者名として表示されるアカウント）
3. デベロッパー登録料 **$5**（約¥750）をクレジットカードで支払い
4. 開発者連絡先メールアドレスを登録（Chromeチームからの通知用、ユーザー向けではない）

### 2. プライバシーポリシーの公開URL

Chrome Web Store提出時には**Webにアクセス可能なプライバシーポリシーURL**が必要です。以下から選択:

- **GitHub Pages（推奨・無料）**: リポジトリを公開して `PRIVACY.md` のRaw URLを使用、または `gh-pages` ブランチで静的ホスト
- **Notion / Google Site の公開ページ**
- **既存サイト（GachaSpotドメイン等）に `/autolift-privacy` ページを追加**

`PRIVACY.md` の連絡先セクションをURL公開前に必ず埋めてください。

### 3. スクリーンショット（提出に必須・1〜5枚、1280x800または640x400）

**自動生成不可。実機での撮影が必要。**

撮影候補:
1. **U-NEXTで暗い映画シーンに補正をかけたbefore/after**（最強の訴求）
2. **YouTubeのホラー実況などでbefore/after**
3. **ポップアップUIの全体**
4. **対応サイト一覧をテキストで表示**（既存の `promo-marquee` を流用可）

撮影手順:
- Chromeで`Ctrl+Shift+I`→デバイスツールバー→1280x800 or 1366x768
- before/afterは同じシーンで拡張ON/OFF切り替え時にPrintScreen
- 画像編集ツール（GIMP/Photoshop/Figma）でレイアウト整形

### 4. ストア掲載文の確定

短い説明（132文字以内）の例:
> YouTube・U-NEXT・ABEMAなどの動画で、暗くて見えにくいシーンを明るく補正します。手動スライダーで強度調整、フルスクリーン対応。

詳細説明（最大16,000文字）の構成例:
1. 解決する痛み（GoTのS8E3、ホラー実況の暗いシーン）
2. 既存拡張との違い（フルスクリーン対応、有料配信DRM対応）
3. 対応サイト一覧
4. 制限事項（PiP非対応）
5. 使い方
6. プライバシー方針（要約）

### 5. カテゴリ・言語

- カテゴリ: **アクセシビリティ** または **ユーザー補助**
- 言語: 日本語をプライマリ、英語追加は後回しでOK

## アップロード手順

1. `autolift-v0.1.0.zip` を作成（後述スクリプト）
2. Chrome Web Store デベロッパー ダッシュボードで「新しいアイテム」
3. zipアップロード
4. ストア掲載情報を埋める:
   - 詳細説明
   - カテゴリ
   - 言語
   - スクリーンショット（1〜5枚）
   - 小プロモタイル: `store-assets/promo-small-440x280.png`
   - マーキー（任意）: `store-assets/promo-marquee-1400x560.png`
   - プライバシーポリシーURL
5. 「プライバシーの実践方法」セクションで権限の利用目的を1文ずつ宣言
6. 「公開」ボタン → Google審査（**通常1〜3営業日、最大数週間**）

## zipパッケージ作成

```bash
cd /home/tamag/development/autolift
python3 scripts/package.py
```

`manifest.json`の`version`を読んで`autolift-v{version}.zip`を生成する。

zipに含まれるべきファイル:
- `manifest.json`
- `src/content.js`, `src/popup.html`, `src/popup.js`, `src/popup.css`
- `icons/icon16.png`, `icons/icon32.png`, `icons/icon48.png`, `icons/icon128.png`

zipに含めないもの:
- `README.md`, `PRIVACY.md`, `PUBLISH.md`（リポジトリのみ）
- `scripts/`（開発時のみ）
- `store-assets/`（ストア管理画面で別途アップロード）

## 公開後

- 1週目: Chrome拡張の動作報告SNS投稿（初動レビュー獲得）
- 1ヶ月: インストール数・★・低評価レビューの傾向確認
- 3ヶ月Gate: インストール1,000未達なら撤退判定
- 6ヶ月Gate: Phase 2（自動補正）開発判断（インストール3,000＆★4.0以上）

## 想定リスク

| リスク | 対応 |
|---|---|
| 審査リジェクト（権限過多） | host_permissionsを最小限に絞る、説明文で各権限の理由を明記 |
| 審査リジェクト（プライバシー記述不足） | 「プライバシーの実践方法」全項目を埋める、外部通信なしを明示 |
| ★1レビューの早期付着 | 初週は知人やSNSで動作OK報告を集めて分母を作る |
| 既存拡張のクローンと誤認 | 説明文で「DRM動画でも動く」「フルスクリーン対応」を強調 |
