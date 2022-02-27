# 複数ウイルス株の時空間シミュレーション

#### version: 1.0.0 (2022.1.25 updated)

#### author: Taichi Murakami

## 実行環境(検証済み)

- Node.js ver. 17.2.0
- windows 10 64-bit (Mac でも可)

## 実行方法

1. node.js をインストール（Latest 版：17.2.0 で動作確認済み）して、パスを通す

2. このリポジトリをクローン（git がない場合は右上の「code」>> 「download Zip」で直接ダウンロード）

3. people-flow-simulation のディレクトリを terminal(なんでもいい)で開く

4. `npm i` を実行し、必要モジュールをダウンロード

5. `npm start` を実行 (あるいは `node ./src/index.js` と入力して実行)

## 設定項目について

/config/experiments 内の ts ファイルをいじることで、プログラムの挙動や結果の出力などを管理できます。  
記述例は各設定ファイルを参照してください。
