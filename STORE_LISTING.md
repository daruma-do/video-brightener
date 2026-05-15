# Chrome Web Store 掲載文（コピペ用）

## 拡張機能名
```
Video Brightener - 動画の暗いシーンを明るく
```

## 概要（132文字以内）
```
動画の暗くて見えにくいシーンを明るく補正する拡張機能です。明るさとコントラストを個別に調整可能、フルスクリーン対応、DRM配信対応、外部通信ゼロ。
```
※75文字

## カテゴリ
**アクセシビリティ**（推奨）／ または ユーザー補助

## 言語
プライマリ: **日本語**

## 詳細説明（Web Storeの説明欄にコピペ）
```markdown
■ こんな悩みを解決します
・実況動画の暗いシーンが見えない
・映画やドラマで暗いシーンの細部がわからない
・ホラーゲーム配信の暗部がつぶれて何が起きてるかわからない
・モニターの輝度を上げても、周りが眩しくなるだけで動画は見やすくならない

■ Video Brightenerの特長
・暗いシーンだけ明るくする「ガンマ補正」を採用
・「白っぽくなる」を防ぐコントラスト調整を内蔵
・明るさ・コントラストを個別スライダーで調整
・プリセット4段階（弱／中／強／最強）でワンクリック切り替え
・フルスクリーン再生でも効く（多くの類似拡張で動かない部分）
・有料配信のDRM動画でも動作

■ プライバシー
・外部サーバーとの通信は一切行いません
・動画のピクセルデータを読み取ることもありません
・保存される情報は「ON/OFF」「明るさ」「コントラスト」の3項目のみ
・アナリティクスやトラッキングは入っていません

■ 制限事項
・Picture-in-Picture モードでは仕様上フィルタが反映されません
・一部のハードウェアアクセラレーション環境ではフィルタが効かない場合があります

■ 仕組み（技術的興味のある方へ）
SVGフィルタ（feComponentTransfer）でガンマ補正と線形コントラストを2段適用しています。
GPU合成パスで処理されるため、4K60fps動画でも処理負荷はほぼゼロです。
動画フレームをcanvasに描画しないため、Widevine等のDRMでも動作します。

■ お問い合わせ
不具合・要望は darumado.inc@gmail.com まで
```

## 権限の正当化文（Privacy practices タブ）

### `storage` 権限
```
ユーザーが設定した「ON/OFF状態」「明るさ」「コントラスト」の3項目を、ブラウザの同期ストレージに保存するために使用します。外部送信は一切行いません。
```

### ホスト権限（対応サイトごと）
```
対応サイトのページに含まれるvideo要素にCSSフィルタ（SVG feComponentTransfer）を適用し、暗いシーンを見やすく補正するために必要です。動画の中身の読み取りや、ページデータの送信は一切行いません。
```

### Single purpose（単一目的の説明）
```
対応する動画再生サイトで、暗くて見えにくいシーンの動画にガンマ補正とコントラスト補正をリアルタイムに適用し、視聴体験を向上させること。
```

### 「リモートコード」の使用
```
使用しません。すべてのコードは拡張機能パッケージ内にバンドルされています。
```

### データの取り扱いに関する宣言
- ☐ Personally identifiable information → **チェックしない**
- ☐ Health information → **チェックしない**
- ☐ Financial and payment information → **チェックしない**
- ☐ Authentication information → **チェックしない**
- ☐ Personal communications → **チェックしない**
- ☐ Location → **チェックしない**
- ☐ Web history → **チェックしない**
- ☐ User activity → **チェックしない**
- ☐ Website content → **チェックしない**

すべて未チェックでOK（本拡張は何も収集しない）。

下部の「I certify that the following disclosures are true」の3つのチェックボックス:
- ☑ I do not sell or transfer user data to third parties (該当: チェック)
- ☑ I do not use or transfer user data for purposes that are unrelated to my item's single purpose (該当: チェック)
- ☑ I do not use or transfer user data to determine creditworthiness or for lending purposes (該当: チェック)
