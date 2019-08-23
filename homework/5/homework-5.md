# Homework - 5

## 作业需求

第五课作业

1. 实现本课中实现的substrate-kitties所有功能

2. 设计加密猫模块V4

3. 1. 需求：
   2. 交易所
   3. 给自己的小猫设定价钱
   4. 购买其他人的小猫

额外作业

1. 利用 polkadot.js 开发一个命令行软件

2. 1. 创建小猫
   2. 赠予小猫

## 作业内容：

1. 实现本课中实现的substrate-kitties所有功能：

   见代码，以及截图：

![cargo-test-pass-img](/home/threebody/Desktop/yikuailianxi/gitlab/homework/5/homework-5.assets/cargo-test-pass-img.png)

![kitties-ui-img](/home/threebody/Desktop/yikuailianxi/gitlab/homework/5/homework-5.assets/kitties-ui-img.png)

2. 设计加密猫模块V4：

- 交易所

  - 给自己的小猫设定设定价格

  ```
  kittiesPrice: map KittyIndex => Balance
  setPrice(origin, KittyIndex, Balance) -> Result
  //判断控制权
  let sender = ensure_signed(origin)?;
  ensure!(<OwnedKitties<T>>::exists(&(sender.clone(), Some(kitty_id))), "Only owner can set price");
  //设置价格
  kittiesPrice put Balance
  ```

  - 购买小猫

  ```
  buy(KittyIndex) -> Result
  // 获取小猫所有者和价格
  // Balance 转移
  // 转移小猫
  // 检查结果
  ```

3. 额外作业：利用 polkadot.js 开发一个命令行软件(详见目录./polkadot-js)

- 创建小猫(create-kitties.js)：

```js
const { ApiPromise } = require('@polkadot/api');

// import the test keyring (already has dev keys for Alice, Bob, Charlie, Eve & Ferdie)
const testKeyring = require('@polkadot/keyring/testing');

// some constants we are using in this sample
const ALICE = '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY';

async function main () {
  // Create the API and wait until ready
  const api = await ApiPromise.create();

  // create an instance of our testing keyring
  // If you're using ES6 module imports instead of require, just change this line to:
  // const keyring = testKeyring();
  const keyring = testKeyring.default();

  // get the nonce for the admin key
  const nonce = await api.query.system.accountNonce(ALICE);

  // find the actual keypair in the keyring
  const alicePair = keyring.getPair(ALICE);

  // Do the transfer and track the actual status
  api.tx.kitties
    .create()
    .sign(alicePair, { nonce })
    .send(({ events = [], status }) => {
      console.log('Create status:', status.type);

      if (status.isFinalized) {
        console.log('Completed at block hash', status.asFinalized.toHex());
        console.log('Events:');

        events.forEach(({ phase, event: { data, method, section } }) => {
          console.log('\t', phase.toString(), `: ${section}.${method}`, data.toString());
        });

        process.exit(0);
      }
    });
}

main().catch(console.error);
```

- 转移小猫(transfer-kitties.js)

```javascript
const { ApiPromise } = require('@polkadot/api');

// import the test keyring (already has dev keys for Alice, Bob, Charlie, Eve & Ferdie)
const testKeyring = require('@polkadot/keyring/testing');


// Alice 发送小猫
const ALICE = '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY';

// Bob 接收小猫
const BOB = '5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty' 

async function main () {
  // Create the API and wait until ready
  const api = await ApiPromise.create({
    types: {
        KittyIndex: {
        "KittyIndex": "u32",
      }
    }
  });

  // create an instance of our testing keyring
  // If you're using ES6 module imports instead of require, just change this line to:
  // const keyring = testKeyring();
  const keyring = testKeyring.default();

  // get the nonce for the admin key
  const nonce = await api.query.system.accountNonce(ALICE);

  // find the actual keypair in the keyring
  const alicePair = keyring.getPair(ALICE);

  // 把 kittyIndex 为1的猫转给BOB。
  api.tx.kitties
    .transfer(BOB, [1])
    .sign(alicePair, { nonce })
    .send(({ events = [], status }) => {
      console.log('Create status:', status.type);

      if (status.isFinalized) {
        console.log('Completed at block hash', status.asFinalized.toHex());
        console.log('Events:');

        events.forEach(({ phase, event: { data, method, section } }) => {
          console.log('\t', phase.toString(), `: ${section}.${method}`, data.toString());
        });

        process.exit(0);
      }
    });
}

main().catch(console.error);
```

![深度截图_选择区域_20190710231937](/home/threebody/Desktop/yikuailianxi/gitlab/homework/5/homework-5.assets/深度截图_选择区域_20190710231937.png)

