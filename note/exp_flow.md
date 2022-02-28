# 実験データ取得のテンプレ化

## 実験内容まとめ

### 実験するべき要素

- 空間・人流
  - 基本的に初期人口は固定
  - 人流のテスト部分で、ランダム初期人口を用いる
  - 全結合か最近接結合
- 免疫システム
  - フィードバックあり・なし
  - 交差免疫あり・無し
- ウイルス数
  - ウイルス増加
- ワクチン数
  - ワクチン接種（1 種類）
  - ワクチン接種（2 種類）

### 基本的に固定する要素

#### 1. params

- timeLength = 2500
- maxPopulationSize = 1,000,000
- EI_transCoeff = 0.4
- birthRate: 0.0001
- initialInfectiousRate: 0.0001
- initialFatality: 0(基本的に 出生率 - 死亡率 が増える人口となるので、二つ設定するのはめんどくさい >> birthRate に統一)
- initialPopulation.max = initialPopulation.min = 1.0(すべて 1,000,000 人固定)

#### 2. virus

v_alpha, beta, gamma ... は最初に定義した設定のまま変更しない

- v_alpha

  ```js
      strainType: "v_alpha",
      infectivity: 0.2,
      resilience: 0.18,
      fatarity: 0.001,
      appearanceAt: [0],
      appearanceTime: 10,
      crossImmunity: {
        beta: 0.2,
        gamma: 0.1,
        delta: 0.1,
        epsilon: 0.1,
        zeta: 0.1,
      },
  ```

- v_beta

  ```js
      strainType: "v_beta",
      infectivity: 0.3,
      resilience: 0.23,
      fatarity: 0.002,
      appearanceTime: 200,
      appearanceAt: [0],
      crossImmunity: {
        alpha: 0.1,
        gamma: 0.2,
        delta: 0.2,
        epsilon: 0.15,
        zeta: 0.15,
      },
    },
  ```

- v_gamma

  ```js
       {
         strainType: "v_gamma",
         infectivity: 0.5,
         resilience: 0.3,
         fatarity: 0.002,
         appearanceTime: 500,
         appearanceAt: [0],
         crossImmunity: {
           alpha: 0.1,
           gamma: 0.2,
           delta: 0.2,
           epsilon: 0.15,
           zeta: 0.15,
         },
       },
  ```

これらを変化させて遊ぶのが exp6

### 以上を踏まえて、実験フロー

#### flow_01: 固定条件：ウイルス数１，人流なし、空間１

- フィードバックなし(s1)
- フィードバックあり・弱め(s2)
  - feedbackRate = 0.001
- フィードバックあり・強め(s3)
  - feedbackRate = 0.1
- フィードバックあり・弱め・ウイルスの感染力が強め(s4)
  - v_alpha.beta = 0.7
- フィードバックあり・弱め・ウイルスの感染力・致死率が強め(s4)
  - v_alpha.mu = 0.1
- フィードバックあり・弱め・ウイルスの感染力・致死率・回復率が強め(s4)
  - v_alpha.gamma = 0.5

以降は、

1.  の条件で実験を行う

#### flow_02: 固定条件：ウイルス数１、人流あり、空間複数、フィードバックあり

- フィードバックあり・全結合(s1)
  - maxCoeffConst = 0.1
  - spaceLength = 10 x 10
  - connectionType = "full"
- フィードバックあり・最近接結合(s2)
  - connectionType = "partial"
- フィードバックなし・全結合(s3)
  - connectionType = "full"
- フィードバックなし・最近接結合(s4)
  - connectionType = "partial"

以降は、

1. spaceLength = 10 x 10
2. maxCoeffConst = 0.1
3. connectionType = "partial"(最近接結合)
   として計算する

#### flow_03: 固定条件：ウイルス数複数、人流あり、空間複数

- ウイルス数 3、弱い奴から順に出てくる(s1)
  - v_beta,v_gamma 解禁
  - v_alpha.appearanceTime = 10
  - v_beta.appearanceTime = 200
  - v_gamma.appearanceTime = 500
- ウイルス数 3、強い奴から順に出てくる(s2)
  - alpha, gamma の appearanceTime を入れ替え
- ウイルス数 3、弱い奴から順に出てくる、出現時期をかなり近づける(s3)
  - v_alpha.appearanceTime = 10
  - v_beta.appearanceTime = 50
  - v_gamma.appearanceTime = 100
- ウイルス数 3、強い奴から順に出てくる、出現時期を近づける(s4)
  - v_alpha.appearanceTime = 10
  - v_beta.appearanceTime = 50
  - v_gamma.appearanceTime = 100

#### 4. 固定条件：ウイルス数複数、人流あり、空間複数（最近接結合）、フィードバックあり、 交差免疫あり(s2)

交差免疫はデフォルトのもので固定する。

- ウイルス数 3、弱い奴から順に出てくる(s1) with 交差免疫
- ウイルス数 3、強い奴から順に出てくる(s2) with 交差免疫
- ウイルス数 3、弱い奴から順に出てくる、出現時期をかなり近づける(s3) with 交差免疫
- ウイルス数 3、強い奴から順に出てくる、出現時期を近づける(s4) with 交差免疫

#### 5. 固定条件：ウイルス数複数、人流あり、空間複数（最近接結合）、フィードバックあり、交差免疫あり、ワクチンあり

- 感染ピーク前に集団接種(s1)
- 感染ピークと同時に集団接種(s2)
- 感染ピーク後に集団接種(s3)

この時点の data で、現実のデータと比較したい

#### 6. さらに実験

- 5.の状態で、ウイルスの致死率がめっちゃ高い奴を途中挿入
- 5.の状態で、ウイルスの感染力がめっちゃ高い奴をを途中挿入
- 5.の状態で、感染からの回復力がめちゃ高いウイルスをを途中挿入
- 5.の状態で、さらにウイルス数を増やす
- 5.の状態で、ウイルスを同時に複数空間で放つ
- 5.の状態で、フィードバックがめっちゃ高い状態で実験
- 5.の状態で、初期人口をランダムにして実験
  - maxCoeffConst = 0.1
  - spaceLength = 10 x 10
  - initialPopulation.min = 0.01
  - initialPopulation.max = 1.0

### 書いてて疑問に思ったこと

- snapshot はどこで載せるべき？
- 図表はどのような形で載せる？
  - 空間
- 計算できる空間数には限りがある

### 設定の修正

- 自分の分だけ crossImmunity オンにしないと R の意味なくなるぞ

感染力同じで重症度変えるとか
潜伏期間の長さ
感染期間の長さ
リカバリーの速さ、致死率
依存性

系統だてて説明してほしい

- 人流なら人流に絞って、わかるようにプレゼンしてほしい
  - 感染力がましたら〜、潜伏期間が増えたら〜のように、ストーリーをもって説明できるように
  - 結果に一貫性が欲しい
  - パラメータの変化に対して
  - プレゼン
- 空間的なパターンがなければ
  - 不均一 -> 均一かのプロセスは１回みせる
  - どこかに空間的不均一があっても、均一になっていくだろうという予測
  - 予想外のことがあったら見せたい
- それほど細かい

  - 客観的に示したい時は広めの空間でシミュレーション
  - 面白そうなところがあった場合は
  - シミュレーションの結果をある程度まとめる
  - 感染者数がどのように推移していくか、等

- カラーマップ
- モデルの妥当性

- 第 2 章
  - 基礎的、既存なこと（先行研究とか）
  - おおさっぱに触れて 3 章に入れる
  - わざわざシミュレーションすることの重要性
  - 研究の意義
- 第 3 章

  - 研究に合わせて補足していく
  - 数式はここで参照

- 第 4 章
  - 考察：現実由来かモデル由来か
