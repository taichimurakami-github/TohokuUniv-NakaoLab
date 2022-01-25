# 人流の簡易シミュレーションプログラム

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

/config.json 内の項目をいじることで、プログラムの挙動や結果の出力などを管理できます。  
記述例は config.json ファイルを参照してください。

### params

設定できる値はすべて整数値です

- spaceLength ... シミュレートする空間の数。
- timeLength ... 空間同士で起こる、人口移動の回数。（1 増えるごとに）
- maxCoeffConst ... 空間同士の人流移動の際、最大で人口の何割の人数が移動するか。
- maxPopulationSize ... １空間あたりの人口の数。（この値に 0.001 ～ 1.0 の間からランダムに選ばれた値を乗じたものがその空間の人口になります）
- birthRate ... 出生率。計算毎に S として追加。
- initialInfectiousRate ... 最初のウイルス株の初期感染人口が、全人口の何割かを定義。
- initialFatarity ... S,R 状態の人々の死亡率

### io

設定できる値はすべて真偽値（`true` or `false`）です

- writeResultAsXLSX ... `true`にすると、`config.json`のディレクトリ内に`result`ディレクトリを生成し、計算結果を`.xlsx`形式にて書き出します。
- writeResultAsPNG ... 実装検討中の機能。オンにしても意味はありません。
- showProgressBar ... `true`にすると、terminal(console)に計算の進捗を書き出します。計算時間があまりに長いと退屈なので、残り時間の目安把握のため作成。

### variantConfig

モデル内で生成されるウイルス株を設定。

- strainType(`String`) ... ウイルス判別用の ID。
- infectivity(`Float`) ... S に対する感染率。
- resilience(`Float`) ... 初期感染時の回復率。
- fatarity(`Float`) ... 初期感染時の死亡率。
- crossImmunity(`[{Object}]`) ... 他のウイルス株に対する交差免疫を定義。数値が高いほど交差免疫としての影響が大きくなる。

## 計算量について

計算量に直結するのは、`config.json`内の timeLength , spaceLength, variantConfig です。  
計算量への影響度合いは、 `timeLength << spaceLength << variantConfig` の順です。

(検証環境)  
OS : Windows 10 Home 64-bit  
CPU: Intel Core i7-9700  
GPU: NVIDIA GTX 1650  
RAM: 16.0 GB
