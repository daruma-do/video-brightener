# 変更履歴 / リリース・審査ログ

このファイルは Video Brightener のリリース履歴と Chrome Web Store 審査の経緯を、
セッションをまたいで引き継ぐための恒久ログです。新しい出来事は上に追記します。

拡張機能ID: `fgnimlbknladhkjjncailiolinldipgg`
ストアURL: https://chromewebstore.google.com/detail/fgnimlbknladhkjjncailiolinldipgg

---

## [0.5.0] - 開発中（未公開）

成長戦略フェーズ1の打ち手②「任意サイトで有効化」（[[GROWTH_STRATEGY.md]] §3.1）。

### Added
- **任意の動画サイトでワンクリック有効化**: ポップアップに現在サイトの状態表示と
  「このサイトで有効化／無効化」ボタンを追加。
  - `optional_host_permissions: ["https://*/*"]` を宣言。インストール時の権限警告は増えず、
    ユーザーがボタンを押した時に初めて、そのサイト1つ分の権限を Chrome が要求する。
  - 許可後、`chrome.scripting.registerContentScripts`（`persistAcrossSessions`）で当該サイトに
    content script を登録し、現在のタブには `executeScript` で即時適用。
  - 「無効化」で登録解除＋権限削除。
  - 既定対応サイト（manifest の `content_scripts`）は「標準で対応」と表示し、トグル不要。
- `permissions` に `scripting`・`activeTab` を追加。

### 意義
- 対応範囲が「既定の主要サイト」＋「ユーザーが有効化した任意サイト」に拡大。
- Prime Video（Amazon）のようなドメイン取りこぼしを構造的に解消。
- 掲載文・manifest でのサイト名列挙が将来不要化でき、Yellow Argon 再発をさらに防げる。

### 公開前の必須作業
- ブラウザ実機テスト（任意サイトでの有効化／無効化、権限プロンプト、再読み込み後の維持、
  ブラウザ再起動後の維持、非対応ページでの表示）。
- 審査で `optional_host_permissions` の広範さを問われた場合に備え、「ユーザーが明示的に
  有効化したサイトでのみ動作する」設計である旨を説明できるようにする。

---

## [0.4.0] - 2026-05-15 審査再提出

成長戦略フェーズ1の打ち手③「英語ローカライズ」（[[GROWTH_STRATEGY.md]] §3.1）。
2026-05-15 に v0.3.0 の変更（VODサービス対応）を含めて一本化し、Chrome Web Store に審査再提出。

### Added
- **英語ローカライズ**: Chrome 拡張の `_locales` i18n 機構を導入。`en` / `ja` の2言語に対応。
  - `_locales/en/messages.json`, `_locales/ja/messages.json` を新設。
  - `manifest.json` の `name` / `description` を `__MSG_..__` 化、`default_locale: "en"` を設定。
  - ポップアップUIの文字列を `data-i18n` 属性 ＋ `chrome.i18n.getMessage()` で多言語化。
  - 明るさ/コントラストの動的ラベル（弱/中/強 等）も多言語化。

### Changed
- ポップアップ下部の対応サイト表示を、固定列挙から「対応サイトで自動的に有効になります」という
  汎用文に変更（サイト追加ごとの更新が不要になり、キーワード羅列も回避）。

### 公開前の必須作業
- 英語UI・日本語UIの表示確認（Chromeの言語設定を切り替えて検証）。
- Chrome Web Store の掲載情報に英語の掲載文を別途登録（`STORE_LISTING.md` に英語版を追加予定）。

---

## [0.3.0] - 開発中（未公開）

成長戦略フェーズ1の打ち手①（[[GROWTH_STRATEGY.md]] §3.1）。

### Added
- 対応サイトに主要VODサービスを追加: **Netflix / Disney+ / Prime Video / Hulu / Max**。
  - `content.js` はサイト固有コードを持たず全 `<video>` に汎用適用するため、`manifest.json` の
    `host_permissions` と `content_scripts.matches` への追加のみで対応。
  - Prime Video: `primevideo.com` は日本では `amazon.co.jp` にリダイレクトされる。
    当初 `/gp/video/*` にパス限定したが、Amazonはシングルページアプリのため対象パス外から
    SPA遷移すると content script が注入されず発動しなかった。`https://www.amazon.co.jp/*`・
    `https://www.amazon.com/*` の host 全体に拡大（`content.js` は `<video>` 要素にのみ作用し、
    他ページでの実害はなし）。

### 検証状況
- ✅ **Netflix**: 実機でフィルタ動作を確認（DRM配信でのCSSフィルタ方式が機能することを実証）。
- ✅ **Prime Video**: `amazon.co.jp` で実機動作を確認（host全体への拡大後）。
- ✅ 多言語UI（英語表示）を確認。
- ⏳ Disney+ / Hulu / Max: サブスク未登録のため未検証（実害なし。効かない場合もフィルタ未適用となるのみ）。

### 公開前の必須作業
- 追加 host の正当化文を Privacy practices に登録（`STORE_LISTING.md` の既存フォーマット流用、サイト名は羅列しない）。

---

## [0.2.1] - 2026-05-13 公開（現行の公開バージョン）

### 審査経緯
- 初回提出（0.2.0相当のストア掲載文）が **Yellow Argon（キーワードスパム）** でリジェクト。
  - 違反参照ID: Yellow Argon / ルーティングID: FZSL
  - 違反箇所: 説明文の `■ 対応サイト` 見出し下に YouTube/Twitch/Niconico/Vimeo/U-NEXT/ABEMA を6つ羅列したセクション。
  - Google判定: 機能説明と無関係なキーワードの詰め込み。
- 修正後 0.2.1 を再提出 → **2026-05-13 承認・公開**。

### Changed
- `manifest.json`: `description` からブランド名列挙を削除。version 0.2.0 → 0.2.1。
- ストア掲載文（`STORE_LISTING.md`）: `■ 対応サイト` セクションを削除。概要文・本文のブランド名連呼を緩和。
- `PUBLISH.md`: Yellow Argon 回避方針を想定リスク表・詳細説明の構成例・スクリーンショット案に追記。

### 教訓（再発防止）
- ストア掲載文・manifest description・スクリーンショットで、対応サイトを箇条書きや見出しで列挙しない。
- 対応サイトは `host_permissions` でユーザに自動表示されるため、本文での明示は文脈内に最小限（1〜2回）に留める。

---

## [0.2.0] - 2026-05-08 提出準備完了（単独では未公開）

### Changed
- ガンマ補正のみ → **ガンマ + 線形コントラストの2段フィルタ**に改修（`feComponentTransfer` 2段適用）。
- 製品名を AutoLift → **Video Brightener** に変更。
- ディレクトリ名・内部識別子を `video-brightener` に統一。
- GitHubリポジトリ・公開連絡先を屋号アカウント（daruma-do / darumado.inc@gmail.com）に変更。
- ストア掲載文・プライバシーポリシー・公開チェックリストを整備。

---

## [0.1.0] - Initial commit

### Added
- Phase 1 MVP（製品名 AutoLift）。`<video>` 要素に SVG `feComponentTransfer (type="gamma")` フィルタを適用。
- ツールバーポップアップUI（ON/OFF・明るさ・コントラストのスライダー、4段階プリセット）。
- 対応サイト: YouTube / Twitch / ニコニコ動画 / Vimeo / U-NEXT / ABEMA。
- DRM保護コンテンツ（Widevine）でも動作。
