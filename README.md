# Video Brightener

動画の暗いシーンを明るく補正するChrome拡張機能。

リポジトリ: https://github.com/daruma-do/video-brightener

YouTube・Twitch・ニコニコ・Vimeo・U-NEXT・ABEMAなどで「暗くて見えにくい」動画にガンマ補正をかけ、白飛びを抑えながら暗部だけを持ち上げる。

## 仕組み

`<video>`要素にSVGの`feComponentTransfer (type="gamma")`フィルタを適用する。Chromeの合成パスでGPU処理されるため、4K60fps動画でも実質コストはほぼゼロ。

DRM保護コンテンツ（U-NEXT、ABEMAなど）でも動作する。Canvas経由のピクセル読み出しを行わないため、Widevine等の保護下でもフィルタが適用できる。

## 対応サイト

- YouTube
- Twitch
- ニコニコ動画
- Vimeo
- U-NEXT（Widevine DRM動作確認済）
- ABEMA（Widevine DRM動作確認済）
- Netflix（v0.3.0で追加 / 実機動作確認済）
- Disney+（v0.3.0で追加 / 未検証）
- Prime Video（v0.3.0で追加 / `amazon.co.jp/gp/video/` 配下、未検証）
- Hulu（v0.3.0で追加 / 未検証）
- Max（v0.3.0で追加 / 未検証）

> Netflix 等の主要VODは v0.3.0 で host を追加。CSSフィルタ方式のため Widevine DRM 下でも動作する
> （Netflixで実機確認済）。HWアクセラレーションオーバーレイ環境では効かない既知制限あり。

## 制限事項

- **Picture-in-Picture モード**: W3C仕様によりCSSフィルタが反映されない（仕様上の制限）
- **HWアクセラレーションオーバーレイ**: 一部環境で`<video>`がコンポジットをバイパスし、フィルタが効かない場合あり

## ローカルインストール（開発・テスト用）

1. Chromeで `chrome://extensions/` を開く
2. 右上の「デベロッパーモード」をON
3. 「パッケージ化されていない拡張機能を読み込む」をクリック
4. このリポジトリのルートディレクトリ（`video-brightener/`）を選択
5. ツールバーのアイコンからON/OFF・強度調整

## ファイル構成

```
video-brightener/
├── manifest.json          # MV3拡張機能マニフェスト
├── src/
│   ├── content.js         # SVGフィルタ生成・<video>適用
│   ├── popup.html         # ツールバーポップアップUI
│   ├── popup.js           # 設定の読み書き・スライダー制御
│   └── popup.css          # ポップアップのスタイル
├── icons/                 # 16/32/48/128 PNG
├── store-assets/          # Chrome Web Store用promo画像
├── scripts/
│   └── generate_icons.py  # アイコン・promo画像生成
├── PRIVACY.md             # プライバシーポリシー（公開時はWebに掲載）
├── PUBLISH.md             # Chrome Web Store公開チェックリスト
├── CHANGELOG.md           # リリース履歴・審査経緯の恒久ログ
├── GROWTH_STRATEGY.md     # 成長・収益化戦略
└── README.md
```

## 開発

### アイコン再生成

```bash
python3 scripts/generate_icons.py
```

PIL（Pillow）が必要: `pip install pillow`

### パッケージ作成（Chrome Web Store提出用zip）

```bash
python3 scripts/package.py
```

## ライセンス

未定（公開前に決定）
