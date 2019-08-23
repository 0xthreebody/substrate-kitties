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