# 人流の簡易シミュレーションプログラム
## version: 2021.12.16_002
## author: Taichi Murakami

## 実行環境
Node.js version 17.2.0

## 実行方法

1. node.js をインストール（Latest版で動作確認済み）

2. パスを通す

3. people-flow-simulationのディレクトリをterminalで開く

4. ``npm start`` と入力し、実行 (あるいは ``node ./src/index.js`` と入力して実行)

## 設定項目について

/config.json 内の項目をいじることで、プログラムの挙動や結果の出力などを管理できます。

### params

設定できる値はすべて整数値です

+ spaceLength ... シミュレートする空間の数
+ timeLength ... 空間同士の人口移動の回数
+ peopleConst ... １空間の人口の数（目安、この値に 0.001 ～ 1.0 の間からランダムに選ばれた値を乗じたものがその空間の人口になります）


### io

設定できる値はすべて真偽値（``true`` or ``false``）です

+ writeResultAsXLSX ... ``true``にすると、``config.json``のディレクトリ内に``result``ディレクトリを生成し、計算結果を``.xlsx``形式にて書き出します。
+ showCalcProgressBar ... ``true``にすると、terminal(console)に計算の進捗を書き出します。計算時間があまりに長いと退屈なので、残り時間の目安把握のため作成。


## 計算量について
``config.json``にある、timeLengthとspaceLengthを調節すると、計算量を変更できます。  
試しに  

spaceLength = 10000  
timeLength = 1000 

で実行してみましたが、この場合計算完了までに1時間ほどかかりました。 

(検証環境)
windows 10 64bit 
core i7-9700 
gtx 1650 
