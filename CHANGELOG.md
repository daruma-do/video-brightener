# 変更履歴 / リリース・審査ログ

このファイルは Video Brightener のリリース履歴と Chrome Web Store 審査の経緯を、
セッションをまたいで引き継ぐための恒久ログです。新しい出来事は上に追記します。

拡張機能ID: `fgnimlbknladhkjjncailiolinldipgg`
ストアURL: https://chromewebstore.google.com/detail/fgnimlbknladhkjjncailiolinldipgg

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
